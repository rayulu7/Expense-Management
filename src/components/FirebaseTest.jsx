import React, { useState, useEffect } from 'react'
import { db, auth } from './Firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const FirebaseTest = () => {
  const [user, setUser] = useState(null)
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const runTests = async () => {
    const results = []

    try {
      // Test 1: Check if user is authenticated
      results.push(`User authenticated: ${user ? 'YES' : 'NO'}`)
      if (user) {
        results.push(`User ID: ${user.uid}`)
        results.push(`User Email: ${user.email}`)
      }

      // Test 2: Try to get all categories (without user filter)
      try {
        const categoriesRef = collection(db, 'categories')
        const categoriesSnap = await getDocs(categoriesRef)
        results.push(`Total categories in DB: ${categoriesSnap.size}`)
        categoriesSnap.forEach(doc => {
          results.push(`Category: ${doc.id} - ${JSON.stringify(doc.data())}`)
        })
      } catch (error) {
        results.push(`Error getting categories: ${error.message}`)
      }

      // Test 3: Try to get categories for current user
      if (user) {
        try {
          const q = query(collection(db, 'categories'), where('userId', '==', user.uid))
          const userCategoriesSnap = await getDocs(q)
          results.push(`User categories found: ${userCategoriesSnap.size}`)
          userCategoriesSnap.forEach(doc => {
            results.push(`User Category: ${doc.id} - ${JSON.stringify(doc.data())}`)
          })
        } catch (error) {
          results.push(`Error getting user categories: ${error.message}`)
        }
      }

      // Test 4: Try to get all expenses
      try {
        const expensesRef = collection(db, 'expenses')
        const expensesSnap = await getDocs(expensesRef)
        results.push(`Total expenses in DB: ${expensesSnap.size}`)
      } catch (error) {
        results.push(`Error getting expenses: ${error.message}`)
      }

    } catch (error) {
      results.push(`General error: ${error.message}`)
    }

    setTestResults(results)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' }}>
      <h2>Firebase Debug Test</h2>
      <button onClick={runTests} style={{ padding: '10px 20px', margin: '10px 0' }}>
        Run Firebase Tests
      </button>
      <div>
        <h3>Test Results:</h3>
        <ul>
          {testResults.map((result, index) => (
            <li key={index} style={{ margin: '5px 0' }}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FirebaseTest