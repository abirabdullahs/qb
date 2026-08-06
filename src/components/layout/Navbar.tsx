'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Search, User, LogIn, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="app-container navbar-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">
            <BookOpen size={18} />
          </div>
          <span>Question Bank</span>
        </Link>

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.875rem' }}>
            <LogIn size={16} />
            <span>Login</span>
          </Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.875rem' }}>
            <User size={16} />
            <span>Register</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
