<template>
    <div>
        <div v-if="loading" class="loading-screen">
            <span v-if="loading" class="loader-primary"></span>
        </div>
        <div v-else>
            <div v-if="orders.length === 0" class="text-center flex flex-col items-center justify-center"
                style="height: calc(100vh - 156px);">
                <div class="font-bold text-4xl mb-8">
                    You have no orders!
                </div>
                <nuxt-link to="/" class="text-2xl btn">
                    See products
                </nuxt-link>
            </div>
            <div v-else>
                <div class="title-container">
                    <h1 class="mb-0">My Orders</h1>
                </div>
                <div v-for="order in ordersHistory" :key="order.id">
                    <div class="text-primary font-bold text-2xl mt-8 mb-4">
                        Order date: {{ order.date }}
                    </div>
                    <div class="products">
                        <div v-for="product in order.products" :key="product.id" class="product">
                            <div class="order-detail">
                                <h3>Completed</h3>
                                <div class="flex items-center">
                                    <p>Order ID: {{ order.id }}</p>
                                    <div class="ml-3">
                                        <nuxt-link to="/"
                                            class="font-bold flex items-center duration-300 text-sm hover:text-primary sm:text-base">
                                            Order details
                                            <i class="material-icons">chevron_right</i>
                                        </nuxt-link>
                                    </div>
                                </div>
                            </div>
                            <div class="product-content">
                                <div class="-ml-6"></div>
                                <nuxt-link :to="`/product/${product.id}`">
                                    <img :src="product.image" :alt="product.title">
                                </nuxt-link>
                                <div class="product-details">
                                    <div class="flex items-center justify-between gap-2 ">
                                        <nuxt-link :to="`/product/${product.id}`">
                                            <h3
                                                class="text-[20px] font-bold duration-300 truncate-oneline hover:text-primary">
                                                {{ product.title }}
                                            </h3>
                                        </nuxt-link>
                                    </div>
                                    <!-- <p class="truncate-multiline">{{ product.description }}</p> -->
                                    <div class="price flex justify-between items-center gap-4">
                                        <p class="text-lg font-semibold">
                                            Price: {{ formattedPrice(product.price) }}
                                        </p>
                                    </div>
                                    <div class="quantity text-lg font-semibold">
                                        <h3>Quantity:</h3>
                                        <span>{{ product.quantity }}</span>
                                    </div>
                                    <div class="total self-end font-bold text-2xl">
                                        Total: {{ formattedPrice(product.price * product.quantity * 1.2) }}
                                    </div>

                                    <button v-if="true" @click="addToCart(product)"
                                        class="btn flex justify-center items-center gap-x-2 self-end w-40">
                                        <i class="material-icons">add_shopping_cart</i>
                                        <span class="font-semibold">Add to cart</span>
                                    </button>
                                    <button v-else @click="addToCart(product)"
                                        class="btn flex justify-center items-center gap-x-2 self-end w-40">
                                        <i class="material-icons">add_shopping_cart</i>
                                        <span class="font-semibold">Pay now</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "My Orders - Products Store"
});

import { productsStore } from '~/store/productsStore';

const { $toast } = useNuxtApp();

const store = productsStore();

const { orders } = storeToRefs(store);

const products = ref([]);
const loading = ref(true);
const ordersHistory = ref([]);

const fetchProducts = async () => {
    loading.value = true;

    try {
        const orderedProducts = await Promise.all(
            orders.value.map(async (order) => {
                const products = await Promise.all((
                    order.products.map(async (product) => {
                        const productData = await $fetch(`https://fakestoreapi.com/products/${product.productId}`);
                        return {
                            ...productData,
                            quantity: product.quantity
                        }
                    })
                ))
                return {
                    ...order,
                    products
                }
            }
            )
        );
        ordersHistory.value = orderedProducts.reverse();
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

fetchProducts();
</script>

<style scoped>
.loading-screen {
    @apply flex justify-center;
    height: calc(100vh - 156px);
}

.products {
    @apply grid gap-4 2xl:grid-cols-2;

    .product {
        @apply bg-white shadow-md rounded-lg px-6 py-4 min-h-[15rem];

        .order-detail {
            @apply flex justify-between items-center pb-4 mb-4 border-b border-b-gray-200;

            h3 {
                @apply font-bold text-xl sm:text-2xl;
            }

            p {
                @apply text-sm border-r border-r-gray-300 pr-3 hidden sm:block;
            }
        }

        .product-content {
            @apply flex flex-col items-center justify-between gap-4 md:flex-row;

            img {
                @apply max-w-[150px] max-h-[150px] w-full;
            }

            .product-details {
                @apply max-w-[45rem] flex flex-col gap-4 w-full md:w-[70%];

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
}

.quantity {
    @apply flex items-center gap-2;
}
</style>