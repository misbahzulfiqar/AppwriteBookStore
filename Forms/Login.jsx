import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlices'
import Button from "../Components/button"
import Input from "../Components/input"
import { useDispatch } from "react-redux"
import authService from "../Appwrite/Auth/authService"
import { useForm } from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const login = async (data) => {
  setError("")
  try {
    const result = await authService.login(data)

    if (result.alreadyLoggedIn) {
      alert("You are already logged in")
    } else {
      alert("You are successfully logged in")
    }

    const userData = await authService.getCurrentUser()
    if (userData) dispatch(authLogin(userData))

    navigate("/")

  } catch (err) {
    setError(err.message)
  }
}
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5eee6', // very light brown
            }}
        >
            {/* Blurred overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    zIndex: 1
                }}
            ></div>

            {/* Center Login Card */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '360px',
                    backgroundColor: 'white', // card white
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px', color: 'var(--dark-color)' }}>
                    Sign in
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--dark-color)', marginBottom: '18px' }}>
                    Don&apos;t have an account? 
                    <Link to="/signup" style={{ color: 'var(--black)', textDecoration: 'underline', marginLeft: '4px'}}>Sign Up</Link>
                </p>
                {error && <p style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
                
                <form onSubmit={handleSubmit(login)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        style={{
                            padding: '10px',
                            fontSize: '14px',
                            borderRadius: '8px',
                            border: `1px solid var(--dark-color)`,
                            color: 'var(--black)',
                            backgroundColor: 'white',
                        }}
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Invalid email",
                            },
                        })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        style={{
                            padding: '10px',
                            fontSize: '14px',
                            borderRadius: '8px',
                            border: `1px solid var(--dark-color)`,
                            color: 'var(--black)',
                            backgroundColor: 'white',

                        }}
                        {...register("password", { required: true })}
                    />
                    <Button
                        type="submit"
                        style={{
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            backgroundColor: 'var(--dark-color)',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                        }}
                    >
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Login
