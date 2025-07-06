import DashboardPage from '@/views/DashboardPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login' // Redirige la ruta raíz a la página de login
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    // Ruta catch-all para cualquier URL no definida, redirige a login
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- Protege rutas que requieren login ---
router.beforeEach((to, from, next) => {
  // 1. Intenta obtener los datos de autenticación desde localStorage
  const authDataString = localStorage.getItem('authData');
  
  let token = null;
  let expiresAt = null;

  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString);
      token = authData.token;
      expiresAt = authData.expiresAt;
    } catch (e) {
      console.error("Error al parsear authData desde localStorage:", e);
      // Si los datos están corruptos, los removemos
      localStorage.removeItem('authData');
    }
  }

  // 2. Comprueba si la ruta de destino requiere autenticación
  if (to.meta.requiresAuth) {
    // Si la ruta requiere autenticación...
    if (!token) {
      // No hay token, significa que el usuario no ha iniciado sesión, redirigir a login
      console.log('Ruta protegida: No se encontró token. Redirigiendo a /login.');
      next('/login');
    } else if (expiresAt && Date.now() > expiresAt) {
      // El token existe pero ha expirado, limpiar y redirigir a login
      console.log('Ruta protegida: Token expirado. Limpiando y redirigiendo a /login.');
      localStorage.removeItem('authData'); // Limpia el token expirado
      next('/login');
    } else {
      // El token existe y es válido, permitir el acceso a la ruta protegida
      console.log('Ruta protegida: Token válido. Permitiendo acceso.');
      next();
    }
  } else {
    // La ruta no requiere autenticación (ej. /login), permitir el acceso
    console.log('Ruta no protegida. Permitiendo acceso.');
    next();
  }
})

export default router