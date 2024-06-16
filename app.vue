<script setup lang="ts">
const state = useSharedState<{count: number}>()
state.value.count ||= 0
</script>

<template>
  <div>
    {{ state }}
    <button @click="state.count++">Increment</button>
  </div>
</template>
