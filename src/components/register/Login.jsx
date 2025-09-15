import React from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Login = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  error,
  showPassword,
  setShowPassword,
  switchToSignup
}) => (
  <div className="min-h-screen flex items-center justify-center bg-primary px-2">
    <div className="bg-grayDark p-8 rounded shadow-lg w-full max-w-xs sm:max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-secondary">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          autoComplete="email"
          className="w-full px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            autoComplete="new-password"  // 🚀 stops browser autofill weirdness
            className="w-full px-3 py-2 border border-gray bg-grayDark text-secondary rounded focus:outline-none focus:ring-2 focus:ring-grayLight pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Error message */}
        {error && <div className="text-red-400 text-sm">{error}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary text-secondary py-2 rounded hover:bg-gray transition"
        >
          Login
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-gray hover:underline"
          onClick={switchToSignup}
        >
          Don&apos;t have an account? Sign Up
        </button>
      </div>
    </div>
  </div>
)

export default Login
