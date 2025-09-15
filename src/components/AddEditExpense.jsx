import React from 'react'
import { useParams } from 'react-router-dom'
import AddEditExpenseForm from './Expenses/AddEditExpenseForm'
import { useExpenses } from '../context/ExpenseContext'

const AddEditExpense = () => {
  const { id } = useParams()
  const { expenses } = useExpenses()
  const expense = expenses.find(e => e.id === id)

  return <AddEditExpenseForm initialData={expense} />
}

export default AddEditExpense
