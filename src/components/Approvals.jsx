import React from 'react'
import { useExpenses } from '../context/ExpenseContext'

const Approvals = () => {
  const { expenses, loading, approveExpense, rejectExpense } = useExpenses()

  const pendingExpenses = expenses.filter(exp => exp.status === 'submitted')

  const handleApprove = async (id) => {
    if (window.confirm('Approve this expense?')) {
      await approveExpense(id)
    }
  }

  const handleReject = async (id) => {
    if (window.confirm('Reject this expense?')) {
      await rejectExpense(id)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Pending Approvals</h2>

      {pendingExpenses.length === 0 ? (
        <div className="bg-grayDark p-6 rounded shadow text-center">
          <p>No expenses pending approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingExpenses.map(exp => (
            <div key={exp.id} className="bg-grayDark p-6 rounded shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-gray">Category: {exp.category}</p>
                  <p className="text-gray">Vendor: {exp.vendor}</p>
                  <p className="text-gray">Date: {exp.date}</p>
                  {exp.notes && <p className="text-gray">Notes: {exp.notes}</p>}
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-2xl font-bold text-secondary">${exp.amount}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleApprove(exp.id)}
                      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(exp.id)}
                      className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Approvals
