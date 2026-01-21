import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Code2,
  Paintbrush,
  Settings,
  MessagesSquare,
  HelpCircle,
  Palette,
  Music,
  BarChart,
  Bot,
  DollarSign,
  Scale,
  Binary,
  Database,
  Calculator,
  MessageCircle,
  Lightbulb,
  ExternalLink,
  Mail,
  Phone,
  Shield,
  Users,
  ArrowRight,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface TeamMemberFeature {
  icon: string;
  color: string;
  title: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  description: string;
  gradient: string;
  mainIcon: string;
  features: TeamMemberFeature[];
}

// =============================================================================
// DATA
// =============================================================================

const teamMembers: TeamMember[] = [
  {
    id: 'dev',
    name: 'Dev',
    title: 'Meet Dev, Your AI Developer',
    role: 'AI Developer',
    description: 'Your expert AI developer, specializing in full-stack development and system architecture.',
    gradient: 'from-blue-500 to-cyan-500',
    mainIcon: 'Code2',
    features: [
      { icon: 'Bot', color: 'text-blue-400', title: 'System Architecture', description: 'Designs robust and scalable system architectures for complex applications.' },
      { icon: 'Code2', color: 'text-cyan-400', title: 'Full-Stack Development', description: 'Implements end-to-end solutions with modern technologies and best practices.' },
      { icon: 'Binary', color: 'text-blue-400', title: 'Code Quality', description: 'Ensures high-quality, maintainable, and well-documented code.' },
    ],
  },
  {
    id: 'des',
    name: 'Des',
    title: 'Meet Des, Your AI Designer',
    role: 'AI Designer',
    description: 'Your creative AI designer, crafting beautiful and intuitive user experiences.',
    gradient: 'from-purple-500 to-pink-500',
    mainIcon: 'Paintbrush',
    features: [
      { icon: 'Paintbrush', color: 'text-purple-400', title: 'UI Design', description: 'Creates stunning user interfaces with attention to detail and user experience.' },
      { icon: 'Bot', color: 'text-pink-400', title: 'Design Systems', description: 'Develops comprehensive design systems for consistent brand experiences.' },
      { icon: 'Settings', color: 'text-purple-400', title: 'Prototyping', description: 'Builds interactive prototypes to validate design concepts and user flows.' },
    ],
  },
  {
    id: 'opera',
    name: 'Opera',
    title: 'Meet Opera, Your Operations Engineer',
    role: 'Operations Engineer',
    description: 'Your efficient AI operations engineer, maintaining system reliability and performance.',
    gradient: 'from-yellow-500 to-orange-500',
    mainIcon: 'Settings',
    features: [
      { icon: 'Settings', color: 'text-yellow-400', title: 'System Monitoring', description: 'Maintains 24/7 monitoring of all systems and infrastructure.' },
      { icon: 'Bot', color: 'text-orange-400', title: 'Cloud Operations', description: 'Manages cloud infrastructure and ensures optimal resource utilization.' },
      { icon: 'Scale', color: 'text-yellow-400', title: 'System Security', description: 'Implements and maintains robust security protocols and practices.' },
    ],
  },
  {
    id: 'mark',
    name: 'Mark',
    title: 'Meet Mark, Your Marketing Expert',
    role: 'AI Marketing Director',
    description: 'Your AI marketing strategist, crafting compelling campaigns and driving engagement.',
    gradient: 'from-green-500 to-emerald-500',
    mainIcon: 'MessagesSquare',
    features: [
      { icon: 'Bot', color: 'text-green-400', title: 'Campaign Strategy', description: 'Develops data-driven marketing campaigns that resonate with your target audience.' },
      { icon: 'BarChart', color: 'text-emerald-400', title: 'Content Planning', description: 'Creates engaging content strategies that drive growth and engagement.' },
      { icon: 'MessagesSquare', color: 'text-green-400', title: 'Analytics', description: 'Provides deep insights and metrics to optimize marketing performance.' },
    ],
  },
  {
    id: 'su',
    name: 'Su',
    title: 'Meet Su, Your Support Engineer',
    role: 'Help & Support Engineer',
    description: 'Your dedicated AI support engineer, ensuring smooth operations and user satisfaction.',
    gradient: 'from-pink-500 to-rose-500',
    mainIcon: 'HelpCircle',
    features: [
      { icon: 'HelpCircle', color: 'text-pink-400', title: 'User Support', description: 'Provides comprehensive technical support and problem resolution.' },
      { icon: 'MessageCircle', color: 'text-rose-400', title: 'Documentation', description: 'Creates and maintains detailed documentation and user guides.' },
      { icon: 'Bot', color: 'text-pink-400', title: 'Training', description: 'Develops and delivers training programs for users and teams.' },
    ],
  },
  {
    id: 'art',
    name: 'Art',
    title: 'Meet Art, Your AI Artist',
    role: 'AI Artist',
    description: 'Your creative AI artist, bringing imagination to life through digital artistry.',
    gradient: 'from-violet-500 to-indigo-500',
    mainIcon: 'Palette',
    features: [
      { icon: 'Palette', color: 'text-violet-400', title: 'Digital Art', description: 'Creates stunning digital artwork across various styles and mediums.' },
      { icon: 'Bot', color: 'text-indigo-400', title: 'Visual Design', description: 'Develops unique visual identities and design concepts.' },
      { icon: 'Lightbulb', color: 'text-violet-400', title: 'Creative Direction', description: 'Provides artistic vision and creative direction for projects.' },
    ],
  },
  {
    id: 'mu',
    name: 'Mu',
    title: 'Meet Mu, Your AI Musician',
    role: 'AI Musician',
    description: 'Your creative AI musician, composing and producing original music.',
    gradient: 'from-pink-500 to-purple-500',
    mainIcon: 'Music',
    features: [
      { icon: 'Music', color: 'text-pink-400', title: 'Composition', description: 'Creates original musical compositions in various genres.' },
      { icon: 'Bot', color: 'text-purple-400', title: 'Production', description: 'Handles music production and sound engineering.' },
      { icon: 'Lightbulb', color: 'text-pink-400', title: 'Arrangement', description: 'Provides musical arrangement and orchestration services.' },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    title: 'Meet Data, Your AI Data Scientist',
    role: 'AI Data Scientist',
    description: 'Your expert AI data scientist, unlocking insights from complex datasets.',
    gradient: 'from-blue-500 to-indigo-500',
    mainIcon: 'BarChart',
    features: [
      { icon: 'BarChart', color: 'text-blue-400', title: 'Data Analysis', description: 'Analyzes complex datasets to extract meaningful insights.' },
      { icon: 'Bot', color: 'text-indigo-400', title: 'Machine Learning', description: 'Develops and implements machine learning models.' },
      { icon: 'Database', color: 'text-blue-400', title: 'Data Visualization', description: 'Creates clear and informative data visualizations.' },
    ],
  },
  {
    id: 'core',
    name: 'Core',
    title: 'Meet Core, Your AI Core Engineer',
    role: 'AI Core Engineer',
    description: 'Your expert AI core engineer, building robust system foundations.',
    gradient: 'from-gray-500 to-slate-500',
    mainIcon: 'Settings',
    features: [
      { icon: 'Settings', color: 'text-neutral-400', title: 'Core Systems', description: 'Develops and maintains core system infrastructure.' },
      { icon: 'Bot', color: 'text-slate-400', title: 'Performance', description: 'Optimizes system performance and reliability.' },
      { icon: 'Binary', color: 'text-neutral-400', title: 'Architecture', description: 'Designs scalable system architectures.' },
    ],
  },
  {
    id: 'fin',
    name: 'Fin',
    title: 'Meet Fin, Your AI Financial Expert',
    role: 'AI Financial Expert',
    description: 'Your expert AI financial analyst, providing financial insights and strategy.',
    gradient: 'from-green-500 to-teal-500',
    mainIcon: 'DollarSign',
    features: [
      { icon: 'DollarSign', color: 'text-green-400', title: 'Financial Analysis', description: 'Provides comprehensive financial analysis and reporting.' },
      { icon: 'Bot', color: 'text-teal-400', title: 'Investment Strategy', description: 'Develops data-driven investment strategies.' },
      { icon: 'BarChart', color: 'text-green-400', title: 'Risk Management', description: 'Assesses and manages financial risks.' },
    ],
  },
  {
    id: 'sec',
    name: 'Sec',
    title: 'Meet Sec, Your AI Security Expert',
    role: 'AI Security Expert',
    description: 'Your expert AI security specialist, protecting digital assets and infrastructure.',
    gradient: 'from-red-500 to-orange-500',
    mainIcon: 'Scale',
    features: [
      { icon: 'Scale', color: 'text-red-400', title: 'Security Analysis', description: 'Conducts thorough security assessments and audits.' },
      { icon: 'Bot', color: 'text-orange-400', title: 'Threat Prevention', description: 'Implements proactive security measures.' },
      { icon: 'Settings', color: 'text-red-400', title: 'Security Operations', description: 'Manages ongoing security operations and monitoring.' },
    ],
  },
  {
    id: 'algo',
    name: 'Algo',
    title: 'Meet Algo, Your AI Algorithm Expert',
    role: 'AI Algorithm Expert',
    description: 'Your expert AI algorithm specialist, optimizing computational solutions.',
    gradient: 'from-cyan-500 to-blue-500',
    mainIcon: 'Binary',
    features: [
      { icon: 'Binary', color: 'text-cyan-400', title: 'Algorithm Design', description: 'Designs efficient algorithms for complex problems.' },
      { icon: 'Bot', color: 'text-blue-400', title: 'Optimization', description: 'Optimizes computational performance and efficiency.' },
      { icon: 'BarChart', color: 'text-cyan-400', title: 'Analysis', description: 'Analyzes algorithm complexity and performance.' },
    ],
  },
  {
    id: 'db',
    name: 'DB',
    title: 'Meet DB, Your AI Database Expert',
    role: 'AI Database Expert',
    description: 'Your expert AI database specialist, managing data infrastructure.',
    gradient: 'from-emerald-500 to-green-500',
    mainIcon: 'Database',
    features: [
      { icon: 'Database', color: 'text-emerald-400', title: 'Database Design', description: 'Designs and implements efficient database structures.' },
      { icon: 'Bot', color: 'text-green-400', title: 'Data Management', description: 'Manages and optimizes database operations.' },
      { icon: 'Settings', color: 'text-emerald-400', title: 'Performance Tuning', description: 'Optimizes database performance and reliability.' },
    ],
  },
  {
    id: 'cal',
    name: 'Cal',
    title: 'Meet Cal, Your AI Calculator',
    role: 'AI Calculator',
    description: 'Your expert AI calculator, processing complex computations.',
    gradient: 'from-purple-500 to-violet-500',
    mainIcon: 'Calculator',
    features: [
      { icon: 'Calculator', color: 'text-purple-400', title: 'Computation', description: 'Processes complex mathematical calculations.' },
      { icon: 'Bot', color: 'text-violet-400', title: 'Analysis', description: 'Provides mathematical analysis and insights.' },
      { icon: 'BarChart', color: 'text-purple-400', title: 'Modeling', description: 'Creates mathematical models and simulations.' },
    ],
  },
  {
    id: 'chat',
    name: 'Chat',
    title: 'Meet Chat, Your AI Conversation Expert',
    role: 'AI Conversation Expert',
    description: 'Your expert AI conversation specialist, facilitating natural communication.',
    gradient: 'from-blue-500 to-purple-500',
    mainIcon: 'MessageCircle',
    features: [
      { icon: 'MessageCircle', color: 'text-blue-400', title: 'Natural Language', description: 'Processes and generates natural language responses.' },
      { icon: 'Bot', color: 'text-purple-400', title: 'Conversation', description: 'Manages dynamic conversation flows.' },
      { icon: 'Lightbulb', color: 'text-blue-400', title: 'Understanding', description: 'Comprehends context and user intent.' },
    ],
  },
];

// =============================================================================
// ICON MAP
// =============================================================================

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Paintbrush,
  Settings,
  MessagesSquare,
  HelpCircle,
  Palette,
  Music,
  BarChart,
  Bot,
  DollarSign,
  Scale,
  Binary,
  Database,
  Calculator,
  MessageCircle,
  Lightbulb,
};

