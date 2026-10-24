import type {
  Project,
  SkillGroup,
  ExperienceItem,
  StatItem,
  PrincipleItem,
  NavItem,
  ServiceItem,
  ProcessStep,
  TestimonialItem,
} from '@/types/portfolio';

export const NAVIGATION_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
] as const;

export const HERO_CONTENT = {
  eyebrow: 'FULL-STACK SOFTWARE ENGINEER',
  name: 'Try Sereyvichea',
  title: 'Full-Stack Engineer & Architect',
  supportingStatement:
    'Engineering high-performance web applications, distributed backend services, and interactive 3D digital experiences with strict architectural rigor.',
  primaryCta: 'View Selected Work',
  secondaryCta: 'Curriculum Vitae',
  availabilityText: 'Available for selected opportunities',
  portraitImage: '/developer-portrait.jpg',
  portraitAlt: 'Try Sereyvichea — Full-Stack Developer Portrait',
  floatingStats: [
    { label: 'Experience', value: '4+ Years' },
    { label: 'Delivered', value: '28+ Projects' },
    { label: 'System Uptime', value: '99.9%' },
  ],
} as const;

export const ABOUT_CONTENT = {
  sectionTag: 'ABOUT ME',
  headline: 'Building Digital Experiences with Purpose',
  leadBio:
    "I'm a full-stack developer who enjoys turning complex requirements into intuitive interfaces and reliable web applications. I care about thoughtful design, clean architecture, performance, and maintainable code.",
  detailedBio:
    'Over the past 4+ years, I have architected responsive web applications, high-throughput REST APIs, and interactive 3D WebGL experiences. My approach balances strict TypeScript contracts, reactive performance control, and accessible, responsive design that performs seamlessly across every viewport.',
  stats: [
    {
      value: '4+',
      label: 'Years of Experience',
      detail: 'Continuous production engineering',
    },
    {
      value: '28+',
      label: 'Projects Completed',
      detail: 'Enterprise & high-impact applications',
    },
    {
      value: '15+',
      label: 'Technologies Used',
      detail: 'Vue 3, TypeScript, Node.js, Three.js',
    },
  ] as StatItem[],
  principles: [
    {
      id: 'architectural-rigor',
      title: 'Architectural Rigor',
      description:
        'Clean boundaries, deterministic state machines, and typed contracts that scale without cognitive degradation.',
      iconName: 'Layers',
    },
    {
      id: 'reactive-performance',
      title: 'Reactive Performance',
      description:
        'Zero unnecessary reactivity triggers, shallow references for heavy data structures, and 60fps pacing.',
      iconName: 'Cpu',
    },
    {
      id: 'cinematic-craft',
      title: 'Meticulous Craft',
      description:
        'Every hover, displacement, and gradient is art-directed to feel weighted, natural, and purposeful.',
      iconName: 'ShieldCheck',
    },
  ] as PrincipleItem[],
} as const;

