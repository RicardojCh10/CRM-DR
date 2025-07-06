<template>
  <!-- Overlay y Contenedor del Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Enviar Correo</h2>
      <form @submit.prevent="sendEmail" class="space-y-4">
        <div>
          <label for="to" class="block text-gray-700 text-sm font-bold mb-1">Para (Email del Lead):</label>
          <input
            type="email"
            id="to"
            v-model="form.to"
            placeholder="destinatario@ejemplo.com"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            readonly 
          />
        </div>
        <div>
          <label for="subject" class="block text-gray-700 text-sm font-bold mb-1">Asunto:</label>
          <input
            type="text"
            id="subject"
            v-model="form.subject"
            placeholder="Asunto del correo"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label for="message" class="block text-gray-700 text-sm font-bold mb-1">Mensaje (para el lead):</label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Escribe tu mensaje aquí..."
            rows="6"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
            required
          ></textarea>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            :disabled="estado === 'enviando'"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            :disabled="estado === 'enviando'"
          >
            <svg v-if="estado === 'enviando'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ estado === 'enviando' ? 'Enviando...' : 'Enviar Correo' }}</span>
          </button>
        </div>

        <!-- Mensajes de estado -->
        <div v-if="estado === 'exito'" class="mt-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>✅ Correo enviado correctamente.</span>
        </div>
        <div v-if="estado === 'error'" class="mt-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 111 12a9 9 0 0118 0z"></path></svg>
          <span>❌ Hubo un error al enviar el mensaje.</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import emailjs from '@emailjs/browser'; // Importa la librería EmailJS

// Props para controlar la visibilidad del modal y los datos del lead
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialEmail: { // Correo del lead
    type: String,
    default: '',
  },
  leadName: { // Nombre del lead
    type: String,
    default: 'Cliente',
  },
});

// Emits para notificar al componente padre
const emit = defineEmits(['close', 'emailSent']);

// Estado del formulario
const form = ref({
  to: '', // Correo del destinatario (lead)
  subject: '', // Asunto del correo
  message: '', // Mensaje personalizado para el lead
});

// Estado de la operación de envío
const estado = ref('idle'); // 'idle' | 'enviando' | 'exito' | 'error'

// Configuración de EmailJS (¡ADVERTENCIA: ESTAS CLAVES SERÁN PÚBLICAS!)
const SERVICE_ID = 'service_24g1ggj';
const TEMPLATE_ID = 'template_qx5ccpd';
const PUBLIC_KEY = 'ZH2dpAka63cP3412m';

// Observa los props para pre-rellenar los campos del formulario
watch(() => props.initialEmail, (newEmail) => {
  if (newEmail) {
    form.value.to = newEmail;
  }
}, { immediate: true }); // Ejecutar inmediatamente al montar si ya hay un initialEmail

// Método para enviar el correo directamente con EmailJS
const sendEmail = async () => {
  estado.value = 'enviando';
  try {
    const templateParams = {
      name: props.leadName,     // Nombre del lead para la plantilla
      title: form.value.subject, // Asunto del correo para la plantilla
      email: form.value.to,      // Correo del lead para la plantilla (Correo de contacto: {{email}})
      message: form.value.message, // Mensaje personalizado para la plantilla
      // Puedes añadir más variables estáticas o dinámicas si tu plantilla las necesita
      // Por ejemplo, el nombre del remitente si no está hardcodeado en la plantilla:
      // sender_name: 'Chi Ricardo Director General y Aleman Diego Gerente General'
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams, // Envía el objeto de parámetros de la plantilla
      PUBLIC_KEY
    );

    console.log('✅ Correo enviado con EmailJS:', response.text);
    estado.value = 'exito';
    // Opcional: Limpiar el formulario después de un envío exitoso
    form.value = { to: '', subject: '', message: '' };
    emit('emailSent'); // Notificar al padre que el correo fue enviado
    
    // Auto-cerrar el modal después de un breve tiempo si es exitoso
    setTimeout(() => {
      closeModal();
    }, 2000);

  } catch (error) {
    console.error('❌ Error al enviar correo con EmailJS:', error);
    estado.value = 'error';
    // Puedes añadir más lógica de error aquí, como mostrar un mensaje más específico
  }
};

// Método para cerrar el modal y resetear el estado
const closeModal = () => {
  estado.value = 'idle'; // Resetear estado al cerrar
  form.value = { to: '', subject: '', message: '' }; // Limpiar formulario
  emit('close'); // Emitir evento para que el padre cierre el modal
};
</script>

<style scoped>
/* No se necesitan estilos específicos adicionales si Tailwind CSS es suficiente */
</style>