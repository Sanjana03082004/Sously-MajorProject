// import type { Metadata } from 'next'
// import './globals.css'

// export const metadata: Metadata = {
//   title: 'v0 App',
//   description: 'Created with v0',
//   generator: 'v0.dev',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }
import type { Metadata } from "next";
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

export const metadata: Metadata = {
  title: "Soulsy",
  description: "Your 24/7 AI Emotional Companion",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
