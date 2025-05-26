<template>
  <div class="contenedor">
    <h1>Rutas de Taxis</h1>

    <input
      v-model="busqueda"
      type="text"
      placeholder="Buscar por nombre o color de taxi..."
      class="buscador"
    />

    <div class="cards">
      <div class="card" v-for="taxi in taxisFiltrados" :key="taxi.nombre + taxi.descripcion">
        <h2>{{ taxi.nombre }} </h2>
        <p><strong>Horario:</strong> {{ taxi.horario }}</p>
        <p><strong>Descripción:</strong> {{ taxi.descripcion }}</p>
        <p>
            <strong>Contacto: </strong>
            <a :href="'tel:' + taxi.contacto" title="Llamar">
              <font-awesome-icon :icon="['fas', 'phone']" style="color: green; font-size: 18px; margin-right: 5px;" />

            </a>
            <a :href="'https://wa.me/' + taxi.contacto" target="_blank" title="WhatsApp">
              <font-awesome-icon :icon="['fab', 'whatsapp']" style="color: green; font-size: 20px;" />

            </a>
            {{ taxi.contacto }}
          </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const taxis = ref([])
const busqueda = ref('')

const cargarTaxis = async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwCLg7TmmioWYO7qAU7bDk4YTG9FQuaKll-RQvjKVy9UrbtDrDSY1AvM1qUtPU7cPzw/exec')
    const data = await response.json()
    taxis.value = data
  } catch (error) {
    console.error("Error cargando taxis:", error)
  }
}

const taxisFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return taxis.value.filter(taxi => {
    const nombre = taxi.nombre ? taxi.nombre.toLowerCase() : ''
    const descripcion = taxi.descripcion ? taxi.descripcion.toLowerCase() : ''
    return nombre.includes(texto) || descripcion.includes(texto)
  })
})

onMounted(() => {
  cargarTaxis()
})
</script>

<style scoped>
.contenedor {
  width: 100%;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.buscador {
  width: 80%;
  padding: 10px;
  margin: 20px auto;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  transition: transform 0.2s;
  max-height: 150px;
  overflow-y: auto;
}

.card:hover {
  transform: translateY(-5px);
}

.card h2 {
  margin-top: 0;
  color: #007BFF;
  font-size: 20px;
  margin-bottom: 10px;
}

.card p {
  margin: 5px 0;
}
</style>
