import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { nextTick } from 'vue';
import HomeView from '../views/HomeView.vue';

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
  { path: '/', name: 'home', sectionId: 'home', title: 'Try Sereyvichea — Full-Stack Developer' },
  { path: '/about', name: 'about', sectionId: 'about', title: 'About — Try Sereyvichea' },
  {
    path: '/services',
    name: 'services',
    sectionId: 'services',
    title: 'Services — Try Sereyvichea',
  },
  { path: '/skills', name: 'skills', sectionId: 'skills', title: 'Tech Stack — Try Sereyvichea' },
  {
    path: '/projects',
    name: 'projects',
    sectionId: 'projects',
    title: 'Selected Projects — Try Sereyvichea',
  },
  {
    path: '/process',
    name: 'process',
    sectionId: 'process',
    title: 'Development Process — Try Sereyvichea',
  },
  { path: '/contact', name: 'contact', sectionId: 'contact', title: 'Contact — Try Sereyvichea' },
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
      title: 'Curriculum Vitae / Resume — Try Sereyvichea',
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
    // Preserve the previous scroll position on browser Back/Forward.
    if (savedPosition) {
      return savedPosition;
    }

    // Support ordinary anchor links.
    if (to.hash) {
      return {
        el: to.hash,
        top: -88, // Adjust for your fixed navbar height.
        behavior: 'smooth',
      };
    }

    const sectionId = typeof to.meta.sectionId === 'string' ? to.meta.sectionId : null;

    // Home should start at the top.
    if (!sectionId || sectionId === 'home') {
      return { top: 0, left: 0 };
    }

    // Wait for Vue to render the destination section.
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

    // On refresh, jump directly to the requested section.
    // During in-app navigation, scroll smoothly to it.
    return {
      el: target,
      top: -88,
      behavior: _from.name == null ? 'auto' : 'smooth',
    };
  },
});

router.afterEach((to) => {
  if (typeof document !== 'undefined' && to.meta && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  }
});

export default router;
