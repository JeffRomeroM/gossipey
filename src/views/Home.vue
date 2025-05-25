<template>
  <div class="home">
    <h1>Busca tu ruta</h1>

    <div class="inputs-in-drive">
      <input
        v-model="origen"
        type="text"
        placeholder="Punto de partida"
        class="input-in-drive"
      />
      <input
        v-model="destino"
        type="text"
        placeholder="Destino"
        class="input-in-drive"
      />
    </div>

    <div class="cards" v-if="rutasFiltradas.length">
      <div
        class="card"
        v-for="ruta in rutasFiltradas"
        :key="ruta.origen + ruta.destino + ruta.horario"
      >
        <div class="card-header">
          <h2>{{ ruta.origen }} → {{ ruta.destino }}</h2>
        </div>
        <div class="card-body">
          <p><strong>Horario:</strong> {{ ruta.horario }}</p>
          <p><strong>Costo:</strong> {{ ruta.costo }}</p>
          <p><strong>Empresa:</strong> {{ ruta.empresa }}</p>
          <p>
            <strong>Contacto: </strong>
            <a :href="'tel:' + ruta.contacto" title="Llamar">
              <font-awesome-icon
                :icon="['fas', 'phone']"
                style="color: green; font-size: 18px; margin-right: 5px;"
              />
            </a>
            <a
              :href="'https://wa.me/' + ruta.contacto"
              target="_blank"
              title="WhatsApp"
            >
              <font-awesome-icon
                :icon="['fab', 'whatsapp']"
                style="color: green; font-size: 20px;"
              />
            </a>
            {{ ruta.contacto }}
          </p>
        </div>
      </div>
    </div>

    <p v-else class="sin-resultados">No se encontraron rutas con esos puntos.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const rutas = ref([]);
const origen = ref("");
const destino = ref("");

const cargarRutas = async () => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwnAyPLgHNJxjBEDjdZCJSC5UUKrj1bsSxx84Odbzco5uMnyGDOp8Ldh2I-bK9birp_/exec"
    );
    const data = await response.json();
    rutas.value = data;
  } catch (error) {
    console.error("Error cargando rutas:", error);
  }
};

// Función para normalizar texto (sin tildes, minúsculas, sin espacios al inicio/final)
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .toLowerCase()
    .trim();
}

const rutasFiltradas = computed(() => {
  const origenNorm = normalizar(origen.value);
  const destinoNorm = normalizar(destino.value);

  if (!origenNorm || !destinoNorm) return [];

  return rutas.value.filter((ruta) => {
    const rutaOrigen = normalizar(ruta.origen);
    const rutaDestino = normalizar(ruta.destino);

    return rutaOrigen.includes(origenNorm) && rutaDestino.includes(destinoNorm);
  });
});

onMounted(() => {
  cargarRutas();
});
</script>

<style scoped>
.home {
  width: 100%;
  margin: 30px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.inputs-in-drive {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 300px;
  margin: 0 auto 20px;
}

.input-in-drive {
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
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

.card:hover {
  transform: translateY(-5px);
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #007bff;
  margin-bottom: 10px;
  text-align: center;
}

.card-body p {
  margin: 5px 0;
  font-size: 14px;
}

.sin-resultados {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-top: 40px;
}
</style>
