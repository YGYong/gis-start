<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
const cesiumContainer = ref(null);
let viewer = null;

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
    infoBox: false,
  });

  // 添加point实体
  const pointEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9075, 50),
    point: {
      color: Cesium.Color.RED.withAlpha(0.8), // 80% 不透明的红色
      pixelSize: 20, // 直径20像素
      outlineColor: Cesium.Color.WHITE, // 白色轮廓
      outlineWidth: 3, // 轮廓宽度3像素
      // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 贴地显示
      show: true, // 默认显示
    },
  });
  // pointEntity.point.scaleByDistance = new Cesium.NearFarScalar(
  //   1000, // 相机距离1000米时
  //   3.0, // 缩放至3倍大小
  //   5000, // 相机距离5000米时
  //   0.5 // 缩放至0.5倍大小
  // );
  // pointEntity.point.translucencyByDistance = new Cesium.NearFarScalar(
  //   500, // 相机距离500米时
  //   1.0, // 完全不透明
  //   2000, // 相机距离2000米时
  //   0.2 // 20%透明度
  // );
  //

  // 创建支持聚合的数据源
  const clusteredDataSource = new Cesium.CustomDataSource("clusteredData");

  // 添加到 Viewer
  viewer.dataSources.add(clusteredDataSource);

  // 启用聚合
  clusteredDataSource.clustering.enabled = true;

  // 配置聚合参数
  clusteredDataSource.clustering.pixelRange = 48; // 聚合像素范围
  clusteredDataSource.clustering.minimumClusterSize = 3; // 最小聚合点数

  // 添加点实体
  for (let i = 0; i < 1000; i++) {
    clusteredDataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        116.3975 + Math.random() * 0.01, // 随机偏移
        39.9075 + Math.random() * 0.01, // 随机偏移
        50
      ),
      point: {
        pixelSize: 15,
        color: Cesium.Color.fromRandom(),
      },
      id: `point-${i}`,
    });
  }

  // 使用时间动态颜色实现闪烁
  // pointEntity.point.color = new Cesium.CallbackProperty(() => {
  //   const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);
  //   return Cesium.Color.RED.withAlpha(alpha);
  // }, false);

  // pointEntity.point.distanceDisplayCondition =
  //   new Cesium.DistanceDisplayCondition(
  //     100, // 最小可见距离（米）
  //     5000 // 最大可见距离（米）
  //   );
  // 定位到实体
  viewer.zoomTo(pointEntity);

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
