import React, { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom'
import Login from './Login'

const LoginContainer = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Login | Rayulu M'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      setEmail('')
      setPassword('')
      navigate('/')
    } catch (err) {

      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError(`Login failed: ${err.message}`)
      }
    }
  }

  const switchToSignup = () => {
    navigate('/signup')
  }

  return (
    <Login
      email={email}
      password={password}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleSubmit}
      error={error}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      switchToSignup={switchToSignup}
    />
  )
}

export default LoginContainer