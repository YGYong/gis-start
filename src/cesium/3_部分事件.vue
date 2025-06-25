<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
let viewer = null;

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

  // 飞到中国南京
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(118.7969, 32.0603, 2000), // 南京的经纬度和高度
    duration: 5, // 飞行持续时间
    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
    orientation: {
      heading: Cesium.Math.toRadians(0), // 方向
      pitch: Cesium.Math.toRadians(-30), // 俯仰角
      roll: 0, // 翻滚角
    },
  });

  // 2、--------------相机事件（更改默认操作）----------
  const controller = viewer.scene.screenSpaceCameraController;

  // 示例：将右键拖拽改为旋转（默认是缩放）
  // controller.rotateEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];

  // 示例：仅用滚轮控制缩放
  // controller.zoomEventTypes = [Cesium.CameraEventType.WHEEL];

  // 监听场景更新之前的事件
  // viewer.scene.preUpdate.addEventListener(() => {
  //   console.log("场景更新之前");
  // });
  // // 监听场景更新之后的事件
  // viewer.scene.postUpdate.addEventListener(() => {
  //   console.log("场景更新之后");
  // });
  // // 监听场景渲染之前的事件
  // viewer.scene.preRender.addEventListener(() => {
  //   console.log("场景渲染之前");
  // });
  // // 监听场景渲染之后的事件
  // viewer.scene.postRender.addEventListener(() => {
  //   console.log("场景渲染之后");
  // });
  // 禁用所有默认交互
  controller.enableRotate = false;
  controller.enableZoom = false;
  controller.enableTilt = false;

  // -------------------------------

  // ================================================
  // 以下为天地图及天地图标注加载
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

  // 添加地理标注
  const labelProvider = new Cesium.WebMapTileServiceImageryProvider({
    url:
      "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&tileMatrix={TileMatrix}&tileRow={TileRow}&tileCol={TileCol}&style=default&format=tiles&tk=" +
      "05be06461004055923091de7f3e51aa6",
    layer: "img",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 子域名轮询
    maximumLevel: 18,
    credit: new Cesium.Credit("天地图影像"),
  });
  // 添加到viewer实例的影像图层集合中
  viewer.imageryLayers.addImageryProvider(labelProvider);
  // 将天地图影像添加到viewer实例的影像图层集合中
  const layer = viewer.imageryLayers.addImageryProvider(tiandituProvider);
  layer.alpha = 0.6; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 开启帧率
  viewer.scene.debugShowFramesPerSecond = true;
  // 深度监测
  // viewer.scene.globe.depthTestAgainstTerrain = true;
});
</script>
