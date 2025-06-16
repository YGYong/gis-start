<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";

// import cesium_air from "./models/Cesium_Air.glb";
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
    infoBox: false,
    // 开启地形
    // terrainProvider: await Cesium.createWorldTerrainAsync({
    //   requestVertexNormals: true, // 真实光照效果
    //   requestWaterMask: true, // 真实水面流动效果
    // })
  });

  // 添加实体
  const modelEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.397, 39.907, 100),
    model: {
      // uri: '/Cesium_Air.glb',
      uri: new URL("./models/Cesium_Air.glb", import.meta.url).href,
      scale: 10,
      minimumPixelSize: 128, // 最小像素尺寸
      maximumScale: 20000, // 最大缩放比例
    },
  });
  // 添加模型动画
  // const model = modelEntity.model;
  // if (model) {
  //   // model.readyPromise.then((model) => {
  //     modelEntity.activeAnimations.add({
  //       name: "takeoff",
  //       stopTime: 1.0,
  //       loop: Cesium.ModelAnimationLoop.REPEAT,
  //     });
  //   // });
  // }

  // 模型裁剪
  const clippingPlane = new Cesium.ClippingPlane(
    new Cesium.Cartesian3(0, 1, 0), // 法线向量
    5.0 // 距离
  );

  modelEntity.model.clippingPlanes = new Cesium.ClippingPlaneCollection({
    planes: [clippingPlane],
    edgeWidth: 1.0,
    edgeColor: Cesium.Color.RED,
  });

  // 静态位置
  // modelEntity.position = Cesium.Cartesian3.fromDegrees(116.397, 39.907, 100);

  // 动态位置
  // let t = 0.000001;
  // modelEntity.position = new Cesium.CallbackProperty(() => {
  //   t += 0.000001;
  //   return Cesium.Cartesian3.fromDegrees(116.397 + t, 39.907, 100);
  // }, false);

  // // 相机跟随实体
  viewer.trackedEntity = modelEntity;
  // viewer.flyTo(modelEntity);

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
  viewer.imageryLayers.addImageryProvider(tiandituProvider);
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
