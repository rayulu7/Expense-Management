import React, { useState, useMemo } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { FiDownload, FiStar, FiAward } from 'react-icons/fi'

const Leaderboard = () => {
  const { expenses } = useExpenses()
  const [timeframe, setTimeframe] = useState('all')

  const leaderboardData = useMemo(() => {
    const now = new Date()
    let filteredExpenses = expenses

    // Filter by timeframe
    if (timeframe === 'month') {
      const thisMonth = now.toISOString().slice(0, 7)
      filteredExpenses = expenses.filter(exp => exp.date.startsWith(thisMonth))
    } else if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredExpenses = expenses.filter(exp => new Date(exp.date) >= weekAgo)
    }

    // Group by category and calculate totals
    const categoryTotals = {}
    filteredExpenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = {
          total: 0,
          count: 0,
          avgAmount: 0
        }
      }
      categoryTotals[expense.category].total += Number(expense.amount)
      categoryTotals[expense.category].count += 1
    })

    // Calculate averages
    Object.keys(categoryTotals).forEach(category => {
      categoryTotals[category].avgAmount = categoryTotals[category].total / categoryTotals[category].count
    })

    // Convert to array and sort by total spending
    const sortedCategories = Object.entries(categoryTotals)
      .map(([category, data]) => ({
        category,
        ...data
      }))
      .sort((a, b) => b.total - a.total)

    return sortedCategories
  }, [expenses, timeframe])

  const exportToCSV = () => {
    const headers = ['Rank', 'Category', 'Total Spent', 'Transaction Count', 'Average Amount']
    const csvData = leaderboardData.map((item, index) => [
      index + 1,
      item.category,
      `$${item.total.toFixed(2)}`,
      item.count,
      `$${item.avgAmount.toFixed(2)}`
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `expense-leaderboard-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FiAward className="text-white text-xl" />
      case 1:
        return <FiStar className="text-gray-400 text-xl" />
      case 2:
        return <FiAward className="text-gray-300 text-xl" />
      default:
        return <span className="text-gray-400 text-lg font-bold">#{index + 1}</span>
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🏆 Leaderboard</h3>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition"
        >
          <FiDownload size={14} />
          CSV
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'month', 'week'].map(period => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`px-3 py-1 rounded text-sm capitalize transition ${
              timeframe === period
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {period === 'all' ? 'All Time' : period}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {leaderboardData.length === 0 ? (
          <p className="text-gray text-center py-4">No expenses found for this period</p>
        ) : (
          leaderboardData.slice(0, 10).map((item, index) => (
            <div
              key={item.category}
              className={`flex items-center justify-between p-3 rounded transition ${
                index < 3 ? 'bg-gray-700' : 'bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index)}
                <div>
                  <p className="font-medium text-white">{item.category}</p>
                  <p className="text-xs text-gray">{item.count} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">${item.total.toFixed(2)}</p>
                <p className="text-xs text-gray">avg: ${item.avgAmount.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Leaderboard