import React, { useState } from 'react'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
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