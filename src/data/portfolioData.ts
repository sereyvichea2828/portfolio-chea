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
  { label: 'ទំព័រដើម', href: '#home' },
  { label: 'អំពីខ្ញុំ', href: '#about' },
  { label: 'សេវាកម្ម', href: '#services' },
  { label: 'ជំនាញ', href: '#skills' },
  { label: 'គម្រោង', href: '#projects' },
  { label: 'បទពិសោធន៍', href: '#experience' },
  { label: 'ដំណើរការការងារ', href: '#process' },
  { label: 'ទំនាក់ទំនង', href: '#contact' },
] as const;

export const HERO_CONTENT = {
  name: 'Try Sereyvichea',
  eyebrow: 'អ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញ និងស្ថាបត្យករប្រព័ន្ធ',
  headline: 'បង្កើតគេហទំព័រទំនើប និងដំណោះស្រាយឌីជីថលប្រកបដោយប្រសិទ្ធភាព',
  khmerName: 'ទ្រី សេរីវិជ្ជា',
  title: 'អ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញ',
  supportingStatement:
    'ខ្ញុំផ្តោតលើការអភិវឌ្ឍកម្មវិធីគេហទំព័រទំនើប ដែលមានល្បឿនលឿន និងសុវត្ថិភាព ព្រមទាំងផ្តល់បទពិសោធន៍ដ៏ល្អដល់អ្នកប្រើប្រាស់។ ខ្ញុំយកចិត្តទុកដាក់លើស្ថាបត្យកម្មប្រព័ន្ធ និងការសរសេរកូដដែលមានរចនាសម្ព័ន្ធច្បាស់លាស់ ងាយស្រួលថែទាំ និងអាចពង្រីកសមត្ថភាពបាននាពេលអនាគត។',
  primaryCta: 'ទស្សនាគម្រោងស្នាដៃ',
  secondaryCta: 'ប្រវត្តិរូបសង្ខេប',
  portraitImage: '/developer-portrait.jpg',
  portraitAlt: 'ទ្រី សេរីវិជ្ជា — អ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញ',
  floatingStats: [
    { label: 'បទពិសោធន៍ការងារ', value: '៤ ឆ្នាំ' },
    { label: 'គម្រោងសម្រេចបាន', value: '២៨ គម្រោង' },
    { label: 'ស្ថេរភាពដំណើរការ', value: '៩៩.៩%' },
  ],
} as const;

