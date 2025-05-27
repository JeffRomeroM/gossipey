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
          <h2>
            {{ ruta.origen }} → {{ ruta.destino }}
             <span>Transporte {{ ruta.empresa }}</span>
          </h2>
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
              <img src="../iconos/llamada.png" alt="Llamar" width="20px" />
            </a>
            <a
              :href="'https://wa.me/' + ruta.contacto"
              target="_blank"
              title="WhatsApp"
              class="contact"
            >
              <img src="../iconos/whatsapp.png" alt="WhatsApp" width="20px" />
            </a>
            {{ ruta.contacto }}
          </p>
          <button @click="ruta.mostrarMapa = !ruta.mostrarMapa" class="btn-detalles">
            {{ ruta.mostrarMapa ? 'Ocultar mapa' : 'Ver mapa' }}
          </button>
        </div>
        <div class="card-mapa" v-if="ruta.mostrarMapa">
          <iframe
            v-if="ruta.mapa && ruta.mapa.startsWith('http')"
            :src="ruta.mapa"
            frameborder="0"
            allowfullscreen
            class="mapa"
          ></iframe>
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

// Cargar las rutas desde el API
const cargarRutas = async () => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxJBLfR3N7IoOf0BaQMIy4gw6I22dARPqG3cvvLc8H-y7apixOvC2pd9ElKm4ubiCqr/exec"
    );
    const data = await response.json();
    rutas.value = data.map((ruta) => ({
      ...ruta,
      mostrarMapa: false,
    }));
  } catch (error) {
    console.error("Error cargando rutas:", error);
  }
};

// Normalizar texto para comparar sin tildes, mayúsculas, ni espacios
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Computed con lógica de búsqueda flexible e inversa
const rutasFiltradas = computed(() => {
  const origenNorm = normalizar(origen.value);
  const destinoNorm = normalizar(destino.value);

  return rutas.value.filter((ruta) => {
    const rutaOrigen = normalizar(ruta.origen);
    const rutaDestino = normalizar(ruta.destino);

    // Ambas vacías, no mostrar nada
    if (!origenNorm && !destinoNorm) return false;

    // Solo origen o solo destino
    if (origenNorm && !destinoNorm) {
      return rutaOrigen.includes(origenNorm) || rutaDestino.includes(origenNorm);
    }
    if (!origenNorm && destinoNorm) {
      return rutaOrigen.includes(destinoNorm) || rutaDestino.includes(destinoNorm);
    }

    // Ambos ingresados, permite coincidencias directas e inversas
    const matchDirecto =
      rutaOrigen.includes(origenNorm) && rutaDestino.includes(destinoNorm);
    const matchInverso =
      rutaOrigen.includes(destinoNorm) && rutaDestino.includes(origenNorm);

    return matchDirecto || matchInverso;
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
  color: #d19a02;
  margin-bottom: 10px;
  text-align: center;
}

.card-body p {
  margin: 7px 0;
  font-size: 14px;
}

.sin-resultados {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-top: 40px;
}

.mapa {
  width: 100%;
  height: 250px;
  border: none;
  margin-top: 10px;
  border-radius: 8px;
}

.contact {
  margin-right: 10px;
  display: inline-block;
}
</style>
