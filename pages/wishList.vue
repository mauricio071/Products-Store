<template>
    <div>
        <div v-if="loading" class="loading-screen">
            <span v-if="loading" class="loader-primary"></span>
        </div>
        <div v-else>
            <EmptyScreen v-if="products.length === 0" message="Your wish list is empty!" />
            <div v-else>
                <div class="title-container">
                    <h1 class="mb-0">Wish List ({{ products.length }})</h1>
                </div>
                <div class="products">
                    <div v-for="product in products" :key="product.id" class="product">
                        <div class="-ml-6"></div>
                        <nuxt-link :to="`/product/${product.id}`">
                            <img :src="product.image" :alt="product.title">
                        </nuxt-link>
                        <div class="product-details">
                            <div class="flex items-center justify-between gap-2 ">
                                <nuxt-link :to="`/product/${product.id}`">
                                    <h3 class="text-[20px] font-bold duration-300 truncate-oneline hover:text-primary">
                                        {{ product.title }}
                                    </h3>
                                </nuxt-link>
                                <i @click="remove(product.id)"
                                    class="material-icons cursor-pointer duration-300 hover:text-red-500">delete</i>
                            </div>
                            <p class="truncate-multiline">{{ product.description }}</p>
                            <div class="price flex justify-between items-center gap-4">
                                <p class="text-xl font-bold">
                                    Price: {{ formattedPrice(product.price) }}
                                </p>
                                <div class="flex items-center">
                                    <p class="text-sm border-r border-r-gray-400 pr-2 mr-2">{{ product.rating.count }}
                                        sold
                                    </p>
                                    <div class="rating">
                                        <IconsStar class="w-5" />
                                        <p>{{ product.rating.rate }}</p>
                                    </div>
                                </div>
                            </div>
                            <span class="text-gray-600 block !-mt-3">
                                +{{ formattedPrice(product.price * 0.2) }} estimated tax
                            </span>
                            <button @click="addToCart(product)"
                                class="btn flex justify-center items-center gap-x-2 self-end">
                                <i class="material-icons">add_shopping_cart</i>
                                <span class="font-semibold">Add to cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

useHead({
    title: "Wish List - Products Store"
});

import { productsStore } from '~/store/productsStore';

const { $toast } = useNuxtApp();

const store = productsStore();

const { wishList } = storeToRefs(store);

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
    loading.value = true;

    try {
        const wishListProducts = await Promise.all(
            wishList.value.map(async (favId) => (
                $fetch(`https://fakestoreapi.com/products/${favId}`)
            ))
        );

        products.value = wishListProducts;
    } catch (e) {
        console.log("Error: ", e);
    } finally {
        loading.value = false;
    }
}

const addToCart = (product) => {
    try {
        store.addProduct(product, 1);
        $toast.success("Product added!");
    } catch (error) {
        $toast.error("There was an error processing your request");
    }
}

const remove = (id) => {
    try {
        store.removeWishList(id);

        products.value = products.value.filter((product) => product.id !== id);
    } catch (error) {
        $toast.error("There was an error processing your request");
    }
}

fetchProducts();
</script>

<style scoped>
.products {
    @apply grid gap-4 2xl:grid-cols-2;

    .product {
        @apply bg-white shadow-md rounded-lg px-6 py-4 min-h-[15rem] flex flex-col items-center justify-between gap-4 md:flex-row;

        img {
            @apply max-w-[150px] max-h-[150px] w-full;
        }

        .product-details {
            @apply max-w-[45rem] flex flex-col gap-4 md:w-[70%];

            .truncate-multiline {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .truncate-oneline {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }
}
</style>