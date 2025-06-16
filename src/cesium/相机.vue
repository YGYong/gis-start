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
    // terrainProvider: await Cesium.createWorldTerrainAsync({
    //   requestVertexNormals: true, // 真实光照效果
    //   requestWaterMask: true, // 真实水面流动效果
    // }),
  });
  const circle = viewer.entities.add({
    id: "circle",
    name: "circle",
    description: "This is circle",
    position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.WHITE,
    },
  });
  // viewer.flyTo(circle);
  // 跳转到珠穆朗玛峰
  // viewer.camera.flyTo({
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(116.404, 39.915, 1000), // 目标位置
  //   orientation: {
  //     direction: new Cesium.Cartesian3(0, 0, -1), // 自定义视线方向向量
  //     up: new Cesium.Cartesian3(0, 1, 0), // 定义相机的“上”方向
  //   },
  //   complete: function () {
  //     // 飞行完成后执行的回调函数
  //     console.log("Fly to complete");
  //   },
  // });

  viewer.camera.lookAt(
    Cesium.Cartesian3.fromDegrees(116.404, 39.915, 1000), // 目标位置
    new Cesium.Cartesian3(0, 0, 1000) // 偏移量
  );

  document.addEventListener("keydown", function (event) {
    const camera = viewer.camera;
    const distance = 100; // 每次移动的距离
    switch (event.key) {
      case "ArrowUp": // 上按键
        camera.moveForward(distance); // 向前移动
        break;
      case "ArrowDown": // 下按键
        camera.moveBackward(distance); // 向后移动
        break;
      case "ArrowLeft": // 左按键
        camera.moveLeft(distance); // 向左移动
        break;
      case "ArrowRight": // 右按键
        camera.moveRight(distance); // 向右移动
        break;

      case "w": // w按键
        camera.lookUp(distance); // 向上旋转
        break;
      case "s": // s按键
        camera.lookDown(distance); // 向下旋转
        break;
      case "a": // a按键
        camera.lookLeft(distance); // 向左旋转
        break;
      case "d": // d按键
        camera.lookRight(distance); // 向右旋转
        break;
      case "q": // q按键
        camera.twistLeft(distance); // 向左倾斜
        break;
      case "e": // e按键
        camera.twistRight(distance); // 向右倾斜
        break;
      default:
        break;
    }
  });

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
