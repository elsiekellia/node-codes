import { useEffect, useState } from 'react'
import axios from 'axios'

const apiBase = 'http://localhost:3001/api/employee'

export default function Employee(){
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    departmentCode: '',
    email: '',
    position: '',
    address: '',
    telephone: '',
    gender: '',
    hiredDate: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setError('')
    try {
      const res = await axios.get(apiBase)
      setEmployees(res.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employees')
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate required fields
    if (!form.employeeNumber || !form.firstName || !form.lastName) {
      setError('Employee Number, First Name, and Last Name are required')
      return
    }

    console.log('Submitting employee:', form)
    try {
      const res = await axios.post(apiBase, form)
      console.log('Response:', res.data)
      setSuccess('Employee saved')
      setForm({
        employeeNumber: '',
        firstName: '',
        lastName: '',
        departmentCode: '',
        email: '',
        position: '',
        address: '',
        telephone: '',
        gender: '',
        hiredDate: ''
      })
      fetchEmployees()
    } catch (err) {
      console.error('Error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to save employee')
    }
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <h3>Employees</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <input placeholder='Employee Number' value={form.employeeNumber} onChange={e=>setForm({...form, employeeNumber: e.target.value})} />
          <input placeholder='Department Code' value={form.departmentCode} onChange={e=>setForm({...form, departmentCode: e.target.value})} />
          <input placeholder='First Name' value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} />
          <input placeholder='Last Name' value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} />
          <input placeholder='Email' type='email' value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
          <input placeholder='Position' value={form.position} onChange={e=>setForm({...form, position: e.target.value})} />
          <input placeholder='Telephone' value={form.telephone} onChange={e=>setForm({...form, telephone: e.target.value})} />
          <input placeholder='Gender' value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})} />
          <input placeholder='Hired Date (YYYY-MM-DD)' value={form.hiredDate} onChange={e=>setForm({...form, hiredDate: e.target.value})} />
          <input placeholder='Address' value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
        </div>
        <button type='submit'>Add Employee</button>
      </form>

      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <h4>Employee List</h4>
      {employees.length === 0 ? (
        <div>No employees</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>#</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Name</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Dept</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Position</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Phone</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Gender</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Hired</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id || emp.employeeNumber}>
                <td style={{ padding: 8 }}>{emp.employeeNumber}</td>
                <td style={{ padding: 8 }}>{emp.firstName} {emp.lastName}</td>
                <td style={{ padding: 8 }}>{emp.departmentCode}</td>
                <td style={{ padding: 8 }}>{emp.email}</td>
                <td style={{ padding: 8 }}>{emp.position}</td>
                <td style={{ padding: 8 }}>{emp.telephone}</td>
                <td style={{ padding: 8 }}>{emp.gender}</td>
                <td style={{ padding: 8 }}>{emp.hiredDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
