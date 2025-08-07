"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function HeroSectionOne() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Navbar />

      {/* Decorative side lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Hero Section */}
      <div className="px-4 py-16 md:py-24">
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-bold text-slate-700 md:text-5xl lg:text-6xl dark:text-slate-200">
          {"Your Personal Medical Assistant, Just a Call Away"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-neutral-600 dark:text-neutral-400"
        >
          FroshAi lets you speak directly with an AI — just like a phone call. Describe your symptoms and get helpful, real-time responses based on real medical knowledge. It’s built for ease, speed, and privacy — no waiting rooms, no guesswork.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.3 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/sign-in">
            <button className="w-48 rounded-lg bg-black px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get Started
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Updated Info Section */}
      <section className="w-full bg-gray-50 dark:bg-zinc-900 py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3 text-center">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Voice Interaction
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Talk to the AI like a real call. Describe symptoms in your own words, and get voice responses instantly.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Medically Trained AI
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The system is focused only on medical conversations and trained to understand health-related questions with care.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Private & Secure
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your voice stays between you and the AI. No data shared. Just answers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 w-full border-t border-neutral-200 bg-white px-6 py-10 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} FroshAi. All rights reserved.
          </div>
          <div className="text-center md:text-right">
            Built with purpose. Powered by <span className="font-semibold text-blue-600">FroshX</span>.
          </div>
        </div>
      </footer>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="w-full border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">FroshAi</h1>
        {!user ? (
          <Link href="/sign-in">
            <button className="w-28 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Login
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <UserButton />
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
