<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
import jiangsu from "./models/jiangsu.json";
const cesiumContainer = ref(null);
let viewer = null;
const popup = ref(null); // 用于存储气泡窗口元素

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

  // 异步加载中国GeoJson数据
  // const geoJsonData1 = Cesium.GeoJsonDataSource.load(
  //   "https://geojson.cn/api/china/1.6.2/china.json",
  //   {
  //     stroke: Cesium.Color.SKYBLUE, // 边框颜色
  //     fill: Cesium.Color.PINK, // 填充颜色
  //     strokeWidth: 3, // 边框宽度
  //   }
  // );

  // // 将数据源添加到Viewer中
  // geoJsonData1.then((dataSource) => {
  //   viewer.dataSources.add(dataSource);
  //   // 遍历所有实体
  //   dataSource.entities.values.forEach((entity) => {
  //     if (entity.polygon) {
  //       // 设置随机颜色
  //       entity.polygon.material = new Cesium.ColorMaterialProperty(
  //         Cesium.Color.fromRandom({
  //           alpha: 0.8, // 设置透明度
  //         })
  //       );
  //       // 区域随机拉伸高度
  //       entity.polygon.extrudedHeight = Math.random() * 100000;
  //     }
  //   });
  //   // 设置视图范围
  //   // viewer.zoomTo(dataSource);
  // });

  const geoJsonData = new Cesium.GeoJsonDataSource().load(
    jiangsu,
    {
      stroke: Cesium.Color.SKYBLUE, // 边框颜色
      fill: Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0), // 填充颜色
      strokeWidth: 3, // 边框宽度
    }
  );

  geoJsonData.then((datasource) => {
    console.log(datasource, "datasource");
    viewer.dataSources.add(datasource);
    viewer.flyTo(datasource, { duration: 3 });

    // 存储所有洞的区域（每个独立多边形一个数组）
    const holes = [];

    // 收集所有多边形点位（按独立区域分组）
    datasource.entities.values.forEach((entity) => {
      const hierarchy = entity.polygon.hierarchy.getValue(
        Cesium.JulianDate.now()
      );
      if (hierarchy) {
        holes.push(hierarchy.positions); // 每个区域单独存储
      }
    });
    // 创建覆盖全球的蒙层（带多个洞）
    viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([30, 0, 30, 89, 180, 89, 180, 0]),
          holes.map((hole) => new Cesium.PolygonHierarchy(hole))
        ),
        material: Cesium.Color.BLACK.withAlpha(0.4),
      },
      perPositionHeight: true,
    });
  });
  // -------------------------------

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
  const layer = viewer.imageryLayers.addImageryProvider(tiandituProvider);
  layer.alpha = 0.9; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
