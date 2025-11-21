import { useState } from 'react'
import { api } from '../api'

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const { token, user } = await api.login(email.trim(), password)
      onAuth(token, user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Entrar</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input placeholder="email@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Senha</label>
        <input type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
        {error && <div style={{ color: 'tomato' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  )
}
