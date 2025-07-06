// api/config.js
import axios from 'axios'

// Crear instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    // CAMBIO: Usar localStorage para persistencia de sesión
    const authData = JSON.parse(localStorage.getItem('authData') || '{}')
    if (authData.token) {
      config.headers.Authorization = `Bearer ${authData.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores (ej. token expirado/inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authData')
      // Redirige al usuario a la página de login
      window.location.href = '/login' 
    }
    return Promise.reject(error)
  }
)

export default api

// --- Servicios específicos ---
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => {
    // CAMBIO: Usar localStorage para limpiar la sesión
    localStorage.removeItem('authData')
    window.location.href = '/login'
  },
  checkAuth: () => {
    // CAMBIO: Usar localStorage para revisar la sesión
    const authData = JSON.parse(localStorage.getItem('authData') || '{}')
    return authData.token && authData.expiresAt > Date.now()
  }
}

export const contactService = {
  // Crear contacto público (sin auth - se usa la instancia 'api' base)
  create: (contactData) => api.post('/api/contacto', contactData),
  
  // Obtener todos los contactos (protegido - el interceptor añade el token)
  getAll: () => api.get('/api/dashboard/contactos'),
  
  // Enviar correo (protegido)
  sendEmail: (emailData) => api.post('/api/dashboard/enviar-correo', emailData),
  
  // Obtener estadísticas (protegido)
  getStats: () => api.get('/api/dashboard/stats')
}

export const healthService = {
  check: () => api.get('/api/health')
}