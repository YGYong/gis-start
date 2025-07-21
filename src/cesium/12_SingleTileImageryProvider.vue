<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
import img from "../assets/earthbump1k.jpg";
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

  // viewer.imageryLayers.remove(viewer.imageryLayers.get(0));

  console.log(img);
  // const imageryProvider = new Cesium.SingleTileImageryProvider({
  //   url: img,
  //   rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
  // });
  // const imageryLayer = new Cesium.ImageryLayer(imageryProvider, {
  //   alpha: 0.9,
  //   hue: 0.3,
  //   saturation: 0.3,
  //   gamma: 0.3,
  // });
  // // 添加单张图片图层
  // viewer.imageryLayers.add(imageryLayer);

  const singleTileLayer = Cesium.ImageryLayer.fromProviderAsync(
    Cesium.SingleTileImageryProvider.fromUrl(img, {
      rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
    })
  );
  // singleTileLayer.alpha = 0.1; // 设置透明度
  viewer.imageryLayers.add(singleTileLayer);

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
  // viewer.imageryLayers.addImageryProvider(labelProvider);
  // 将天地图影像添加到viewer实例的影像图层集合中
  // const layer = viewer.imageryLayers.addImageryProvider(tiandituProvider);
  // layer.alpha = 0.6; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
