<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Importa la instancia de axios configurada y los servicios
import api, { authService, contactService } from '@/api/config.js'; 
import EmailSenderModal from '@/components/EmailSenderModal.vue'; // Importa el componente modal

// --- Estado del componente ---
const sidebarOpen = ref(true);
const leads = ref([]); // Lista de leads
const loadingLeads = ref(false); // Estado de carga para la tabla de leads
const searchTerm = ref(''); // Término de búsqueda para filtrar leads
const selectedStatus = ref(''); // Estado seleccionado para filtrar leads
const showAddDialog = ref(false); // Controla la visibilidad del modal para añadir lead

// Estado para controlar el modal de envío de correo
const showEmailSenderModal = ref(false);
const emailToSendTo = ref(''); // Para pre-rellenar el email del destinatario
const nameToSendTo = ref(''); // NUEVO: Para pre-rellenar el nombre del destinatario (lead)


// Estadísticas del dashboard (obtenidas del backend)
const dashboardStats = ref({ total: 0, hoy: 0, semana: 0, mes: 0 });

// Datos del usuario logueado
const userName = ref('Cargando...');
const userInitials = computed(() => {
  if (userName.value) {
    const parts = userName.value.split(' ');
    // Si hay más de una palabra, toma la inicial de la primera y la última
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    // Si es una sola palabra, toma la primera inicial
    return userName.value[0].toUpperCase();
  }
  return ''; // Valor por defecto si no hay nombre de usuario
});

// Nuevo lead (para el formulario del modal de añadir)
const newLead = ref({
  nombre: '',
  email: '',
  mensaje: '',
  estado: 'nuevo', // Estado por defecto al crear un nuevo lead
});

// --- Computadas ---
// Estadísticas de leads filtrados (calculadas en el frontend)
const estadisticas = computed(() => {
  const stats = { nuevo: 0, contactado: 0, descartado: 0 };
  if (Array.isArray(leads.value)) { // Asegurarse de que leads.value sea un array
    leads.value.forEach(lead => {
      // Asegurarse de que el estado exista y sea válido
      if (lead.estado && stats.hasOwnProperty(lead.estado)) {
        stats[lead.estado] = (stats[lead.estado] || 0) + 1;
      } else {
        // Si el estado no es reconocido o no existe, contarlo como 'nuevo' por defecto
        stats.nuevo = (stats.nuevo || 0) + 1;
      }
    });
  }
  return stats;
});

// Leads filtrados por término de búsqueda y estado
const filteredLeads = computed(() => {
  let filtered = leads.value;
  
  if (selectedStatus.value) {
    filtered = filtered.filter(lead => lead.estado === selectedStatus.value);
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      lead => 
        (lead.nombre && lead.nombre.toLowerCase().includes(term)) ||
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        (lead.mensaje && lead.mensaje.toLowerCase().includes(term))
    );
  }
  return filtered;
});

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10); // Número de elementos por página

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage.value));

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredLeads.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxPages = 5; // Número máximo de botones de página visibles
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// --- Métodos ---
const router = useRouter(); // Instancia del router

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Obtener datos del usuario logueado desde localStorage
const fetchUserData = () => {
  try {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      if (authData.user) {
        userName.value = authData.user.nombre || authData.user.username || 'Usuario';
      }
    } else {
      // Si no hay datos de autenticación, redirigir al login
      router.push('/login');
    }
  } catch (e) {
    console.error("Error al obtener datos del usuario:", e);
    // Si hay un error al parsear, limpiar y redirigir
    localStorage.removeItem('authData');
    router.push('/login');
  }
};

// Obtener estadísticas del dashboard desde el backend
const fetchDashboardStats = async () => {
  try {
    const response = await contactService.getStats(); // Llama al servicio de estadísticas
    // Acceder a la propiedad 'data' anidada en la respuesta
    if (response.data && typeof response.data.data === 'object') {
      dashboardStats.value = response.data.data; 
    } else {
      console.warn('La API de estadísticas no devolvió el formato esperado.');
      dashboardStats.value = { total: 0, hoy: 0, semana: 0, mes: 0 };
    }
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    // Manejo de errores (el interceptor de Axios ya maneja el 401)
  }
};

