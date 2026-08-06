'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, LogIn, Menu, X, LayoutDashboard, Bookmark, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="app-container navbar-inner">
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
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.875rem' }}>
            <LogIn size={16} />
            <span>Login</span>
          </Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.875rem' }}>
            <User size={16} />
            <span>Register</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-hamburger-nav-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="mobile-drawer-backdrop"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="mobile-nav-drawer">
              <div className="mobile-nav-drawer-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <BookOpen size={18} color="var(--color-primary)" />
                  <span>Question Bank Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-nav-drawer-body">
                <Link
                  href="/questions"
                  className={`mobile-nav-item ${pathname === '/questions' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search size={18} />
                  <span>Browse Questions</span>
                </Link>

                <Link
                  href="/dashboard"
                  className={`mobile-nav-item ${pathname.startsWith('/dashboard') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/dashboard/bookmarks"
                  className={`mobile-nav-item ${pathname === '/dashboard/bookmarks' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bookmark size={18} />
                  <span>My Bookmarks</span>
                </Link>

                <div className="mobile-nav-auth-actions">
                  <Link
                    href="/login"
                    className="btn btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <User size={16} />
                    <span>Register</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
