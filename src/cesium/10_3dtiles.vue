<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import CesiumNavigation from "cesium-navigation-es6";
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

  // 默认
  // const tileset = await Cesium.createOsmBuildingsAsync();
  // viewer.scene.primitives.add(tileset);
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(116.3911, 39.9067, 500),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // });

  // 设置样式
  // const tileset = await Cesium.createOsmBuildingsAsync({
  //   // 通过样式来设置建筑物的颜色
  //   style: new Cesium.Cesium3DTileStyle({
  //     color: {
  //       conditions: [
  //         ["${feature['building']} === 'hospital'", "color('#0000FF')"],
  //         ["${feature['building']} === 'school'", "color('#00FF00')"],
  //         ["${height} < 50", "color('#FF0000')"],
  //         [true, "color('#ffffff')"],
  //       ],
  //     },
  //   }),
  // });
  // 基本加载
  // const tileset = await Cesium.createOsmBuildingsAsync();
  // viewer.scene.primitives.add(tileset);
  // console.log(tileset,"")
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(116.3911, 39.9067, 500),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // });
  // 调试面板1
  // viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);

  // 创建3D Tileset
  const tileset = await Cesium.Cesium3DTileset.fromUrl(
    new URL("./models/Tileset/tileset.json", import.meta.url).href,
    {
      maximumScreenSpaceError: 16, // 最大屏幕空间误差
      maximumMemoryUsage: 512, // 最大内存使用量
      skipLevelOfDetail: true, // 跳过细节层级
      dynamicScreenSpaceError: true, // 动态屏幕空间误差
      dynamicScreenSpaceErrorDensity: 0.001, // 动态屏幕空间误差密度
    }
  );
  viewer.scene.primitives.add(tileset);
  viewer.zoomTo(tileset); // 缩放到3D Tileset

  viewer.screenSpaceEventHandler.setInputAction((click) => {
    const picked = viewer.scene.pick(click.position);
    if (picked instanceof Cesium.Cesium3DTileFeature) {
      // 当前点击为黄色
      picked.color = Cesium.Color.YELLOW;
      const properties = picked.getPropertyIds();
      // 获取属性并打印
      properties.forEach((name) => {
        console.log(`${name}: ${picked.getProperty(name)}`);
      });
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${Height} >= 80", "color('purple')"],
        ["${Height} >= 50", "color('red')"],
        ["${Height} >= 10", "color('green')"],
        ["true", "color('blue')"],
      ],
    },
  });

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
