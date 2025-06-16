<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import mx from "./skyBox/tycho2t3_80_mx.jpg";
import my from "./skyBox/tycho2t3_80_my.jpg";
import mz from "./skyBox/tycho2t3_80_mz.jpg";
import px from "./skyBox/tycho2t3_80_px.jpg";
import py from "./skyBox/tycho2t3_80_py.jpg";
import pz from "./skyBox/tycho2t3_80_pz.jpg";

const cesiumContainer = ref(null);
let viewer = null;

onMounted(async () => {
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
    terrainProvider: await Cesium.createWorldTerrainAsync({
      requestVertexNormals: true, // 真实光照效果
      requestWaterMask: true, // 真实水面流动效果
    }),
  });

  // 跳转到珠穆朗玛峰
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(86.889, 27.991, 8000),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0.0), //正北
  //     pitch: Cesium.Math.toDegrees(0.0), //平视
  //     roll: 0.0,
  //   },
  // });

  // 更换底图
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
  // viewer.imageryLayers.addImageryProvider(tiandituProvider);

  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: mx,
      negativeX: px,
      positiveY: my,
      negativeY: py,
      positiveZ: mz,
      negativeZ: pz,
    },
  });
});
</script>
