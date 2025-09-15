/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { db } from '../components/Firebase/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { useAuth } from './AuthContext'
import { calculateAndUpdateUserStats } from '../components/Firebase/firebase'

const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const addCategory = useCallback(async ({ name, budget }) => {
    if (!user) throw new Error('Not authenticated')
    await addDoc(collection(db, 'categories'), {
      name,
      budget: Number(budget) || 0,
      userId: user.uid,
      createdAt: serverTimestamp(),
    })
    // Update user's total budget
    try {
      await calculateAndUpdateUserStats(user.uid)
    } catch (error) {
      console.error('Failed to update user stats after adding category:', error)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    setLoading(true)

    // First try with compound query (requires index)
    const q = query(
      collection(db, 'categories'),
      where('userId', '==', user.uid),
      orderBy('name', 'asc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const cats = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setCategories(cats)
      setLoading(false)
      // Add default categories if none exist
      if (cats.length === 0) {
        const defaults = [
          { name: 'Food', budget: 500 },
          { name: 'Transportation', budget: 200 },
          { name: 'Entertainment', budget: 100 },
          { name: 'Utilities', budget: 300 },
          { name: 'Healthcare', budget: 150 },
        ]
        defaults.forEach(cat => addCategory(cat).catch(console.error))
      }
    }, (error) => {
      console.error('Error with compound query:', error)

      // Fallback: Try without ordering (simpler query)
      console.log('Trying fallback query without ordering...')
      const fallbackQ = query(
        collection(db, 'categories'),
        where('userId', '==', user.uid)
      )

      const fallbackUnsub = onSnapshot(fallbackQ, (snap) => {
        const cats = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Sort client-side instead
        cats.sort((a, b) => a.name.localeCompare(b.name))
        setCategories(cats)
        setLoading(false)
        if (cats.length === 0) {
          const defaults = [
            { name: 'Food', budget: 500 },
            { name: 'Transportation', budget: 200 },
            { name: 'Entertainment', budget: 100 },
            { name: 'Utilities', budget: 300 },
            { name: 'Healthcare', budget: 150 },
          ]
          defaults.forEach(cat => addCategory(cat).catch(console.error))
        }
      }, (fallbackError) => {
        console.error('Error with fallback query:', fallbackError)
        setError('Failed to load categories')
        setLoading(false)
      })

      return fallbackUnsub
    })

    return () => unsub()
  }, [user, addCategory])

  const updateCategory = async (id, updates) => {
    await updateDoc(doc(db, 'categories', id), { ...updates, updatedAt: serverTimestamp() })
    // Update user's total budget
    try {
      await calculateAndUpdateUserStats(user.uid)
    } catch (error) {
      console.error('Failed to update user stats after updating category:', error)
    }
  }

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id))
    // Update user's total budget
    try {
      await calculateAndUpdateUserStats(user.uid)
    } catch (error) {
      console.error('Failed to update user stats after deleting category:', error)
    }
  }

  return (
    <CategoryContext.Provider value={{ categories, loading, error, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => useContext(CategoryContext)
