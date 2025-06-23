export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Limitless : The Paths',
  description: 'Transform your life through gamified personal development',
};
