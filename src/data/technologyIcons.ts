export interface TechnologyMetadata {
  id: string
  name: string
  title: string
  category: 'frontend' | 'backend' | 'database' | 'tools'
  isBrand: boolean
  brandColor: string
  secondaryColor?: string
  accentBg?: string
  accentBorder?: string
  tag: string
  isDual?: boolean
}

export const TECHNOLOGY_REGISTRY: Record<string, TechnologyMetadata> = {
  // Frontend
  vue: {
    id: 'vue',
    name: 'Vue 3',
    title: 'Vue.js',
    category: 'frontend',
    isBrand: true,
    brandColor: '#42B883',
    secondaryColor: '#35495E',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    tag: 'Frontend Framework',
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    title: 'TypeScript',
    category: 'frontend',
    isBrand: true,
    brandColor: '#3178C6',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/20',
    tag: 'Typed Language',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript (ESNext)',
    title: 'JavaScript',
    category: 'frontend',
    isBrand: true,
    brandColor: '#F7DF1E',
    accentBg: 'bg-yellow-500/10',
    accentBorder: 'border-yellow-500/20',
    tag: 'Language Standard',
  },
  tailwind: {
    id: 'tailwind',
    name: 'Tailwind CSS',
    title: 'Tailwind CSS',
    category: 'frontend',
    isBrand: true,
    brandColor: '#06B6D4',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/20',
    tag: 'Utility CSS',
  },
  'html5-css3': {
    id: 'html5-css3',
    name: 'HTML5 & CSS3',
    title: 'HTML5 & CSS3',
    category: 'frontend',
    isBrand: true,
    brandColor: '#E34F26',
    secondaryColor: '#1572B6',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/20',
    tag: 'Web Standards',
    isDual: true,
  },
  html5: {
    id: 'html5',
    name: 'HTML5',
    title: 'HTML5',
    category: 'frontend',
    isBrand: true,
    brandColor: '#E34F26',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/20',
    tag: 'Markup Standard',
  },
  css3: {
    id: 'css3',
    name: 'CSS3',
    title: 'CSS3',
    category: 'frontend',
    isBrand: true,
    brandColor: '#1572B6',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/20',
    tag: 'Stylesheet Standard',
  },
  'three-canvas': {
    id: 'three-canvas',
    name: 'Three.js & Canvas',
    title: 'Three.js & HTML5 Canvas',
    category: 'frontend',
    isBrand: true,
    brandColor: '#0F172A',
    secondaryColor: '#6366F1',
    accentBg: 'bg-slate-500/10',
    accentBorder: 'border-slate-500/20',
    tag: '3D Graphics & Canvas',
    isDual: true,
  },
  three: {
    id: 'three',
    name: 'Three.js',
    title: 'Three.js',
    category: 'frontend',
    isBrand: true,
    brandColor: '#0F172A',
    accentBg: 'bg-slate-500/10',
    accentBorder: 'border-slate-500/20',
    tag: 'WebGL Engine',
  },

  // Backend & Services
  node: {
    id: 'node',
    name: 'Node.js',
    title: 'Node.js',
    category: 'backend',
    isBrand: true,
    brandColor: '#5FA04E',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    tag: 'JS Runtime',
  },
  express: {
    id: 'express',
    name: 'Express.js',
    title: 'Express.js',
    category: 'backend',
    isBrand: true,
    brandColor: '#0F172A',
    accentBg: 'bg-slate-500/10',
    accentBorder: 'border-slate-500/20',
    tag: 'REST Framework',
  },
  rest: {
    id: 'rest',
    name: 'REST APIs',
    title: 'REST APIs',
    category: 'backend',
    isBrand: false,
    brandColor: '#6366F1',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/20',
    tag: 'Architecture Concept',
  },
  'jwt-oauth': {
    id: 'jwt-oauth',
    name: 'JWT & OAuth2',
    title: 'JWT & OAuth2',
    category: 'backend',
    isBrand: false,
    brandColor: '#F59E0B',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
    tag: 'Auth Protocol',
  },
  'websocket-sse': {
    id: 'websocket-sse',
    name: 'WebSocket & SSE',
    title: 'WebSocket & SSE',
    category: 'backend',
    isBrand: false,
    brandColor: '#10B981',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    tag: 'Real-Time Protocol',
  },
  'security-middleware': {
    id: 'security-middleware',
    name: 'Security Middleware',
    title: 'Security Middleware',
    category: 'backend',
    isBrand: false,
    brandColor: '#4F46E5',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/20',
    tag: 'App Defense',
  },

  // Databases & Caching
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    title: 'PostgreSQL',
    category: 'database',
    isBrand: true,
    brandColor: '#336791',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/20',
    tag: 'Relational DB',
  },
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB',
    title: 'MongoDB',
    category: 'database',
    isBrand: true,
    brandColor: '#47A248',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    tag: 'Document Store',
  },
  mysql: {
    id: 'mysql',
    name: 'MySQL',
    title: 'MySQL',
    category: 'database',
    isBrand: true,
    brandColor: '#00758F',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/20',
    tag: 'Relational DB',
  },
  redis: {
    id: 'redis',
    name: 'Redis',
    title: 'Redis',
    category: 'database',
    isBrand: true,
    brandColor: '#DC382D',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/20',
    tag: 'In-Memory Cache',
  },
  'database-migrations': {
    id: 'database-migrations',
    name: 'Database Migrations',
    title: 'Database Migrations',
    category: 'database',
    isBrand: false,
    brandColor: '#6366F1',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/20',
    tag: 'Schema Evolution',
  },
  prisma: {
    id: 'prisma',
    name: 'Prisma ORM',
    title: 'Prisma ORM',
    category: 'database',
    isBrand: true,
    brandColor: '#2D3748',
    accentBg: 'bg-slate-500/10',
    accentBorder: 'border-slate-500/20',
    tag: 'Type-Safe ORM',
  },

  // DevOps & Tooling
  'git-github': {
    id: 'git-github',
    name: 'Git & GitHub',
    title: 'Git & GitHub',
    category: 'tools',
    isBrand: true,
    brandColor: '#F05032',
    secondaryColor: '#181717',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/20',
    tag: 'Version Control',
    isDual: true,
  },
  git: {
    id: 'git',
    name: 'Git',
    title: 'Git',
    category: 'tools',
    isBrand: true,
    brandColor: '#F05032',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/20',
    tag: 'VCS',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    title: 'GitHub',
    category: 'tools',
    isBrand: true,
    brandColor: '#181717',
    accentBg: 'bg-slate-500/10',
    accentBorder: 'border-slate-500/20',
    tag: 'Code Platform',
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    title: 'Docker',
    category: 'tools',
    isBrand: true,
    brandColor: '#2496ED',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/20',
    tag: 'Containers',
  },
  vite: {
    id: 'vite',
    name: 'Vite',
    title: 'Vite',
    category: 'tools',
    isBrand: true,
    brandColor: '#646CFF',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
    tag: 'Modern Bundler',
  },
  postman: {
    id: 'postman',
    name: 'Postman',
    title: 'Postman',
    category: 'tools',
    isBrand: true,
    brandColor: '#FF6C37',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/20',
    tag: 'API Testing',
  },
  vscode: {
    id: 'vscode',
    name: 'VS Code',
    title: 'Visual Studio Code',
    category: 'tools',
    isBrand: true,
    brandColor: '#007ACC',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/20',
    tag: 'Development IDE',
  },
  'linux-bash': {
    id: 'linux-bash',
    name: 'Linux / Bash',
    title: 'Linux & GNU Bash',
    category: 'tools',
    isBrand: true,
    brandColor: '#FCC624',
    secondaryColor: '#4EAA25',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
    tag: 'OS & Shell',
    isDual: true,
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    title: 'Linux',
    category: 'tools',
    isBrand: true,
    brandColor: '#FCC624',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
    tag: 'Operating System',
  },
  bash: {
    id: 'bash',
    name: 'Bash',
    title: 'GNU Bash',
    category: 'tools',
    isBrand: true,
    brandColor: '#4EAA25',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    tag: 'Shell Scripting',
  },
}

