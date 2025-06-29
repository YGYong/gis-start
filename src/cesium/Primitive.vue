<template>
  <div ref="cesiumContainer" style="width: 100%; height: 90vh"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as Cesium from "cesium";
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

  // -------------------------------PerInstanceColorAppearance
  // 1.
  // const geometry = new Cesium.CircleGeometry({
  //   center: Cesium.Cartesian3.fromDegrees(116.39, 39.9),
  //   radius: 1000,
  // });

  // 2.
  // const geometryInstance = new Cesium.GeometryInstance({
  //   geometry,
  //   attributes: {
  //     color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 1),
  //   },
  // });

  // 3 PerInstanceColorAppearance
  // const appearance = new Cesium.PerInstanceColorAppearance({
  //   flat: true, // 不考虑光照
  //   translucent: true,
  // });

  // ---------------------------------

  // --------------------------------- EllipsoidSurfaceAppearance
  // 1. 定义椭球体几何体
  // const geometry = new Cesium.PolygonGeometry({
  //   polygonHierarchy: new Cesium.PolygonHierarchy(
  //     Cesium.Cartesian3.fromDegreesArray([
  //       116.39,
  //       39.9, // 第一个点
  //       116.4,
  //       39.9, // 第二个点
  //       116.4,
  //       39.91, // 第三个点
  //       116.39,
  //       39.91, // 第四个点
  //     ])
  //   ),
  //   height: 0, // 高度为0，表示在地面上
  //   vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT, // 包含位置和法线信息
  // });
  // // 2. 创建几何实例
  // const geometryInstance = new Cesium.GeometryInstance({
  //   geometry,
  // });
  // // 3. 创建外观
  // const appearance = new Cesium.EllipsoidSurfaceAppearance({
  //   material: Cesium.Material.fromType("Stripe"),
  // });

  // ---------------------------------PolylineMaterialAppearance
  // 1. 定义线段几何体
  const geometryInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.39,
        39.9, // 第一个点
        116.4,
        39.9, // 第二个点
        116.4,
        39.91, // 第三个点
        116.39,
        39.91, // 第四个点
      ]),
      width: 10.0,
      vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
    }),
  });

  // 2. 创建外观
  const appearance = new Cesium.PolylineMaterialAppearance({
    material: Cesium.Material.fromType("Color"),
  });

  // 3. 创建几何体实例
  const primitive = new Cesium.Primitive({
    geometryInstances: [geometryInstance],
    appearance,
  });

  viewer.scene.primitives.add(primitive);
  // primitive.destroy()
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 5000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });

  // // 1. 定义盒子中心位置（WGS84坐标）
  // const center = Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000);

  // // 2. 定义盒子尺寸（单位：米）
  // const boxSize = new Cesium.Cartesian3(500.0, 800.0, 300.0); // 长(x)、宽(y)、高(z)

  // // 3. 计算最小和最大点（以中心为原点）
  // const halfSize = Cesium.Cartesian3.multiplyByScalar(
  //   boxSize,
  //   0.5,
  //   new Cesium.Cartesian3()
  // );
  // const minimum = Cesium.Cartesian3.negate(halfSize, new Cesium.Cartesian3());
  // const maximum = halfSize;

  // // 4. 创建盒子几何体（使用正确的参数）
  // const boxGeometry = new Cesium.BoxGeometry({
  //   vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL, // 包含法线信息（用于光照）
  //   minimum: minimum,
  //   maximum: maximum,
  // });

  // // 5. 创建模型矩阵（包含位置和方向）
  // const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);

  // // 6. 创建几何实例
  // const instance = new Cesium.GeometryInstance({
  //   geometry: boxGeometry,
  //   modelMatrix: modelMatrix,
  //   id: "custom-box", // 可选ID，用于拾取识别
  //   attributes: {
  //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(
  //       Cesium.Color.RED.withAlpha(0.7)
  //     ), // 带透明度
  //   },
  // });

  // // 7. 创建Primitive并添加到场景
  // const boxPrimitive = new Cesium.Primitive({
  //   geometryInstances: instance,
  //   appearance: new Cesium.PerInstanceColorAppearance({
  //     closed: true, // 封闭几何体（盒子必须封闭）
  //     translucent: true, // 启用透明度
  //   }),
  //   asynchronous: false, // 同步加载（小几何体适用）
  // });

  // viewer.scene.primitives.add(boxPrimitive);
  // boxPrimitive.destroy()

  // // 8. 视角定位
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 5000),
  //   offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 2000),
  // });

  // setTimeout(() => {
  //   // viewer.scene.primitives.remove(boxPrimitive);
  //   // boxPrimitive = boxPrimitive && boxPrimitive.destroy()
  //   // boxPrimitive = undefined
  //   // console.log(boxPrimitive)
  //   console.log(boxPrimitive.isDestroyed())
  // }, 3000);

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
  // layer.alpha = 0.9; // 设置透明度
  // 清空logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