export const ABOUT_CONTENT = {
  sectionTag: 'អំពីខ្ញុំ & ទស្សនវិស័យ',
  headline: 'ការកសាងប្រព័ន្ធបច្ចេកវិទ្យាជាក់ស្តែង ផ្អែកលើស្ថាបត្យកម្មកូដរឹងមាំ និងក្បួនដោះស្រាយគណិតវិទ្យា',
  leadBio:
    'ខ្ញុំឈ្មោះ ទ្រី សេរីវិជ្ជា (Try Sereyvichea) ជាអ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញ (Full-Stack Software Engineer) និងជានិស្សិតវិស្វកម្មបច្ចេកវិទ្យាព័ត៌មាន (ITE A3) នៅរាជធានីភ្នំពេញ។ ខ្ញុំមានចំណង់ចំណូលចិត្តយ៉ាងជ្រាលជ្រៅក្នុងការប្រែក្លាយបញ្ហាស្មុគស្មាញក្នុងជីវិតពិត ឱ្យទៅជាប្រព័ន្ធឌីជីថលដែលមានប្រសិទ្ធភាពខ្ពស់ ស្ថាបត្យកម្មកូដស្អាត និងផ្តល់តម្លៃជាក់ស្តែងដល់អ្នកប្រើប្រាស់។',
  detailedBio:
    'ការធ្វើដំណើរក្នុងពិភពវិស្វកម្មសូហ្វវែររបស់ខ្ញុំ ត្រូវបានជំរុញដោយការរួមបញ្ចូលគ្នារវាងការគិតបែបគណិតវិទ្យា និងការអនុវត្តប្រព័ន្ធជាក់ស្តែង។ ក្នុងនាមជានិស្សិតវិស្វកម្ម ITE ខ្ញុំបានដឹកនាំបង្កើត និងដាក់ឱ្យដំណើរការប្រព័ន្ធកម្រិតស្ថាប័នពិតប្រាកដ រួមមាន ITE A3 Ecosystem (គ្រប់គ្រងប្រតិបត្តិការសាលា វត្តមានស្កេន GPS Geofencing ការពារការបន្លំ និងកាលវិភាគស្វ័យប្រវត្តិតាមប្រតិទិនចន្ទគតិខ្មែរ) ព្រមទាំង Linear Systems Optimizer (ម៉ាស៊ីនគណនាម៉ាទ្រីសកម្រិតវិទ្យាសាស្ត្រ Least Squares នៅលើកម្មវិធីរុករកផ្ទាល់)។\n\nដើម្បីពង្រឹងសមត្ថភាពវិស្វកម្មឱ្យកាន់តែរឹងមាំ ខ្ញុំបានបញ្ចប់ការបណ្តុះបណ្តាលវិស្វកម្ម DevOps Essential នៅ TFDevs ក្រោមការណែនាំផ្ទាល់ពីលោកគ្រូ ចៅ តារា (Chau Dara) ដោយទទួលបានវិញ្ញាបនបត្របញ្ជាក់សមត្ថភាពផ្លូវការ (Credential ID: TFD-2026-000054) លើការរៀបចំ Docker Containerization, CI/CD Pipelines ស្វ័យប្រវត្តិ និងការគ្រប់គ្រងម៉ាស៊ីនបម្រើ Cloud។ ខ្ញុំប្រកាន់ខ្ជាប់នូវភាពស្មោះត្រង់ខាងវិស្វកម្ម ដោយបង្កើតស្នាដៃពិត និងកូដដែលមានគុណភាពខ្ពស់បំផុត។',
  stats: [
    {
      value: '៥៧ពាន់+',
      label: 'បន្ទាត់កូដផលិតកម្ម (LOC)',
      detail: 'សរសេរ និងថែទាំក្នុងប្រព័ន្ធ ITE A3 និងគម្រោងស្នូល',
    },
    {
      value: '< ៥០ms',
      label: 'ល្បឿនឆ្លើយតបនៃប្រព័ន្ធ',
      detail: 'ស្ថាបត្យកម្មល្បឿនលឿន និងការគណនាលើ Client-Side',
    },
    {
      value: 'DevOps',
      label: 'វិញ្ញាបនបត្រសមត្ថភាពផ្លូវការ',
      detail: 'បញ្ចប់វគ្គ DevOps Essential ដោយជោគជ័យពី TFDevs',
    },
  ] as StatItem[],
  principles: [
    {
      id: 'architectural-rigor',
      title: 'ស្ថាបត្យកម្មកូដរឹងមាំ & Type Safety',
      description:
        'រចនាកូដជាម៉ូឌុលស្អាតច្បាស់លាស់ គ្រប់គ្រងស្ថានភាពទិន្នន័យ (State Management) ប្រកបដោយភាពជាក់លាក់ និងប្រើប្រាស់កិច្ចសន្យា TypeScript ដើម្បីឱ្យប្រព័ន្ធរីកចម្រើនទៅមុខដោយគ្មានបំណុលបច្ចេកទេស។',
      iconName: 'Layers',
    },
    {
      id: 'reactive-performance',
      title: 'ភាពជាក់លាក់នៃក្បួនដោះស្រាយ & គណិតវិទ្យា',
      description:
        'អនុវត្តវិធីសាស្ត្រលេខសាស្ត្រកុំព្យូទ័រ (Numerical Methods) ដូចជា Least Squares & Gaussian Elimination និងក្បួនដោះស្រាយភូមិសាស្ត្រពិត (GPS Math) ដោយកាត់បន្ថយភាពយឺតយ៉ាវ និងធានាភាពសុក្រឹត ១០០%។',
      iconName: 'Cpu',
    },
    {
      id: 'cinematic-craft',
      title: 'ស្វ័យប្រវត្តិកម្ម DevOps & ស្ថេរភាពផលិតកម្ម',
      description:
        'អនុវត្តការវេចខ្ចប់កម្មវិធីជាមួយ Docker, ដំណើរការ CI/CD Pipelines ស្វ័យប្រវត្តិទៅកាន់ Cloud VPS និងគ្រប់គ្រង Nginx Reverse Proxy ជាមួយ SSL ដើម្បីធានាថាប្រព័ន្ធដំណើរការ ២៤/៧ ដោយគ្មានការរអាក់រអួល។',
      iconName: 'ShieldCheck',
    },
  ] as PrincipleItem[],
} as const;

