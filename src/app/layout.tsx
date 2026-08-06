import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Smart Question Bank — Academic & Admission Platform',
  description: 'An advanced question bank management platform for SSC, HSC, and Admission preparation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
