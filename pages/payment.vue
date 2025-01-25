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
                <div class="custom-radio">
                    <label class="radiobutton">
                        <input v-model="paymentMethod" value="pix" type="radio">
                        <span>
                            <IconsPix class="w-8 h-6" />
                            Pix
                        </span>
                    </label>
                    <label class="radiobutton">
                        <input v-model="paymentMethod" value="credit_card" type="radio">
                        <span>
                            <IconsCreditCard class="w-8 h-6" />
                            Credit Card
                        </span>
                    </label>
                </div>
            </div>
            <div class="shipping-method">
                <h2>Shipping Method</h2>
                <p>
                    <span>Shipping:</span> {{ shippingFee > 0 ? `${formattedPrice(shippingFee)}` : "Free shipping" }}
                </p>
                <p><span>Estimated delivery:</span> 1 week</p>
            </div>
            <div class="products">
                <div v-for="product in checkoutCart" :key="product.id">
                    <ProductCard :product="product" :disabled="true" />
                </div>
            </div>
        </div>
        <div class="right-side">
            <div class="overview">
                <h2 class="text-2xl font-bold mb-4 text-primary">Summary</h2>
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
                <button @click="completePurchase" :disabled="paymentMethod === ''"
                    :class="{ 'opacity-40 cursor-not-allowed': paymentMethod === '' }"
                    class="btn w-full disabled:hover:bg-primary disabled:hover:text-white">
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
import { nanoid } from 'nanoid';

definePageMeta({
    middleware: "payment"
});

useHead({
    title: "Payment - Products Store"
});

const router = useRouter();
const { $toast } = useNuxtApp();

const store = productsStore();

const { cart, subTotal, shippingFee, tax, totalSaved, totalValue, checkoutCart, orders } = storeToRefs(store);

const loginToken = useCookie("loginToken");

const userData = ref({});

const paymentMethod = ref('');

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

    const transactionId = nanoid(12);
    const today = new Date();
    const formattedDateTime = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
    const estimatedDate = new Date();
    estimatedDate.setDate(today.getDate() + 7);
    const formattedEstimatedDate = `${estimatedDate.getFullYear()}-${(estimatedDate.getMonth() + 1).toString().padStart(2, '0')}-${estimatedDate.getDate().toString().padStart(2, '0')} ${estimatedDate.getHours().toString().padStart(2, '0')}:${estimatedDate.getMinutes().toString().padStart(2, '0')}`;

    const data = {
        id: transactionId,
        date: formattedDateTime,
        estimatedDate: formattedEstimatedDate,
        totalValue: totalValue.value,
        status: "To pay",
        paymentMethod: paymentMethod.value,
        products: cart.value.map((product) => ({
            productId: product.id,
            quantity: product.quantity
        }))
    }

    switch (paymentMethod.value) {
        case "pix":
            store.checkout(data);
            router.push({ path: `/paymentPix/${data.id}` }).then(() => {
                $toast.success("Purchase completed successfully");
                store.emptyShoppingCart();
            });
            break;
    }
}
</script>

<style scoped>
.left-side {
    @apply space-y-4 lg:w-[70%];

    .address {
        @apply shadow-md rounded-lg bg-white flex flex-col gap-1.5 justify-between p-6;

        h2 {
            @apply text-2xl font-bold mb-4 text-primary;
        }

        .address-content {
            @apply grid grid-cols-2 max-w-[28rem];

            p {
                span {
                    @apply font-bold text-lg;
                }
            }
        }
    }

    .payment-methods {
        @apply shadow-md rounded-lg bg-white flex flex-col gap-1.5 justify-between p-6;

        h2 {
            @apply text-2xl font-bold mb-4 text-primary;
        }
    }

    .shipping-method {
        @apply shadow-md rounded-lg bg-white flex flex-col gap-1.5 justify-between p-6;

        h2 {
            @apply text-2xl font-bold mb-4 text-primary;
        }

        p {
            span {
                @apply font-bold text-lg;
            }
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