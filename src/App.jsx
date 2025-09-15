import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Expenses from './components/Expenses'
import AddEditExpense from './components/AddEditExpense'
import Categories from './components/Categories'
import Reports from './components/Reports'
import Approvals from './components/Approvals'
import { FiHome, FiList, FiPlusCircle, FiGrid, FiBarChart2, FiCheckCircle, FiLogOut, FiMenu, FiUsers } from 'react-icons/fi'
import LoginContainer from './components/register/LoginContainer'
import SignupContainer from './components/register/SignupContainer'
import Leaderboard from './components/Leaderboard'
import Friends from './components/Friends'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ExpenseProvider } from './context/ExpenseContext.jsx'
import { CategoryProvider } from './context/CategoryContext.jsx'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: <FiHome size={20} /> },
  { to: '/expenses', label: 'Expenses', icon: <FiList size={20} /> },
  { to: '/add', label: 'Add Expense', icon: <FiPlusCircle size={20} /> },
  { to: '/categories', label: 'Categories', icon: <FiGrid size={20} /> },
  { to: '/reports', label: 'Reports', icon: <FiBarChart2 size={20} /> },
  { to: '/approvals', label: 'Approvals', icon: <FiCheckCircle size={20} /> },
  { to: '/friends', label: 'Friends', icon: <FiUsers size={20} /> },
]

function AppShell() {
  const { user, logout, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-primary text-secondary">Loading...</div>

  if (!user) {
    return <Navigate to="/login" />
  }

  const userName = user?.displayName || user?.email || 'User'

  return (
    <div className="h-screen flex flex-col bg-primary overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 bg-primary border-b border-grayDark sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button className="sm:hidden p-2" onClick={() => setSidebarOpen(v => !v)}>
            <FiMenu size={24} className="text-secondary" />
          </button>
          <span className="text-2xl font-bold text-secondary tracking-wide hidden sm:block">Expense Manager</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-secondary font-semibold text-base truncate max-w-[120px] sm:max-w-xs" title={userName}>{userName}</span>
          <button onClick={logout} className="bg-grayDark text-secondary px-3 py-1 rounded hover:bg-gray transition font-semibold text-sm flex items-center gap-2">
            <FiLogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <nav className={`bg-primary text-secondary shadow-lg flex flex-col p-4 border-r border-grayDark fixed sm:static z-30 top-[57px] sm:top-0 left-0 h-[calc(100vh-57px)] sm:h-full w-52 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
          <span className="text-2xl font-bold mb-6 tracking-wide sm:hidden">Expense Manager</span>
          <ul className="space-y-2 mb-6">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-grayDark hover:text-white transition text-lg font-medium"
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

        </nav>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-20 sm:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <main className="flex-1 p-4 sm:p-8 bg-secondary text-primary h-[calc(100vh-57px)] sm:h-full ml-0 sm:ml-64 transition-all duration-200 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/add" element={<AddEditExpense />} />
            <Route path="/edit/:id" element={<AddEditExpense />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginContainer />} />
      <Route path="/signup" element={<SignupContainer />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

const App = () => (
  <AuthProvider>
    <ExpenseProvider>
      <CategoryProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginContainer />} />
            <Route path="/signup" element={<SignupContainer />} />
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </Router>
      </CategoryProvider>
    </ExpenseProvider>
  </AuthProvider>
)

export default App

