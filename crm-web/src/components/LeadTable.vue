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
                <p class="text-2xl font-bold text-gray-900">{{ totalLeads }}</p>
                <p class="text-sm text-green-600">+12% este mes</p>
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
                <p class="text-sm font-medium text-gray-600">Nuevos</p>
                <p class="text-2xl font-bold text-gray-900">{{ estadisticas.nuevo }}</p>
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
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loadingLeads">
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                        </svg>
                        Cargando...
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="paginatedLeads.length === 0">
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
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
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-2">
                        <select
                          v-model="lead.estado"
                          @change="actualizarEstado(lead)"
                          class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="descartado">Descartado</option>
                        </select>
                        <button
                          @click="editLead(lead)"
                          class="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(lead)"
                          class="p-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
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
              @click="showAddDialog = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="addLead"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Confirmar eliminación</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              ¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="flex items-center justify-center space-x-2 mt-4">
            <button
              @click="showConfirmDialog = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="deleteLead(leadToDelete)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado del componente
const sidebarOpen = ref(true)
const leads = ref([])
const loadingLeads = ref(false)
const searchTerm = ref('')
const selectedStatus = ref('')
const showAddDialog = ref(false)
const showConfirmDialog = ref(false)
const leadToDelete = ref(null)
const userName = ref('Usuario Demo')
const userInitials = ref('UD')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Nuevo lead
const newLead = ref({
  nombre: '',
  email: '',
  mensaje: ''
})

// Computadas
const totalLeads = computed(() => leads.value.length)

const estadisticas = computed(() => {
  const stats = { nuevo: 0, contactado: 0, descartado: 0 }
  leads.value.forEach(lead => {
    stats[lead.estado] = (stats[lead.estado] || 0) + 1
  })
  return stats
})

const filteredLeads = computed(() => {
  let filtered = leads.value
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(lead => 
      lead.nombre.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.mensaje.toLowerCase().includes(term)
    )
  }
  
  if (selectedStatus.value) {
    filtered = filtered.filter(lead => lead.estado === selectedStatus.value)
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage.value))

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLeads.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxPages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1)

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Métodos
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const fetchLeads = async () => {
  loadingLeads.value = true
  try {
    // Simulación de datos para demo
    setTimeout(() => {
      leads.value = [
        {
          _id: '1',
          nombre: 'Juan Pérez',
          email: 'juan.perez@email.com',
          mensaje: 'Interesado en los servicios de consultoría para mi empresa',
          estado: 'nuevo',
          fecha: new Date().toISOString()
        },
        {
          _id: '2',
          nombre: 'María González',
          email: 'maria.gonzalez@email.com',
          mensaje: 'Necesito más información sobre los precios y planes disponibles',
          estado: 'contactado',
          fecha: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '3',
          nombre: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          mensaje: 'Quiero agendar una reunión para discutir una propuesta',
          estado: 'nuevo',
          fecha: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '4',
          nombre: 'Ana Martínez',
          email: 'ana.martinez@email.com',
          mensaje: 'No me interesa en este momento',
          estado: 'descartado',
          fecha: new Date(Date.now() - 259200000).toISOString()
        }
      ]
      loadingLeads.value = false
    }, 1000)

    // Código real para API
    /*
    const authData = JSON.parse(sessionStorage.getItem('authData') || '{}')
    const res = await fetch('https://tu-backend.com/crm/leads', {
      headers: {
        Authorization: `Bearer ${authData.token}`
      }
    })
    
    if (res.ok) {
      leads.value = await res.json()
      leads.value.forEach(lead => {
        if (!lead.fecha) {
          lead.fecha = new Date().toISOString()
        }
      })
    }
    */
  } catch (error) {
    console.error('Error fetching leads:', error)
    loadingLeads.value = false
  }
}

const actualizarEstado = async (lead) => {
  try {
    // Simulación para demo
    console.log('Actualizando estado:', lead)
    
    // Código real para API
    /*
    const authData = JSON.parse(sessionStorage.getItem('authData') || '{}')
    await fetch(`https://tu-backend.com/crm/leads/${lead._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`
      },
      body: JSON.stringify({ estado: lead.estado })
    })
    */
  } catch (error) {
    console.error('Error updating lead:', error)
  }
}

const addLead = async () => {
  if (!newLead.value.nombre || !newLead.value.email || !newLead.value.mensaje) {
    alert('Por favor, completa todos los campos')
    return
  }

  try {
    // Simulación para demo
    const newLeadData = {
      _id: Date.now().toString(),
      ...newLead.value,
      estado: 'nuevo',
      fecha: new Date().toISOString()
    }
    
    leads.value.unshift(newLeadData)
    showAddDialog.value = false
    newLead.value = { nombre: '', email: '', mensaje: '' }
    
    // Código real para API
    /*
    const authData = JSON.parse(sessionStorage.getItem('authData') || '{}')
    const res = await fetch('https://tu-backend.com/crm/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`
      },
      body: JSON.stringify({
        ...newLead.value,
        estado: 'nuevo',
        fecha: new Date().toISOString()
      })
    })
    
    if (res.ok) {
      const lead = await res.json()
      leads.value.push(lead)
      showAddDialog.value = false
      newLead.value = { nombre: '', email: '', mensaje: '' }
    }
    */
  } catch (error) {
    console.error('Error adding lead:', error)
  }
}

const editLead = (lead) => {
  // Implementar edición
  console.log('Editar lead:', lead)
}

const confirmDelete = (lead) => {
  leadToDelete.value = lead
  showConfirmDialog.value = true
}

const deleteLead = async (lead) => {
  try {
    // Simulación para demo
    leads.value = leads.value.filter(l => l._id !== lead._id)
    showConfirmDialog.value = false
    leadToDelete.value = null
    
    // Código real para API
    /*
    const authData = JSON.parse(sessionStorage.getItem('authData') || '{}')
    await fetch(`https://tu-backend.com/crm/leads/${lead._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authData.token}`
      }
    })
    
    leads.value = leads.value.filter(l => l._id !== lead._id)
    showConfirmDialog.value = false
    leadToDelete.value = null
    */
  } catch (error) {
    console.error('Error deleting lead:', error)
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'nuevo': 
      return 'bg-green-100 text-green-800'
    case 'contactado': 
      return 'bg-yellow-100 text-yellow-800'
    case 'descartado': 
      return 'bg-red-100 text-red-800'
    default: 
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const logout = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    sessionStorage.removeItem('authData')
    // router.push('/login') // Descomentar si usas Vue Router
    window.location.href = '/login'
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  fetchLeads()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.table-fixed {
  table-layout: fixed;
}

/* Animaciones suaves */
.transition-all {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .min-w-64 {
    min-width: 100%;
  }
  
  .w-48 {
    width: 100%;
  }
}
</style>