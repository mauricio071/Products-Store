<template>
    <div class="content">
        <div v-if="loading" class="loader-primary"></div>
        <div v-else class="payment-container">
            <h1>AWAITING PAYMENT</h1>
            <h2>Total value: {{ formattedPrice(pixValue) }}</h2>
            <!-- TODO -->
            <!-- <p class="font-semibold">This code is valid for 24 hours</p> -->
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
                <nuxt-link to="/" class="text-blue-500 font-bold duration-300 hover:text-blue-700">
                    here
                </nuxt-link>
                to continue)
            </p>
            <nuxt-link to="/"
                class="flex items-center gap-2 mt-4 text-blue-500 font-bold duration-300 hover:text-blue-700">
                <i class="material-icons ">arrow_back</i>
                Back to Home
            </nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '~/store/productsStore';
import { generatePixQrCode } from '~/services/pixService';

definePageMeta({
    middleware: 'payment-pix'
});

useHead({
    title: "Payment - Products Store"
});

const { $toast } = useNuxtApp();
const $route = useRoute();
const store = productsStore();

const { orders } = storeToRefs(store);

const qrCode = ref(null);
const pixCode = ref(null);
const loading = ref(true);
const pixValue = ref(null);

// finalValue.value = totalValue.value;

onMounted(async () => {
    loading.value = true;
    try {
        const order = orders.value.find((order) => order.id === $route.params.id);
        pixValue.value = order.totalValue;
        const pixData = {
            value: 0.01,
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