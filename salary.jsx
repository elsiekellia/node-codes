import { useEffect, useState } from 'react'
import axios from 'axios'

const apiBase = 'http://localhost:3001/api/salary'

export default function Salary(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ employeeNumber: '', grossSalary: '', totalDeduction: '', month: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(()=>{ fetchList() }, [])

  const fetchList = async ()=>{
    setError('')
    try{
      const res = await axios.get(apiBase)
      setItems(res.data || [])
    }catch(err){ setError(err.response?.data?.error || 'Cannot load salaries') }
  }

  const submit = async (e)=>{
    e.preventDefault(); setError(''); setSuccess('')
    const netSalary = Number(form.grossSalary || 0) - Number(form.totalDeduction || 0)
    try{
      if (editingId) {
        await axios.put(`${apiBase}/${editingId}`, { ...form, netSalary })
        setSuccess('Updated')
      } else {
        // include salaryId null to match server schema if needed
        await axios.post(apiBase, { salaryId: null, ...form, netSalary })
        setSuccess('Inserted')
      }
      setForm({ employeeNumber: '', grossSalary: '', totalDeduction: '', month: '' })
      setEditingId(null)
      fetchList()
    }catch(err){ setError(err.response?.data?.error || 'Failed to save') }
  }

  const remove = async (id)=>{
    if(!confirm('Delete this salary record?')) return
    setError(''); setSuccess('')
    try{
      await axios.delete(`${apiBase}/${id}`)
      setSuccess('Deleted')
      fetchList()
    }catch(err){ setError(err.response?.data?.error || 'Failed to delete') }
  }

  const edit = (it)=>{
    setEditingId(it.salaryId || it.id)
    setForm({ employeeNumber: it.employeeNumber || '', grossSalary: it.grossSalary || '', totalDeduction: it.totalDeduction || '', month: it.month || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = ()=>{ setEditingId(null); setForm({ employeeNumber: '', grossSalary: '', totalDeduction: '', month: '' }); setError(''); setSuccess('') }

  return (
    <div style={{ maxWidth: 700 }}>
      <h3>Salary</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder='Employee Number' value={form.employeeNumber} onChange={e=>setForm({...form, employeeNumber: e.target.value})} />
        <input placeholder='Gross Salary' type='number' value={form.grossSalary} onChange={e=>setForm({...form, grossSalary: e.target.value})} />
        <input placeholder='Total Deduction' type='number' value={form.totalDeduction} onChange={e=>setForm({...form, totalDeduction: e.target.value})} />
        <input placeholder='Month (e.g. 2026-05)' value={form.month} onChange={e=>setForm({...form, month: e.target.value})} />
        <div>Net: { (Number(form.grossSalary||0) - Number(form.totalDeduction||0)).toFixed(2) }</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type='submit'>{editingId ? 'Save' : 'Insert'}</button>
          {editingId && <button type='button' onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h4 style={{ marginTop: 16 }}>List</h4>
      {items.length === 0 ? <div>No salary records</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th style={{ borderBottom: '1px solid #ccc' }}>Emp#</th><th style={{ borderBottom: '1px solid #ccc' }}>Gross</th><th style={{ borderBottom: '1px solid #ccc' }}>Deduction</th><th style={{ borderBottom: '1px solid #ccc' }}>Net</th><th style={{ borderBottom: '1px solid #ccc' }}>Month</th></tr>
          </thead>
          <tbody>
            {items.map(it=> (
              <tr key={it.salaryId || it.id}>
                <td style={{ padding:6 }}>{it.employeeNumber}</td>
                <td style={{ padding:6 }}>{it.grossSalary}</td>
                <td style={{ padding:6 }}>{it.totalDeduction}</td>
                <td style={{ padding:6 }}>{it.netSalary}</td>
                <td style={{ padding:6 }}>{it.month}</td>
                <td style={{ padding:6 }}>
                  <button onClick={()=>edit(it)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={()=>remove(it.salaryId || it.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
