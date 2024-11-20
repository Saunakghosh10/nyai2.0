"use client";

import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const tiers = [
  {
    name: 'Basic',
    price: 'Free',
    features: [
      'Access to Declutter module with ads',
      'Basic document analysis',
      'Limited document drafting',
      'Community support',
    ],
    buttonText: 'Start Free',
    buttonVariant: 'outline',
  },
  {
    name: 'Pro',
    price: '$29',
    features: [
      'Ad-free experience',
      'Advanced document analysis',
      'Unlimited document drafting',
      'Priority support',
      '2 free consultations/month',
    ],
    buttonText: 'Start Pro',
    buttonVariant: 'solid',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    features: [
      'All Pro features',
      'Unlimited consultations',
      'Custom document templates',
      'API access',
      'Dedicated account manager',
      'Custom branding',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function PricingPlans() {
  return (
    <div className="bg-gradient-to-b from-accent-midnight to-primary-black py-24 sm:py-32">
      <motion.div 
        className="mx-auto max-w-7xl px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2 
            variants={cardVariants}
            className="text-base font-semibold leading-7 text-primary-violet"
          >
            Pricing
          </motion.h2>
          <motion.p 
            variants={cardVariants}
            className="mt-2 text-4xl font-bold tracking-tight text-text-light sm:text-5xl"
          >
            Choose the right plan for you
          </motion.p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 md:grid-cols-3 lg:gap-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-3xl p-8 ring-1 backdrop-blur-sm ${
                tier.mostPopular 
                  ? 'bg-accent-violet/10 ring-accent-violet' 
                  : 'bg-accent-midnight/50 ring-accent-violet/20'
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-violet px-4 py-1 text-sm font-semibold text-white">
                    <SparklesIcon className="h-4 w-4" />
                    Most popular
                  </span>
                </div>
              )}
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-text-light">
                {tier.name}
              </h3>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-text-light">{tier.price}</span>
                {tier.price !== 'Free' && <span className="text-sm font-semibold text-text-purple">/month</span>}
              </p>
              <ul role="list" className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-primary-violet" aria-hidden="true" />
                    <span className="text-sm leading-6 text-text-purple">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.buttonVariant === 'solid'
                    ? 'bg-primary-violet text-white hover:bg-accent-violet'
                    : 'bg-transparent text-text-light ring-1 ring-accent-violet hover:bg-accent-violet/10'
                }`}
              >
                {tier.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 