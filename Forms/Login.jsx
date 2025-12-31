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
<<<<<<< HEAD
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
=======
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState("")
    const [resetMessage, setResetMessage] = useState("")
    const [isResetting, setIsResetting] = useState(false)
    const [resetToken, setResetToken] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [resetStep, setResetStep] = useState(1) // 1: request, 2: verify token, 3: set new password

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

    // Step 1: Request password reset
    const handleForgotPassword = async () => {
        if (!resetEmail) {
            setError("Please enter your email address")
            return
        }

        setError("")
        setResetMessage("")
        setIsResetting(true)

        try {
            const recoveryUrl = `${window.location.origin}/reset-password`
            
            const response = await authService.account.createRecovery(
                resetEmail,
                recoveryUrl
            )
            
            setResetMessage("Password reset instructions have been sent to your email. Please check your inbox.")
            setResetStep(2) // Move to token verification step
            
        } catch (err) {
            console.error("Password reset error:", err)
            if (err.code === 404 || err.message.includes("not found")) {
                setError("No account found with this email address")
            } else if (err.code === 429) {
                setError("Too many attempts. Please try again later.")
            } else {
                setError("Failed to send reset email. Please try again.")
            }
        } finally {
            setIsResetting(false)
        }
    }

    // Step 2: Verify reset token
    const verifyResetToken = () => {
        if (!resetToken) {
            setError("Please enter the reset token from your email")
            return
        }
        setError("")
        setResetStep(3)
    }

    // Step 3: Set new password
    const setNewPasswordHandler = async () => {
        if (!newPassword) {
            setError("Please enter a new password")
            return
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setError("")
        setIsResetting(true)

        try {
            // Update password using Appwrite's method
            const response = await authService.account.updateRecovery(
                resetToken,
                newPassword
            )
            
            setResetMessage("Password has been reset successfully! You can now login with your new password.")
            setTimeout(() => {
                setIsForgotPassword(false)
                setResetStep(1)
                setResetEmail("")
                setResetToken("")
                setNewPassword("")
                setConfirmPassword("")
                setResetMessage("")
            }, 3000)
            
        } catch (err) {
            console.error("Password update error:", err)
            if (err.code === 401) {
                setError("Invalid or expired reset token. Please request a new one.")
                setResetStep(1) // Go back to request step
            } else {
                setError("Failed to reset password. Please try again.")
            }
        } finally {
            setIsResetting(false)
        }
    }

    // Reset the flow
    const resetForgotPassword = () => {
        setIsForgotPassword(false)
        setResetStep(1)
        setResetEmail("")
        setResetToken("")
        setNewPassword("")
        setConfirmPassword("")
        setResetMessage("")
        setError("")
    }

>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
<<<<<<< HEAD
                backgroundColor: '#f5eee6', // very light brown
=======
                backgroundColor: '#f5eee6',
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
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
<<<<<<< HEAD
                    backgroundColor: 'white', // card white
=======
                    backgroundColor: 'white',
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                }}
            >
<<<<<<< HEAD
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
=======
                {!isForgotPassword ? (
                    <>
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
                            
                            {/* Forgot Password Link */}
                            <p style={{ textAlign: 'right', marginTop: '-5px', marginBottom: '5px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--dark-color)',
                                        fontSize: '13px',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </p>
                            
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
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px', color: 'var(--dark-color)' }}>
                            Reset Password
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--dark-color)', marginBottom: '18px' }}>
                            Enter your email to receive reset instructions
                        </p>
                        
                        {resetMessage && (
                            <p style={{ color: '#28a745', fontSize: '14px', marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '6px' }}>
                                {resetMessage}
                            </p>
                        )}
                        {error && <p style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
                        
                        {/* Step 1: Request reset email */}
                        {resetStep === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Input
                                    label="Email"
                                    placeholder="Enter your registered email"
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        border: `1px solid var(--dark-color)`,
                                        color: 'var(--black)',
                                        backgroundColor: 'white',
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <Button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        disabled={isResetting}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            backgroundColor: 'var(--dark-color)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            cursor: isResetting ? 'not-allowed' : 'pointer',
                                            opacity: isResetting ? 0.7 : 1,
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                                        }}
                                    >
                                        {isResetting ? 'Sending...' : 'Send Reset Link'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={resetForgotPassword}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {/* Step 2: Enter reset token */}
                        {resetStep === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                                    Check your email for a reset token and enter it below
                                </p>
                                <Input
                                    label="Reset Token"
                                    placeholder="Enter token from email"
                                    type="text"
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        border: `1px solid var(--dark-color)`,
                                        color: 'var(--black)',
                                        backgroundColor: 'white',
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <Button
                                        type="button"
                                        onClick={verifyResetToken}
                                        style={{
                                            flex: 1,
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
                                        Verify Token
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setResetStep(1)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                                        }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {/* Step 3: Set new password */}
                        {resetStep === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Input
                                    label="New Password"
                                    placeholder="Enter new password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        border: `1px solid var(--dark-color)`,
                                        color: 'var(--black)',
                                        backgroundColor: 'white',
                                    }}
                                />
                                <Input
                                    label="Confirm Password"
                                    placeholder="Confirm new password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        border: `1px solid var(--dark-color)`,
                                        color: 'var(--black)',
                                        backgroundColor: 'white',
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <Button
                                        type="button"
                                        onClick={setNewPasswordHandler}
                                        disabled={isResetting}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            backgroundColor: 'var(--dark-color)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            cursor: isResetting ? 'not-allowed' : 'pointer',
                                            opacity: isResetting ? 0.7 : 1,
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                                        }}
                                    >
                                        {isResetting ? 'Resetting...' : 'Reset Password'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setResetStep(2)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                                        }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
            </div>
        </div>
    )
}

<<<<<<< HEAD
export default Login
=======
export default Login
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
