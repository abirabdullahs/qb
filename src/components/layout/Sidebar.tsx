'use client';

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
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Questions', href: '/dashboard/questions', icon: FileText },
    { label: 'Add Question', href: '/dashboard/questions/new', icon: PlusCircle },
    { label: 'Review Queue', href: '/dashboard/review', icon: CheckCircle2 },
    { label: 'Taxonomy (Curriculum)', href: '/dashboard/taxonomy', icon: FolderTree },
    { label: 'Admissions & Exams', href: '/dashboard/admission', icon: GraduationCap },
    { label: 'Question Sets', href: '/dashboard/question-sets', icon: Layers },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', paddingLeft: '0.5rem', letterSpacing: '0.05em' }}>
        Dashboard Navigation
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
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
