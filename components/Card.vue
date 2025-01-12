<template>
    <div class="card">
        <img :src="product.image" alt="Product image" class="max-h-[11rem] max-w-[70%] mx-auto flex-grow">
        <div @click="addInCart(product)" class="add-cart">
            <IconsAddProdutct />
        </div>
        <h2 class="text-2xl font-semibold my-4 truncate">{{ product.title }}</h2>
        <div class="rating">
            <IconsStar />
            <p>{{ product.rating.rate }}</p>
        </div>
        <div class="flex justify-between items-center mb-4">
            <p class="text-2xl font-bold text-gray-500 truncate">${{ product.price }}</p>
            <p class="text-lg font-semibold">{{ product.rating.count }} sold</p>
        </div>
        <nuxt-link :to="`/products/${product.id}`">
            <p class="btn">See details</p>
        </nuxt-link>
    </div>
</template>

<script setup>
import { productsStore } from '../store/productsStore'

const store = productsStore()

const { $toast } = useNuxtApp()

const { product } = defineProps({
    product: Object
})

const addInCart = (product) => {
    try {
        store.addProduct(product)
        $toast.success("Product added!")
    } catch (error) {
        $toast.error("There was an error processing your request")
    }
}
</script>

<style scoped>
.card {
    @apply relative shadow-lg h-full p-4 rounded-xl bg-white flex flex-col mb-4 justify-between text-center;
}

.add-cart {
    @apply absolute w-full right-[1rem] max-w-[3rem] bg-gray-100 rounded-[50%] p-2 shadow-lg cursor-pointer duration-300;
}

.add-cart:hover {
    @apply bg-[#1dd8a6];
}

.sale {
    @apply flex items-center;
}
</style>