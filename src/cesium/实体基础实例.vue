<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
import gg from "../assets/vue.svg";
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
  // 广告牌
  // const billboard = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075),
  //   billboard: {
  //     image: gg,
  //     scale: 2,
  //     color: Cesium.Color.WHITE,
  //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平对齐方式
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
  //   },
  // });
  // billboard.billboard.pixelOffset = new Cesium.Cartesian2(0, -50); // 向下偏移 50 像素

  // 箱
  // const box = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.4075, 39.9075),
  //   box: {
  //     dimensions: new Cesium.Cartesian3(1000, 1000, 500), // 长、宽、高
  //     material: Cesium.Color.RED.withAlpha(0.5), // 半透明红色
  //     outline: true,
  //     outlineColor: Cesium.Color.WHITE,
  //     outlineWidth: 2,
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 贴地显示
  //   },
  // });

  // 添加一个矩形
  // const rectangle = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
  //   rectangle: {
  //     coordinates: Cesium.Rectangle.fromDegrees(
  //       116.3975,
  //       39.9075,
  //       116.4075,
  //       39.9175
  //     ), // 矩形的坐标
  //     material: Cesium.Color.GREEN.withAlpha(0.5), // 半透明绿色
  //     outline: true,
  //     outlineColor: Cesium.Color.WHITE,
  //     outlineWidth: 2,
  //     height: 100, // 矩形的高度
  //     extrudedHeight: 200, // 矩形的拉伸高度
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 贴地显示
  //   },
  // });

  // 椭球
  // const ellipse = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
  //   ellipse: {
  //     semiMajorAxis: 1000, // 长半轴
  //     semiMinorAxis: 500, // 短半轴
  //     material: Cesium.Color.BLUE.withAlpha(0.5), // 半透明蓝色
  //     outline: true,
  //     outlineColor: Cesium.Color.WHITE,
  //     outlineWidth: 2,
  //     height: 100, // 椭圆的高度
  //     extrudedHeight: 200, // 椭圆的拉伸高度
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 贴地显示
  //   },
  // });

  // 椭球体
  // const ellipsoid = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
  //   ellipsoid: {
  //     radii: new Cesium.Cartesian3(1000, 500, 250), // 长半轴、短半轴、高半轴
  //     material: Cesium.Color.YELLOW.withAlpha(0.5), // 半透明黄色
  //     outline: true,
  //     outlineColor: Cesium.Color.WHITE,
  //     outlineWidth: 2,
  //     extrudedHeight: 200, // 椭圆体的拉伸高度
  //   },
  // });

  // 圆柱体
  // const cylinder = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
  //   cylinder: {
  //     length: 1000, // 圆柱体的长度
  //     topRadius: 500, // 顶部半径
  //     bottomRadius: 500, // 底部半径
  //     material: Cesium.Color.PURPLE.withAlpha(0.5), // 半透明紫色
  //     extrudedHeight: 200, // 圆柱体的拉伸高度
  //   },
  // });

  // label标签
  // const label = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
  //   label: {
  //     text: "Hello World", // 标签文本
  //     font: "30px sans-serif", // 字体
  //     style: Cesium.LabelStyle.FILL, // 样式
  //     fillColor: Cesium.Color.WHITE, // 填充颜色
  //     outlineColor: Cesium.Color.BLACK, // 轮廓颜色
  //     outlineWidth: 2, // 轮廓宽度
  //     scale: 1.0, // 缩放比例
  //     showBackground: true, // 显示背景
  //     backgroundColor: Cesium.Color.TRANSPARENT, // 背景颜色
  //     backgroundPadding: new Cesium.Cartesian2(7, 5), // 背景填充
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 贴地显示
  //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平对齐方式
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
  //     pixelOffset: new Cesium.Cartesian2(0, -50), // 向下偏移 50 像素
  //     eyeOffset: new Cesium.Cartesian3(0, 0, 0), // 相对于相机的偏移量
  //   },
  // });

  // 路径
  // const path = viewer.entities.add({
  //   position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
  //   path: {
  //     width: 5, // 路径宽度
  //     resolution: 60, // 路径分辨率
  //     material: Cesium.Color.RED.withAlpha(0.5), // 半透明红色
  //     leadTime: 3, // 前导时间,就是从当前位置往前推3秒
  //     trailTime: 8, // 后拖时间,就是从当前位置往后推8秒
  //   },
  // });

  // 定义一个墙
  // const wall = viewer.entities.add({
  //   wall: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       116.3975, 39.9075, 100, // 起点
  //       116.4075, 39.9075, 100, // 终点
  //       116.4075, 39.9175, 100, // 高度
  //       116.3975, 39.9175, 100, // 高度
  //       116.3975, 39.9075, 100, // 起点
  //     ]),
  //     material: Cesium.Color.GREEN.withAlpha(0.5), // 半透明绿色
  //     outline: true,
  //     outlineColor: Cesium.Color.WHITE,
  //     outlineWidth: 2,
  //     maximumHeights: [100, 100, 200, 100, 100], // 每个顶点的最大高度
  //     minimumHeights: [0, 0, 0, 0, 0], // 每个顶点的最小高度
  //   }
  // })

  // 定义一个走廊
  // const corridor = viewer.entities.add({
  //   corridor: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       116.3975, 39.9075, 100, 116.4075, 39.9075, 100, 116.4075, 39.9175, 100,
  //     ]),
  //     width: 100, // 走廊宽度
  //     height: 50, // 走廊高度
  //     material: Cesium.Color.ORANGE.withAlpha(0.5), // 半透明橙色
  //     extrudedHeight: 20, // 走廊拉伸高度
  //     outline: true,
  //     outlineColor: Cesium.Color.WHITE,
  //     outlineWidth: 2,
  //   },
  // });

  // path

  // 创建一个XY平面（水平面）
  const planeEntity = viewer.entities.add({
    plane: {
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0), // Z轴法向量，高度0
      dimensions: new Cesium.Cartesian2(10000000, 10000000), // 10km x 10km
      material: Cesium.Color.BLUE.withAlpha(0.5),
      fill: true,
      outline: true,
      outlineColor: Cesium.Color.WHITE,
    },
  });

  // 定位到实体
  viewer.zoomTo(planeEntity);

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
