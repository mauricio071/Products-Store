<template>
    <header class="shadow-md">
        <nav class="flex justify-between flex-wrap md:flex-nowrap container mx-auto p-8">
            <NuxtLink to="/" class="font-bold text-xl flex gap-2 items-center">
                <LazyIconsShopping class="rotate-[-20deg]" />
                Products Store
            </NuxtLink>
            <button @click="visible = !visible" class="md:hidden">
                <IconsMenu />
            </button>
            <ul class="space-y-8 md:space-y-0 mt-8 md:my-0 justify-between gap-4 w-full md:w-[unset] md:flex"
                :class="{ 'block': visible, 'hidden': !visible }">
                <li>
                    <NuxtLink to="/" class="text-xl btn">Products</NuxtLink>
                </li>
                <li class="user-account">
                    <IconsUser />
                    <p>Hi! Teste</p>
                    <div class="submenu">
                        Login
                    </div>
                </li>
                <li class="relative">
                    <div v-if="productsAmount > 0" class="product-counter">{{ productsAmount }}</div>
                    <nuxt-link to="/cart"><i class="material-icons">shopping_cart</i></nuxt-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
import { productsStore } from '../store/productsStore'
import { storeToRefs } from 'pinia';

const visible = ref(false)

const store = productsStore()

const { productsAmount } = storeToRefs(store)
</script>

<style scoped>
.user-account {
    @apply flex gap-2 relative;

    &:hover {
        .submenu {
            @apply block;
        }
    }

    .submenu {
        @apply hidden absolute top-[1.5rem] w-24 text-center bg-white px-4 py-2 rounded-lg;
    }
}

.product-counter {
    @apply absolute left-[10px] bottom-[20px] bg-[#12b488] text-white rounded-[50%] py-[1px] px-[6px] text-[10px];
}
</style>