<template>
    <div v-if="productsAmount > 0 && $route.name !== 'cart'"
        class="bg-white w-[15rem] fixed top-0 right-0 h-full shadow-xl p-6 space-y-4 hidden xl:flex flex-col">
        <p class="text-center font-bold">Total: ${{ totalValue }}</p>
        <NuxtLink to="/cart" class="btn-goTo">Go to cart</NuxtLink>
        <hr>
        <p v-if="saveShipping >= 0" class="shipping">
            To save <span>$5.00</span> on shipping,
            spend an additional <span>${{ saveShipping }}</span>
        </p>
        <p v-else class="shipping">
            <span>$5.00 saved</span>, explore more items with free shipping
        </p>
        <div class="products space-y-8 overflow-auto -mr-4">
            <div v-for="product in cart" :key="product.id"
                class="product flex flex-col items-center gap-2 bg-gray-100 rounded-xl py-4 mr-3">
                <img :src="product.image" :alt="product.title" class="rounded-lg max-w-[5rem]">
                <p class="font-semibold">${{ product.price }}</p>
                <div class="amounts">
                    <IconsMinus @click="removeUnitProduct(product.id)"
                        class="w-[1.5rem] text-gray-500 cursor-pointer" />
                    <span class="font-semibold">{{ product.amount }}</span>
                    <IconsPlus @click="addUnitProduct(product)" class="w-[1.5rem] text-gray-500 cursor-pointer" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '../store/productsStore'
import { storeToRefs } from 'pinia';

const store = productsStore()

const { cart, productsAmount, totalValue } = storeToRefs(store)

const costShipping = 50;

const saveShipping = computed(() => {
    if (costShipping - totalValue >= 0) {
        return 0;
    } else {
        return (costShipping - Number(totalValue.value)).toFixed(2);
    }
})

const removeUnitProduct = (id) => {
    store.removeUnit(id);
}

const addUnitProduct = (product) => {
    store.addProduct(product)
}
</script>

<style scoped>
::-webkit-scrollbar {
    @apply bg-[#f0fdfa] w-[.4rem] ml-8;
}

::-webkit-scrollbar-thumb {
    @apply bg-[#12b488] rounded-[.3rem] ml-8;
}

.btn-goTo {
    @apply block mx-auto text-center bg-[#12b488] duration-300 text-white w-full py-2 rounded-2xl border border-[#12b488];
}

.btn-goTo:hover {
    @apply bg-white text-[#12b488];
}

.shipping {
    @apply bg-gray-100 p-2 py-4 text-center font-semibold;
}

.shipping span {
    @apply text-red-500;
}

.amounts {
    @apply flex items-center gap-2;
}
</style>