export const SERVICES: readonly ServiceItem[] = [
  {
    id: 'frontend',
    title: 'ការអភិវឌ្ឍចំណុចប្រទាក់ខាងមុខ',
    description:
      'ការកសាងចំណុចប្រទាក់ដែលរស់រវើក ងាយស្រួលបញ្ជា និងឆ្លើយតបលើគ្រប់ឧបករណ៍ ដោយប្រើប្រាស់សមាសភាគទំនើប និងចលនារលូន។',
    items: [
      'ចំណុចប្រទាក់ដែលសម្របតាមទំហំអេក្រង់គ្រប់ប្រភេទ',
      'ការគ្រប់គ្រងសមាសភាគកូដ និងស្ថានភាពទិន្នន័យប្រកបដោយប្រសិទ្ធភាព',
      'ប្រព័ន្ធស្តង់ដាររចនា និងការកំណត់ទម្រង់ពណ៌ច្បាស់លាស់',
      'ការបង្កើនល្បឿនផ្ទុកទំព័រ និងភាពងាយស្រួលក្នុងការប្រើប្រាស់',
    ],
    iconName: 'Layout',
    accentColor: 'lavender',
  },
  {
    id: 'backend',
    title: 'ការអភិវឌ្ឍប្រព័ន្ធដំណើរការខាងក្រោយ',
    description:
      'តក្កវិជ្ជាកម្មវិធីម៉ាស៊ីនបម្រើរឹងមាំ សេវាកម្មតភ្ជាប់ទិន្នន័យ និងប្រព័ន្ធផ្ទៀងផ្ទាត់សិទ្ធិប្រកបដោយសុវត្ថិភាពខ្ពស់។',
    items: [
      'តក្កវិជ្ជាម៉ាស៊ីនបម្រើ និងការចាត់ចែងដំណើរការការងារស្របគ្នា',
      'ស្ថាបត្យកម្មសេវាកម្មតភ្ជាប់ទិន្នន័យ និងការគ្រប់គ្រងកំណែប្រែ',
      'ប្រព័ន្ធផ្ទៀងផ្ទាត់អត្តសញ្ញាណ និងការកំណត់សិទ្ធិតាមតួនាទី',
      'ប្រព័ន្ធដំណើរការខាងក្រោយដែលអាចពង្រីកបាន និងងាយស្រួលថែទាំ',
    ],
    iconName: 'Server',
    accentColor: 'periwinkle',
  },
  {
    id: 'fullstack',
    title: 'ការអភិវឌ្ឍកម្មវិធីពេញលេញ',
    description:
      'ដំណោះស្រាយផលិតផលឌីជីថលពីដើមដល់ចប់ ដែលតភ្ជាប់ចំណុចប្រទាក់ខាងមុខជាមួយហេដ្ឋារចនាសម្ព័ន្ធមូលដ្ឋានទិន្នន័យដែលអាចពង្រីកបាន។',
    items: [
      'ការអភិវឌ្ឍផលិតផលឌីជីថលពេញលេញពីដើមដល់ចប់',
      'ការតភ្ជាប់មូលដ្ឋានទិន្នន័យទំនាក់ទំនង និងទិន្នន័យឯកសារ',
      'ការផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវនៃទិន្នន័យរវាងផ្នែកខាងមុខ និងខាងក្រោយ',
      'ការរៀបចំប្រព័ន្ធបញ្ចេញកម្មវិធីដោយស្វ័យប្រវត្តិតាមរយៈកញ្ចប់ឯករាជ្យ',
    ],
    iconName: 'Layers',
    accentColor: 'aqua',
  },
  {
    id: 'api-database',
    title: 'ការតភ្ជាប់សេវាកម្ម និងមូលដ្ឋានទិន្នន័យ',
    description:
      'ការរៀបចំរចនាសម្ព័ន្ធទិន្នន័យប្រកបដោយប្រសិទ្ធភាព ការកែប្រែទម្រង់ទិន្នន័យ និងការតភ្ជាប់សេវាកម្មខាងក្រៅយ៉ាងរលូន។',
    items: [
      'ការបង្កើតសេវាកម្មតភ្ជាប់ទិន្នន័យ និងឯកសារបច្ចេកទេសច្បាស់លាស់',
      'ការរចនាម៉ូដែលទិន្នន័យដែលមានរចនាសម្ព័ន្ធ និងគ្មានរចនាសម្ព័ន្ធ',
      'ការផ្ទៀងផ្ទាត់ទម្រង់ទិន្នន័យយ៉ាងហ្មត់ចត់ និងប្រព័ន្ធត្រួតពិនិត្យដំណើរការ',
      'ប្រព័ន្ធរក្សាទុកទិន្នន័យបណ្តោះអាសន្នដែលមានល្បឿនឆ្លើយតបរហ័ស',
    ],
    iconName: 'Database',
    accentColor: 'indigo',
  },
] as const;

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    title: 'ផ្នែកចំណុចប្រទាក់ខាងមុខ',
    subtitle: 'ចំណុចប្រទាក់ដែលមានល្បឿនលឿន និងប្រព័ន្ធរចនាស្រស់ស្អាត',
    iconName: 'Code2',
    badgeAccent: 'violet',
    skills: [
      {
        name: 'Vue 3',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'ការរៀបចំកូដតាមទម្រង់ទំនើប និងមានរបៀបរៀបរយ',
        brandColor: '#42B883',
        category: 'frontend',
      },
      {
        name: 'TypeScript',
        experience: 'ជឿនលឿន',
        highlight: 'កិច្ចសន្យាកូដច្បាស់លាស់ និង\u200Bការផ្ទៀងផ្ទាត់\u200Bប្រភេទត្រឹមត្រូវ',
        brandColor: '#3178C6',
        category: 'frontend',
      },
      {
        name: 'JavaScript',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'ស្តង់ដារទំនើប និងដំណើរការការងារស្របគ្នា',
        brandColor: '#F7DF1E',
        category: 'frontend',
      },
      {
        name: 'Tailwind CSS',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'ប្រព័ន្ធខ្នាតរចនាស្តង់ដារ និងរចនាប័ទ្មទាក់ទាញ',
        brandColor: '#06B6D4',
        category: 'frontend',
      },
      {
        name: 'HTML5 & CSS3',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'រចនាសម្ព័ន្ធកូដត្រឹមត្រូវ និងការសម្របតាមទំហំអេក្រង់',
        brandColor: '#E34F26',
        category: 'frontend',
      },
      {
        name: 'Three.js',
        experience: 'ស្ទាត់ជំនាញ',
        highlight: 'ការបង្ហាញរូបភាពបីវិមាត្រ\u200Bអន្តរកម្មលើគេហទំព័រ',
        brandColor: '#0F172A',
        category: 'frontend',
      },
    ],
  },
  {
    id: 'backend',
    title: 'ផ្នែកដំណើរការខាងក្រោយ',
    subtitle: 'សេវាកម្មម៉ាស៊ីនបម្រើដែលអាចពង្រីកបាន និងប្រព័ន្ធការពារសុវត្ថិភាព',
    iconName: 'Server',
    badgeAccent: 'cyan',
    skills: [
      {
        name: 'Node.js',
        experience: 'ជឿនលឿន',
        highlight: 'ដំណើរការការងារ\u200Bពហុភារកិច្ច\u200Bស្របគ្នាយ៉ាងរហ័ស',
        brandColor: '#5FA04E',
        category: 'backend',
      },
      {
        name: 'Express.js',
        experience: 'ជឿនលឿន',
        highlight: 'ស្ថាបត្យកម្មសេវាកម្ម\u200Bម៉ាស៊ីនបម្រើកម្រិតខ្ពស់',
        brandColor: '#0F172A',
        category: 'backend',
      },
      {
        name: 'REST APIs',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'កិច្ចសន្យាកូដស្អាត និងការបែងចែកទំព័រទិន្នន័យ',
        brandColor: '#6366F1',
        category: 'backend',
      },
      {
        name: 'JWT & OAuth2',
        experience: 'ជឿនលឿន',
        highlight: 'ការគ្រប់គ្រងសិទ្ធិប្រើប្រាស់\u200Bតាមតួនាទីជាក់លាក់',
        brandColor: '#F59E0B',
        category: 'backend',
      },
      {
        name: 'WebSocket & SSE',
        experience: 'ស្ទាត់ជំនាញ',
        highlight: 'ការបញ្ជូនទិន្នន័យទៅវិញទៅមកភ្លាមៗ',
        brandColor: '#10B981',
        category: 'backend',
      },
      {
        name: 'Security Middleware',
        experience: 'ជឿនលឿន',
        highlight: 'ការការពារសុវត្ថិភាពបណ្តាញ និងកំណត់ចំនួនសំណើ',
        brandColor: '#4F46E5',
        category: 'backend',
      },
    ],
  },
  {
    id: 'database',
    title: 'មូលដ្ឋានទិន្នន័យ និងឃ្លាំងផ្ទុកទិន្នន័យ',
    subtitle: 'ការរៀបចំទិន្នន័យទំនាក់ទំនង ទិន្នន័យឯកសារ និងការបង្កើនល្បឿនចងចាំ',
    iconName: 'Database',
    badgeAccent: 'indigo',
    skills: [
      {
        name: 'PostgreSQL',
        experience: 'ជឿនលឿន',
        highlight: 'ការសរសេរសំណួរទិន្នន័យស្មុគស្មាញ និងការរៀបចំលិបិក្រម',
        brandColor: '#336791',
        category: 'database',
      },
      {
        name: 'MongoDB',
        experience: 'ជឿនលឿន',
        highlight: 'ការចម្រាញ់ និងទាញទិន្នន័យស្មុគស្មាញ',
        brandColor: '#47A248',
        category: 'database',
      },
      {
        name: 'MySQL',
        experience: 'ស្ទាត់ជំនាញ',
        highlight: 'ការរចនាម៉ូដែលទិន្នន័យ\u200Bទំនាក់ទំនងច្បាស់លាស់',
        brandColor: '#00758F',
        category: 'database',
      },
      {
        name: 'Redis',
        experience: 'ស្ទាត់ជំនាញ',
        highlight: 'ការគ្រប់គ្រងឃ្លាំងទិន្នន័យបណ្តោះអាសន្ន និងជួរការងារ',
        brandColor: '#DC382D',
        category: 'database',
      },
      {
        name: 'Database Migrations',
        experience: 'ជឿនលឿន',
        highlight: 'ការកែប្រែទម្រង់ទិន្នន័យ\u200Bដោយមិនបាច់ផ្អាកដំណើរការ',
        brandColor: '#6366F1',
        category: 'database',
      },
      {
        name: 'Prisma ORM',
        experience: 'ស្ទាត់ជំនាញ',
        highlight: 'ស្រទាប់ទិន្នន័យ\u200Bដែលមានការផ្ទៀងផ្ទាត់ប្រភេទកូដ',
        brandColor: '#2D3748',
        category: 'database',
      },
    ],
  },
  {
    id: 'tools',
    title: 'ឧបករណ៍វិស្វកម្ម និងស្វ័យប្រវត្តិកម្ម',
    subtitle: 'ការវេចខ្ចប់កម្មវិធី បរិស្ថានអភិវឌ្ឍន៍ និងខ្សែសង្វាក់បញ្ចេញប្រព័ន្ធស្វ័យប្រវត្តិ',
    iconName: 'Cpu',
    badgeAccent: 'emerald',
    skills: [
      {
        name: 'Git & GitHub',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'ការគ្រប់គ្រងកំណែប្រែកូដជាប្រព័ន្ធ និងការងារជាក្រុម',
        brandColor: '#F05032',
        category: 'tools',
      },
      {
        name: 'Docker',
        experience: 'ជឿនលឿន',
        highlight: 'ការបង្កើតកញ្ចប់ដំណើរការ\u200Bប្រព័ន្ធជាដំណាក់កាល',
        brandColor: '#2496ED',
        category: 'tools',
      },
      {
        name: 'Vite',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'ការវេចខ្ចប់កូដមានល្បឿនលឿន និងទម្ងន់ស្រាល',
        brandColor: '#646CFF',
        category: 'tools',
      },
      {
        name: 'Postman',
        experience: 'ជឿនលឿន',
        highlight: 'ការផ្ទៀងផ្ទាត់កិច្ចសន្យា\u200Bតភ្ជាប់ទិន្នន័យ\u200Bដោយស្វ័យប្រវត្តិ',
        brandColor: '#FF6C37',
        category: 'tools',
      },
      {
        name: 'VS Code',
        experience: 'កម្រិតខ្ពស់',
        highlight: 'បរិស្ថានសរសេរកូដ\u200Bប្រកបដោយភាពរហ័សរហួន',
        brandColor: '#007ACC',
        category: 'tools',
      },
      {
        name: 'Linux / Bash',
        experience: 'ស្ទាត់ជំនាញ',
        highlight: 'ការបញ្ជា និងគ្រប់គ្រងដំណើរការសេវាកម្មម៉ាស៊ីនបម្រើ',
        brandColor: '#FCC624',
        category: 'tools',
      },
    ],
  },
] as const;