export const SERVICES: readonly ServiceItem[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description:
      'Responsive, accessible, and tactile user interfaces built with modern component architectures and micro-animations.',
    items: [
      'Responsive interfaces & cross-device layouts',
      'Vue 3 Composition API & reactive stores',
      'Component design systems & token scaling',
      'High performance, Web Vitals & accessibility',
    ],
    iconName: 'Layout',
    accentColor: 'lavender',
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description:
      'Robust server-side application logic, RESTful microservices, and secure token authorization systems.',
    items: [
      'Server-side application logic & concurrency',
      'RESTful API architecture & versioning',
      'JWT authentication & role-based authorization',
      'Maintainable distributed backend systems',
    ],
    iconName: 'Server',
    accentColor: 'periwinkle',
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Application Development',
    description:
      'End-to-end digital products connecting fluid client interfaces with scalable database infrastructure.',
    items: [
      'End-to-end full-stack application development',
      'Relational and document database integration',
      'Frontend and backend contract coordination',
      'Deployment-ready CI/CD container pipelines',
    ],
    iconName: 'Layers',
    accentColor: 'aqua',
  },
  {
    id: 'api-database',
    title: 'API and Database Integration',
    description:
      'Optimized data modeling, schema migrations, and high-throughput third-party service orchestrations.',
    items: [
      'REST API development & Swagger documentation',
      'SQL (PostgreSQL/MySQL) & NoSQL (MongoDB) modeling',
      'Strict schema validation & telemetry pipelines',
      'Reliable low-latency caching with Redis',
    ],
    iconName: 'Database',
    accentColor: 'indigo',
  },
] as const;

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    subtitle: 'High-performance reactive interfaces and tactile design systems',
    iconName: 'Code2',
    badgeAccent: 'violet',
    skills: [
      {
        name: 'Vue 3',
        experience: 'Expert',
        highlight: 'Script Setup & Composition API',
        brandColor: '#42B883',
        category: 'frontend',
      },
      {
        name: 'TypeScript',
        experience: 'Advanced',
        highlight: 'Strict contracts & zero loose types',
        brandColor: '#3178C6',
        category: 'frontend',
      },
      {
        name: 'JavaScript (ESNext)',
        experience: 'Expert',
        highlight: 'Modern standards & async',
        brandColor: '#F7DF1E',
        category: 'frontend',
      },
      {
        name: 'Tailwind CSS',
        experience: 'Expert',
        highlight: 'Scale tokens & Pearl Glass',
        brandColor: '#06B6D4',
        category: 'frontend',
      },
      {
        name: 'HTML5 & CSS3',
        experience: 'Expert',
        highlight: 'Semantic & responsive layouts',
        brandColor: '#E34F26',
        category: 'frontend',
      },
      {
        name: 'Three.js & Canvas',
        experience: 'Proficient',
        highlight: 'Interactive 3D & shaders',
        brandColor: '#0F172A',
        category: 'frontend',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Services',
    subtitle: 'Scalable services, RESTful micro-architectures, and authorization',
    iconName: 'Server',
    badgeAccent: 'cyan',
    skills: [
      {
        name: 'Node.js',
        experience: 'Advanced',
        highlight: 'Event-driven concurrency',
        brandColor: '#5FA04E',
        category: 'backend',
      },
      {
        name: 'Express.js',
        experience: 'Advanced',
        highlight: 'RESTful architectures',
        brandColor: '#0F172A',
        category: 'backend',
      },
      {
        name: 'REST APIs',
        experience: 'Expert',
        highlight: 'Clean contracts & pagination',
        brandColor: '#6366F1',
        category: 'backend',
      },
      {
        name: 'JWT & OAuth2',
        experience: 'Advanced',
        highlight: 'Role-based access control',
        brandColor: '#F59E0B',
        category: 'backend',
      },
      {
        name: 'WebSocket & SSE',
        experience: 'Proficient',
        highlight: 'Real-time telemetry',
        brandColor: '#10B981',
        category: 'backend',
      },
      {
        name: 'Security Middleware',
        experience: 'Advanced',
        highlight: 'Helmet, CORS, rate limits',
        brandColor: '#4F46E5',
        category: 'backend',
      },
    ],
  },
  {
    id: 'database',
    title: 'Databases & Caching',
    subtitle: 'Relational consistency, document stores, and memory-tier acceleration',
    iconName: 'Database',
    badgeAccent: 'indigo',
    skills: [
      {
        name: 'PostgreSQL',
        experience: 'Advanced',
        highlight: 'Complex queries & indexing',
        brandColor: '#336791',
        category: 'database',
      },
      {
        name: 'MongoDB',
        experience: 'Advanced',
        highlight: 'Aggregation pipelines',
        brandColor: '#47A248',
        category: 'database',
      },
      {
        name: 'MySQL',
        experience: 'Proficient',
        highlight: 'Relational data modeling',
        brandColor: '#00758F',
        category: 'database',
      },
      {
        name: 'Redis',
        experience: 'Proficient',
        highlight: 'Cache invalidation & queues',
        brandColor: '#DC382D',
        category: 'database',
      },
      {
        name: 'Database Migrations',
        experience: 'Advanced',
        highlight: 'Zero-downtime schemas',
        brandColor: '#6366F1',
        category: 'database',
      },
      {
        name: 'Prisma ORM',
        experience: 'Proficient',
        highlight: 'Type-safe data layers',
        brandColor: '#2D3748',
        category: 'database',
      },
    ],
  },
  {
    id: 'tools',
    title: 'DevOps & Tooling',
    subtitle: 'Containerization, reproducible environments, and automated pipelines',
    iconName: 'Cpu',
    badgeAccent: 'emerald',
    skills: [
      {
        name: 'Git & GitHub',
        experience: 'Expert',
        highlight: 'Atomic commits & trunk flow',
        brandColor: '#F05032',
        category: 'tools',
      },
      {
        name: 'Docker',
        experience: 'Advanced',
        highlight: 'Multi-stage container builds',
        brandColor: '#2496ED',
        category: 'tools',
      },
      {
        name: 'Vite',
        experience: 'Expert',
        highlight: 'Optimized bundler pipelines',
        brandColor: '#646CFF',
        category: 'tools',
      },
      {
        name: 'Postman',
        experience: 'Advanced',
        highlight: 'Automated contract testing',
        brandColor: '#FF6C37',
        category: 'tools',
      },
      {
        name: 'VS Code',
        experience: 'Expert',
        highlight: 'Configured IDE workflows',
        brandColor: '#007ACC',
        category: 'tools',
      },
      {
        name: 'Linux / Bash',
        experience: 'Proficient',
        highlight: 'Server daemon orchestration',
        brandColor: '#FCC624',
        category: 'tools',
      },
    ],
  },
] as const;

