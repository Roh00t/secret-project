import Link from 'next/link'
import { useAuthStore } from '../lib/stores/authStore'
import { authService } from '../lib/services/authService'

export default function Header() {
  const { user, setUser } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
    } catch (err) {
      console.error('Sign out failed', err)
    }
  }

  return (
    <header style={{display: 'flex', alignItems: 'center', gap: 16, padding: 12, borderBottom: '1px solid #eee'}}>
      <nav style={{display: 'flex', gap: 12, alignItems: 'center'}}>
        <Link href='/'>Home</Link>
        <Link href='/venues'>Venues</Link>
        <Link href='/raws'>RAWs</Link>
      </nav>
      <div style={{marginLeft: 'auto'}}>
        {user ? (
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <span>{user.full_name || user.email}</span>
            <button onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <Link href='/login'>Sign in</Link>
        )}
      </div>
    </header>
  )
}
