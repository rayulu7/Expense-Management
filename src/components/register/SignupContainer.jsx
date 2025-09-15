import React, { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, setUser } from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom'
import Signup from './Signup'

const SignupContainer = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Signup | Rayulu M'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== retypePassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      })
      await setUser(userCredential.user.uid, {
        firstName,
        lastName,
        email,
        displayName: `${firstName} ${lastName}`,
        budget: 0,
        totalSpent: 0
      })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  const switchToLogin = () => {
    navigate('/login')
  }

  return (
    <Signup
      firstName={firstName}
      lastName={lastName}
      email={email}
      password={password}
      retypePassword={retypePassword}
      onFirstNameChange={(e) => setFirstName(e.target.value)}
      onLastNameChange={(e) => setLastName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onRetypePasswordChange={(e) => setRetypePassword(e.target.value)}
      onSubmit={handleSubmit}
      error={error}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showRetypePassword={showRetypePassword}
      setShowRetypePassword={setShowRetypePassword}
      switchToLogin={switchToLogin}
    />
  )
}

export default SignupContainer