export const PROJECTS: readonly Project[] = [
  {
    id: 'ite-a3-ecosystem',
    title: 'ITE A3 Academic Ecosystem',
    tagline: 'Campus operations platform, geofenced QR attendance & duty orchestration',
    category: 'Education Platform',
    description:
      'Enterprise-grade academic operations platform featuring anti-proxy geofenced QR attendance, automated duty orchestration, and real-time Google Sheets synchronization.',
    challenge:
      'Preventing classroom attendance fraud ("buddy punching") while eliminating serverless execution timeouts during cold starts and accommodating complex Buddhist lunar calendar (Chhankitek) holiday shifts.',
    solution:
      'Engineered an anti-proxy Haversine GPS geofence validator, a fault-tolerant in-memory Circuit Breaker with client-side Axios fallback handling, and an automated AI swap matchmaking algorithm.',
    metrics: [
      { label: 'Codebase Scale', value: '57k+ LOC' },
      { label: 'DB Resilience', value: '<50ms Fast-Fail' },
      { label: 'Attendance Security', value: 'Zero-Proxy QR' },
    ],
    tags: ['Vue 3', 'TypeScript', 'Node.js'],
    featured: true,
    demoUrl: 'https://itea3.vercel.app',
    githubUrl: 'https://github.com/sereyvichea2828/website-pickup-slide',
    accentColor: 'indigo',
    mockupType: 'campus',
  },
] as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Understand requirements, users, and the core problem.',
    description:
      'Deep dive into product requirements, target user journeys, technical constraints, and system expectations to outline clear measurable objectives.',
    deliverables: ['Requirements specification', 'User journey mapping', 'Success criteria'],
  },
  {
    number: '02',
    title: 'Plan',
    summary: 'Define architecture, data flow, and technical choices.',
    description:
      'Establish robust system architectures, data models, schema definitions, and select the optimal libraries and deployment environments.',
    deliverables: ['Architecture diagrams', 'Schema data contracts', 'Tech stack roadmap'],
  },
  {
    number: '03',
    title: 'Design',
    summary: 'Plan the interface, interactions, and responsive behavior.',
    description:
      'Design clean, tactile interfaces with deliberate typographic hierarchies, accessible contrast, fluid animations, and mobile-first layouts.',
    deliverables: ['Design tokens & scale', 'Responsive wireframes', 'Interaction specifications'],
  },
  {
    number: '04',
    title: 'Develop',
    summary: 'Build reusable components, application logic, and integrations.',
    description:
      'Author clean, typed code with Vue 3 Composition API, strict TypeScript contracts, modular services, and comprehensive error handling.',
    deliverables: ['Modular Vue 3 components', 'Type-safe APIs', 'State management stores'],
  },
  {
    number: '05',
    title: 'Test & Deliver',
    summary: 'Validate functionality, fix issues, and prepare for deployment.',
    description:
      'Conduct automated contract testing, performance audits, cross-browser verification, and orchestrate containerized CI/CD releases.',
    deliverables: [
      'Lighthouse performance audit',
      'Zero-error production build',
      'Container deployment',
    ],
  },
] as const;

