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

  // 添加实体
  const circle = viewer.entities.add({
    id: "circle",
    name: "circle",
    description: "This is circle",
    position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
    properties: {
      name: "Circle",
      description: "This is a circle entity",
      aa: "abc",
    },
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.WHITE,
    },
  });
  // 定位到实体
  viewer.zoomTo(circle);

  //
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (e) {
    const pickedObject = viewer.scene.pick(e.position);
    if (
      Cesium.defined(pickedObject) &&
      pickedObject.id instanceof Cesium.Entity
    ) {
      const entity = pickedObject.id;
      console.log("Clicked entity:", entity); // 输出实体信息
      console.log("Entity name:", entity.name); // 输出实体的名称属性
      // 你可以根据需要访问实体的其他属性，例如：
      // console.log('Entity position:', entity.position);
    } else {
      console.log("Clicked nothing");
    }
    // // 点击后获取点击位置的笛卡尔坐标
    // const cartesian = viewer.scene.pickPosition(e.position);
    // // 笛卡尔坐标转弧度坐标
    // var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    // console.log(cartographic, "cartographic");
    // // 弧度转度数
    // var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    // var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    // var heightString = cartographic.height;
    // console.log(
    //   "Longitude: " +
    //     longitudeString +
    //     ", Latitude: " +
    //     latitudeString +
    //     ", Height: " +
    //     heightString
    // );
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //
  // viewer.screenSpaceEventHandler.setInputAction(
  //   function (e) {
  //     console.log("同时按住Shift + 鼠标左键");
  //   },
  //   Cesium.ScreenSpaceEventType.LEFT_CLICK,
  //   Cesium.KeyboardEventModifier.SHIFT
  // );

  // 相机事件

  // 监听相机移动开始
  // viewer.camera.moveStart.addEventListener(() => {
  //   console.log("相机开始移动");
  // });

  // // 监听相机移动结束
  // viewer.camera.moveEnd.addEventListener(() => {
  //   console.log("相机移动结束");
  // });

  // // 监听相机移动中
  // viewer.camera.changed.addEventListener(() => {
  //   console.log("相机移动中");
  // });

  // const handler1 = new Cesium.CameraEventAggregator(viewer.scene.canvas);
  // const abc = handler1.getButtonPressTime(Cesium.CameraEventType.LEFT_DRAG);
  // console.log(abc,"abc000");
  // handler1.anyButtonDown.addEventListener(() => {
  // if (eventAggregator.isMoving(Cesium.CameraEventType.LEFT_DRAG)) {
  //   console.log('左键拖拽进行中');
  // }
  // });

  // 鼠标进入实体
  // 创建自定义事件总线
  // const eventBus = {
  //   events: {},
  //   emit(event, data) {
  //     if (this.events[event]) {
  //       this.events[event].forEach((fn) => fn(data));
  //     }
  //   },
  //   on(event, callback) {
  //     if (!this.events[event]) this.events[event] = [];
  //     this.events[event].push(callback);
  //   },
  // };
  // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // // 在实体点击时触发自定义事件
  // handler.setInputAction((click) => {
  //   const picked = viewer.scene.pick(click.position);
  //   if (picked && picked.id) {
  //     eventBus.emit("entity-clicked", picked.id);
  //   }
  // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // // 监听自定义事件
  // eventBus.on("entity-clicked", (entity) => {
  //   console.log("实体被点击:", entity.name);
  // });
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
