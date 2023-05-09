<script setup>
const num = 0
const NewNum = ref(0)
console.log(NewNum)
</script>

<template>
  <el-button type="primary">
    i am button
  </el-button>
  <h1>静态：{{ num }}</h1>
  <h1 class="title">
    动态：{{ NewNum }}
  </h1>
  <button @click="NewNum++">
    增加
  </button>

  <RouterView />
</template>

<style scoped lang="scss">
$red: red;

.title {
  color: $red;
}
</style>
