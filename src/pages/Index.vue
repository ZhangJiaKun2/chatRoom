<template>
  <a-layout>
    <a-layout-header class="myHeader">
      <commonHeader></commonHeader>
    </a-layout-header>
    <a-layout-content class="myBody">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>
      <commonFooter></commonFooter>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>




</script>

<style lang="less" scoped>
.myHeader{
  background-color: #fff;
}
.myBody{
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  margin-top: 10px;
  //margin-bottom: 0px;
  //margin: 60px auto;
}
</style>
