import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../components/Firebase/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { useAuth } from './AuthContext'
import { calculateAndUpdateUserStats } from '../components/Firebase/firebase'

const ExpenseContext = createContext()

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)

    
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setExpenses(data)
      setLoading(false)
    }, (error) => {
      console.error('Error with compound query:', error)

      
      console.log('Trying fallback query without ordering...')
      const fallbackQ = query(
        collection(db, 'expenses'),
        where('userId', '==', user.uid)
      )

      const fallbackUnsub = onSnapshot(fallbackQ, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date))
        setExpenses(data)
        setLoading(false)
      }, (fallbackError) => {
        console.error('Error with fallback query:', fallbackError)
        setError('Failed to load expenses')
        setLoading(false)
      })

      return fallbackUnsub
    })

    return () => unsub()
  }, [user])

  const addExpense = async (expense) => {
    if (!user) throw new Error('Not authenticated')
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      amount: Number(expense.amount),
      userId: user.uid,
      userName: user.displayName || user.email || 'User',
      createdAt: serverTimestamp(),
    })
    
    try {
      await calculateAndUpdateUserStats(user.uid)
    } catch (error) {
      console.error('Failed to update user stats:', error)
    }
  }

  const updateExpense = async (id, updates) => {
    await updateDoc(doc(db, 'expenses', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    
    try {
      await calculateAndUpdateUserStats(user.uid)
    } catch (error) {
      console.error('Failed to update user stats:', error)
    }
  }

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, 'expenses', id))
    
    try {
      await calculateAndUpdateUserStats(user.uid)
    } catch (error) {
      console.error('Failed to update user stats:', error)
    }
  }

  const approveExpense = async (id) => {
    await updateExpense(id, { status: 'approved' })
  }

  const rejectExpense = async (id) => {
    await updateExpense(id, { status: 'rejected' })
  }

  return (
    <ExpenseContext.Provider value={{ expenses, loading, error, addExpense, updateExpense, deleteExpense, approveExpense, rejectExpense }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpenseContext)
