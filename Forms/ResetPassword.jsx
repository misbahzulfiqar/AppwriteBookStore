import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../Appwrite/Auth/authService';
import Input from '../Components/input';
import Button from '../Components/button';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    const secret = searchParams.get('secret');
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (!secret || !userId) {
            setError('Invalid or expired reset link.');
        }
    }, [secret, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await authService.confirmPasswordReset(userId, secret, newPassword);
            
            setMessage('Password reset successful! You can now log in with your new password.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Reset error:', err);
            if (err.code === 401 || err.message.includes('invalid')) {
                setError('This reset link is invalid or has expired. Please request a new one.');
            } else {
                setError(err.message || 'Failed to reset password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!secret || !userId) {
        return (
            <div style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5eee6',
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    zIndex: 1
                }}></div>
                
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '360px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: 'var(--dark-color)'
                    }}>Invalid Link</h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--dark-color)',
                        marginBottom: '25px'
                    }}>The password reset link is invalid or has expired.</p>
                    <Button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            backgroundColor: 'var(--dark-color)',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: 'none',
                            width: '100%',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)'
                        }}
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5eee6',
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(0,0,0,0.05)',
                zIndex: 1
            }}></div>

            <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                textAlign: 'center',
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: 'var(--dark-color)'
                }}>Reset Password</h2>
                
                <p style={{
                    fontSize: '14px',
                    color: 'var(--dark-color)',
                    marginBottom: '20px'
                }}>
                    Enter your new password below
                </p>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        border: '1px solid #ffcdd2'
                    }}>
                        {error}
                    </div>
                )}
                
                {message && (
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        fontSize: '14px',
                        border: '1px solid #c8e6c9'
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
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
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        style={{
                            padding: '10px',
                            fontSize: '14px',
                            borderRadius: '8px',
                            border: `1px solid var(--dark-color)`,
                            color: 'var(--black)',
                            backgroundColor: 'white',
                        }}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            backgroundColor: loading ? '#cccccc' : 'var(--dark-color)',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            border: 'none',
                            marginTop: '10px',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>

                <p style={{
                    fontSize: '13px',
                    color: '#666',
                    marginTop: '20px',
                    textAlign: 'center'
                }}>
                    Remember your password?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        style={{
                            color: 'var(--dark-color)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: '500'
                        }}
                    >
                        Sign in here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;