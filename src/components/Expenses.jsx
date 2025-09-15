import React, { useEffect } from 'react'
import ExpenseList from './Expenses/ExpenseList'

const Expenses = () => {
  useEffect(() => {
    document.title = 'Expenses | Rayulu M'
  }, [])

  return <ExpenseList />
}

export default Expenses
