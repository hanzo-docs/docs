'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Code,
  Rocket,
  Stars,
  Coins,
  Trophy,
  User2,
  Users,
  Database,
  Share2,
  RefreshCcw,
  Heart,
  BookOpen,
  Target,
  BarChart3,
  Zap,
} from 'lucide-react';

const BRAND_COLOR = '#fd4444';

const timelineEvents = [
  {
    year: '2014-2016',
    title: 'Origins: Verus Media & Crowdstart',
    description:
      'Zach Kelling founded Verus Media and launched Crowdstart, a platform to harness crowd-driven data and AI to help businesses grow.',
    highlight: 'Record-breaking product launches and significant crowdfunding success.',
  },
  {
    year: '2016',
    title: 'Reimagining as Hanzo',
    description:
      'The company formally incorporated as Hanzo AI, Inc., focusing on AI-powered marketing and development platforms.',
    highlight: 'Helped launch some of the most successful crowdsales in history.',
  },
  {
    year: '2017',
    title: 'Techstars Acceleration',
    description:
      'Selected for the inaugural Techstars Kansas City accelerator cohort, sharpening focus on e-commerce SaaS.',
    highlight: '23 beta users and $42M in client sales by Demo Day.',
  },
  {
    year: '2018-2020',
    title: 'AI Marketing & Blockchain',
    description:
      'Pivoted to AI marketing platform and blockchain technology, supporting tokenized crowdfunding.',
    highlight: 'Co-founded the first SEC-approved crowdfunding token offering.',
  },
  {
    year: '2021-2023',
    title: 'Product Innovation',
    description:
      'Launched Hanzo Dev, an AI-powered code editor and app builder translating natural language to live software.',
    highlight: 'Open-sourced Hanzo Base, a powerful backend framework.',
  },
  {
    year: '2024-Present',
    title: 'Strategic Partnerships',
    description:
      "Formed key alliances like Personas Social Inc. partnership to expand Keek's user base using Hanzo's AI.",
    highlight: 'Driven over $1B in revenues to clients using AI-powered marketing.',
  },
];

const principles = [
  {
    title: 'Empower the Underdog',
    description:
      'Enable others to win. Democratize technology so small businesses and startups can compete with industry giants.',
    icon: Users,
  },
  {
    title: 'Data-Driven Everything',
    description:
      'Let data be your guide. Embrace analytics and AI as the foundation of decision-making.',
    icon: Database,
  },
  {
    title: 'Open Innovation',
    description:
      'Be open, share often. Openness accelerates growth - both for the company and its community.',
    icon: Share2,
  },
  {
    title: 'Adaptability',
    description:
      'Pivot with purpose. There is no failure, only feedback. Move quickly and strike in new directions when opportunity calls.',
    icon: RefreshCcw,
  },
  {
    title: 'Customer-Centric Growth',
    description:
      'Coach clients like a sensei. Treat each client as a long-term partner and guide them to success.',
    icon: Heart,
  },
  {
    title: 'First Principles Thinking',
    description:
      'See the invisible, do the impossible. Boil problems down to their essence and solve them in fundamentally better ways.',
    icon: BookOpen,
  },
];

