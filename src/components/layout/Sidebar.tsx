'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  FolderTree,
  GraduationCap,
  Layers,
  Settings,
  PlusCircle,
  Bookmark,
  Users,
  Menu,
  X,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user } = useAuth();

  const userRole = user?.role || 'student';

  const allMenuItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'moderator', 'teacher', 'contributor', 'student'] },
    { label: 'Browse Questions', href: '/questions', icon: Search, roles: ['student'] },
    { label: 'Questions', href: '/dashboard/questions', icon: FileText, roles: ['admin', 'moderator', 'teacher', 'contributor'] },
    { label: 'Add Question', href: '/dashboard/questions/new', icon: PlusCircle, roles: ['admin', 'moderator', 'teacher', 'contributor'] },
    { label: 'My Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark, roles: ['admin', 'moderator', 'teacher', 'contributor', 'student'] },
    { label: 'Review Queue', href: '/dashboard/review', icon: CheckCircle2, roles: ['admin', 'moderator'] },
    { label: 'Taxonomy', href: '/dashboard/taxonomy', icon: FolderTree, roles: ['admin', 'moderator', 'teacher'] },
    { label: 'Staff Accounts', href: '/dashboard/users', icon: Users, roles: ['admin'] },
    { label: 'Admission', href: '/dashboard/admission', icon: GraduationCap, roles: ['admin', 'moderator'] },
    { label: 'Question Sets', href: '/dashboard/question-sets', icon: Layers, roles: ['admin', 'moderator', 'teacher'] },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(userRole));
  const activeItem = menuItems.find((item) => item.href === pathname) || menuItems[0] || allMenuItems[0];

  return (
    <>
      {/* Mobile Sticky Navigation Header with Hamburger */}
      <div className="mobile-dashboard-header">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen((prev) => !prev)}
          className="mobile-hamburger-btn"
          aria-label="Toggle Dashboard Menu"
        >
          {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
          <span>Dashboard Menu</span>
        </button>

        <div className="mobile-active-badge">
          {activeItem.label}
        </div>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar Container (Desktop Sidebar + Mobile Slide-In Drawer) */}
      <aside className={`sidebar ${mobileDrawerOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', paddingLeft: '0.5rem', letterSpacing: '0.05em' }}>
            Dashboard Menu
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="mobile-close-btn"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
