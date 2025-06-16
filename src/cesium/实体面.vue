<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
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

  // 带孔洞多边形
  const positions = Cesium.Cartesian3.fromDegreesArray([
    116.39, 39.9, 116.41, 39.9, 116.41, 39.92, 116.39, 39.92,
  ]);

  const hole = Cesium.Cartesian3.fromDegreesArray([
    116.397, 39.907, 116.403, 39.907, 116.403, 39.913, 116.397, 39.913,
  ]);

  const polygon = viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(positions, [
        new Cesium.PolygonHierarchy(hole),
      ]),
      material: Cesium.Color.RED.withAlpha(0.5), // 半透明红色
      outline: true,
      outlineWidth: 20,
      outlineColor: Cesium.Color.WHITE,
      height: 100,
      extrudedHeight: 300, // 创建3D柱体
    },
  });

  // 定位到实体
  viewer.zoomTo(polygon);

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
});
</script>
