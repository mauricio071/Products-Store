<template>
    <div>
        <div v-if="cart.length < 1" class="text-center" style="height: calc(100vh - 160px);">
            <div class="text-4xl mb-8">
                Your cart is empty!
            </div>
            <nuxt-link to="/" class="text-2xl btn">
                See products
            </nuxt-link>
        </div>
        <div v-else class="container flex flex-col lg:flex-row gap-4">
            <div class="left-side">
                <div class="cart-amount">
                    <h1>Shopping cart ({{ cart.length }})</h1>
                    <div class="flex items-center max-w-sm">
                        <label class="checkbox border-r border-r-gray-300 pr-4 mr-4">
                            <input v-model="selectAll" @click="store.checkAllProduct" type="checkbox" id="select-all">
                            <span class="check"></span>
                            Select all items
                        </label>
                        <p @click="store.deleteCheckedProducts" class="delete-items">Delete selected items</p>
                    </div>
                </div>
                <div class="products">
                    <div v-for="product in cart" :key="product.id">
                        <ProductCard :product="product" />
                    </div>
                </div>
            </div>
            <div class="right-side">
                <div class="overview">
                    <h2 class="text-2xl font-semibold mb-4 text-primary">Summary</h2>
                    <p v-if="subTotal > 0" class="font-semibold text-xl flex justify-between">
                        <span>Subtotal:</span>
                        <span>${{ subTotal }}</span>
                    </p>
                    <p v-if="subTotal > 0" class="font-semibold text-xl flex justify-between">
                        <span>Shipping fee:</span>
                        <span>$5.0</span>
                    </p>
                    <p v-if="subTotal > 0" class="font-semibold text-xl flex justify-between">
                        <span>Tax:</span>
                        <span>${{ tax }}</span>
                    </p>
                    <p v-if="subTotal > 0"
                        class="font-semibold text-xl flex justify-between pb-4 border-b border-b-gray">
                        <span>Total saved:</span>
                        <span class="text-red-500"> -$ {{ totalSaved }}</span>
                    </p>
                    <p class="font-bold text-2xl flex justify-between">
                        <span>Total price:</span>
                        <span>${{ subTotal > 0 ? totalValue : 0 }}</span>
                    </p>
                    <button @click="checkout" :class="{ 'opacity-40 cursor-not-allowed': checkoutCart.length === 0 }"
                        class="btn btn-checkout" :disabled="checkoutCart.length === 0">
                        <span class="font-semibold text-lg">Checkout ({{ checkoutCart.length }})</span>
                    </button>
                </div>
                <div class="security">
                    <div class="security-content">
                        <div class="item">
                            <IconsPackage />
                            <h3>Fast delivery</h3>
                        </div>
                        <p>Receive your orders quickly with our efficient and reliable delivery service.</p>
                    </div>
                    <div class="security-content">
                        <div class="item">
                            <IconsShield />
                            <h3>Security & Privacy</h3>
                        </div>
                        <p>Your data is always protected with the highest security and privacy standards.</p>
                    </div>
                    <div class="security-content">
                        <div class="item">
                            <IconsLock />
                            <h3>Safe Payments</h3>
                        </div>
                        <img src="/assets/safe-payment.png" alt="safe-payment">
                        <p>Make payments with confidence using our secure and encrypted payment system.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '~/store/productsStore';
import { storeToRefs } from 'pinia'
const router = useRouter();
const { $toast } = useNuxtApp();

const store = productsStore();

const { cart, subTotal, tax, totalSaved, totalValue, checkoutCart, selectAll } = storeToRefs(store);

const loginToken = useCookie("loginToken");

const checkout = () => {
    if (!loginToken.value) {
        router.push("/login").then(() => {
            $toast.warning("Login is required");
        });
        return
    } else {
        router.push("/payment");
    }
}
</script>

<style scoped>
.left-side {
    @apply space-y-4 lg:w-[70%];

    .cart-amount {
        @apply p-6;

        h1 {
            @apply font-bold mb-6 lg:text-3xl;
        }

        p,
        label {
            @apply cursor-pointer;
        }

        p.delete-items {
            @apply font-bold underline text-blue-500;
        }
    }

    .products {
        @apply flex flex-col gap-4;
    }
}

.right-side {
    @apply flex flex-col gap-4 lg:w-[30%];

    .overview {
        @apply bg-white shadow-md rounded-lg p-6 w-full space-y-4;

        button.btn-checkout {
            @apply w-full;

            &:disabled:hover {
                @apply bg-primary text-white;
            }
        }
    }

    .security {
        @apply bg-white shadow-md rounded-lg p-6 flex flex-col gap-4;

        h3 {
            @apply text-lg font-bold;
        }

        .security-content {
            @apply border-b border-b-slate-200 pb-4;

            .item {
                @apply flex gap-3 items-center mb-2;
            }

            img {
                @apply my-4;
            }

            &:last-of-type {
                @apply border-none pb-0;
            }
        }
    }
}
</style>