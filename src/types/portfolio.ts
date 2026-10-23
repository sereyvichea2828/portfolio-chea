export type ProjectCategory =
  | 'All'
  | 'Education'
  | 'Mathematics'
  | 'Hardware / Embedded Systems'
  | 'Full Stack'
  | 'Frontend'
  | 'Backend/API'

export interface ProjectMetric {
  label: string
  value: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  category: 'Education' | 'Mathematics' | 'Hardware / Embedded Systems' | 'Full Stack' | 'Frontend' | 'Backend/API'
  description: string
  challenge: string
  solution: string
  metrics: ProjectMetric[]
  tags: string[]
  featured: boolean
  demoUrl: string
  githubUrl: string
  accentColor: 'violet' | 'cyan' | 'indigo' | 'emerald'
  mockupType: 'finance' | 'tasks' | 'api' | 'campus' | 'math' | 'iee'
  imageUrl?: string
  imageAlt?: string
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  items: string[]
  iconName: 'Layout' | 'Server' | 'Layers' | 'Database'
  accentColor: 'lavender' | 'periwinkle' | 'aqua' | 'indigo'
}

export interface ProcessStep {
  number: string
  title: string
  summary: string
  description: string
  deliverables: string[]
}

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role: string
  company: string
  avatar: string
}

export interface SkillItem {
  name: string
  experience: string
  highlight: string
  brandColor?: string
  category?: 'frontend' | 'backend' | 'database' | 'tools'
}

export interface SkillGroup {
  id: string
  title: string
  subtitle: string
  iconName: 'Code2' | 'Server' | 'Database' | 'Cpu'
  badgeAccent: 'violet' | 'cyan' | 'indigo' | 'emerald'
  skills: SkillItem[]
}

export interface ExperienceItem {
  id: string
  period: string
  role: string
  company: string
  location: string
  description: string
  achievements: string[]
  technologies: string[]
  isCurrent?: boolean
}

export interface StatItem {
  value: string
  label: string
  detail: string
}

export interface PrincipleItem {
  id: string
  title: string
  description: string
  iconName: 'Layers' | 'Cpu' | 'ShieldCheck'
}

export interface NavItem {
  label: string
  href: string
}

export interface ContactFormData {
  name: string
  email: string
  projectType: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  projectType?: string
  message?: string
}
