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

  // 带孔洞多边形
  const positions = Cesium.Cartesian3.fromDegreesArray([
    116.39, 39.9, 116.41, 39.9, 116.41, 39.92, 116.39, 39.92,
  ]);

  // const polygon = viewer.entities.add({
  //   polygon: {
  //     hierarchy: positions,
  //     material: new Cesium.ColorMaterialProperty(
  //       Cesium.Color.RED.withAlpha(0.5) // 颜色+透明度
  //     ),
  //     // 图片材质
  //     // material: new Cesium.ImageMaterialProperty({
  //     //   image: new URL("../assets/vue.svg", import.meta.url).href, // 图片路径
  //     //   repeat: new Cesium.Cartesian2(4, 4), // 平铺次数
  //     //   // color: Cesium.Color.RED, // 图片颜色
  //     //   // transparent: true, // 当图像具有透明度时设置为true
  //     // }),

  //     // 棋盘格材质
  //     // material: new Cesium.CheckerboardMaterialProperty({
  //     //   evenColor: Cesium.Color.WHITE, // 偶数格颜色
  //     //   oddColor: Cesium.Color.BLACK, // 奇数格颜色
  //     //   repeat: new Cesium.Cartesian2(10, 10), // 交替频率
  //     // }),

  //     // 条纹材质
  //     // material: new Cesium.StripeMaterialProperty({
  //     //   evenColor: Cesium.Color.YELLOW,
  //     //   oddColor: Cesium.Color.BLACK,
  //     //   orientation: Cesium.StripeOrientation.HORIZONTAL, // 条纹方向
  //     //   repeat: 20, // 条纹密度
  //     // }),

  //     // 网格材质
  //     // material: new Cesium.GridMaterialProperty({
  //     //   color: Cesium.Color.YELLOW, // 网格线颜色
  //     //   cellAlpha: 0.6, // 单元格透明度
  //     //   lineCount: new Cesium.Cartesian2(5, 5), // 网格密度
  //     //   lineThickness: new Cesium.Cartesian2(3, 3), // 网格线宽度
  //     // }),
  //   },
  // });

  const polyline = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.39, 39.9, 116.41, 39.9, 116.41, 39.92, 116.39, 39.92,
      ]),
      width: 16,
      // 发光材质
      // material: new Cesium.PolylineGlowMaterialProperty({
      //   color: Cesium.Color.CYAN, // 颜色
      //   glowPower: 0.3,  // 亮度
      //   taperPower: 0.7, // 衰减率
      // }),

      // 轮廓材质
      // material: new Cesium.PolylineOutlineMaterialProperty({
      //   color: Cesium.Color.RED,
      //   outlineColor: Cesium.Color.YELLOW,
      //   outlineWidth: 5,
      // }),

      // 虚线
      // material: new Cesium.PolylineDashMaterialProperty({
      //   color: Cesium.Color.BLUE,
      //   // gapColor: Cesium.Color.WHITE,
      //   dashLength: 24,
      //   // dashPattern: parseInt("11110000", 2), // 长虚线
      // }),

      // 箭头材质
      // material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.YELLOW),

      // 
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.PURPLE,
        outlineColor: Cesium.Color.PURPLE,
        outlineWidth: 5,
      }),
    },
  });

  // 定位到实体
  viewer.zoomTo(polyline);

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
