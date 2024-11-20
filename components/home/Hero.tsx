"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { BsLightningChargeFill } from 'react-icons/bs'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary-black to-accent-midnight overflow-hidden min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-primary-violet mb-4"
              >
                <BsLightningChargeFill className="h-5 w-5" />
                <span className="text-sm font-semibold">Powered by Advanced AI</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl tracking-tight font-extrabold text-text-light sm:text-5xl md:text-6xl"
              >
                <span className="block">Unlock Document</span>
                <span className="block text-primary-violet">Intelligence with AI</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="mt-3 text-base text-text-purple sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto"
              >
                Transform complex documents into actionable insights. Get instant analysis, 
                smart drafting, and expert consultations - all powered by cutting-edge AI technology.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                <div className="rounded-md shadow">
                  <Link
                    href="/declutter"
                    className="group w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-violet hover:bg-accent-violet transition-all duration-300 transform hover:scale-105 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                    <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-accent-violet text-base font-medium rounded-md text-text-light bg-transparent hover:bg-accent-violet/10 transition-all duration-300 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </main>
        </motion.div>
      </div>
      
      <motion.div 
        className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative h-56 w-full sm:h-72 md:h-96 lg:h-screen">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-black/80 to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80"
            alt="NYAI Platform Dashboard"
            width={1920}
            height={1080}
            priority
            className="object-cover w-full h-full"
          />
        </div>
      </motion.div>
    </div>
  )
} 