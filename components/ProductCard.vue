<template>
    <div>
        <div class="product">
            <img :src="product.image" :alt="product.title">
            <div class="product-details">
                <div class="flex items-center justify-between w-full">
                    <h3 class="text-[20px] font-bold">{{ product.title }}</h3>
                    <i v-if="!disabled" @click="remove(product.id)"
                        class="material-icons mb-2 cursor-pointer duration-300 hover:text-red-500">delete</i>
                </div>
                <p>{{ product.description }}</p>
                <div class="amounts">
                    <h3 class="font-bold">Amount:</h3>
                    <IconsMinus @click="removeUnitProduct(product.id)"
                        :class="{ '!text-gray-200 !cursor-not-allowed': disabled }"
                        class="w-[1.5rem] text-gray-500 cursor-pointer" />
                    <span class="font-semibold">{{ product.amount }}</span>
                    <IconsPlus @click="addUnitProduct(product)"
                        :class="{ '!text-gray-200 !cursor-not-allowed': disabled }"
                        class="w-[1.5rem] text-gray-500 cursor-pointer" />
                </div>
                <p class="text-xl font-semibold">Total price: ${{ product.total.toFixed(2) }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '~/store/productsStore';

const { $toast } = useNuxtApp();

const { product, disabled } = defineProps(["product", "disabled"]);

const store = productsStore();

const remove = (id) => {
    try {
        store.removeProduct(id)
    } catch (error) {
        $toast.error("There was an error processing your request")
    }
}

const removeUnitProduct = (id) => {
    if (!disabled) {
        store.removeUnit(id);
    }
}

const addUnitProduct = (product) => {
    if (!disabled) {
        store.addProduct(product);
    }
}
</script>

<style scoped>
.product {
    @apply bg-white shadow-md rounded-lg px-4 py-8 min-h-[15rem] md:flex md:gap-4;
}

.product img {
    @apply flex-grow m-auto max-w-[150px] max-h-[150px] md:m-8;
}

.product-details {
    @apply max-w-[45rem] space-y-6;
}

.amounts {
    @apply flex items-center gap-2;
}
</style>