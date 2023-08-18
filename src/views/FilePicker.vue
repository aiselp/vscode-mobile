<template>
    <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name" :root-style="{ color: 'blue' }"
        style="color: red" title="Basic Drawer" placement="right">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </a-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import defaultFileSystem from '../core/features/filesystem'

const open = ref<boolean>(false)
const filesystem = defaultFileSystem.value

</script>
<style scoped></style>