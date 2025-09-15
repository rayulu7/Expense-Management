import React, { useState, useMemo } from 'react'
import { useExpenses } from '../../context/ExpenseContext.jsx'
import { useCategories } from '../../context/CategoryContext.jsx'
import { useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'

const ExpenseList = () => {
  const { expenses, loading, deleteExpense } = useExpenses()
  const { categories } = useCategories()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [vendorFilter, setVendorFilter] = useState('')

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesSearch = !search || exp.title.toLowerCase().includes(search.toLowerCase()) || exp.vendor.toLowerCase().includes(search.toLowerCase())
      const matchesDate = !dateFilter || exp.date === dateFilter
      const matchesCategory = !categoryFilter || exp.category === categoryFilter
      const matchesVendor = !vendorFilter || exp.vendor.toLowerCase().includes(vendorFilter.toLowerCase())
      return matchesSearch && matchesDate && matchesCategory && matchesVendor
    })
  }, [expenses, search, dateFilter, categoryFilter, vendorFilter])

  const csvData = useMemo(() => {
    return filteredExpenses.map(exp => ({
      Title: exp.title,
      Amount: exp.amount,
      Category: exp.category,
      Date: exp.date,
      Vendor: exp.vendor,
      Status: exp.status || 'submitted',
      Notes: exp.notes || ''
    }))
  }, [filteredExpenses])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <input
          className="px-3 py-2 border border-gray rounded bg-grayDark text-secondary w-full sm:w-48"
          placeholder="Search title/vendor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="px-3 py-2 border border-gray rounded bg-grayDark text-secondary w-full sm:w-40"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
        <select
          className="px-3 py-2 border border-gray rounded bg-grayDark text-secondary w-full sm:w-40"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
        </select>
        <input
          className="px-3 py-2 border border-gray rounded bg-grayDark text-secondary w-full sm:w-40"
          placeholder="Vendor"
          value={vendorFilter}
          onChange={e => setVendorFilter(e.target.value)}
        />
        <CSVLink
          data={csvData}
          filename="expenses.csv"
          className="bg-primary text-secondary px-4 py-2 rounded hover:bg-gray"
        >
          Export CSV
        </CSVLink>
      </div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-secondary text-primary">
          <thead>
            <tr className="bg-grayDark text-secondary">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Vendor</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">No expenses found.</td></tr>
            ) : filteredExpenses.map(exp => (
              <tr key={exp.id} className="border-b border-grayLight hover:bg-grayLight/30">
                <td className="px-4 py-2">{exp.title}</td>
                <td className="px-4 py-2">${exp.amount}</td>
                <td className="px-4 py-2">{exp.category}</td>
                <td className="px-4 py-2">{exp.date}</td>
                <td className="px-4 py-2">{exp.vendor}</td>
                <td className="px-4 py-2 capitalize">{exp.status || 'submitted'}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-500 hover:underline" onClick={() => navigate(`/edit/${exp.id}`)}>Edit</button>
                  <button className="text-red-500 hover:underline" onClick={() => {
                    if (window.confirm('Are you sure you want to delete this expense?')) {
                      deleteExpense(exp.id)
                    }
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpenseList
