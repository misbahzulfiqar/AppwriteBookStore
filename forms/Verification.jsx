// Create a new file: src/Pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../appwrite/auth/authService';
import Button from '../components/button';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get('userId');
      const secret = searchParams.get('secret');

      if (!userId || !secret) {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new verification email.');
        return;
      }

      try {
        await authService.verifyEmail(userId, secret);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Verification failed. The link may be expired or invalid. Please request a new verification email.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-card">
        <h2 className="auth-title">Email Verification</h2>
        
        {status === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Verifying your email...</p>
            <div className="spinner"></div>
          </div>
        )}
        
        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              color: '#28a745', 
              marginBottom: '20px' 
            }}>✓</div>
            <p style={{ marginBottom: '20px' }}>{message}</p>
            <p>Redirecting to login page...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              color: '#dc3545', 
              marginBottom: '20px' 
            }}>✗</div>
            <p style={{ marginBottom: '20px' }}>{message}</p>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;