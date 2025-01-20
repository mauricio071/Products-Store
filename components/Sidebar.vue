<template>
    <div v-if="productsQuantity > 0 && $route.name !== 'cart' && $route.name !== 'payment'"
        class="bg-white w-[15rem] fixed top-0 right-0 h-full shadow-xl p-6 space-y-4 hidden xl:flex flex-col">
        <p class="text-center font-bold">Total: {{ formattedPrice(subTotal) }}</p>
        <NuxtLink :to="checkoutCart.length > 0 ? '/payment' : ''"
            :class="{ 'opacity-40 cursor-not-allowed': checkoutCart.length === 0 }" class="btn-goTo">
            Checkout
        </NuxtLink>
        <NuxtLink to="/cart" class="btn-goTo !bg-white !text-primary">Go to cart</NuxtLink>
        <hr>
        <p v-if="shippingFee > 0" class="shipping">
            To save <span>{{ formattedPrice(shippingFee) }}</span> on shipping,
            spend an additional <span>{{ formattedPrice(costShipping - subTotal) }}</span>
        </p>
        <p v-else class="shipping">
            <span>$5.00 saved</span>, explore more items with free shipping
        </p>
        <div class="products space-y-8 overflow-auto -mr-4">
            <div v-for="product in cart" :key="product.id"
                class="product flex flex-col items-center gap-2 bg-gray-100 rounded-xl py-4 mr-3">
                <label class="checkbox -left-[4rem]">
                    <input v-model="product.checked" type="checkbox" id="select-all">
                    <span class="check"></span>
                </label>
                <nuxt-link :to="`/product/${product.id}`">
                    <img :src="product.image" :alt="product.title" class="rounded-lg max-w-[5rem]">
                </nuxt-link>
                <p class="font-semibold">{{ formattedPrice(product.price) }}</p>
                <div class="quantity">
                    <IconsMinus @click="removeUnitProduct(product.id)"
                        class="w-[1.5rem] text-gray-500 cursor-pointer" />
                    <span class="font-semibold">{{ product.quantity }}</span>
                    <IconsPlus @click="addUnitProduct(product)" class="w-[1.5rem] text-gray-500 cursor-pointer" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '../store/productsStore'
import { storeToRefs } from 'pinia';

const store = productsStore();

const { cart, productsQuantity, subTotal, costShipping, shippingFee, checkoutCart } = storeToRefs(store);

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
    @apply bg-primary rounded-[.3rem] ml-8;
}

.btn-goTo {
    @apply block mx-auto font-semibold text-center bg-primary duration-300 text-white w-full py-2 rounded-2xl border border-primary;

    &:hover {
        @apply bg-[#11c091];
    }
}

.shipping {
    @apply bg-gray-100 p-2 py-4 text-center font-semibold;

    span {
        @apply text-red-500;
    }
}

.quantity {
    @apply flex items-center gap-2;
}
</style>