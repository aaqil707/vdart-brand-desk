/**
 * LoginPage — Glassmorphism auth form with animated toggle
 * between sign-in and sign-up states.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import AlgorithmicBackground from '../../components/AlgorithmicBackground/AlgorithmicBackground';
import './LoginPage.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const { login, register } = useAuthStore();
  const { addToast } = useUIStore();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!form.name.trim()) {
          addToast({ type: 'error', message: 'Please enter your name' });
          return;
        }
        const result = await register(form.name, form.email, form.password);
        if (result?.success || result?.status === 'success') {
          addToast({ type: 'success', message: 'Account created! Please sign in.' });
          setIsSignUp(false);
          setForm((prev) => ({ ...prev, password: '' }));
        } else {
          addToast({ type: 'error', message: result?.message || 'Registration failed' });
        }
      } else {
        const result = await login(form.email, form.password);
        if (result.success) {
          addToast({ type: 'success', message: 'Welcome back!' });
        } else {
          addToast({ type: 'error', message: result.message || 'Invalid credentials' });
        }
      }
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <AlgorithmicBackground />

      <motion.div
        className="login-container glass"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative elements */}
        <div className="login-deco-top" aria-hidden="true" />
        <div className="login-deco-orb" aria-hidden="true" />

        <div className="login-header">
          <motion.div
            className="login-brand-icon"
            animate={{ rotateY: isSignUp ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="brand-icon-face front">
              <ArrowRight size={24} />
            </div>
            <div className="brand-icon-face back">
              <UserPlus size={24} />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="login-title">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="login-subtitle">
                {isSignUp
                  ? 'Enter your details to get started'
                  : 'Sign in to VDart Brand Desk'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className="login-form" id="login-form">
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                className="input-group"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 'var(--space-5)' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="name">
                  <User size={16} /> Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <label htmlFor="email">
              <Mail size={16} /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-field"
              placeholder="you@vdartinc.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <Lock size={16} /> Password
            </label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-lg login-submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="login-submit"
          >
            {isLoading ? (
              <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              <>
                {isSignUp ? <UserPlus size={18} /> : <ArrowRight size={18} />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </motion.button>
        </form>

        <div className="login-toggle">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            className="toggle-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setForm({ name: '', email: '', password: '' });
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
