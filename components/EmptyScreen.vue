<template>
    <div class="text-center flex flex-col items-center justify-center gap-4" style="height: calc(100vh - 228px);">
        <div class="font-bold text-4xl mb-4">
            {{ message }}
        </div>
        <nuxt-link v-if="!loginToken" to="/login"
            class="text-2xl btn px-4 bg-white text-primary border-primary max-w-[15rem] w-full">
            Login
        </nuxt-link>
        <nuxt-link to="/" class="text-2xl btn px-4 hover:bg-primary hover:text-white max-w-[15rem] w-full">
            See products
        </nuxt-link>
    </div>
</template>

<script setup>
const { message } = defineProps(['message']);

const loginToken = useCookie("loginToken");
</script>
