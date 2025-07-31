<template>
  <div ref="cesiumContainer" class="container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
let viewer = null;

// 天地图TOKEN
const token = "05be06461004055923091de7f3e51aa6";

onMounted(() => {
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
    baseLayer: false, // 关闭默认地图
  });
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // 创建半透明红色材质
  const redMaterial = new Cesium.ColorMaterialProperty(
    Cesium.Color.RED.withAlpha(0.5) // 50%透明度
  );

  // 应用到多边形
  viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        116.3975, 39.9075, 116.4075, 39.9075, 116.4075, 39.9175, 116.3975,
        39.9175,
      ]),
      material: redMaterial,
      // 图片材质
      // material: new Cesium.ImageMaterialProperty({
      //   image: new URL("../assets/vue.svg", import.meta.url).href, // 图片路径
      //   repeat: new Cesium.Cartesian2(4, 4), // 平铺次数
      //   // color: Cesium.Color.RED, // 图片颜色
      //   // transparent: true, // 当图像具有透明度时设置为true
      // }),

      // 棋盘格材质
      // material: new Cesium.CheckerboardMaterialProperty({
      //   evenColor: Cesium.Color.WHITE, // 偶数格颜色
      //   oddColor: Cesium.Color.BLACK, // 奇数格颜色
      //   repeat: new Cesium.Cartesian2(10, 10), // 交替频率
      // }),

      // 条纹材质
      // material: new Cesium.StripeMaterialProperty({
      //   evenColor: Cesium.Color.YELLOW,
      //   oddColor: Cesium.Color.BLACK,
      //   orientation: Cesium.StripeOrientation.HORIZONTAL, // 条纹方向
      //   repeat: 20, // 条纹密度
      // }),

      // 网格材质
      // material: new Cesium.GridMaterialProperty({
      //   color: Cesium.Color.YELLOW, // 网格线颜色
      //   cellAlpha: 0.6, // 单元格透明度
      //   lineCount: new Cesium.Cartesian2(5, 5), // 网格密度
      //   lineThickness: new Cesium.Cartesian2(3, 3), // 网格线宽度
      // }),
      height: 0,
      extrudedHeight: 100,
    },
  });
  // 缩放到多边形
  viewer.zoomTo(viewer.entities);

  initMap();
});

// 加载天地图
const initMap = () => {
  // 以下为天地图及天地图标注加载
  const tiandituProvider = new Cesium.WebMapTileServiceImageryProvider({
    url:
      "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
      token,
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
      token,
    layer: "img",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 子域名轮询
    maximumLevel: 18,
    credit: new Cesium.Credit("天地图影像"),
  });
  // 天地图影像添加到viewer实例的影像图层集合中
  viewer.imageryLayers.addImageryProvider(tiandituProvider);
  // 天地图地理标注（后添加的会覆盖前面的）
  viewer.imageryLayers.addImageryProvider(labelProvider);
};
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
