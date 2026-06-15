import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { type UserRole } from '@/types'
import { cn } from '@/utils'

interface Step {
  title:     string
  desc:      string
  resources: string[]
  done?:     boolean
}

const ROADMAPS: Partial<Record<UserRole, { title: string; steps: Step[] }>> = {
  student: {
    title: 'Student থেকে Graduate Engineer',
    steps: [
      {
        title: 'Civil Engineering Basics',
        desc:  'Engineering Drawing, Surveying, Construction Materials',
        resources: ['Basic Civil Engineering', 'Engineering Drawing Course'],
      },
      {
        title: 'Core Subjects',
        desc:  'Structural Analysis, Soil Mechanics, Hydraulics, Transportation',
        resources: ['Structural Analysis', 'Soil Mechanics'],
      },
      {
        title: 'Design Learning',
        desc:  'RCC Design, Foundation Design, Steel Design',
        resources: ['RCC Design Course', 'Design Lab'],
      },
      {
        title: 'Software Skills',
        desc:  'AutoCAD, ETABS, Primavera',
        resources: ['AutoCAD Course', 'ETABS Training'],
      },
      {
        title: 'Professional Skills',
        desc:  'BOQ, Estimation, Technical Writing',
        resources: ['Professional Skills Center'],
      },
    ],
  },

  site_engineer: {
    title: 'Site Engineer থেকে Project Manager',
    steps: [
      {
        title: 'Site Management Basics',
        desc:  'Site organization, Safety, Daily reporting',
        resources: ['Construction Hub', 'Site Documentation'],
      },
      {
        title: 'Quality Control',
        desc:  'Testing procedures, QC checklist, Material testing',
        resources: ['QC Module', 'Lab Tests Guide'],
      },
      {
        title: 'RCC Work Mastery',
        desc:  'Reinforcement, Formwork, Concrete casting',
        resources: ['Construction Learning Hub'],
      },
      {
        title: 'Project Scheduling',
        desc:  'CPM, Gantt Chart, Primavera basics',
        resources: ['Project Management Courses'],
      },
      {
        title: 'Leadership & Management',
        desc:  'Team management, Client communication, Risk',
        resources: ['Professional Development Center'],
      },
    ],
  },

  design_engineer: {
    title: 'Design Engineer থেকে Lead Structural Engineer',
    steps: [
      {
        title: 'Structural Analysis',
        desc:  'Matrix method, Finite element basics, Load analysis',
        resources: ['Structural Analysis Course'],
      },
      {
        title: 'RCC Design Mastery',
        desc:  'Beam, Column, Slab, Footing, Staircase design',
        resources: ['RCC Design Course', 'Design Lab'],
      },
      {
        title: 'Software Proficiency',
        desc:  'ETABS, SAFE, AutoCAD — advanced level',
        resources: ['ETABS Advanced', 'SAFE Course'],
      },
      {
        title: 'Steel & Special Structures',
        desc:  'Steel design, Bridge concepts, Seismic design',
        resources: ['Steel Design Course', 'Bridge Engineering'],
      },
      {
        title: 'Standards & Code Practice',
        desc:  'BNBC 2020, ACI 318, detailed code application',
        resources: ['Standards Library', 'Encyclopedia'],
      },
    ],
  },

  researcher: {
    title: 'Junior Researcher থেকে Senior Researcher',
    steps: [
      {
        title: 'Research Methodology',
        desc:  'Literature review, Research design, Data collection',
        resources: ['Research Hub'],
      },
      {
        title: 'Thesis Writing',
        desc:  'Chapter structure, Academic writing, Citations',
        resources: ['Thesis Writing Guide'],
      },
      {
        title: 'Modern Topics',
        desc:  'BIM, Digital Twin, Smart Cities, Sustainability',
        resources: ['Innovation Hub', 'Modern Topics'],
      },
      {
        title: 'Journal Paper Writing',
        desc:  'Abstract, Methodology, Results, Peer review process',
        resources: ['Research Hub'],
      },
      {
        title: 'Publication & Recognition',
        desc:  'Publishing, Conference presentation, Citation building',
        resources: ['Research Database'],
      },
    ],
  },
}

const fallbackRoadmap: { title: string; steps: Step[] } = {
  title: 'Professional Growth Path',
  steps: [
    {
      title:     'Knowledge Building',
      desc:      'Encyclopedia পড়ো, Library ব্যবহার করো',
      resources: ['Encyclopedia', 'Library'],
    },
    {
      title:     'Skill Development',
      desc:      'Courses ও Design Lab ব্যবহার করো',
      resources: ['Courses', 'Design Lab'],
    },
    {
      title:     'AI-Assisted Learning',
      desc:      'AI Tutor থেকে সাহায্য নাও',
      resources: ['AI Tutor'],
    },
  ],
}

interface Props {
  role:          UserRole
  earnedBadges?: string[]
}

export default function LearningRoadmap({ role }: Props) {
  const roadmap = ROADMAPS[role] ?? fallbackRoadmap

  return (
    <div>
      <h3 className="font-display font-semibold text-white mb-1">{roadmap.title}</h3>
      <p className="text-xs text-slate-500 mb-5">তোমার role অনুযায়ী recommended learning path</p>

      <div className="space-y-0">
        {roadmap.steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Connector */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10',
                step.done
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 border-2 border-slate-700 text-slate-400',
              )}>
                {step.done
                  ? <CheckCircle2 size={16} />
                  : <span className="text-xs font-bold">{i + 1}</span>
                }
              </div>
              {i < roadmap.steps.length - 1 && (
                <div className={cn(
                  'w-0.5 flex-1 my-1',
                  step.done ? 'bg-brand-500/40' : 'bg-slate-800',
                )} />
              )}
            </div>

            {/* Content */}
            <div className={cn(
              'pb-6 flex-1',
              i === roadmap.steps.length - 1 && 'pb-0',
            )}>
              <div className="card p-4 hover:border-brand-500/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-white text-sm">{step.title}</h4>
                  {step.done && (
                    <span className="badge-brand text-xs shrink-0">সম্পন্ন</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">{step.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.resources.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700"
                    >
                      <ArrowRight size={9} />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
