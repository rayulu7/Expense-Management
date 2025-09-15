import React, { useMemo, useEffect } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'

const Reports = () => {
  const { expenses, loading } = useExpenses()

  useEffect(() => {
    document.title = 'Reports | Rayulu M'
  }, [])

  const categoryData = useMemo(() => {
    const data = {}
    expenses.forEach(exp => {
      data[exp.category] = (data[exp.category] || 0) + Number(exp.amount)
    })
    return Object.entries(data).map(([category, amount]) => ({ category, amount }))
  }, [expenses])

  const monthlyData = useMemo(() => {
    const data = {}
    expenses.forEach(exp => {
      const month = exp.date.slice(0, 7) // YYYY-MM
      data[month] = (data[month] || 0) + Number(exp.amount)
    })
    return Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }))
  }, [expenses])

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Reports & Charts</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-grayDark p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" fill="#fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-grayDark p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#fff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-grayDark p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray">Total Expenses</p>
            <p className="text-2xl font-bold">${expenses.reduce((sum, exp) => sum + Number(exp.amount), 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray">Average per Expense</p>
            <p className="text-2xl font-bold">
              ${expenses.length > 0 ? (expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) / expenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
          <div>
            <p className="text-gray">Categories Used</p>
            <p className="text-2xl font-bold">{new Set(expenses.map(exp => exp.category)).size}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
