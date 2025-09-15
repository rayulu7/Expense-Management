import React from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Signup = ({ firstName, lastName, email, password, retypePassword, onFirstNameChange, onLastNameChange, onEmailChange, onPasswordChange, onRetypePasswordChange, onSubmit, error, showPassword, setShowPassword, showRetypePassword, setShowRetypePassword, switchToLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-primary px-2">
    <div className="bg-grayDark p-8 rounded shadow-lg w-full max-w-xs sm:max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-secondary">Sign Up</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={onFirstNameChange}
            className="w-1/2 px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={onLastNameChange}
            className="w-1/2 px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight"
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          className="w-full px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            className="w-full px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showRetypePassword ? 'text' : 'password'}
            placeholder="Re-type Password"
            value={retypePassword}
            onChange={onRetypePasswordChange}
            className="w-full px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
            tabIndex={-1}
            onClick={() => setShowRetypePassword(v => !v)}
          >
            {showRetypePassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-primary text-secondary py-2 rounded hover:bg-gray transition">Sign Up</button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-gray hover:underline"
          onClick={switchToLogin}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  </div>
)

export default Signup
