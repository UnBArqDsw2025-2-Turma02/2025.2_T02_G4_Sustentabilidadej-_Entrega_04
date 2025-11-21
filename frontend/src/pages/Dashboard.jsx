import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import ConsumptionChart from '../components/ConsumptionChart'

export default function Dashboard() {
  const [bills, setBills] = useState([])
  const [balance, setBalance] = useState(0)
  const [ledger, setLedger] = useState([])
  const [msg, setMsg] = useState('')

  const load = async () => {
    try {
      const [b, bal, led] = await Promise.all([
        api.bills.list(),
        api.tokens.balance(),
        api.tokens.ledger(),
      ])
      setBills(b)
      setBalance(bal.balance)
      setLedger(led)
    } catch (e) {
      setMsg(e.message)
    }
  }

  useEffect(() => { load() }, [])

  const sendReport = async () => {
    setMsg('Enviando relatório...')
    try { await api.reports.send(); setMsg('Relatório enviado (verifique seu e-mail).') } catch(e) { setMsg(e.message) }
  }

  const chartData = useMemo(() => {
    // Agrupar por ano/mês, somando por tipo
    const map = new Map()
    for (const b of [...bills]) {
      const key = `${String(b.year).padStart(4,'0')}-${String(b.month).padStart(2,'0')}`
      if (!map.has(key)) map.set(key, { key, label: `${String(b.month).padStart(2,'0')}/${b.year}`, WATER: null, ELECTRICITY: null })
      const entry = map.get(key)
      entry[b.type] = (entry[b.type] ?? 0) + b.consumption
    }
    return Array.from(map.values()).sort((a,b)=>a.key.localeCompare(b.key))
  }, [bills])

  return (
    <div>
      <div className="stats">
        <div className="card"><div><b>Saldo de Tokens</b></div><div style={{ fontSize: 28 }}>{balance}</div></div>
        <div className="card"><div><b>Contas registradas</b></div><div style={{ fontSize: 28 }}>{bills.length}</div></div>
      </div>
      <div className="row" style={{ margin: '12px 0' }}>
        <button onClick={load}>Atualizar</button>
        <button onClick={sendReport}>Enviar relatório por e-mail</button>
      </div>
      {msg && <div className="card">{msg}</div>}

  <ConsumptionChart data={chartData} />
  <h3 style={{ marginTop: 16 }}>Últimas contas</h3>
      <table>
        <thead>
          <tr><th>Tipo</th><th>Mês/Ano</th><th>Consumo</th><th>Valor</th><th>Notas</th></tr>
        </thead>
        <tbody>
          {bills.slice(0, 10).map(b => (
            <tr key={b.id}>
              <td>{b.type === 'WATER' ? 'Água' : 'Energia'}</td>
              <td>{b.month}/{b.year}</td>
              <td>{b.consumption}</td>
              <td>{b.amount ?? '-'}</td>
              <td>{b.notes ?? '-'}</td>
            </tr>
          ))}
          {bills.length === 0 && <tr><td colSpan={5}>Nenhuma conta registrada ainda.</td></tr>}
        </tbody>
      </table>

      <h3>Extrato de tokens</h3>
      <table>
        <thead>
          <tr><th>Data</th><th>Tokens</th><th>Motivo</th></tr>
        </thead>
        <tbody>
          {ledger.slice(0, 10).map(t => (
            <tr key={t.id}>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>+{t.amount}</td>
              <td>{t.reason}</td>
            </tr>
          ))}
          {ledger.length === 0 && <tr><td colSpan={3}>Sem lançamentos ainda.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
