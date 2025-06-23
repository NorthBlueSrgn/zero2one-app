import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Zero2One - Level Up Your Life',
  description: 'Transform your life through gamified personal development',
};