// Obtener todos los leads desde el backend
const fetchLeads = async () => {
  loadingLeads.value = true;
  try {
    const response = await contactService.getAll(); // Llama al servicio para obtener todos los leads
    
    // Acceder a la propiedad 'data' anidada en la respuesta
    if (response.data && Array.isArray(response.data.data)) {
      leads.value = response.data.data.map(lead => ({
        _id: lead.Id, // Mapear Id a _id
        nombre: lead.NombreCompleto, // Mapear NombreCompleto a nombre
        email: lead.Correo, // Mapear Correo a email
        mensaje: lead.Mensaje, // Mapear Mensaje a mensaje
        fecha: lead.FechaRegistro, // Mapear FechaRegistro a fecha
        estado: 'nuevo' // Asignar estado por defecto, ya que no viene del backend
      }));
    } else {
      console.warn('La API de leads no devolvió un array en la propiedad "data", se inicializa como vacío.');
      leads.value = [];
    }
    console.log('Leads cargados:', leads.value);
  } catch (error) {
    console.error('Error al obtener leads:', error);
    leads.value = []; // En caso de error, asegurar que leads sea un array vacío
  } finally {
    loadingLeads.value = false;
  }
};

// Añadir un nuevo lead (se conecta al endpoint público /api/contacto)
const addLead = async () => {
  if (!newLead.value.nombre || !newLead.value.email || !newLead.value.mensaje) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  try {
    const response = await contactService.create({ // Llama al servicio para crear un lead
      NombreCompleto: newLead.value.nombre, // Mapear a NombreCompleto para el backend
      Correo: newLead.value.email, // Mapear a Correo para el backend
      Mensaje: newLead.value.mensaje, // Mapear a Mensaje para el backend
      // No enviar estado ni fecha al backend si tu endpoint público no los espera
    });
    
    // Asumiendo que el backend devuelve el lead creado con su Id y FechaRegistro
    if (response.data && response.data.success && response.data.data) {
      const addedLeadRaw = response.data.data;
      const addedLead = {
        _id: addedLeadRaw.Id,
        nombre: addedLeadRaw.NombreCompleto,
        email: addedLeadRaw.Correo,
        mensaje: addedLeadRaw.Mensaje,
        fecha: addedLeadRaw.FechaRegistro,
        estado: 'nuevo' // Siempre 'nuevo' al añadir desde el frontend
      };
      leads.value.unshift(addedLead); // Añadir al principio de la lista reactiva
    } else {
      console.warn('La API de añadir lead no devolvió el formato esperado.');
      // Opcional: Recargar todos los leads si la respuesta no es clara
      fetchLeads(); 
    }
    
    showAddDialog.value = false; // Cerrar el modal
    // Limpiar el formulario
    newLead.value = { nombre: '', email: '', mensaje: '', estado: 'nuevo' }; 
    console.log('Lead añadido exitosamente.');
    alert('Lead añadido exitosamente.');
    fetchDashboardStats(); // Actualizar estadísticas después de añadir un lead
  } catch (error) {
    console.error('Error al añadir lead:', error);
    alert('Error al añadir el lead. Por favor, intente de nuevo.');
  }
};

// Función para actualizar el estado del lead (solo visualmente en el frontend)
const actualizarEstado = (lead) => {
  console.log('Actualizando estado (solo frontend):', lead);
  alert(`Estado de lead "${lead.nombre}" actualizado a "${lead.estado}" (solo visual).`);
};

// Función de edición (no implementada en el backend)
const editLead = (lead) => {
  console.log('Función de editar lead (no implementada en backend):', lead);
  alert('Funcionalidad de edición no implementada aún en el backend.');
};

// Función de eliminación (no implementada en el backend)
const deleteLead = () => {
  console.log('Función de eliminar lead (no implementada en backend).');
  alert('Funcionalidad de eliminación no implementada aún en el backend.');
};

// Métodos para controlar el modal de envío de correo
const openEmailSenderModal = (email = '') => {
  emailToSendTo.value = email; // Pre-rellena el email si se pasa
  showEmailSenderModal.value = true;
};


const closeEmailSenderModal = () => {
  showEmailSenderModal.value = false;
  emailToSendTo.value = ''; // Limpiar el email pre-rellenado al cerrar
};

const handleEmailSent = () => {
  // Opcional: Puedes recargar los leads o mostrar una notificación global aquí
  console.log('Correo enviado desde el modal!');
};


