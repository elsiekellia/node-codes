import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try{
      await axios.post('http://localhost:3001/api/register', form)
      setSuccess('Registered — you can now login')
      setTimeout(()=>navigate('/login'), 800)
    }catch(err){
      setError(err.response?.data?.error || 'Register failed')
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h3>Register</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder='Email' value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        <input type='password' placeholder='Password' value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
        <button type='submit'>Register</button>
      </form>
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  )
}
