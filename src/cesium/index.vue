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
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestVertexNormals: true, // 真实光照效果
      requestWaterMask: true, // 真实水面流动效果
    }),
  });

  // -------------------------------
  // 案例1：创建一个虚线和实线重叠的线，大约十个点左右,线条弯曲一些,点位在珠穆朗玛峰
  const positions = [
    Cesium.Cartesian3.fromDegrees(86.95, 27.98), // 珠穆朗玛峰
    Cesium.Cartesian3.fromDegrees(86.96, 27.99),
    Cesium.Cartesian3.fromDegrees(86.97, 27.90),
    Cesium.Cartesian3.fromDegrees(86.98, 27.91),
    Cesium.Cartesian3.fromDegrees(86.99, 27.92),
    Cesium.Cartesian3.fromDegrees(86.90, 27.93),
    Cesium.Cartesian3.fromDegrees(86.91, 27.94),
    Cesium.Cartesian3.fromDegrees(86.92, 27.95),
    Cesium.Cartesian3.fromDegrees(86.93, 27.96),
    Cesium.Cartesian3.fromDegrees(86.94, 27.97),
    Cesium.Cartesian3.fromDegrees(86.95, 27.98),
  ];
  const lineStyle = {
    // clampToGround: true, // 线条贴地
    // arcType: Cesium.ArcType.GEODESIC, // 测地线（沿地球表面）
    arcType: Cesium.ArcType.RHUMB, // 恒向线
    granularity: 1000, // 线条的平滑度
  } 
  // const polyline = viewer.entities.add({
  //   polyline: {
  //     ...lineStyle,
  //     positions: positions,
  //     width: 10,
  //     material: new Cesium.PolylineDashMaterialProperty({
  //       color: Cesium.Color.AQUA,
  //       dashLength: 100,
  //       // dashPattern: parseInt("11110000", 2),
  //     }),
  //   },
  // });
  const solidLine = viewer.entities.add({
    polyline: {
      ...lineStyle,
      positions: positions,
      width: 4,
      material: Cesium.Color.AQUA,
    },
  });
  viewer.zoomTo([ solidLine]); // 缩放到线的位置
  // 设置相机位置
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(116.42, 39.93, 5000), // 设置相机位置
  //   duration: 2, // 飞行时间
  // });

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
  // const layer = viewer.imageryLayers.addImageryProvider(tiandituProvider);
  // layer.alpha = 0.9; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