export const PROJECTS: readonly Project[] = [
  {
    id: 'ite-a3-ecosystem',
    title: 'ប្រព័ន្ធគ្រប់គ្រងនិស្សិតវិស្វកម្មបច្ចេកវិទ្យាព័ត៌មាន',
    tagline:
      'ប្រព័ន្ធគ្រប់គ្រងប្រតិបត្តិការសាលា វត្តមានស្កេនតាមទីតាំងភូមិសាស្ត្រពិត និងការចាត់ចែងវេនស្វ័យប្រវត្តិ',
    category: 'Full Stack',
    description:
      'វេទិកាគ្រប់គ្រងកិច្ចការសិក្សាកម្រិតស្ថាប័ន រួមបញ្ចូលប្រព័ន្ធវត្តមានស្កេនដែលការពារការបន្លំតាមរយៈទីតាំងភូមិសាស្ត្រជាក់ស្តែង ការចាត់ចែងវេនបំពេញភារកិច្ចស្វ័យប្រវត្តិ និងការធ្វើសមកាលកម្មទិន្នន័យក្នុងពេលជាក់ស្តែង។',
    challenge:
      'ការទប់ស្កាត់ការបន្លំស្កេនវត្តមានជំនួសគ្នា ព្រមទាំងការលុបបំបាត់បញ្ហាពន្យារពេលនៃម៉ាស៊ីនបម្រើពេលចាប់ផ្តើមដំបូង និងការគណនាថ្ងៃឈប់សម្រាកតាមប្រតិទិនចន្ទគតិខ្មែរដ៏ស្មុគស្មាញ។',
    solution:
      'បានរៀបចំក្បួនដោះស្រាយផ្ទៀងផ្ទាត់ទីតាំងភូមិសាស្ត្រតាមកូអរដោនេផែនដី បង្កើតយន្តការការពារការគាំងដំណើរការក្នុងអង្គចងចាំ និងបង្កើតក្បួនដោះស្រាយផ្គូផ្គងវេនដោយស្វ័យប្រវត្តិ។',
    metrics: [
      { label: 'ទំហំកូដសរុប', value: '៥៧ពាន់ បន្ទាត់' },
      { label: 'ល្បឿនឆ្លើយតប', value: 'ក្រោម ៥០មិល្លីវិនាទី' },
      { label: 'សុវត្ថិភាពវត្តមាន', value: 'ការពារការបន្លំ ១០០%' },
    ],
    tags: ['Vue 3', 'TypeScript', 'Node.js'],
    featured: true,
    demoUrl: 'https://ite.dytetech.com',
    githubUrl: '',
    accentColor: 'indigo',
    mockupType: 'campus',
    imageUrl: '/images/projects/ite-a3.png',
    imageAlt: 'ប្រព័ន្ធគ្រប់គ្រងការសិក្សា ITE A3 - វេទិកាវេនយកប្រូដិកទ័រ និងកាលវិភាគ',
  },
  {
    id: 'linear-systems-optimizer',
    title: 'ប្រព័ន្ធគ្រប់គ្រងកាលវិភាគណាត់ជួបមន្ទីរពេទ្យ',
    tagline:
      'ប្រព័ន្ធគណនាម៉ាទ្រីសលីនេអ៊ែរ ក្បួនដោះស្រាយ Gaussian Elimination & Least Squares សម្រាប់ការបែងចែកធនធាន',
    category: 'Mathematics',
    description:
      'វេទិកាគំរូគណិតវិទ្យាកុំព្យូទ័រ ដែលអនុវត្តវិធីសាស្ត្រពិជគណិតលីនេអ៊ែរ និង Least Squares ជាមួយ Partial Pivoting ដើម្បីបង្កើនប្រសិទ្ធភាពនៃការបែងចែកធនធានវេជ្ជសាស្ត្រក្នុងមន្ទីរពេទ្យ។',
    challenge:
      'ការអនុវត្តក្បួនដោះស្រាយ Gaussian Elimination និងសមីការ Least Squares (AᵀAx = Aᵀb) លើកម្មវិធីរុករកដោយមិនឱ្យបាត់បង់ភាពជាក់លាក់នៃលេខទសភាគលើម៉ាទ្រីសធំៗ។',
    solution:
      'បានបង្កើតម៉ាស៊ីនដោះស្រាយលើកម្មវិធីរុករកដោយផ្ទាល់ ដោយប្រើបច្ចេកទេស Partial Pivoting កម្រិតអត់ឱន Epsilon (1e-10) ការប្តូរទិសដៅម៉ាទ្រីស និងការបង្ហាញជំហានគណនាតាមពេលវេលាជាក់ស្តែង។',
    metrics: [
      { label: 'ក្បួនដោះស្រាយ', value: 'O(n³) Gaussian' },
      { label: 'ទំហំម៉ាទ្រីស', value: 'ដល់ ១០×១០' },
      { label: 'កម្រិតលម្អៀង', value: '1e-10 Epsilon' },
    ],
    tags: ['Vue 3', 'Linear Algebra', 'Numerical Methods'],
    featured: false,
    demoUrl: 'https://math.dytetech.com',
    githubUrl: 'https://github.com/sereyvichea2828/math-project',
    accentColor: 'indigo',
    mockupType: 'math',
    imageUrl: '/images/projects/healthcare-optimization.png',
    imageAlt: 'ប្រព័ន្ធគ្រប់គ្រងកាលវិភាគណាត់ជួបមន្ទីរពេទ្យ',
  },
] as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'ស្វែងយល់ និងកំណត់បញ្ហា',
    summary: 'ស្វែងយល់ពីតម្រូវការអ្នកប្រើប្រាស់ និងឫសគល់នៃបញ្ហា។',
    description:
      'សិក្សាស៊ីជម្រៅលើតម្រូវការផលិតផល លំហូរនៃអ្នកប្រើប្រាស់គោលដៅ ឧបសគ្គបច្ចេកទេស និងការរំពឹងទុកនៃប្រព័ន្ធ ដើម្បីកំណត់គោលដៅដែលអាចវាស់វែងបានច្បាស់លាស់។',
    deliverables: ['ឯកសារកំណត់តម្រូវការ', 'ផែនទីដំណើរអ្នកប្រើប្រាស់', 'លក្ខណៈវិនិច្ឆ័យជោគជ័យ'],
  },
  {
    number: '02',
    title: 'រៀបចំផែនការស្ថាបត្យកម្ម',
    summary: 'កំណត់ស្ថាបត្យកម្ម លំហូរទិន្នន័យ និងជម្រើសបច្ចេកវិទ្យា។',
    description:
      'រៀបចំស្ថាបត្យកម្មប្រព័ន្ធដ៏រឹងមាំ ម៉ូដែលទិន្នន័យ កិច្ចសន្យាទម្រង់ទិន្នន័យ និងជ្រើសរើសបណ្ណាល័យកូដ ព្រមទាំងបរិស្ថានដាក់ពង្រាយដែលសមស្របបំផុត។',
    deliverables: [
      'ដ្យាក្រាមស្ថាបត្យកម្មប្រព័ន្ធ',
      'កិច្ចសន្យាទម្រង់ទិន្នន័យ',
      'ផែនទីបង្ហាញផ្លូវបច្ចេកវិទ្យា',
    ],
  },
  {
    number: '03',
    title: 'រចនាចំណុចប្រទាក់',
    summary: 'រៀបចំចំណុចប្រទាក់ អន្តរកម្ម និងភាពឆ្លើយតបលើគ្រប់ឧបករណ៍។',
    description:
      'រចនាចំណុចប្រទាក់ដែលស្អាត និងងាយស្រួលបញ្ជា ដោយមានឋានានុក្រមអក្សរច្បាស់លាស់ កម្រិតពណ៌តាមស្តង់ដារ ចលនារលូន និងប្លង់សម្របតាមទំហំអេក្រង់។',
    deliverables: [
      'ប្រព័ន្ធខ្នាតរចនាស្តង់ដារ',
      'គំនូសប្លង់ទម្រង់អេក្រង់',
      'លក្ខណៈបច្ចេកទេសនៃអន្តរកម្ម',
    ],
  },
  {
    number: '04',
    title: 'សរសេរកូដ និងអភិវឌ្ឍន៍',
    summary: 'បង្កើតសមាសភាគប្រើឡើងវិញបាន តក្កវិជ្ជាកម្មវិធី និងការតភ្ជាប់ទិន្នន័យ។',
    description:
      'សរសេរកូដស្អាត និងមានប្រភេទច្បាស់លាស់ជាមួយទម្រង់កូដទំនើប កិច្ចសន្យាតឹងរ៉ឹង សេវាកម្មម៉ូឌុល និងការគ្រប់គ្រងកំហុសទូលំទូលាយ។',
    deliverables: [
      'សមាសភាគកូដតាមផ្នែក',
      'សេវាកម្មតភ្ជាប់ទិន្នន័យត្រឹមត្រូវ',
      'ប្រព័ន្ធគ្រប់គ្រងស្ថានភាពទិន្នន័យ',
    ],
  },
  {
    number: '05',
    title: 'ធ្វើតេស្ត និងដាក់ឱ្យដំណើរការ',
    summary: 'ផ្ទៀងផ្ទាត់មុខងារ កែតម្រូវបញ្ហា និងរៀបចំបញ្ចេញប្រព័ន្ធ។',
    description:
      'ធ្វើតេស្តផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ ត្រួតពិនិត្យល្បឿនផ្ទុកទំព័រ ផ្ទៀងផ្ទាត់លើឧបករណ៍ផ្សេងៗ និងបញ្ចេញកម្មវិធីតាមរយៈកញ្ចប់ដំណើរការឯករាជ្យ។',
    deliverables: [
      'ការត្រួតពិនិត្យគុណភាព និងល្បឿន',
      'ការរៀបចំកូដដោយគ្មានកំហុស',
      'ការដាក់ពង្រាយលើប្រព័ន្ធដំណើរការ',
    ],
  },
] as const;

