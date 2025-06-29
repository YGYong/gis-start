<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
  <!-- 添加气泡窗口 -->
  <div
    ref="popup"
    style="
      position: absolute;
      padding: 10px;
      border: 1px solid aqua;
      border-radius: 5px;
    "
  >
    气泡窗口
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
let viewer = null;
const popup = ref(null); // 用于存储气泡窗口元素

onMounted(async () => {
  // 设置访问令牌
  // Cesium.Ion.defaultAccessToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTEwODgwMS1iYTY0LTRhNmYtYWFhMS03MDEzMjlhYWNjOTciLCJpZCI6MzAwMTM5LCJpYXQiOjE3NDY1ODI5MTR9.P4bdCMYyoubNMaQ_-ZkU99mM8Da3o8HIo4A57stHRAg";

  // 初始化Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    geocoder: false, // 关闭地理编码搜索
    homeButton: false, // 关闭主页按钮
    sceneModePicker: false, // 关闭场景模式选择器
    baseLayerPicker: false, // 关闭底图选择器
    navigationHelpButton: false, // 关闭导航帮助
    animation: false, // 关闭动画控件
    timeline: false, // 关闭时间轴
    fullscreenButton: false, // 关闭全屏按钮
    // selectionIndicator: false,
    // infoBox: false,
    // 开启地形
    // terrainProvider: await Cesium.createWorldTerrainAsync({
    //   requestVertexNormals: true, // 真实光照效果
    //   requestWaterMask: true, // 真实水面流动效果
    // }),
  });

  // -------------------------------
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(121.4737, 31.2304, 5000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });
  viewer.scene.preRender.addEventListener(function () {
    const htmlPop = viewer.scene.cartesianToCanvasCoordinates(
      Cesium.Cartesian3.fromDegrees(121.4737, 31.2304, 0),
      new Cesium.Cartesian2()
    );
    popup.value.style.left = htmlPop.x + "px";
    popup.value.style.top = htmlPop.y + "px";
  });
  // -------------------------------

  const tiandituProvider = new Cesium.WebMapTileServiceImageryProvider({
    url:
      "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
      "05be06461004055923091de7f3e51aa6",
    layer: "img",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w", // 天地图使用 Web 墨卡托投影（EPSG:3857），需确保 tileMatrixSetID: "w"
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 子域名
    maximumLevel: 18,
    credit: new Cesium.Credit("天地图影像"),
  });
  // 将天地图影像添加到viewer实例的影像图层集合中
  const layer = viewer.imageryLayers.addImageryProvider(tiandituProvider);
  layer.alpha = 0.9; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
