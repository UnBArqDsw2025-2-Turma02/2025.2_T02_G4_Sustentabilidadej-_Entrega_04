import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddBill from './pages/AddBill'

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  })
  return { token, setToken, user, setUser }
}

function Nav({ user, onLogout }) {
  return (
    <header>
      <Link to="/">Consumo Sustentável</Link>
      <nav style={{ display: 'flex', gap: 8 }}>
        {user && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/add">Adicionar Conta</Link>
          </>
        )}
      </nav>
      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <span>Olá, {user.name} <button onClick={onLogout} style={{ marginLeft: 8 }}>Sair</button></span>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <span style={{ margin: '0 6px' }}>|</span>
            <Link to="/register">Cadastrar</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default function App() {
  const { token, setToken, user, setUser } = useAuth()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null); setUser(null); navigate('/login');
  }

  return (
    <div>
      <Nav user={user} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/login" element={<Login onAuth={(t,u)=>{localStorage.setItem('token',t); localStorage.setItem('user',JSON.stringify(u)); setToken(t); setUser(u); navigate('/')}} />} />
          <Route path="/register" element={<Register onAuth={(t,u)=>{localStorage.setItem('token',t); localStorage.setItem('user',JSON.stringify(u)); setToken(t); setUser(u); navigate('/')}} />} />
          <Route path="/add" element={token ? <AddBill/> : <Navigate to="/login" />} />
          <Route path="/" element={token ? <Dashboard/> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  )
}
