import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers } from '../components/Firebase/firebase'
import { FiUsers, FiDownload } from 'react-icons/fi'

const Friends = () => {
  const { user } = useAuth()
  const [otherUsers, setOtherUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Friends | Rayulu M'

    const fetchOtherUsers = async () => {
      try {
       
        const allUsers = await getAllUsers()

       
        const userStats = allUsers
          .filter(userData => userData.id !== user.uid) 
          .map(userData => {
            const displayName = userData.displayName || userData.firstName || userData.email || `User ${userData.id.slice(0, 8)}`
            const budget = userData.budget || 0
            const totalSpent = userData.totalSpent || 0

            return {
              userId: userData.id,
              displayName,
              budget,
              totalSpent
            }
          })

        
        userStats.sort((a, b) => b.totalSpent - a.totalSpent)
        setOtherUsers(userStats.slice(0, 10)) 
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOtherUsers()
    }
  }, [user])


  const exportToCSV = () => {
    const headers = ['Rank', 'Name', 'Budget', 'Spent']
    const csvData = otherUsers.map((user, index) => [
      index + 1,
      user.displayName,
      `$${user.budget.toFixed(2)}`,
      `$${user.totalSpent.toFixed(2)}`
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `friends-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-sm">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
          <FiUsers className="text-gray-600" />
          Friends
        </h3>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-white text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition border border-gray-300"
        >
          <FiDownload size={14} />
          CSV
        </button>
      </div>

      <div className="space-y-2">
        {otherUsers.length === 0 ? (
          <p className="text-gray-600 text-sm">No friends found</p>
        ) : (
          otherUsers.map((user, index) => (
            <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-100 rounded hover:bg-gray-200 transition border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-black font-medium">{user.displayName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Budget: ${user.budget.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">Spent: ${user.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Friends