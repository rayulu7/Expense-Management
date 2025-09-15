import React, { useState, useEffect } from 'react'
import { useExpenses } from '../../context/ExpenseContext.jsx'
import { useCategories } from '../../context/CategoryContext.jsx'

const AddEditExpenseForm = ({ initialData, onSubmit }) => {
  const { addExpense, updateExpense } = useExpenses()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    vendor: '',
    notes: '',
    status: 'submitted',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        date: initialData.date || '',
        vendor: initialData.vendor || '',
        notes: initialData.notes || '',
        status: initialData.status || 'submitted',
      })
    }
  }, [initialData])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e, status = 'submitted') => {
    e.preventDefault()
    setError('')
    if (categoriesLoading) {
      setError('Please wait for categories to load.')
      return
    }
    if (categoriesError) {
      setError('Failed to load categories. Please try again.')
      return
    }
    if (!form.title || !form.amount || !form.category || !form.date || !form.vendor) {
      setError('All fields except notes are required.')
      return
    }
    setLoading(true)
    try {
      if (initialData) {
        await updateExpense(initialData.id, { ...form, status })
      } else {
        await addExpense({ ...form, status })
        setForm({ title: '', amount: '', category: '', date: '', vendor: '', notes: '', status: 'submitted' })
      }
      if (onSubmit) onSubmit()
    } catch {
      setError('Failed to save expense.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="w-full max-w-lg mx-auto bg-grayDark p-6 rounded shadow space-y-4" onSubmit={e => handleSubmit(e, 'submitted')}>
      <h2 className="text-xl font-bold text-secondary mb-2">{initialData ? 'Edit' : 'Add'} Expense</h2>
      <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray rounded bg-secondary text-primary" placeholder="Title" />
      <input name="amount" value={form.amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray rounded bg-secondary text-primary" placeholder="Amount" type="number" />
      <select name="category" value={form.category} onChange={handleChange} disabled={categoriesLoading} className="w-full px-3 py-2 border border-gray rounded bg-secondary text-primary">
        <option value="">{categoriesLoading ? 'Loading categories...' : 'Select Category'}</option>
        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
      </select>
      <input name="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray rounded bg-secondary text-primary" type="date" />
      <input name="vendor" value={form.vendor} onChange={handleChange} className="w-full px-3 py-2 border border-gray rounded bg-secondary text-primary" placeholder="Vendor" />
      <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full px-3 py-2 border border-gray rounded bg-secondary text-primary" placeholder="Notes (optional)" />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {categoriesError && <div className="text-red-400 text-sm">Error loading categories: {categoriesError}</div>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-primary text-secondary px-4 py-2 rounded hover:bg-gray disabled:opacity-50">{initialData ? 'Update' : 'Add'} Expense</button>
        <button type="button" disabled={loading} className="bg-gray text-primary px-4 py-2 rounded hover:bg-grayDark disabled:opacity-50" onClick={e => handleSubmit(e, 'draft')}>Save as Draft</button>
      </div>
    </form>
  )
}

export default AddEditExpenseForm
