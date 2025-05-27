<template>
  <div :class="['contenedor', modoOscuro ? 'oscuro' : '']">
    <h1>Rutas de Buses</h1>

    <div class="controles">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar bus..."
        class="buscador"
      />

      <select v-model="filtroCiudad" class="filtro">
        <option value="">Todas las ciudades</option>
        <option v-for="ciudad in ciudadesDisponibles" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
      </select>

      <select v-model="filtroEmpresa" class="filtro">
        <option value="">Todas las empresas</option>
        <option v-for="empresa in empresasDisponibles" :key="empresa" :value="empresa">{{ empresa }}</option>
      </select>

      
    </div>

    <div class="cards">
      <div
        class="card"
        v-for="ruta in rutasFiltradas"
        :key="ruta.origen + ruta.destino + ruta.horario"
      >
        <div class="card-header">
          <h2>{{ ruta.origen }} → {{ ruta.destino }} <span>Transporte {{ ruta.empresa }}</span></h2>
        </div>
        <div class="card-body">
          <p><strong>Horario:</strong> {{ ruta.horario }}</p>
          <p><strong>Costo:</strong> C$ {{ ruta.costo }}</p>
          <p><strong>Empresa:</strong> {{ ruta.empresa }}</p>
          <p><strong>Duración:</strong> {{ ruta.duracion }}</p>
          <p><strong>Frecuencia:</strong> {{ ruta.frecuencia }}</p>
          <p><strong>Opciones de pago:</strong> {{ ruta.pago }}</p>
          <p><strong>Paradas:</strong> {{ ruta.paradas }}</p>
          <p><strong>Tipo de Unidad:</strong> {{ ruta.tipoUnidad }}</p>
          <p><strong>Recomendaciones:</strong> {{ ruta.recomendaciones }}</p>
          <p>
            <strong>Contacto: </strong>
            <a :href="'tel:' + ruta.contacto" title="Llamar" class="contact">
              <img src="../iconos/llamada.png" alt="" width="20px">

            </a>
            <a :href="'https://wa.me/' + ruta.contacto" target="_blank" title="WhatsApp" class="contact">
              <img src="../iconos/whatsapp.png" alt="" width="20px">

            </a>
            {{ ruta.contacto }}
          </p>
          <button @click="ruta.mostrarMapa = !ruta.mostrarMapa" class="btn-detalles">
            {{ ruta.mostrarMapa ? 'Ocultar mapa' : 'Ver mapa' }}
          </button>
        </div>
        <div class="card-mapa" v-if="ruta.mostrarMapa">
          <iframe
            v-if="ruta.mapa"
            :src="ruta.mapa"
            frameborder="0"
            allowfullscreen
            class="mapa"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const rutas = ref([])
const busqueda = ref('')
const filtroCiudad = ref('')
const filtroEmpresa = ref('')
const modoOscuro = ref(false)

const cargarRutas = async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxJBLfR3N7IoOf0BaQMIy4gw6I22dARPqG3cvvLc8H-y7apixOvC2pd9ElKm4ubiCqr/exec')
    const data = await response.json()
    rutas.value = data.map(r => ({ ...r, mostrarMapa: false }))
  } catch (error) {
    console.error("Error cargando rutas:", error)
  }
}

const ciudadesDisponibles = computed(() => {
  const ciudades = rutas.value.map(r => r.origen)
  return [...new Set(ciudades)].sort()
})

const empresasDisponibles = computed(() => {
  const empresas = rutas.value.map(r => r.empresa)
  return [...new Set(empresas)].sort()
})

const rutasFiltradas = computed(() => {
  return rutas.value.filter(ruta => {
    const texto = busqueda.value.toLowerCase()
    const coincideTexto =
      ruta.origen.toLowerCase().includes(texto) ||
      ruta.destino.toLowerCase().includes(texto) ||
      ruta.empresa.toLowerCase().includes(texto)

    const coincideCiudad = filtroCiudad.value ? ruta.origen === filtroCiudad.value : true
    const coincideEmpresa = filtroEmpresa.value ? ruta.empresa === filtroEmpresa.value : true

    return coincideTexto && coincideCiudad && coincideEmpresa
  })
})

onMounted(() => {
  cargarRutas()
})
</script>

<style scoped>
.contenedor {
  width: 100%;
  margin: 30px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

.oscuro {
  background-color: #121212;
  color: #fff;
}
.contact{
  margin-left: 10px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.controles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.buscador,
.filtro {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.modo-btn {
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.oscuro .card {
  background-color: #1e1e1e;
  border-color: #444;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #d19a02;
  margin-bottom: 10px;
  text-align: center;
}

.card-body p {
  margin: 7px 0;
  font-size: 14px;
}

.card-mapa {
  margin-top: 10px;
}

.mapa {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 8px;
}

.btn-detalles {
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 14px;
  background-color: #d19a02;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>