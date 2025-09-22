import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../store"; // Import the Vuex store

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: { guest: true }, // Mark as a guest-only route
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
    meta: { guest: true }, // Mark as a guest-only route
  },
  {
    path: "/phase/:phaseId/grades",
    name: "Grades",
    component: () => import("../views/GradesView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true }, // This route now requires authentication
  },
  {
    path: "/profile",
    name: "Profile",
    // تأكد من إنشاء هذا الملف لاحقاً
    component: () => import("../views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/phase/:phaseId/grades/:gradeId/terms",
    name: "Terms",
    component: () => import("../views/TermView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/phase/:phaseId/grades/:gradeId/terms/:termId/courses",
    name: "Courses",
    component: () => import("../views/CoursesView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/phase/:phaseId/grades/:gradeId/terms/:termId/courses/:courseId/units",
    name: "Units",
    component: () => import("../views/UnitsView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/phase/:phaseId/grades/:gradeId/terms/:termId/courses/:courseId/units/:unitId/lessons",
    name: "Lessons",
    component: () => import("../views/LessonsView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/phase/:phaseId/grades/:gradeId/terms/:termId/courses/:courseId/units/:unitId/lessons/:lessonId/view",
    name: "LessonDetail",
    component: () => import("../views/LessonDetailView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/phase/:phaseId/grades/:gradeId/terms/:termId/courses/:courseId/units/:unitId/lessons/:lessonId/quiz",
    name: "Quiz",
    component: () => import("../views/QuizView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // Redirect unauthenticated users to the login page
    next({ name: "Login" });
  } else if (
    to.matched.some((record) => record.meta.guest) &&
    isAuthenticated
  ) {
    // Redirect authenticated users away from login/register to the home page
    next({ name: "home" });
  } else {
    // Proceed with navigation
    next();
  }
});

export default router;
