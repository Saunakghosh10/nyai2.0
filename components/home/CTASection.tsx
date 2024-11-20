"use client";

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CTASection() {
  return (
    <div className="bg-gradient-to-r from-primary-violet to-primary-purple">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative isolate overflow-hidden bg-accent-midnight/90 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
        >
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold tracking-tight text-text-light sm:text-4xl"
            >
              Ready to transform your<br />
              document experience?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg leading-8 text-text-purple"
            >
              Join thousands of users who are already using AI to simplify their document management. 
              Start with our free tier today.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start"
            >
              <Link
                href="/declutter"
                className="rounded-md bg-text-light px-3.5 py-2.5 text-sm font-semibold text-primary-black shadow-sm hover:bg-text-purple transition-colors duration-300"
              >
                Try for Free
              </Link>
              <Link 
                href="#features" 
                className="text-sm font-semibold leading-6 text-text-light hover:text-primary-violet transition-colors duration-300"
              >
                View Features <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-16 h-80 lg:mt-8"
          >
            <Image
              className="rounded-md bg-white/5 ring-1 ring-white/10"
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
              alt="App screenshot"
              width={1824}
              height={1080}
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 