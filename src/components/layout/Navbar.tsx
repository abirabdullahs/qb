'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, LogIn, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="app-container navbar-inner" style={{ position: 'relative' }}>
        <Link href="/" className="logo">
          <div className="logo-icon">
            <BookOpen size={18} />
          </div>
          <span>Question Bank</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <Link
            href="/questions"
            className={`nav-link ${pathname === '/questions' ? 'active' : ''}`}
          >
            Browse Questions
          </Link>
          <Link
            href="/dashboard"
            className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-actions">
          <Link href="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.875rem' }}>
            <LogIn size={16} />
            <span>Login</span>
          </Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.875rem' }}>
            <User size={16} />
            <span>Register</span>
          </Link>
          
          {/* Mobile Toggle Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              zIndex: 100,
            }}
          >
            <Link
              href="/questions"
              className={`nav-link ${pathname === '/questions' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', padding: '0.5rem 0' }}
            >
              Browse Questions
            </Link>
            <Link
              href="/dashboard"
              className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', padding: '0.5rem 0' }}
            >
              Dashboard
            </Link>
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <Link
                href="/login"
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <User size={16} />
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
