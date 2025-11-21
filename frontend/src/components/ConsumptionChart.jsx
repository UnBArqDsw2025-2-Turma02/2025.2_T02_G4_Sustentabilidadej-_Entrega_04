import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ConsumptionChart({ data }) {
  // data: [{ label: '03/2025', WATER: 10, ELECTRICITY: 120 }, ...]
  return (
    <div className="card">
      <h3>Consumo mensal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="WATER" stroke="#0b6b53" activeDot={{ r: 6 }} name="Água" />
          <Line type="monotone" dataKey="ELECTRICITY" stroke="#d97706" name="Energia" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
