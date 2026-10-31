import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { nextTick } from 'vue';
import HomeView from '../views/HomeView.vue';
import { useModalState } from '@/composables/useModalState';

export interface SectionRouteMeta {
  sectionId: string;
  title: string;
}

export const SECTION_ROUTES: Array<{
  path: string;
  name: string;
  sectionId: string;
  title: string;
}> = [
  {
    path: '/',
    name: 'home',
    sectionId: 'home',
    title: 'ទ្រី សេរីវិជ្ជា — អ្នកអភិវឌ្ឍន៍កម្មវិធីពេញលេញ',
  },
  { path: '/about', name: 'about', sectionId: 'about', title: 'អំពីខ្ញុំ — ទ្រី សេរីវិជ្ជា' },
  {
    path: '/services',
    name: 'services',
    sectionId: 'services',
    title: 'សេវាកម្ម — ទ្រី សេរីវិជ្ជា',
  },
  {
    path: '/skills',
    name: 'skills',
    sectionId: 'skills',
    title: 'ជំនាញបច្ចេកវិទ្យា — ទ្រី សេរីវិជ្ជា',
  },
  {
    path: '/projects',
    name: 'projects',
    sectionId: 'projects',
    title: 'គម្រោងស្នាដៃ — ទ្រី សេរីវិជ្ជា',
  },
  {
    path: '/experience',
    name: 'experience',
    sectionId: 'experience',
    title: 'បទពិសោធន៍ — ទ្រី សេរីវិជ្ជា',
  },
  {
    path: '/process',
    name: 'process',
    sectionId: 'process',
    title: 'ដំណើរការការងារ — ទ្រី សេរីវិជ្ជា',
  },
  {
    path: '/contact',
    name: 'contact',
    sectionId: 'contact',
    title: 'ទំនាក់ទំនង — ទ្រី សេរីវិជ្ជា',
  },
];

const routes: Array<RouteRecordRaw> = [
  ...SECTION_ROUTES.map((item) => ({
    path: item.path,
    name: item.name,
    component: HomeView,
    meta: {
      sectionId: item.sectionId,
      title: item.title,
    },
  })),
  {
    path: '/resume',
    name: 'resume',
    component: HomeView,
    meta: {
      sectionId: 'home',
      title: 'ប្រវត្តិរូបសង្ខេប — ទ្រី សេរីវិជ្ជា',
      hideNavbar: true,
      isModalRoute: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: async (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: -88,
        behavior: 'smooth',
      };
    }

    const sectionId = typeof to.meta.sectionId === 'string' ? to.meta.sectionId : null;

    if (!sectionId || sectionId === 'home') {
      return { top: 0, left: 0 };
    }

    await nextTick();

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    const target = document.getElementById(sectionId);

    if (!target) {
      console.warn(`[Router] Section "#${sectionId}" was not found. Check the section ID.`);
      return { top: 0, left: 0 };
    }

    return {
      el: target,
      top: -88,
      behavior: _from.name == null ? 'auto' : 'smooth',
    };
  },
});

router.afterEach((to, from) => {
  if (typeof document !== 'undefined' && to.meta && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  }
  if (from?.meta?.isModalRoute && !to?.meta?.isModalRoute) {
    const { forceReleaseAllLocks } = useModalState();
    forceReleaseAllLocks();
  }
});

export default router;
