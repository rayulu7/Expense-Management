import React, { useState } from 'react'
import { useCategories } from '../../../context/CategoryContext.jsx'

const CategoriesPage = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name) return
    await addCategory({ name, budget })
    setName('')
    setBudget('')
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Categories & Budgets</h2>

      <form onSubmit={handleAdd} className="bg-grayDark p-4 rounded mb-6 flex flex-col sm:flex-row gap-2">
        <input className="flex-1 px-3 py-2 border border-gray rounded bg-secondary text-primary" placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full sm:w-48 px-3 py-2 border border-gray rounded bg-secondary text-primary" placeholder="Monthly budget" type="number" value={budget} onChange={e => setBudget(e.target.value)} />
        <button className="bg-primary text-secondary px-4 py-2 rounded hover:bg-gray">Add</button>
      </form>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-secondary text-primary">
          <thead>
            <tr className="bg-grayDark text-secondary">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Budget</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-8">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8">No categories yet.</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} className="border-b border-grayLight hover:bg-grayLight/30">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.budget || 0}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-600 hover:underline" onClick={() => updateCategory(c.id, { name: prompt('Name', c.name) || c.name, budget: Number(prompt('Budget', c.budget || 0)) || c.budget })}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => deleteCategory(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoriesPage
