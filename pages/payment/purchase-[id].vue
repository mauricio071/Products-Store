<template>
    <div class="content">
        <div v-if="loading" class="loader-primary"></div>
        <div v-else class="payment-container">
            <template v-if="order.status === 'To pay'">
                <h1>Awaiting payment</h1>
                <div class="space-y-2">
                    <h3><span class="font-bold">Order ID: </span> {{ order.id }}</h3>
                    <h2>Total value: {{ formattedPrice(pixValue) }}</h2>
                </div>
                <img :src="qrCode" alt="QR Code Pix" v-if="qrCode" />
                <div class="flex flex-col gap-4 sm:flex-row sm:gap-2">
                    <input :value="pixCode" type="text" disabled>
                    <button @click="copyToClipboard" class="btn font-bold flex items-center gap-2">
                        <i class="material-icons">content_copy</i>
                        Copy code
                    </button>
                </div>
                <p class="max-w-xl">
                    To make the payment for your order, scan the <strong>QR code</strong> or copy and paste the
                    <strong>Pix code</strong> into your payment app.
                </p>
                <p>
                    (This is a fake Pix code, click
                    <span @click="completeTransaction"
                        class="text-blue-500 font-bold duration-300 cursor-pointer hover:text-blue-700">
                        here
                    </span>
                    to continue)
                </p>
            </template>
            <template v-if="order.status === 'Canceled'">
                <h1>Canceled</h1>
                <i class="material-icons text-red-500 text-[120px]">cancel</i>
                <p>
                    Your order has been canceled. We apologize for any inconvenience caused
                    and hope to serve you in the future.
                </p>
                <p>
                    Click
                    <nuxt-link :to="`/myOrders`"
                        class="text-blue-500 font-bold duration-300 cursor-pointer hover:text-blue-700">
                        here
                    </nuxt-link>
                    to see more details about your order.
                </p>
            </template>
            <template v-if="order.status === 'Completed' || order.status === 'To receive'">
                <h1>Payment confirmed</h1>
                <i class="material-icons text-green-500 text-[120px]">check_circle</i>
                <p>
                    Your payment has been successfully completed! Thank you for your purchase.
                </p>
                <p>
                    Click
                    <nuxt-link :to="`/myOrders`"
                        class="text-blue-500 font-bold duration-300 cursor-pointer hover:text-blue-700">
                        here
                    </nuxt-link>
                    to see more details about your order.
                </p>
            </template>
            <nuxt-link to="/"
                class="flex items-center gap-2 mt-4 text-blue-500 font-bold duration-300 hover:text-blue-700">
                <i class="material-icons">arrow_back</i>
                Back to Home
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '~/store/productsStore';
import { generatePixQrCode } from '~/services/pixService';

definePageMeta({
    middleware: 'auth'
});

useHead({
    title: "Payment - Products Store"
});

const { $toast } = useNuxtApp();
const $route = useRoute();
const store = productsStore();
const { dollar } = storeToRefs(store)

const order = ref(null);
const qrCode = ref(null);
const pixCode = ref(null);
const loading = ref(true);
const pixValue = ref(null);

onMounted(async () => {
    loading.value = true;
    try {
        order.value = await store.getOrder($route.params.id);
        const data = await store.completeOrder(order.value);

        order.value = data;
        pixValue.value = order.value.totalValue;

        const pixData = {
            value: pixValue.value * dollar.value,
        };
        const result = await generatePixQrCode(pixData);
        qrCode.value = result.qrCode;
        pixCode.value = result.payload;
    } catch (e) {
        console.log(e);
    } finally {
        loading.value = false;
    }
});

const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
        $toast.success("Pix code copied to clipboard");
    });
}

const completeTransaction = () => {
    store.confirmPayment($route.params.id);
    order.value.status = "To receive";
    $toast.success("Payment confirmed successfully!");
}
</script>

<style scoped>
.content {
    @apply bg-white shadow-lg rounded-lg flex flex-col justify-center p-8;
    min-height: calc(100vh - 248px);

    .payment-container {
        @apply flex flex-col justify-center items-center gap-4 text-center;


        h1 {
            @apply text-primary font-extrabold text-2xl md:text-3xl;
        }

        h2 {
            @apply font-bold text-xl md:text-2xl;
        }

        img {
            @apply my-1;
        }

        input {
            @apply cursor-text p-2 rounded-lg bg-gray-200;
        }
    }
}
</style>