<template>
  <div ref="cesiumContainer" style="width: 100%; height: 80vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
let viewer = null;

onMounted(async () => {
  // 初始化Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {});

  // 定位到中国南京新街口
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(118.7784, 32.0647, 1500),
    duration: 2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  });

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  // 左键拖拽
  handler.setInputAction((drag) => {
    const startPosition = drag.startPosition;
    const endPosition = drag.endPosition;

    // 计算拖拽距离
    const dx = endPosition.x - startPosition.x;
    const dy = endPosition.y - startPosition.y;

    // 旋转相机
    viewer.scene.camera.rotateLeft(dx * 0.01);
    viewer.scene.camera.rotateUp(-dy * 0.01);
    console.log(dx, dy);
  }, Cesium.ScreenSpaceEventType.LEFT_DRAG);
});
</script>
