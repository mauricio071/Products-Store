<template>
    <div>
        <div v-if="productsAmount < 1" class="text-center" style="height: calc(100vh - 160px);">
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
                    <h1>Shopping cart ({{ productsAmount }})</h1>
                    <p @click="store.removeAllProduct">Remove all itens</p>
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
                    <p class="font-semibold text-xl flex justify-between">
                        <span>Subtotal:</span>
                        <span>${{ subTotal }}</span>
                    </p>
                    <p class="font-semibold text-xl flex justify-between">
                        <span>Shipping fee:</span>
                        <span>$5.0</span>
                    </p>
                    <p class="font-semibold text-xl flex justify-between">
                        <span>Tax:</span>
                        <span>${{ tax }}</span>
                    </p>
                    <p class="font-semibold text-xl flex justify-between">
                        <span>Total saved:</span>
                        <span class="text-red-500"> -$ {{ totalSaved }}</span>
                    </p>
                    <p class="font-bold text-2xl flex justify-between pt-4 border-t border-t-gray">
                        <span>Total price:</span>
                        <span>${{ totalValue }}</span>
                    </p>
                    <button @click="checkout" class="btn w-full">
                        <span class="font-semibold text-lg">Checkout</span>
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

const { cart, productsAmount, subTotal, tax, totalSaved, totalValue } = storeToRefs(store);

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
        @apply flex justify-between items-center sm:px-8 py-6;

        h1 {
            @apply font-bold mb-0 lg:text-3xl;
        }

        p {
            @apply font-bold underline cursor-pointer;
        }
    }

    .products {
        @apply flex flex-col gap-4;
    }
}

.right-side {
    @apply flex flex-col gap-4 lg:w-[30%];

    .overview {
        @apply bg-white shadow-md rounded-lg p-4 w-full h-full space-y-4;
    }

    .security {
        @apply bg-white shadow-md rounded-lg px-6 py-8 flex flex-col gap-4;

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