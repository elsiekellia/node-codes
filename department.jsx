import { useEffect, useState } from 'react'
import axios from 'axios'

const apiBase = 'http://localhost:3001/api/department'

export default function Department(){
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ departmentCode: '', departmentName: '', grossSalary: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(()=>{ fetchDepartments() }, [])

  const fetchDepartments = async ()=>{
    setError('')
    try{
      const res = await axios.get(apiBase)
      setDepartments(res.data || [])
    }catch(err){
      setError(err.response?.data?.error || 'Cannot load departments')
    }
  }

  const submit = async (e)=>{
    e.preventDefault()
    setError(''); setSuccess('')
    try{
      await axios.post(apiBase, form, { headers: { Authorization: `Bearer ${localStorage.getItem('epmsToken')}` }})
      setSuccess('Saved')
      setForm({ departmentCode: '', departmentName: '', grossSalary: '' })
      fetchDepartments()
    }catch(err){
      setError(err.response?.data?.error || 'Failed to save')
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h3>Departments</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        <input placeholder='Code' value={form.departmentCode} onChange={e=>setForm({...form, departmentCode: e.target.value})} />
        <input placeholder='Name' value={form.departmentName} onChange={e=>setForm({...form, departmentName: e.target.value})} />
        <input placeholder='Gross Salary' type='number' value={form.grossSalary} onChange={e=>setForm({...form, grossSalary: e.target.value})} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type='submit'>Insert</button>
          <button type='button' onClick={fetchDepartments}>Refresh</button>
        </div>
      </form>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h4 style={{ marginTop: 16 }}>List</h4>
      {departments.length === 0 ? <div>No departments</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th style={{ borderBottom: '1px solid #ccc' }}>Code</th><th style={{ borderBottom: '1px solid #ccc' }}>Name</th><th style={{ borderBottom: '1px solid #ccc' }}>Gross</th></tr>
          </thead>
          <tbody>
            {departments.map(d=> (
              <tr key={d.departmentCode || d.id}><td style={{ padding:6 }}>{d.departmentCode}</td><td style={{ padding:6 }}>{d.departmentName}</td><td style={{ padding:6 }}>{d.grossSalary}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
