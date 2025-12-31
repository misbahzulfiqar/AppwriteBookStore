import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../Appwrite/Auth/authService';
import Input from '../Components/input';
import Button from '../Components/button';

function Signup() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const signupHandler = async (data) => {
    setError('');
    setSuccessMessage('');

    try {
      // 1. Create the user account
      const user = await authService.createAccount(data);

      if (!user) {
        setError('Signup failed. Please try again.');
        return;
      }

      // 2. Log the user in immediately to create a session
      const session = await authService.login({
        email: data.email,
        password: data.password
      });

      if (!session) {
        setError('Account created but login failed. Please try logging in manually.');
        return;
      }

      // 3. Send the verification email
      const verificationUrl = `${window.location.origin}/verify`;
      
      try {
        await authService.sendVerificationEmail(verificationUrl);
       
        setSuccessMessage(`Account created successfully! A verification email has been sent to ${data.email}. Please check your inbox and click the verification link.`);
        
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        
      } catch (verificationError) {
        console.error('Verification email error:', verificationError);

        setSuccessMessage(`Account created successfully! However, we couldn't send the verification email. Please go to your account settings to request a new verification email.`);
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }

    } catch (err) {
      console.error('Signup error:', err);
      
      if (err.code === 409 || err.type === 'user_already_exists') {
        setError('User already exists, please login.');
      } else if (err.code === 400) {
        setError('Invalid data. Please check your inputs.');
      } else if (err.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection.');
      } else if (err.code === 429) {
        setError('Too many requests. Please wait a few minutes and try again.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <p className="auth-subtitle">
          Already have an account?{' '}
          <span
            className="auth-link"
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </p>

        {error && <div className="auth-error">{error}</div>}
        {successMessage && (
          <div className="auth-success" style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #c3e6cb'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(signupHandler)} className="auth-form">
          <div className="form-fields">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              className="auth-input"
              error={errors.name?.message}
              {...register('name', { required: 'Full name is required' })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              className="auth-input"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              className="auth-input"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
          </div>

          <Button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="auth-note" style={{ fontSize: '12px', marginTop: '10px' }}>
            <strong>Note:</strong> After signing up, you'll receive a verification email.
            You must click the link in that email to fully activate your account.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;