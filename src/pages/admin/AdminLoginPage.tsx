import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { adminAPI } from '@/api/admin'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const { isAuthenticated, setAccessToken, setAdmin } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminAPI.login(email, password)
      const { access_token, admin } = res.data.data
      setAccessToken(access_token)
      setAdmin(admin)
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-lg mx-auto mb-4 shadow-[0_0_20px_rgba(59,130,246,0.4)]">A</div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Portal</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="card-glass p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input-cyber pl-10" placeholder="admin@portfolio.dev"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="input-cyber pl-10 pr-10" placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-bright">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Development credentials: <span className="text-accent-bright">admin@portfolio.dev</span> / <span className="text-accent-bright">Admin@12345</span>
        </p>
      </div>
    </div>
  )
}
