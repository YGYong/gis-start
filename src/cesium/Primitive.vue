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
    infoBox: false,
    // 开启地形
    // terrainProvider: await Cesium.createWorldTerrainAsync({
    //   requestVertexNormals: true, // 真实光照效果
    //   requestWaterMask: true, // 真实水面流动效果
    // })
  });

  // 1.
  // 创建矩形几何
  const rectangle = Cesium.Rectangle.fromDegrees(-120.0, 30.0, -100.0, 40.0);
  const geometry = new Cesium.RectangleGeometry({
    rectangle: rectangle,
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
    height: 10000,
  });
  // 2.
  const instance = new Cesium.GeometryInstance({
    geometry: geometry,
    attributes: {
      color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
    },
  });

  // 3.
  const appearance = new Cesium.EllipsoidSurfaceAppearance({
    material: Cesium.Material.fromType("Checkerboard", {
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLUE,
      repeat: new Cesium.Cartesian2(10, 10),
    }),
    aboveGround: true,
  });

  // 4.
  const primitive = new Cesium.Primitive({
    geometryInstances: instance,
    appearance: appearance,
    releaseGeometryInstances: false,
    compressVertices: true, // 顶点压缩优化
  });

  viewer.scene.primitives.add(primitive);
  viewer.camera.flyTo({
    destination: rectangle,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });

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
  // const layer = viewer.imageryLayers.addImageryProvider(tiandituProvider);
  // layer.alpha = 0.9; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
