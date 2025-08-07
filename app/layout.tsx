import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfriMedAssist",
  description: "AfriMedAssist is Nigeria’s first AI medical assistant that lets you speak directly with an intelligent voice-based system. Describe your symptoms naturally and get fast, accurate medical guidance anytime, anywhere. No waiting rooms, just real-time help tailored for Nigerians. Safe, private, and always available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          
              <Provider>
                {children}
              </Provider>
          
        </body>
      </html>
    </ClerkProvider>
  );
}
