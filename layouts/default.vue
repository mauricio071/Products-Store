<template>
    <div class="flex">
        <div class="w-full" :class="{
            'xl:pr-60': productsQuantity > 0 && checkUrlSidebar($route.name)
        }">
            <Navbar />

            <div class="container mx-auto px-8 pt-10 pb-12" style="min-height: calc(100vh - 148px);">
                <slot />
            </div>
            <Footer />
        </div>

        <Sidebar />
    </div>
</template>

<script setup>
import { productsStore } from '../store/productsStore'
import { storeToRefs } from 'pinia';

const store = productsStore();

const { productsQuantity } = storeToRefs(store);
</script>
