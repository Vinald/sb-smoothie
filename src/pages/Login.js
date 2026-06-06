import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit}>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>

        {error && <p className="error">{error}</p>}

        <p className="toggle-auth" onClick={() => setIsSignUp((v) => !v)}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </p>
      </form>
    </div>
  )
}

export default Login