const getStatusClass = (status) => {
  switch (status) {
    case 'nuevo': return 'bg-green-100 text-green-800';
    case 'contactado': return 'bg-yellow-100 text-yellow-800';
    case 'descartado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Error al formatear fecha:", dateString, e);
    return dateString; 
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const logout = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    authService.logout(); 
  }
};

// --- Ciclo de vida del componente ---
onMounted(() => {
  fetchUserData(); 
  fetchDashboardStats(); 
  fetchLeads(); 
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300"
         :class="{ '-translate-x-full': !sidebarOpen }">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H14V9H21Z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">CRM Leads</h1>
            <p class="text-xs text-gray-500">Panel de Control</p>
          </div>
        </div>
      </div>
      
      <nav class="mt-6">
        <div class="px-4 space-y-2">
          <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Leads</span>
          </a>
          <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>Reportes</span>
          </a>
          <a href="#" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Configuración</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="transition-all duration-300" :class="{ 'ml-64': sidebarOpen, 'ml-0': !sidebarOpen }">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="toggleSidebar"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Dashboard</h2>
              <p class="text-sm text-gray-500">Gestiona tus leads y oportunidades</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ userInitials }}</span>
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
            <button
              @click="logout"
              class="hidden md:flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>Cerrar sesión</span>
            </button>
            <button
              @click="logout"
              class="md:hidden p-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Leads</p>
                <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.total }}</p>
                <p class="text-sm text-green-600">+{{ ((dashboardStats.mes / (dashboardStats.total - dashboardStats.mes)) * 100 || 0).toFixed(0) }}% este mes</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H14V9H21Z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Nuevos (Hoy)</p>
                <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.hoy }}</p>
                <p class="text-sm text-blue-600">Recientes</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Contactados</p>
                <p class="text-2xl font-bold text-gray-900">{{ estadisticas.contactado }}</p>
                <p class="text-sm text-orange-600">En proceso</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Descartados</p>
                <p class="text-2xl font-bold text-gray-900">{{ estadisticas.descartado }}</p>
                <p class="text-sm text-red-600">Cerrados</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Leads Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Gestión de Leads</h3>
              <div class="flex items-center space-x-2">
                <button
                  @click="showAddDialog = true"
                  class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Nuevo Lead</span>
                </button>
                <button
                  @click="fetchLeads"
                  :disabled="loadingLeads"
                  class="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg class="w-4 h-4" :class="{ 'animate-spin': loadingLeads }" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Filtros -->
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-64">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Buscar leads..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="w-48">
                <select
                  v-model="selectedStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Filtrar por estado</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="descartado">Descartado</option>
                </select>
              </div>
            </div>

            <!-- Tabla -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mensaje
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loadingLeads">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                        </svg>
                        Cargando...
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="paginatedLeads.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                      No hay leads disponibles
                    </td>
                  </tr>
                  <tr v-else v-for="lead in paginatedLeads" :key="lead._id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span class="text-gray-700 text-sm font-medium">{{ lead.nombre.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ lead.nombre }}</p>
                          <p class="text-sm text-gray-500">{{ formatDate(lead.fecha) }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <span class="text-gray-900">{{ lead.email }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="max-w-xs">
                        <p class="text-gray-700 truncate" :title="lead.mensaje">
                          {{ lead.mensaje }}
                        </p>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusClass(lead.estado)">
                        {{ lead.estado }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(lead.fecha) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <!-- NUEVO: Botón para enviar correo -->
                      <button
                        @click="openEmailSenderModal(lead.email, lead.nombre)"
                        class="text-blue-600 hover:text-blue-900 mr-3"
                        title="Enviar Correo"
                      >
                        <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </button>
                      <!-- Removed Edit and Delete buttons as per request -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div class="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} a {{ Math.min(currentPage * itemsPerPage, filteredLeads.length) }} de {{ filteredLeads.length }} resultados
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      @click="previousPage"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                    </button>
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="currentPage = page"
                      :class="[
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        page === currentPage 
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar lead -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Lead</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                v-model="newLead.nombre"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="newLead.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <textarea
                v-model="newLead.mensaje"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-2 mt-6">
            <button
              type="button"
              @click="showAddDialog = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              @click="addLead"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- NUEVO: Componente Modal para Enviar Correo -->
    <EmailSenderModal 
      :is-open="showEmailSenderModal"
      :initial-email="emailToSendTo"
      :lead-name="nameToSendTo"
      @close="closeEmailSenderModal"
      @email-sent="handleEmailSent"
    />

  </div>
</template>