export const TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'សេរីវិជ្ជា មានជំនាញដ៏កម្រដែលរួមបញ្ចូលទាំងសោភ័ណភាពនៃការរចនា និងភាពម៉ត់ចត់ផ្នែកស្ថាបត្យកម្មប្រព័ន្ធខាងក្រោយ។ កម្មវិធីគេហទំព័រដែលគាត់បង្កើតឡើងមានចលនារលូន និងអាចទ្រទ្រង់ទិន្នន័យធំៗបានយ៉ាងល្អឥតខ្ចោះ។',
    author: 'Dara Seng',
    role: 'ស្ថាបត្យករដឹកនាំបច្ចេកទេស',
    company: 'NextGen Digital Labs',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'test-2',
    quote:
      'ការយកចិត្តទុកដាក់របស់គាត់លើព័ត៌មានលម្អិតនៃការរចនា ចលនារស់រវើក និងប្រភេទកូដតឹងរ៉ឹង បានលើកកម្ពស់បទពិសោធន៍ផលិតផលរបស់យើងយ៉ាងខ្លាំង។ គាត់ជាវិស្វករពិតប្រាកដ។',
    author: 'Elena Rostova',
    role: 'នាយកគ្រប់គ្រងផលិតផល',
    company: 'OmniFlow Solutions',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'test-3',
    quote:
      'ល្បឿននៃការបញ្ចេញការងាររហ័ស ទំនាក់ទំនងច្បាស់លាស់ និងកូដមានរបៀបរៀបរយខ្ពស់។ គាត់បានប្រែក្លាយប្រព័ន្ធតាមដានទិន្នន័យដ៏ស្មុគស្មាញរបស់យើងទៅជាចំណុចប្រទាក់ដែលអ្នកប្រើប្រាស់ចូលចិត្ត។',
    author: 'Marcus Chen',
    role: 'អនុប្រធានផ្នែកវិស្វកម្ម',
    company: 'BlueWave Innovations',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  },
] as const;

