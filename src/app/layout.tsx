import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import 'bootstrap/dist/css/bootstrap.min.css'
import ImportBsJS from './_component/ImportBsJS'
import ReactQueryProvider from './_component/ReactQueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'simple todo',
  description: 'using react-query',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* font awesome 6.4.2 */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </head>
        <body className={inter.className}>
          <ImportBsJS/>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </body>
      </html>
  )
}