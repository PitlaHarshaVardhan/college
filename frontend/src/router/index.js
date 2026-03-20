import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import EmployeeDashboard from '../views/EmployeeDashboard.vue'
import EmployerDashboard from '../views/EmployerDashboard.vue'
import ApplyLeave from '../views/ApplyLeave.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { 
    path: '/employee-dashboard', 
    component: EmployeeDashboard, 
    meta: { requiresAuth: true, role: 'employee' } 
  },
  { 
    path: '/apply-leave', 
    component: ApplyLeave, 
    meta: { requiresAuth: true, role: 'employee' } 
  },
  { 
    path: '/employer-dashboard', 
    component: EmployerDashboard, 
    meta: { requiresAuth: true, role: 'employer' } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else if (to.meta.guest && user) {
    next(user.role === 'employee' ? '/employee-dashboard' : '/employer-dashboard');
  } else if (to.meta.requiresAuth && to.meta.role && user.role !== to.meta.role) {
    next(user.role === 'employee' ? '/employee-dashboard' : '/employer-dashboard');
  } else {
    next();
  }
});

export default router;
