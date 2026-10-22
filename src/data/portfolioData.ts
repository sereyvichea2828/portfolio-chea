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
  title: 'Full-Stack Developer & Architect',
  supportingStatement:
    'I build thoughtful digital experiences, powerful web applications, and scalable systems that connect beautiful interfaces with reliable engineering.',
  primaryCta: 'View My Work',
  secondaryCta: 'Download Resume',
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
      { name: 'Vue 3', experience: 'Expert', highlight: 'Script Setup & Composition API' },
      {
        name: 'TypeScript',
        experience: 'Advanced',
        highlight: 'Strict contracts & zero loose types',
      },
      { name: 'JavaScript (ESNext)', experience: 'Expert', highlight: 'Modern standards & async' },
      { name: 'Tailwind CSS', experience: 'Expert', highlight: 'Scale tokens & Pearl Glass' },
      { name: 'HTML5 & CSS3', experience: 'Expert', highlight: 'Semantic & responsive layouts' },
      {
        name: 'Three.js & Canvas',
        experience: 'Proficient',
        highlight: 'Interactive 3D & shaders',
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
      { name: 'Node.js', experience: 'Advanced', highlight: 'Event-driven concurrency' },
      { name: 'Express.js', experience: 'Advanced', highlight: 'RESTful architectures' },
      { name: 'REST APIs', experience: 'Expert', highlight: 'Clean contracts & pagination' },
      { name: 'JWT & OAuth2', experience: 'Advanced', highlight: 'Role-based access control' },
      { name: 'WebSocket & SSE', experience: 'Proficient', highlight: 'Real-time telemetry' },
      {
        name: 'Security Middleware',
        experience: 'Advanced',
        highlight: 'Helmet, CORS, rate limits',
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
      { name: 'PostgreSQL', experience: 'Advanced', highlight: 'Complex queries & indexing' },
      { name: 'MongoDB', experience: 'Advanced', highlight: 'Aggregation pipelines' },
      { name: 'MySQL', experience: 'Proficient', highlight: 'Relational data modeling' },
      { name: 'Redis', experience: 'Proficient', highlight: 'Cache invalidation & queues' },
      { name: 'Database Migrations', experience: 'Advanced', highlight: 'Zero-downtime schemas' },
      { name: 'Prisma ORM', experience: 'Proficient', highlight: 'Type-safe data layers' },
    ],
  },
  {
    id: 'tools',
    title: 'DevOps & Tooling',
    subtitle: 'Containerization, reproducible environments, and automated pipelines',
    iconName: 'Cpu',
    badgeAccent: 'emerald',
    skills: [
      { name: 'Git & GitHub', experience: 'Expert', highlight: 'Atomic commits & trunk flow' },
      { name: 'Docker', experience: 'Advanced', highlight: 'Multi-stage container builds' },
      { name: 'Vite', experience: 'Expert', highlight: 'Optimized bundler pipelines' },
      { name: 'Postman', experience: 'Advanced', highlight: 'Automated contract testing' },
      { name: 'VS Code', experience: 'Expert', highlight: 'Configured IDE workflows' },
      { name: 'Linux / Bash', experience: 'Proficient', highlight: 'Server daemon orchestration' },
    ],
  },
] as const;

export const PROJECTS: readonly Project[] = [
  {
    id: 'apex-finance',
    title: 'Apex Financial Intelligence',
    tagline: 'Financial summaries, transaction histories & risk simulation',
    category: 'Full Stack',
    description:
      'A high-frequency financial visualization and portfolio risk analysis workspace. Features streaming telemetry, interactive charts, and deep algorithmic drawdown simulations.',
    challenge:
      'Handling real-time WebSocket tick streams with over 2,000 updates per second without DOM rendering lag or memory churn.',
    solution:
      'Engineered an offscreen WebWorker data pipeline paired with Vue 3 shallowRef() bindings and GPU-accelerated canvas rendering, maintaining 60fps under stress.',
    metrics: [
      { label: 'Throughput', value: '2.5k ticks/sec' },
      { label: 'Render Latency', value: '16.6ms' },
      { label: 'Memory Churn', value: '0 garbage spikes' },
    ],
    tags: ['Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    featured: true,
    demoUrl: 'https://github.com/sereyvichea2828',
    githubUrl: 'https://github.com/sereyvichea2828',
    accentColor: 'violet',
    mockupType: 'finance',
  },
  {
    id: 'flowstate-orchestrator',
    title: 'FlowState Orchestrator',
    tagline: 'Data-driven interface, interactive charts & DAG pipelines',
    category: 'Frontend',
    description:
      'An interactive analytics dashboard and pipeline orchestration interface where teams build, inspect, and trigger multi-node DAG workflows with real-time status telemetry.',
    challenge:
      'Visualizing complex dependency graph topologies with fluid drag interactions while supporting collaborative multi-user live presence.',
    solution:
      'Implemented an interactive canvas node renderer with quad-tree collision caching, declarative transitions, and optimistic conflict-free UI resolution.',
    metrics: [
      { label: 'Active Nodes', value: '500+ DAG Nodes' },
      { label: 'Broadcast Delay', value: '<30ms Sync' },
      { label: 'Bundle Size', value: '42kB Gzip' },
    ],
    tags: ['Vue 3', 'TypeScript', 'Pinia', 'Tailwind CSS', 'Canvas API', 'REST API'],
    featured: true,
    demoUrl: 'https://github.com/sereyvichea2828',
    githubUrl: 'https://github.com/sereyvichea2828',
    accentColor: 'cyan',
    mockupType: 'tasks',
  },
  {
    id: 'nexus-api-gateway',
    title: 'Nexus Cloud API Gateway',
    tagline: 'SaaS management platform, telemetry streaming & proxy',
    category: 'Backend/API',
    description:
      'An enterprise developer portal and streaming proxy service providing real-time request tracing, dynamic token bucket rate-limiting, and zero-leak JWT session management.',
    challenge:
      'Constructing an ultra-low latency gateway layer capable of transparent telemetry ingestion without adding more than 2 milliseconds of reverse-proxy overhead.',
    solution:
      'Developed an asynchronous Node.js streaming pipeline using Redis memory pipelines, automated token bucket throttling, and structured JSON logs with Prometheus endpoints.',
    metrics: [
      { label: 'Proxy Overhead', value: '<1.8ms Median' },
      { label: 'Concurrent Sockets', value: '10,000+' },
      { label: 'Test Coverage', value: '98.5% Core' },
    ],
    tags: ['Node.js', 'Express.js', 'Redis', 'MongoDB', 'Docker', 'Swagger'],
    featured: true,
    demoUrl: 'https://github.com/sereyvichea2828',
    githubUrl: 'https://github.com/sereyvichea2828',
    accentColor: 'emerald',
    mockupType: 'api',
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
  email: 'sereyvichea.dev@gmail.com',
  location: 'Phnom Penh, Cambodia (UTC+7)',
  availability: 'Available for selected opportunities',
  socials: [
    { name: 'GitHub', url: 'https://github.com/sereyvichea2828', handle: '@sereyvichea2828' },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/sereyvichea-chea',
      handle: 'Try Sereyvichea',
    },
    { name: 'Email', url: 'mailto:sereyvichea.dev@gmail.com', handle: 'sereyvichea.dev@gmail.com' },
  ],
  projectTypes: [
    'Full-Stack Web App',
    'Frontend / Vue 3 Application',
    'API & Backend Engineering',
    'Interactive 3D / WebGL Experience',
    'Code Audit & Architecture Consulting',
  ],
} as const;
