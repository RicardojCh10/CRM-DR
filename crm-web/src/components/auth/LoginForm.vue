<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">CRM Leads</h1>
        <p class="text-gray-600">Gestiona tus leads de manera eficiente</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border-0">
        <form @submit.prevent="login" class="space-y-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Iniciar Sesión</h2>
            <p class="text-gray-600 text-sm mt-1">Accede a tu panel de control</p>
          </div>

          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">
              Nombre de Usuario o Correo Electrónico
            </label>
            <div class="relative">
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="admin o tu@email.com"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': usernameError }"
                @blur="validateUsername"
                @input="clearError"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
            <p v-if="usernameError" class="text-red-500 text-sm">{{ usernameError }}</p>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="admin123"
                class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordError }"
                @blur="validatePassword"
                @input="clearError"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="remember" class="ml-2 text-sm text-gray-700">
                Recordar sesión
              </label>
            </div>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-red-700 text-sm">{{ error }}</span>
          </div>

          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
          </button>
        </form>
      </div>

      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 CRM Leads. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// Importa authService directamente desde tu archivo de configuración de API
import { authService } from '@/api/config'; // Ajusta la ruta si es necesario (ej. ../api/config)

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);

const usernameError = ref('');
const passwordError = ref('');

const router = useRouter();

// --- Validaciones de Campos ---
const validateUsername = () => {
  if (!username.value || username.value.trim() === '') {
    usernameError.value = 'El nombre de usuario es obligatorio.';
  } else {
    usernameError.value = '';
  }
};

const validatePassword = () => {
  if (!password.value || password.value.trim() === '') {
    passwordError.value = 'La contraseña es obligatoria.';
  } else {
    passwordError.value = '';
  }
};

const clearError = () => {
  error.value = '';
  usernameError.value = '';
  passwordError.value = '';
};

const isFormValid = computed(() => {
  return username.value && password.value && !usernameError.value && !passwordError.value;
});

// --- Lógica de Inicio de Sesión con authService ---
const login = async () => {
  validateUsername();
  validatePassword();
  
  if (!isFormValid.value) {
    console.log("Formulario no válido. Revise los campos.");
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    console.log("Intentando login con los siguientes datos:");
    console.log("Username:", username.value);
    console.log("Password:", password.value); // Considera no loggear la contraseña en producción
    console.log("Remember Me:", rememberMe.value);
    
    // Usamos authService.login directamente
    const res = await authService.login({ 
      username: username.value, 
      password: password.value,
      rememberMe: rememberMe.value 
    });
    
    // La respuesta exitosa ya viene en `res.data` gracias a Axios
    const data = res.data; 

    // Aquí no necesitamos verificar res.ok porque Axios lanza un error
    // para respuestas que no son 2xx (que será capturado por el catch).
    // Si llegamos aquí, la petición fue exitosa.

    console.log('Login exitoso:', data);
    
    const tokenData = {
      token: data.token,
      expiresAt: rememberMe.value 
        ? Date.now() + (30 * 24 * 60 * 60 * 1000) 
        : Date.now() + (24 * 60 * 60 * 1000),    
      user: data.user
    };
    
    // Importante: Guarda en localStorage si quieres persistencia
    // y si has configurado tu api/config.js para leer de localStorage
    localStorage.setItem('authData', JSON.stringify(tokenData));
    // Si prefieres sessionStorage, usa sessionStorage.setItem(...)
    
    router.push('/dashboard'); 

  } catch (err) {
    // Axios wrap errors in `err.response` for HTTP errors, `err.message` for network errors
    console.error('Error al iniciar sesión:', err);
    if (err.response && err.response.data) {
      error.value = err.response.data.message || err.response.data.error || 'Error en las credenciales.';
    } else {
      error.value = 'Error al conectar con el servidor. Por favor, revisa tu conexión a internet o intenta más tarde.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>