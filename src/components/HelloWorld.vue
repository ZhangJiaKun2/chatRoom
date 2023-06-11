<template>
  <a-button type="primary" @click="toRouter">Primary Button</a-button>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
const router = useRouter()
const size = ref(0)
const toRouter = ()=>{
  console.log(router,1)
  router.push('/signUp')
}
</script>

<style scoped>

</style>
