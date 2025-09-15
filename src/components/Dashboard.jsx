import React, { useMemo } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { useCategories } from '../context/CategoryContext'
import { Link } from 'react-router-dom'
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiTarget, FiPieChart } from 'react-icons/fi'

const Dashboard = () => {
  const { expenses, loading } = useExpenses()
  const { categories } = useCategories()

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
    const thisMonth = new Date().toISOString().slice(0, 7)
    const monthlyTotal = expenses
      .filter(exp => exp.date.startsWith(thisMonth))
      .reduce((sum, exp) => sum + Number(exp.amount), 0)

    // Calculate last month for comparison
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthStr = lastMonth.toISOString().slice(0, 7)
    const lastMonthTotal = expenses
      .filter(exp => exp.date.startsWith(lastMonthStr))
      .reduce((sum, exp) => sum + Number(exp.amount), 0)

    const monthlyChange = lastMonthTotal > 0 ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

    const recent = expenses.slice(0, 5)
    const avgExpense = expenses.length > 0 ? total / expenses.length : 0

    return { total, monthlyTotal, lastMonthTotal, monthlyChange, recent, avgExpense }
  }, [expenses])

  const budgetAlerts = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7)
    const categorySpend = {}
    expenses
      .filter(exp => exp.date.startsWith(thisMonth))
      .forEach(exp => {
        categorySpend[exp.category] = (categorySpend[exp.category] || 0) + Number(exp.amount)
      })

    return categories
      .filter(cat => cat.budget && categorySpend[cat.name] > cat.budget)
      .map(cat => ({
        category: cat.name,
        spent: categorySpend[cat.name],
        budget: cat.budget
      }))
  }, [expenses, categories])

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Dashboard</h2>
        <div className="text-sm text-gray-600">
          Welcome back! Here's your financial overview.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiDollarSign className="text-gray-600 text-2xl" />
            <div className="flex items-center text-gray-500">
              <FiTrendingUp />
              <span className="text-sm ml-1">{Math.abs(stats.monthlyChange).toFixed(1)}%</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">Total Expenses</h3>
          <p className="text-3xl font-bold text-black">${stats.total.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">All time spending</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiCalendar className="text-gray-600 text-2xl" />
            <div className="text-gray-500">
              <FiTrendingUp />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">This Month</h3>
          <p className="text-3xl font-bold text-black">${stats.monthlyTotal.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Current month spending</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiTarget className="text-gray-600 text-2xl" />
            <div className="text-gray-500">
              <FiPieChart />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">Avg Expense</h3>
          <p className="text-3xl font-bold text-black">${stats.avgExpense.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Per transaction</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FiPieChart className="text-gray-600 text-2xl" />
            <div className="text-gray-500">
              <span className="text-sm font-semibold">
                {expenses.filter(exp => exp.status === 'submitted').length}
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">Pending</h3>
          <p className="text-3xl font-bold text-black">
            {expenses.filter(exp => exp.status === 'submitted').length}
          </p>
          <p className="text-sm text-gray-600 mt-2">Awaiting approval</p>
        </div>
      </div>

      {budgetAlerts.length > 0 && (
        <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-black">Budget Alerts</h3>
          {budgetAlerts.map(alert => (
            <p key={alert.category} className="text-gray-500">
              {alert.category}: ${alert.spent.toFixed(2)} / ${alert.budget} (Over budget!)
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-black">Recent Expenses</h3>
            <Link to="/add" className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-sm border border-gray-300">
              + Add Expense
            </Link>
          </div>
          {stats.recent.length === 0 ? (
            <div className="text-center py-8">
              <FiDollarSign className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-600 mb-4">No expenses yet. Start tracking your spending!</p>
              <Link to="/add" className="bg-white text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-medium border border-gray-300">
                Add Your First Expense
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.recent.map(exp => (
                <li key={exp.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-black">{exp.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-300">{exp.category}</span>
                      <span className="text-sm text-gray-500">{exp.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-black">${exp.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded capitalize font-medium text-white ${
                      (exp.status || 'submitted') === 'approved' ? 'bg-green-500' :
                      (exp.status || 'submitted') === 'submitted' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      {exp.status || 'submitted'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {stats.recent.length > 0 && (
            <Link to="/expenses" className="text-gray-600 hover:text-gray-800 mt-4 inline-block font-medium">
              View All Expenses →
            </Link>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/add" className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition text-center border border-gray-200">
              <FiDollarSign className="mx-auto text-2xl text-black mb-2" />
              <p className="text-black font-medium">Add Expense</p>
            </Link>
            <Link to="/categories" className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition text-center border border-gray-200">
              <FiTarget className="mx-auto text-2xl text-black mb-2" />
              <p className="text-black font-medium">Manage Categories</p>
            </Link>
            <Link to="/reports" className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition text-center border border-gray-200">
              <FiPieChart className="mx-auto text-2xl text-black mb-2" />
              <p className="text-black font-medium">View Reports</p>
            </Link>
            <Link to="/approvals" className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition text-center border border-gray-200">
              <FiCalendar className="mx-auto text-2xl text-black mb-2" />
              <p className="text-black font-medium">Approvals</p>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-black mb-2">💡 Tip</h4>
            <p className="text-gray-500 text-sm">
              Track your expenses regularly to better understand your spending patterns and stay within budget.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
