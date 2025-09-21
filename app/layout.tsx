import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AI Chat Bot – Instant Conversations",
  description: "Chat instantly with our AI-powered bot. Fast, secure, and always available.",
  keywords: ["AI", "chatbot", "instant messaging", "conversational AI"],
  openGraph: {
    title: "AI Chat Bot",
    description: "Experience seamless conversations with our AI chat bot.",
    url: defaultUrl,
    siteName: "AI Chat Bot",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AI Chat Bot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat Bot",
    description: "Chat instantly with our AI-powered bot.",
    images: [`${defaultUrl}/og-image.png`],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