// =============================================================================
// STATIC PARAMS
// =============================================================================

export async function generateStaticParams() {
  return teamMembers.map((member) => ({
    member: member.id,
  }));
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ member: string }>;
}): Promise<Metadata> {
  const { member: memberId } = await params;
  const member = teamMembers.find((m) => m.id === memberId);

  if (!member) {
    return { title: 'Not Found | Hanzo AI' };
  }

  return {
    title: member.title,
    description: member.description,
  };
}

// =============================================================================
// PAGE
// =============================================================================

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ member: string }>;
}) {
  const { member: memberId } = await params;
  const member = teamMembers.find((m) => m.id === memberId);

  if (!member) {
    notFound();
  }

  const MainIcon = iconComponents[member.mainIcon] || Bot;

  // Get specialty from description
  const specialty = member.description.split(',')[0].trim();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(253, 68, 68, 0.1) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          {/* Icon */}
          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${member.gradient} mb-6`}>
            <MainIcon className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{member.title}</h1>

          {/* Description */}
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">{member.description}</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {member.features.map((feature, index) => {
              const FeatureIcon = iconComponents[feature.icon] || Bot;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-all hover:-translate-y-1"
                >
                  <FeatureIcon className={`h-8 w-8 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expert Partners Section */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            How {member.name} Works With Our Expert Partners
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Hanzo Agency Card */}
            <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/30 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div className="p-3 rounded-lg bg-purple-500/20 inline-block mb-4">
                <Users className="h-6 w-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Hanzo Agency</h3>
              <p className="text-neutral-300 mb-5">
                {member.name} collaborates with our creative agency to help brands transform their digital
                presence using cutting-edge AI-powered design and marketing strategies.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://hanzo.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Work with Hanzo Agency
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-5 py-2.5 border border-purple-500/40 hover:border-purple-500 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Learn more</span>
                  <Mail className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sensei Group Card */}
            <div className="p-6 bg-gradient-to-br from-green-900/50 to-teal-900/30 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-colors">
              <div className="p-3 rounded-lg bg-green-500/20 inline-block mb-4">
                <Shield className="h-6 w-6 text-green-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sensei Group</h3>
              <p className="text-neutral-300 mb-5">
                When your project requires human expertise, {member.name} works alongside our collective of
                CXOs and industry specialists to implement enterprise-grade solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://sensei.group"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  Contact Sensei Group
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 px-5 py-2.5 border border-green-500/40 hover:border-green-500 rounded-lg text-green-400 hover:text-green-300 transition-colors"
                >
                  <span>Schedule a call</span>
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-6 border-t border-neutral-800 bg-gradient-to-b from-neutral-900/30 to-transparent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold mb-6">What {member.name} Can Do For You</h2>
          <p className="text-neutral-400 mb-8">
            {member.name} specializes in {specialty} to help you achieve your goals.
            For the best results, consider working with our expert human teams at Hanzo Agency or Sensei Group.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://hanzo.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-lg transition-opacity"
            >
              Creative Services
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <a
              href="https://sensei.group"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 text-white rounded-lg transition-opacity"
            >
              Enterprise Solutions
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Other Team Members */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold mb-8 text-center">Meet the Team</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {teamMembers
              .filter((m) => m.id !== member.id)
              .slice(0, 10)
              .map((otherMember) => {
                const OtherIcon = iconComponents[otherMember.mainIcon] || Bot;
                return (
                  <Link key={otherMember.id} href={`/team/${otherMember.id}`} className="group">
                    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-all text-center">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${otherMember.gradient} mb-3`}>
                        <OtherIcon className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-medium text-white group-hover:text-[#fd4444] transition-colors">
                        {otherMember.name}
                      </p>
                      <p className="text-xs text-neutral-500">{otherMember.role}</p>
                    </div>
                  </Link>
                );
              })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/team"
              className="inline-flex items-center text-[#fd4444] hover:text-[#fd4444]/80 font-medium"
            >
              View full team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
