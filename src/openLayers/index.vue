<template>
  <div class="timers">{{ dateWeek }} {{ dateDay }} {{ desc }}</div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import dayjs from "dayjs";
const dateYear = ref("");
const dateDay = ref("");
const dateWeek = ref("");
const desc = ref("");

const time = ref();
const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const getDesc = (hour) => {
  if (hour < 6) return "凌晨好";
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
};
const timeFn = () => {
  time.value = setInterval(() => {
    const now = dayjs();
    dateYear.value = now.format("YYYY");
    dateDay.value = now.format("YYYY-MM-DD HH:mm:ss");
    dateWeek.value = weekday[now.day()];
    desc.value = getDesc(now.hour());
    console.log(
      `当前时间：${dateYear.value} ${dateWeek.value} ${dateDay.value} ${desc.value}`
    );
  }, 1000);
};
timeFn();

onUnmounted(() => {
  clearInterval(time.value);
});
</script>
