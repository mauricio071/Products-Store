<template>
    <div class="products">
        <div class="product">
            <!-- <template v-if="!disabled">
                <label class="checkbox self-start md:self-center">
                    <input v-model="product.checked" type="checkbox" id="select-all">
                    <span class="check !top-1/2 "></span>
                </label>
            </template> -->
            <nuxt-link :to="`/product/${product.id}`">
                <img :src="product.image" :alt="product.title">
            </nuxt-link>
            <div class="product-details">
                <div class="flex items-center justify-between w-full">
                    <nuxt-link :to="`/product/${product.id}`">
                        <h3 class="text-[20px] font-bold duration-300 'hover:text-primary'">
                            {{ product.title }}</h3>
                    </nuxt-link>
                    <i @click="remove(product.id)"
                        class="material-icons mb-2 cursor-pointer duration-300 hover:text-red-500">delete</i>
                </div>
                <p class="truncate-multiline">{{ product.description }}</p>
                <p class="text-xl font-bold">
                    Price: ${{ product.total.toFixed(2) }}
                </p>
                <span v-if="!disabled" class="text-gray-600 block !mt-1">
                    +${{ (product.total * 0.2).toFixed(2) }} estimated tax
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Wish List - Products Store"
});

import { productsStore } from '~/store/productsStore';

const { $toast } = useNuxtApp();

const store = productsStore();

const data = async(() => {

})

const remove = (id) => {
    try {
        store.removeProduct(id);
    } catch (error) {
        $toast.error("There was an error processing your request");
    }
}
</script>

<style scoped>
.products {
    @apply flex flex-col gap-4;

    .product {
        @apply bg-white shadow-md rounded-lg px-6 py-8 min-h-[15rem] flex flex-col items-center justify-between gap-4 md:flex-row;

        img {
            @apply max-w-[150px] max-h-[150px] w-full;
        }

        .product-details {
            @apply max-w-[45rem] space-y-6 md:w-[70%];

            .truncate-multiline {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }
}
</style>