import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      const res = await axios.post('http://localhost:3001/api/login', form)
      localStorage.setItem('epmsToken', res.data.token)
      window.dispatchEvent(new Event('auth-change'))
      navigate('/department')
    }catch(err){
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h3>Login</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder='Email' value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        <input type='password' placeholder='Password' value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
        <button type='submit'>Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  )
}
