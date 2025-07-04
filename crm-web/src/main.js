import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// primevue
import PrimeVue from 'primevue/config';



// PrimeVue components


const app = createApp(App)

app.use(createPinia())
app.use(router)

// --- PrimeVue Configuración ---
app.use(PrimeVue, {
  theme: {
    options: {
      darkModeSelector: '.app-dark'
    }
  },
  locale: {
    startsWith: 'Empieza con',
    contains: 'Contiene',
    notContains: 'No contiene',
    endsWith: 'Termina con',
    equals: 'Igual a',
    notEquals: 'Diferente de',
    noFilter: 'Sin Filtro',

  }
});

// --- PrimeVue Components Globally ---


//Nuevos componentes del mapa


app.mount('#app')

