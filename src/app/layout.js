import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/providers/SessionProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JK Dry Fruits",
  description: "JK Dry Fruits Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToasterProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}