import { useState } from 'react'
import { api } from '../api'

export default function AddBill() {
  const [type, setType] = useState('WATER')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [consumption, setConsumption] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const payload = {
        type,
        month: Number(month),
        year: Number(year),
        consumption: Number(consumption),
        amount: amount ? Number(amount) : undefined,
        notes: notes || undefined,
      }
      await api.bills.create(payload)
      setMsg('Conta salva! Se houve economia em relação ao mês anterior, tokens foram creditados.')
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div>
      <h2>Adicionar conta</h2>
      <form onSubmit={submit}>
        <label>Tipo</label>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="WATER">Água</option>
          <option value="ELECTRICITY">Energia</option>
        </select>
        <div className="row">
          <div>
            <label>Mês</label>
            <input type="number" min="1" max="12" value={month} onChange={e=>setMonth(e.target.value)} />
          </div>
          <div>
            <label>Ano</label>
            <input type="number" min="2000" max="3000" value={year} onChange={e=>setYear(e.target.value)} />
          </div>
        </div>
        <label>Consumo</label>
        <input type="number" step="0.01" value={consumption} onChange={e=>setConsumption(e.target.value)} placeholder="Ex.: kWh ou m³" />
        <label>Valor (R$)</label>
        <input type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Opcional" />
        <label>Notas</label>
        <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Opcional" />
        <button type="submit">Salvar</button>
      </form>
      {msg && <div className="card">{msg}</div>}
    </div>
  )
}
