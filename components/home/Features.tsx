"use client";

import { DocumentTextIcon, PencilSquareIcon, VideoCameraIcon, ShieldCheckIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const features = [
  {
    name: 'Smart Document Analysis',
    description: 'Upload any document and get instant explanations in your preferred language, powered by advanced AI.',
    icon: DocumentTextIcon,
  },
  {
    name: 'AI-Powered Drafting',
    description: 'Create custom documents like rental agreements and affidavits using simple, legally sound language.',
    icon: PencilSquareIcon,
  },
  {
    name: 'Expert Consultation',
    description: 'Connect with top legal experts through video calls for professional guidance anywhere in India.',
    icon: VideoCameraIcon,
  },
  {
    name: 'Multi-Language Support',
    description: 'Get assistance in your preferred language, making legal documents accessible to everyone.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Secure & Reliable',
    description: 'Your documents are protected with enterprise-grade security and authentication.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Industry Specific',
    description: 'Specialized solutions for real estate, healthcare, education, and more sectors.',
    icon: SparklesIcon,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Features() {
  return (
    <div className="py-24 bg-gradient-to-b from-primary-black to-accent-midnight" id="features">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="lg:text-center">
          <motion.h2 
            variants={itemVariants}
            className="text-base text-primary-violet font-semibold tracking-wide uppercase"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-text-light sm:text-4xl"
          >
            Everything you need for legal document management
          </motion.p>
          <motion.p 
            variants={itemVariants}
            className="mt-4 max-w-2xl text-xl text-text-purple lg:mx-auto"
          >
            From document analysis to expert consultations, we've got you covered with cutting-edge AI technology.
          </motion.p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                variants={itemVariants}
                className="relative p-6 bg-accent-midnight/50 rounded-xl border border-accent-violet/20 backdrop-blur-sm group"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-violet text-white group-hover:bg-accent-violet transition-colors">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-text-light group-hover:text-primary-violet transition-colors">
                  {feature.name}
                </p>
                <p className="mt-2 ml-16 text-base text-text-purple">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 