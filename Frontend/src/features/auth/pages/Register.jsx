import { useState } from 'react'

import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import './auth.form.scss'

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate('/login')
        } catch (err) {
            setError(err.message)
        }
    }
        if(loading) {
        return (<main><h1>Loading...</h1></main>)
    }



  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" id="username" name="username" placeholder="Enter username" required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" id="email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                     onChange={(e) => setPassword(e.target.value)}
                     type="password" id="password" name="password" placeholder="Enter your password" required />
                </div>
                <button className="button primary-button" disabled={loading}>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register