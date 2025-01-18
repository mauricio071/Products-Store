<template>
    <div>
        <div class="product">
            <template v-if="!disabled">
                <label class="checkbox self-start md:self-center">
                    <input v-model="product.checked" type="checkbox" id="select-all">
                    <span class="check !top-1/2 "></span>
                </label>
            </template>
            <nuxt-link :to="!disabled ? `/product/${product.id}` : ''">
                <img :src="product.image" :alt="product.title">
            </nuxt-link>
            <div class="product-details">
                <div class="flex items-center justify-between w-full">
                    <nuxt-link :to="!disabled ? `/product/${product.id}` : ''">
                        <h3 :class="{ 'hover:text-primary': !disabled }" class="text-[20px] font-bold duration-300">{{
                            product.title }}</h3>
                    </nuxt-link>
                    <i v-if="!disabled" @click="remove(product.id)"
                        class="material-icons mb-2 cursor-pointer duration-300 hover:text-red-500">delete</i>
                </div>
                <p>{{ product.description }}</p>
                <div class="quantity">
                    <h3 class="font-bold">Quantity:</h3>
                    <IconsMinus @click="removeUnitProduct(product.id)"
                        :class="{ ' !text-gray-200 !cursor-not-allowed': disabled }"
                        class="w-[1.5rem] text-gray-500 cursor-pointer" />
                    <span class="font-semibold">{{ product.quantity }}</span>
                    <IconsPlus @click="addUnitProduct(product)"
                        :class="{ '!text-gray-200 !cursor-not-allowed': disabled }"
                        class="w-[1.5rem] text-gray-500 cursor-pointer" />
                </div>
                <p class="text-xl font-bold">
                    Total price: ${{ product.total.toFixed(2) }}
                </p>
                <span v-if="!disabled" class="text-gray-600 block !mt-1">
                    +${{ (product.total * 0.2).toFixed(2) }} estimated tax
                </span>
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
    @apply bg-white shadow-md rounded-lg px-6 py-8 min-h-[15rem] flex flex-col items-center justify-between gap-4 md:flex-row;
}

.product img {
    @apply max-w-[150px] max-h-[150px] w-full;
}

.product-details {
    @apply max-w-[45rem] space-y-6 md:w-[70%];
}

.quantity {
    @apply flex items-center gap-2;
}
</style>