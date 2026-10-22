import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
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
  scrollBehavior() {
    // Custom smooth programmatic scroll handler controls viewport positioning
    return false;
  },
});

router.afterEach((to) => {
  if (typeof document !== 'undefined' && to.meta && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  }
});

export default router;