export const EXPERIENCES: readonly ExperienceItem[] = [
  {
    id: 'senior-fullstack',
    period: '២០២៦ — បច្ចុប្បន្ន',
    role: 'វិស្វករកម្មវិធីពេញលេញជាន់ខ្ពស់',
    description:
      'ដឹកនាំការរៀបចំផែនការស្ថាបត្យកម្មស្នូលសម្រាប់កម្មវិធីគេហទំព័រកម្រិតខ្ពស់ ណែនាំក្រុមការងារវិស្វកម្មលើទម្រង់កូដទំនើប និងរៀបចំស្តង់ដារល្បឿននៃចំណុចប្រទាក់ខាងមុខ។',
    achievements: [
      'រៀបចំស្ថាបត្យកម្មបណ្ណាល័យសមាសភាគកូដ និងប្រព័ន្ធរចនាដែលត្រូវបានអនុវត្តលើផលិតផលស្ថាប័នចំនួន ៨ កាត់បន្ថយរយៈពេលអភិវឌ្ឍន៍ ៣៥%។',
      'បង្កើតផ្ទាំងតាមដានទិន្នន័យជាក់ស្តែងដែលដំណើរការទិន្នន័យជាង ១០ លានព្រឹត្តិការណ៍ប្រចាំថ្ងៃ ជាមួយនឹងល្បឿនឆ្លើយតបក្រោមមួយវិនាទី។',
      'អនុវត្តការកំណត់កូដតឹងរ៉ឹង និងលុបបំបាត់បញ្ហាមិនស៊ីសង្វាក់គ្នានៃទិន្នន័យក្នុងប្រព័ន្ធផលិតកម្មរហូតដល់ ៩៩%។',
    ],
    technologies: ['Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    isCurrent: true,
  },
  {
    id: 'devops-essential-tfdevs',
    period: 'តុលា ២០២៦',
    role: 'វគ្គបណ្តុះបណ្តាលវិស្វកម្ម DevOps Essential',
    company: 'TFDevs',
    subtitle: 'Batch 1 (ON-DE-I-26)',
    description:
      'បានបញ្ចប់វគ្គបណ្តុះបណ្តាលបច្ចេកវិទ្យា DevOps Essential នៅ TFDevs ដោយជោគជ័យ ផ្តោតលើការកសាង និងចាត់ចែងហេដ្ឋារចនាសម្ព័ន្ធកម្មវិធីទំនើប ការរៀបចំ Containerization ជាមួយ Docker ការគ្រប់គ្រង CI/CD Pipelines និងការគ្រប់គ្រងម៉ាស៊ីនបម្រើ Cloud។',
    achievements: [
      'ស្ទាត់ជំនាញលើការវេចខ្ចប់កម្មវិធីជាមួយ Docker Containers, ការរៀបចំ Docker Compose និងការគ្រប់គ្រងបរិស្ថានផលិតកម្ម។',
      'អនុវត្តការរៀបចំស្វ័យប្រវត្តិកម្ម CI/CD Pipelines និងការដាក់ពង្រាយប្រព័ន្ធលើម៉ាស៊ីនបម្រើ Cloud។',
      'ទទួលបានវិញ្ញាបនបត្របញ្ជាក់សមត្ថភាពផ្លូវការពី TFDevs (Credential ID: TFD-2026-000054) ផ្ទៀងផ្ទាត់ដោយជោគជ័យ។',
    ],
    technologies: ['Docker', 'Linux', 'CI/CD', 'Cloud Infrastructure', 'DevOps', 'Git'],
    certificate: {
      id: 'cert-tfd-2026-000054',
      title: 'DevOps Essential Certificate',
      issuer: 'Mr. Chau Dara — Founder, TFDevs',
      issueDate: '30 តុលា 2026',
      credentialId: 'TFD-2026-000054',
      category: 'DevOps & Cloud Engineering',
      imageUrl: '/certificates/certificate-TFD-2026-000054.png',
      pdfUrl: '/certificates/certificate-TFD-2026-000054.pdf',
      lecturerUrl: 'https://tfdevs.com/',
      lecturerName: 'TFDevs',
    },
  },
] as const;

export const CONTACT_INFO = {
  eyebrow: 'ទំនាក់ទំនងមកខ្ញុំ',
  headline: 'តើលោកអ្នកមានគម្រោងថ្មីក្នុងចិត្តដែរឬទេ?',
  supportingText: 'ចូរយើងរួមគ្នាកសាងអ្វីមួយដែលមានប្រយោជន៍ ស្រស់ស្អាត និងមានឧត្តមភាពបច្ចេកទេសខ្ពស់។',
  email: 'dyte.vichea.dev@gmail.com',
  location: 'រាជធានីភ្នំពេញ កម្ពុជា',
  socials: [
    { name: 'GitHub', url: 'https://github.com/sereyvichea2828', handle: '@sereyvichea2828' },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/try-sereyvichea-8a890a436/',
      handle: 'Try Sereyvichea',
    },
    {
      name: 'អ៊ីមែល',
      url: 'mailto:dyte.vichea.dev@gmail.com',
      handle: 'dyte.vichea.dev@gmail.com',
    },
  ],
  projectTypes: [
    'កម្មវិធីគេហទំព័រពេញលេញ',
    'កម្មវិធីចំណុចប្រទាក់ខាងមុខ',
    'វិស្វកម្មសេវាកម្ម និងប្រព័ន្ធខាងក្រោយ',
    'បទពិសោធន៍រូបភាពបីវិមាត្រអន្តរកម្ម',
    'ការពិនិត្យគុណភាពកូដ និងប្រឹក្សាស្ថាបត្យកម្ម',
  ],
} as const;