export const TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'Sereyvichea brings a rare combination of visual finesse and backend rigor. The web applications he builds feel buttery smooth and handle heavy data without a flinch.',
    author: 'Dara Seng',
    role: 'Lead Architect',
    company: 'NextGen Digital Labs',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'test-2',
    quote:
      'His attention to tactile glass details, micro-motion, and strict TypeScript types elevated our entire product experience. A true craftsman.',
    author: 'Elena Rostova',
    role: 'Product Director',
    company: 'OmniFlow Solutions',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'test-3',
    quote:
      'Exceptional delivery speed, zero drama, and pristine code. He transformed our complex API monitoring system into an interface our customers love.',
    author: 'Marcus Chen',
    role: 'Engineering VP',
    company: 'BlueWave Innovations',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  },
] as const;

export const EXPERIENCES: readonly ExperienceItem[] = [
  {
    id: 'senior-fullstack',
    period: '2023 — Present',
    role: 'Senior Full-Stack Engineer',
    company: 'NextGen Digital Labs',
    location: 'Phnom Penh, Cambodia',
    description:
      'Spearheading the core architectural roadmap for high-scale web applications, mentoring engineering teams in Vue 3 Composition patterns, and standardizing frontend performance metrics.',
    achievements: [
      'Architected a component library and design system adopted across 8 enterprise products, reducing frontend delivery cycles by 35%.',
      'Engineered an event-driven telemetry dashboard processing 10M+ daily events with sub-second aggregate query speeds.',
      'Enforced zero-loose-type TypeScript governance and eliminated 99% of production runtime state desynchronization issues.',
    ],
    technologies: ['Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    isCurrent: true,
  },
  {
    id: 'frontend-engineer',
    period: '2022 — 2023',
    role: 'Frontend Systems Specialist',
    company: 'OmniFlow Solutions',
    location: 'Remote / Cambodia',
    description:
      'Engineered fluid, accessible client applications, optimized 3D WebGL background visualizers, and migrated legacy codebases to reactive Vue 3 Script Setup architecture.',
    achievements: [
      'Rebuilt customer-facing portal resulting in 40% faster First Contentful Paint (FCP) and a 100/100 Lighthouse performance rating.',
      'Implemented custom GPU fragment shaders for brand marketing campaigns that maintained 60fps across low-powered mobile devices.',
      'Integrated end-to-end testing suite with automated visual regression pipelines.',
    ],
    technologies: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite', 'Pinia', 'Three.js'],
  },
  {
    id: 'software-developer',
    period: '2021 — 2022',
    role: 'Full-Stack Software Developer',
    company: 'BlueWave Innovations',
    location: 'Phnom Penh, Cambodia',
    description:
      'Developed RESTful backend microservices with Express.js and MongoDB while delivering clean, responsive UI layouts with Tailwind CSS.',
    achievements: [
      'Designed and deployed 14 secure REST endpoints with JWT authorization and role-based access validation.',
      'Consolidated multi-database queries with MongoDB indexing, cutting 95th-percentile response latency from 320ms to 45ms.',
      'Collaborated closely with design leads to convert Figma design systems into pixel-accurate component architectures.',
    ],
    technologies: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
  },
] as const;

export const CONTACT_INFO = {
  eyebrow: "LET'S CONNECT",
  headline: 'Have a project in mind?',
  supportingText: "Let's create something useful, elegant, and technically excellent together.",
  email: 'dyte.vichea.dev@gmail.com',
  location: 'Phnom Penh, Cambodia (UTC+7)',
  availability: 'Available for selected opportunities',
  socials: [
    { name: 'GitHub', url: 'https://github.com/sereyvichea2828', handle: '@sereyvichea2828' },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/try-sereyvichea-8a890a436/',
      handle: 'Try Sereyvichea',
    },
    { name: 'Email', url: 'mailto:dyte.vichea.dev@gmail.com', handle: 'dyte.vichea.dev@gmail.com' },
  ],
  projectTypes: [
    'Full-Stack Web App',
    'Frontend / Vue 3 Application',
    'API & Backend Engineering',
    'Interactive 3D / WebGL Experience',
    'Code Audit & Architecture Consulting',
  ],
} as const;
