import React, { useEffect } from 'react'
import CategoriesPage from './Categories/manage/CategoriesPage'

const Categories = () => {
  useEffect(() => {
    document.title = 'Categories | Rayulu M'
  }, [])

  return <CategoriesPage />
}

export default Categories
