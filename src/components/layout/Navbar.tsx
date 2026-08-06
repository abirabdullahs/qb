'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, LogIn, LogOut, Menu, X, LayoutDashboard, Bookmark, Search, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

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

        {/* Desktop Auth Section */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {loading ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Loading...</div>
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', textTransform: 'capitalize', color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-primary-light)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--color-accent)', marginTop: '0.1rem' }}>
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                title="Logout from account"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.875rem' }}>
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.875rem' }}>
                <User size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
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
                {user && (
                  <div style={{ padding: '0.75rem', background: 'var(--color-primary-light)', border: '1px solid var(--color-accent)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                    <span style={{ display: 'inline-block', fontSize: '0.7rem', textTransform: 'capitalize', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.35rem' }}>
                      Role: {user.role}
                    </span>
                  </div>
                )}

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
                  {user ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
