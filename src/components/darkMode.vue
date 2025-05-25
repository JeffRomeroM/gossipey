<!-- src/components/DarkModeToggle.vue -->
<template>
  <button @click="toggleDark" class="toggle-button">
    {{ isDark ? '🌙 Oscuro' : '☀️ Claro' }}
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const toggleDark = () => {
  isDark.value = !isDark.value;
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});
</script>

<style scoped>
.toggle-button {
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  background-color: #eee;
  color: #111;
  cursor: pointer;
  margin: 1rem;
}

.dark .toggle-button {
  background-color: #333;
  color: #fff;
}
</style>
