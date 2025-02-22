import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MD/HTML to PDF Converter",
  description: "Convert Markdown or HTML to PDF easily",
  applicationName: "mdhtmltopdf",
  authors: {"name": "Xander LS", "url": "https://xanderls.dev/"},
  keywords: "mdhtmltopdf, markdown, html, pdf, converter, convert, md to pdf, html to pdf, pdf converter, pdf converter",
  creator: "Luis Lara",
  icons: {
    icon: 'favicon.ico',
    apple: 'favicon.ico',
    // icon: 'https://docs.nestjs.com/assets/logo-small-gradient.svg',
    // apple: 'https://docs.nestjs.com/assets/logo-small-gradient.svg',
  },
}

export const viewport: Viewport = {
  initialScale: 1.0,
  width: 'device-width',
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

