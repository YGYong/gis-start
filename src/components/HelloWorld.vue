<template>
  <div ref="cesiumContainer" style="width: 100%; height: 80vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const cesiumContainer = ref(null);
let viewer = null;

onMounted(async () => {
  
});
</script>
