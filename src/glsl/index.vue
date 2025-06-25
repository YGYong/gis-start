<template>
  <div>
    <canvas ref="canvas" width="800" height="600"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const canvas = ref(null);
// 读取 GLSL 文件
const glslCode = ref("");
onMounted(async () => {
  const glsl = fetch("./code.glsl")
    .then((response) => response.text())
    .then((data) => {
      glslCode.value = data;
        // 创建一个 canvas 元素
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        const gl = canvas.getContext("webgl");
        if (!gl) {
          console.error("WebGL not supported");
          return;
        }
        // 创建着色器
        const vertexShaderSource = `
          attribute vec4 a_position;
          void main() {
            gl_Position = a_position;
          }
        `;
        const fragmentShaderSource = `
          precision mediump float;
          uniform vec4 u_color;
          void main() {
            gl_FragColor = u_color;
          }
        `;
      console.log("GLSL Code:", glslCode.value);
    })
    .catch((error) => {
      console.error("Error fetching GLSL file:", error);
    });
});
</script>

<style lang="scss" scoped></style>
