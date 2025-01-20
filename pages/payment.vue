<template>
    <div class="container flex flex-col lg:flex-row gap-4">
        <div class="left-side">
            <div class="address">
                <h2>Shipping address</h2>
                <div class="address-content">
                    <p><span>Name: </span> {{ userData.name?.firstname + " " + userData.name?.lastname }}</p>
                    <p><span>Phone: </span> {{ userData?.phone }}</p>
                </div>
                <div class="address-content">
                    <p><span>City: </span> {{ userData.address?.city }}</p>
                    <p><span>Street: </span> {{ userData.address?.street }}</p>
                </div>
                <div class="address-content">
                    <p><span>Number: </span> {{ userData.address?.number }}</p>
                    <p><span>Zipcode: </span> {{ userData.address?.zipcode }}</p>
                </div>
            </div>
            <div class="payment-methods">
                <h2>Payment Methods</h2>
            </div>
            <div class="shipping-method">
                <h2>Shipping Method</h2>
                <p>Shipping: {{ shippingFee > 0 ? `${formattedPrice(shippingFee)}` : "Free shipping" }} </p>
                <p>Estimated delivery: 1 month</p>
            </div>
            <div class="products">
                <div v-for="product in checkoutCart" :key="product.id">
                    <ProductCard :product="product" :disabled="true" />
                </div>
            </div>
        </div>
        <div class="right-side">
            <div class="overview">
                <h2 class="text-2xl font-semibold mb-4 text-primary">Summary</h2>
                <p class="font-semibold text-xl flex justify-between">
                    <span>Subtotal:</span>
                    <span>{{ formattedPrice(subTotal) }}</span>
                </p>
                <p class="font-semibold text-xl flex justify-between">
                    <span>Shipping fee:</span>
                    <span>{{ shippingFee === 0 ? "Free" : "$5.00" }}</span>
                </p>
                <p class="font-semibold text-xl flex justify-between">
                    <span>Tax:</span>
                    <span>{{ formattedPrice(tax) }}</span>
                </p>
                <p class="font-semibold text-xl flex justify-between">
                    <span>Total saved:</span>
                    <span class="text-red-500"> -{{ formattedPrice(totalSaved) }}</span>
                </p>
                <p class="font-bold text-2xl flex justify-between pt-4 border-t border-t-gray">
                    <span>Total price:</span>
                    <span>{{ formattedPrice(totalValue) }}</span>
                </p>
                <button @click="checkout" class="btn w-full">
                    <span class="font-semibold text-lg">Place order</span>
                </button>
            </div>
            <div class="safety">
                <div class="security-content">
                    <div class="item">
                        <IconsSecurity />
                        <h3>Products Store</h3>
                    </div>
                    <p>Products Store keeps your information and payment safe.</p>
                </div>
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
</template>

<script setup>
import { productsStore } from '~/store/productsStore';
import { storeToRefs } from 'pinia';

definePageMeta({
    middleware: "payment"
});

useHead({
    title: "Payment - Products Store"
});

const router = useRouter();
const { $toast } = useNuxtApp();

const store = productsStore();

const { subTotal, shippingFee, tax, totalSaved, totalValue, checkoutCart } = storeToRefs(store);

const loginToken = useCookie("loginToken");

const userData = ref({});

// Caso precise carregar do lado do client
// onMounted(async () => {
//     const data = await $fetch('https://fakestoreapi.com/users/2');
//     userData.value = data;
// });

const { data } = await useFetch('https://fakestoreapi.com/users/2');
userData.value = data.value;

const completePurchase = () => {
    if (!loginToken.value) {
        router.push("/login").then(() => {
            $toast.warning("Login is required");
        });
        return
    }

    try {
        // store.checkout();
        router.push({ path: "/" }).then(() => {
            $toast.success("Purchase completed!");
        });
    } catch (error) {
        $toast.error("There was an error processing your request");
    }
}
</script>

<style scoped>
.left-side {
    @apply space-y-4 lg:w-[70%];

    .address {
        @apply shadow-md rounded-lg bg-white flex flex-col justify-between p-6;

        h2 {
            @apply text-xl font-bold mb-4;
        }

        .address-content {
            @apply grid grid-cols-2 max-w-[25rem];

            p span {
                @apply font-semibold;
            }
        }
    }

    .payment-methods {
        @apply shadow-md rounded-lg bg-white flex flex-col justify-between p-6;

        h2 {
            @apply text-xl font-bold mb-4;
        }
    }

    .shipping-method {
        @apply shadow-md rounded-lg bg-white flex flex-col justify-between p-6;

        h2 {
            @apply text-xl font-bold mb-4;
        }

        p {
            @apply font-semibold;
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
    }

    .security,
    .safety {
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