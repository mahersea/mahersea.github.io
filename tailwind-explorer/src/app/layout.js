import './globals.css';

export const metadata = {
  title: 'Tailwind CSS Explorer',
  description: 'Interactive tool for exploring Tailwind CSS classes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}