const senseiMethods = [
  {
    icon: Target,
    title: 'Identify First-Principle Goals',
    description: 'Drill down to the fundamental objectives that drive real value.',
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping',
    description: 'Build quickly, test assumptions, and iterate with purpose.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Decisions',
    description: 'Measure impact, analyze patterns, and let insights guide strategy.',
  },
  {
    icon: Users,
    title: 'Sensei Mentorship',
    description:
      'Work directly with expert "senseis" to implement and refine your approach.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 md:px-8 lg:px-12 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15"
              style={{
                background: `radial-gradient(circle, ${BRAND_COLOR} 0%, transparent 70%)`,
                filter: 'blur(100px)',
              }}
            />
            <div
              className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
              style={{
                background: `radial-gradient(circle, #8b5cf6 0%, transparent 70%)`,
                filter: 'blur(80px)',
              }}
            />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                style={{ backgroundColor: `${BRAND_COLOR}20`, color: BRAND_COLOR }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Our Journey
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight leading-[1.1] mb-6"
              >
                <span className="text-white">History of</span>
                <br />
                <span className="text-neutral-400">Hanzo Industries.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-base lg:text-lg text-neutral-400 leading-relaxed mb-10 max-w-3xl mx-auto"
              >
                From startup to AI powerhouse, our journey of transformation, innovation,
                and purpose.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="#timeline"
                  className="inline-flex items-center px-6 py-3 rounded-full font-medium transition-all hover:opacity-90 text-sm"
                  style={{ backgroundColor: BRAND_COLOR, color: '#ffffff' }}
                >
                  Explore Our Timeline
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <Link
                  href="/zen"
                  className="inline-flex items-center px-6 py-3 rounded-full font-medium transition-colors border border-neutral-700 bg-transparent hover:bg-neutral-900 text-sm text-white"
                >
                  The Zen of Hanzo
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900/20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Story
              </h2>
              <div className="h-1 w-20 bg-[#fd4444] mx-auto"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg p-8 mb-10"
            >
              <p className="text-neutral-400 md:text-lg leading-relaxed mb-6">
                Hanzo Industries, Inc. - originally known as Crowdstart under Verus Media
                - has undergone several transformations since its inception. Founded by
                Zach Kelling (with David Tai as co-founder) in the mid-2010s, the company
                evolved from a crowd-powered marketing platform into a Techstars-backed
                artificial intelligence venture, and ultimately into a multifaceted AI
                technology provider.
              </p>

              <p className="text-neutral-400 md:text-lg leading-relaxed mb-6">
                Along the way, Hanzo has achieved notable milestones in product
                development, fundraising, and partnerships, while navigating pivots and
                challenges that shaped its guiding philosophy. Our journey demonstrates
                the power of adaptability, resilience, and first-principles thinking in
                building technology that empowers others.
              </p>

              <p className="text-neutral-400 md:text-lg leading-relaxed">
                Today, operating under the umbrella Hanzo Industries, Inc., we remain
                small but influential, proving the mantra that a lean, mission-driven team
                can punch well above its weight. Our mission is to accelerate human
                entrepreneurship through intelligent technology and timeless wisdom.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Journey Through Time
              </h2>
              <div className="h-1 w-20 bg-[#fd4444] mx-auto mb-6"></div>
              <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                From crowd-powered marketing to AI innovation, explore the key milestones
                that shaped Hanzo Industries.
              </p>
            </motion.div>

            <div className="mt-16 space-y-16">
              {timelineEvents.map((event, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      isEven ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="md:w-1/2">
                      <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg p-8 h-full">
                        <div className="flex items-center mb-4">
                          <div className="p-3 rounded-full bg-neutral-800 mr-4">
                            <Rocket
                              className="h-6 w-6"
                              style={{ color: BRAND_COLOR }}
                            />
                          </div>
                          <div>
                            <span
                              className="text-sm font-semibold"
                              style={{ color: BRAND_COLOR }}
                            >
                              {event.year}
                            </span>
                            <h3 className="text-2xl font-bold text-white">
                              {event.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-neutral-400 mb-4">{event.description}</p>
                        <div className="bg-[#fd4444]/10 border border-[#fd4444]/20 rounded-lg p-4">
                          <p className="text-[#fd4444]/80 italic">"{event.highlight}"</p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block md:w-1/2 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-full bg-[#fd4444]/30"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#fd4444] flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Zen Principles Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The Zen of Hanzo
              </h2>
              <div className="h-1 w-20 bg-[#fd4444] mx-auto mb-6"></div>
              <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                Our guiding philosophy - a set of first principles and laws that act as
                our north star.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg p-8 h-full"
                  >
                    <div className="mb-6">
                      <Icon className="h-10 w-10" style={{ color: BRAND_COLOR }} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {principle.title}
                    </h3>
                    <p className="text-neutral-400">{principle.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sensei Method Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1 rounded-full bg-[#fd4444]/10 border border-[#fd4444]/30 text-[#fd4444] text-sm font-medium mb-4">
                  Principles in Practice
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  The Sensei Method
                </h2>
                <p className="text-xl text-neutral-400 mb-8">
                  A practical framework for applying AI and data to achieve exponential
                  growth for businesses. If the "Zen of Hanzo" is the theory, the Sensei
                  Method is the practice.
                </p>

                <div className="space-y-6 mb-8">
                  {senseiMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div key={index} className="flex items-start">
                        <div className="p-2 bg-[#fd4444]/10 rounded-lg mr-4">
                          <Icon className="h-6 w-6" style={{ color: BRAND_COLOR }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {method.title}
                          </h3>
                          <p className="text-neutral-400">{method.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <a
                  href="https://sensei.group"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full font-medium transition-all hover:opacity-90 text-sm"
                  style={{ backgroundColor: BRAND_COLOR, color: '#ffffff' }}
                >
                  Visit Sensei Group
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-[#fd4444]/20 to-transparent rounded-2xl p-1">
                  <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-neutral-800">
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        The Impact of Sensei
                      </h3>
                      <p className="text-neutral-400 mb-6">
                        Through the Sensei Method and Sensei Group, we've helped clients
                        generate over $1 billion in revenue, launch groundbreaking
                        products, and build scalable businesses.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-[#fd4444]/10 px-4 py-2 rounded-lg">
                          <span className="text-2xl font-bold text-[#fd4444]">$1B+</span>
                          <p className="text-sm text-neutral-400">Client Revenue</p>
                        </div>
                        <div className="bg-[#fd4444]/10 px-4 py-2 rounded-lg">
                          <span className="text-2xl font-bold text-[#fd4444]">100+</span>
                          <p className="text-sm text-neutral-400">Product Launches</p>
                        </div>
                        <div className="bg-[#fd4444]/10 px-4 py-2 rounded-lg">
                          <span className="text-2xl font-bold text-[#fd4444]">10+</span>
                          <p className="text-sm text-neutral-400">Years Experience</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
