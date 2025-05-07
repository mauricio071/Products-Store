<template>
    <div>
        <div v-if="loading" class="loading-screen">
            <span class="loader-primary"></span>
        </div>
        <div v-else class="max-w-5xl mx-auto flex flex-col gap-6">
            <div class="card status">
                <h1>{{ order.status }}</h1>
                <p v-if="order.status === 'To pay'">
                    Your order is awaiting payment. Please complete the payment to proceed.
                </p>
                <p v-if="order.status === 'To receive'">
                    Your order has been shipped and is on its way to you. Please wait for delivery.
                </p>
                <p v-if="order.status === 'Completed'">
                    Your order has been successfully completed. Thank you for shopping with us!
                </p>
                <p v-if="order.status === 'Canceled'">
                    Your order has been canceled. We apologize for any inconvenience caused
                    and hope to serve you in the future.
                </p>
                <div class="flex gap-4">
                    <nuxt-link v-if="order.status === 'To pay'" :to="`/payment/purchase-${order.id}`">
                        <button class="btn rounded-xl hover:bg-primary hover:text-white">
                            <span class="font-semibold text-lg">Pay now</span>
                        </button>
                    </nuxt-link>
                    <button v-else @click="addToCart(productData)"
                        class="btn rounded-xl hover:bg-primary hover:text-white">
                        <span class="font-semibold text-lg">Add to cart</span>
                    </button>
                    <button v-if="order.status !== 'Completed' && order.status !== 'Canceled'" @click="modal = true"
                        class="btn rounded-xl border-primary bg-white text-primary">
                        <span class="font-semibold text-lg">Cancel order</span>
                    </button>
                </div>
            </div>
            <div class="card security">
                <div class="security-content">
                    <div class="item">
                        <IconsPackage />
                        <h3>Fast delivery</h3>
                    </div>
                    <p>Receive your orders quickly with our efficient and reliable delivery service.</p>
                </div>
                <div class="security-content">
                    <div class="item">
                        <IconsUndo class="text-[#4CAF50]" />
                        <h3>Free returns</h3>
                    </div>
                    <p>Return your items for free within the return period. No hassle, no extra cost.</p>
                </div>
                <div class="security-content">
                    <div class="item">
                        <IconsVeirified class="text-[#2196F3]" />
                        <h3>Buyer Protection</h3>
                    </div>
                    <p>Shop with confidence. We ensure secure transactions and safeguard your purchases.</p>
                </div>
            </div>
            <div class="card address">
                    <h2>
                        <IconsMappin />
                        Shipping address
                    </h2>
                    <div class="address-content">
                        <p><span>Name: </span> {{ order.address.name }}</p>
                    <p><span>Phone: </span> {{ order.address.phone }}</p>
                    <p><span>Zipcode: </span> {{ order.address.zipCode }}</p>
                    <p><span>State: </span> {{ order.address.state }}</p>
                    <p><span>City: </span> {{ order.address.city }}</p>
                    <p><span>Neighborhood: </span> {{ order.address.neighborhood }}</p>
                    <p><span>Street name: </span> {{ order.address.streetName }}</p>
                    <p><span>Street number: </span> {{ order.address.streetNumber }}</p>
                    </div>
                </div>
            <div class="card order-info">
                    <h2>
                        <IconsDocument />
                        Order info
                    </h2>
                    <div class="info-content">
                        <p><span>Order ID: </span> {{ order.id }}</p>
                    </div>
                    <div class="info-content">
                        <p><span>Order date: </span> {{ order.date }}</p>
                    </div>
                    <div v-if="order.status === 'To receive'" class="info-content">
                        <p><span>Estimated date: </span> {{ order.estimatedDate }}</p>
                    </div>
                    <div v-if="order.status === 'completed'" class="info-content">
                        <p><span>Order completed on: </span> {{ order.estimatedDate }}</p>
                    </div>
                    <div class="info-content">
                        <p><span>Payment method: </span> {{ order.paymentMethod }}</p>
                    </div>
                </div>
            <div class="card product">
                <div class="product-content">
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
                        </div>
                        <div class="price flex justify-between items-center gap-4">
                            <p class="text-lg font-semibold">
                                Price: {{ formattedPrice(product.price) }}
                            </p>
                        </div>
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <h3>Quantity:</h3>
                            <span>{{ product.quantity }}</span>
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
                <div class="product-price">
                    <div class="price-container">
                        <p>
                            <span>Subtotal: </span>
                            {{ formattedPrice(product.price * product.quantity) }}
                        </p>
                        <p>
                            <span>Shipping: </span>
                            {{ order.shippingFee === 0 ? "Free" : `${formattedPrice(order.shippingFee)}` }}
                        </p>
                        <p>
                            <span>Tax total: </span>
                            {{ formattedPrice(product.price * product.quantity * 0.2) }}
                        </p>
                        <p class="!font-bold !text-lg !text-black">
                            <span>Total: </span>
                            {{ formattedPrice(product.price * product.quantity * 1.2 + order.shippingFee) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Modal :isVisible="modal" @close="closeModal">
            <div class="flex flex-col gap-4 items-center justify-between lg:-mb-4">
                <h3 class="text-2xl font-bold text-center">Cancel order</h3>
                <i class="material-icons text-yellow-400 text-[5rem]">warning</i>
                <p class="text-center max-w-lg text-gray-700 mb-4">
                    Are you sure you want to cancel this order? Once canceled,
                    it will no longer be processed or delivered.
                </p>
                <button @click="cancelOrder"
                    class="btn w-full max-w-[15rem] hover:bg-[#11c091] !text-white">Confirm</button>
                <button @click="closeModal"
                    class="btn border-primary !bg-white !text-primary w-full max-w-[15rem]">Cancel</button>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { productsStore } from '~/store/productsStore';

definePageMeta({
    middleware: 'auth'
});

useHead({
    title: "Details - Products Store"
});

const $route = useRoute();
const { $toast } = useNuxtApp();

const order = ref({});

const userData = ref({});
const loading = ref(true);
const product = ref(null);
const productData = ref(null)

const store = productsStore();

const modal = ref(false);

const closeModal = () => {
    modal.value = false;
}

const userDataFetch = async () => {
    try {
        const data = await $fetch('https://fakestoreapi.com/users/2');
        userData.value = data;
    } catch (e) {
        console.log(e);
    }
}

const getOrderDetails = async () => {
    const orderId = $route.params.id.slice(0, -1);
    const productId = $route.params.id.at(-1);
    order.value = await store.getOrder(orderId);

    const data = await $fetch(`https://fakestoreapi.com/products/${productId}`);
    const additionalData = order.value.products.find((product) => product.productId === Number(productId));
    productData.value = data;

    const formattedData = {
        ...data,
        ...additionalData
    }

    product.value = formattedData;
}

const cancelOrder = async () => {
    await store.cancelOrder(order.value.id);
    closeModal();
    getOrderDetails();
    $toast.success("Order canceled!");
}

const addToCart = (product) => {
    try {
        store.addProduct(product, 1);
        $toast.success("Product added!");
    } catch (error) {
        $toast.error("There was an error processing your request");
    }
}

onMounted(async () => {
    loading.value = true;
    await userDataFetch();
    await getOrderDetails();
    await store.completeOrder(order.value);
    loading.value = false;

})
</script>

<style scoped>
.card {
    @apply p-6 mb-0;
}

.status {
    @apply flex flex-col gap-3;

    h1 {
        @apply font-extrabold text-2xl mb-0;
    }
}

.security {
    @apply flex flex-col gap-4;

    h3 {
        @apply text-lg font-bold;
    }

    .security-content {
        @apply border-b border-b-slate-200 pb-4;

        .item {
            @apply flex gap-3 items-center mb-2;
        }

        &:last-of-type {
            @apply border-none pb-0;
        }
    }
}

.address {
    @apply flex flex-col gap-1.5 justify-between p-6;

    h2 {
        @apply text-2xl font-bold mb-4 text-primary flex items-center gap-2;
    }

    .address-content {
        @apply grid grid-cols-2 gap-1;

        p {
            span {
                @apply font-bold text-lg;
            }
        }
    }
}

.product {
    @apply bg-white shadow-md rounded-lg p-6 min-h-[15rem];

    .product-price {
        @apply pt-6 mt-6 border-t border-t-gray-200;

        .price-container {
            @apply flex flex-col gap-2 max-w-xs ml-auto;

            p {
                @apply flex items-center justify-between text-gray-400 text-sm;
            }
        }
    }

    .product-content {
        @apply flex flex-col items-center justify-between gap-4 md:flex-row;

        img {
            @apply max-w-[150px] max-h-[150px] w-full;
        }

        .product-details {
            @apply max-w-[45rem] flex flex-col gap-4 w-full md:w-[70%];

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

.order-info {
    @apply flex flex-col gap-1.5 justify-between p-6;

    h2 {
        @apply text-2xl font-bold mb-4 text-primary flex items-center gap-2;
    }

    .info-content {
        @apply flex gap-2;

        p {
            span {
                @apply font-bold text-lg;
            }
        }
    }
}
</style>