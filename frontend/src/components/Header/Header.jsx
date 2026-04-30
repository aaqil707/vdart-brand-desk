/**
 * Header — Top navigation bar with glassmorphism and 3D depth.
 */
import { motion } from 'framer-motion';
import { LogOut, HelpCircle } from 'lucide-react';
import logoPng from '../../assets/logo.png';
import { useAuthStore } from '../../store';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <motion.header
      className="app-header glass-dark"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="header-inner">
        {/* Decorative glowing orb */}
        <div className="header-glow" aria-hidden="true" />

        <div className="header-left">
          <motion.div
            className="header-brand"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="brand-icon">
              <img src={logoPng} className="brand-icon-img" alt="Logo" />
            </div>
            <div>
              <h1 className="brand-title">VDart Brand Desk</h1>
              <span className="brand-subtitle">Select Your Entity</span>
            </div>
          </motion.div>
        </div>

        <div className="header-right">
          {user && (
            <motion.span
              className="user-badge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="user-avatar">
                {(user.name || user.email || '?')[0].toUpperCase()}
              </span>
              <span className="user-name">{user.name || user.email}</span>
            </motion.span>
          )}

          <motion.button
            className="btn btn-danger btn-sm header-logout"
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="logout-button"
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
