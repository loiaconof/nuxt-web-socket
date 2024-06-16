<script setup lang="ts">
import { useSharedState } from './composables/shared-state'

const state = useSharedState()
</script>

<template>
  <div>
    {{ state }}
  </div>
</template>