export function resolveTechnologyId(rawName: string): string {
  const n = rawName.toLowerCase().trim()

  // Dual combinations first
  if (n.includes('html') && n.includes('css')) return 'html5-css3'
  if (n.includes('three') && (n.includes('canvas') || n.includes('webgl'))) return 'three-canvas'
  if (n.includes('git') && n.includes('github')) return 'git-github'
  if ((n.includes('linux') && n.includes('bash')) || n === 'linux / bash') return 'linux-bash'

  // Specific single matches
  if (n.includes('vue')) return 'vue'
  if (n.includes('typescript') || n === 'ts') return 'typescript'
  if (n.includes('javascript') || n === 'js' || n.includes('esnext')) return 'javascript'
  if (n.includes('tailwind')) return 'tailwind'
  if (n.includes('html')) return 'html5'
  if (n.includes('css')) return 'css3'
  if (n.includes('three')) return 'three'
  if (n.includes('node')) return 'node'
  if (n.includes('express')) return 'express'
  if (n.includes('jwt') || n.includes('oauth')) return 'jwt-oauth'
  if (n.includes('websocket') || n.includes('sse')) return 'websocket-sse'
  if (n.includes('security') || n.includes('middleware') || n.includes('helmet')) return 'security-middleware'
  if (n.includes('migration')) return 'database-migrations'
  if (n.includes('rest') || n.includes('api')) return 'rest'
  if (n.includes('postgres')) return 'postgresql'
  if (n.includes('mongo')) return 'mongodb'
  if (n.includes('mysql')) return 'mysql'
  if (n.includes('redis')) return 'redis'
  if (n.includes('prisma')) return 'prisma'
  if (n.includes('docker')) return 'docker'
  if (n.includes('vite')) return 'vite'
  if (n.includes('postman')) return 'postman'
  if (n.includes('code') || n.includes('vscode')) return 'vscode'
  if (n.includes('linux')) return 'linux'
  if (n.includes('bash')) return 'bash'
  if (n === 'git') return 'git'
  if (n === 'github') return 'github'

  return 'generic'
}
