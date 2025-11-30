// apps/web/pages/login.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { authService } from '../lib/services/authService'
import { useAuthStore } from '../lib/stores/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('safety_officer')
  const [isSignup, setIsSignup] = useState(false)
  const { setUser } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const sub = authService.onAuthStateChange(async (u) => {
      if (u) {
        const profile = await authService.getCurrentUser()
        setUser(profile)
        // Redirect to venues (dashboard can be added later)
        router.push('/venues')
      } else {
        setUser(null)
      }
    })

    return () => sub?.unsubscribe?.()
  }, [setUser, router])

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      await authService.signIn(email, password)
      const profile = await authService.getCurrentUser()
      setUser(profile)
      router.push('/venues')
    } catch (err) {
      alert(err.message || 'Sign in failed')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await authService.signUp(email, password, fullName, role)
      const profile = await authService.getCurrentUser()
      setUser(profile)
      router.push('/venues')
    } catch (err) {
      alert(err.message || 'Sign up failed')
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>{isSignup ? 'Sign up' : 'Sign in'}</h1>
      {isSignup ? (
        <form onSubmit={handleSignUp} style={{display: 'grid', gap: 8}}>
          <input type="text" placeholder="Full name" value={fullName}
            onChange={(e) => setFullName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="safety_officer">Safety Officer</option>
              <option value="facility_manager">Facility Manager</option>
              <option value="approver">Approver</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div style={{display: 'flex', gap: 8}}>
            <button type="submit">Create account</button>
            <button type="button" onClick={() => setIsSignup(false)}>Have an account? Sign in</button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignIn} style={{display: 'grid', gap: 8}}>
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <div style={{display: 'flex', gap: 8}}>
            <button type="submit">Sign in</button>
            <button type="button" onClick={() => setIsSignup(true)}>Create account</button>
          </div>
        </form>
      )}
    </main>
  )
}