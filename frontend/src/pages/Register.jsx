import { useState } from 'react'
import { api } from '../api'

export default function Register({ onAuth }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const { token, user } = await api.register(name.trim(), email.trim(), password)
      onAuth(token, user)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Criar conta</h2>
      <form onSubmit={submit}>
        <label>Nome</label>
        <input placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} required minLength={2} />
        <label>Email</label>
        <input placeholder="email@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Senha (mín 6)</label>
        <input type="password" placeholder="Crie uma senha" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
        {error && <div style={{ color: 'tomato' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  )
}
