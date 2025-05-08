<template>
    <div>
        <div class="max-w-4xl mx-auto space-y-4">
            <ShippingAddress />
            <div class="payment-methods">
                <h2>Credit card</h2>
                <span v-if="loading" class="skeleton-loader max-w-[26rem]"></span>
                <div v-else class="relative w-full h-52 bg-gray-200 p-4 flex justify-center items-center md:w-1/2">
                    <p v-if="!Object.keys(creditCard).length" @click="modal = true"
                        class="flex gap-2 font-bold cursor-pointer">
                        <i class="material-icons">add_circle_outline</i>
                        Add new card
                    </p>
                    <div v-else>
                        <span>{{ formattedCreditcard(creditCard.cardNumber) }}</span>
                        <i @click="modalDelete = true"
                            class="material-icons cursor-pointer duration-300 absolute top-6 right-8 hover:text-red-500">delete</i>
                    </div>
                </div>
            </div>
        </div>
        <CreditCardModal :modal="modal" :disabledInputs="true" @close-modal="closeModal"
            @addCreditcardInfo="addCreditcardInfo" />
        <Modal :isVisible="modalDelete" @close="modalDelete = false">
            <div class="flex flex-col gap-4 items-center justify-between lg:-mb-4">
                <h3 class="text-2xl font-bold text-center">Remove</h3>
                <i class="material-icons text-yellow-400 text-[5rem]">warning</i>
                <p class="text-center max-w-lg text-gray-700 mb-4">
                    Are you sure you want to remove this credit card? This action cannot be undone.
                </p>
                <button @click="deleteCreditcard"
                    class="btn w-full hover:bg-[#11c091] !text-white max-w-[15rem]">Remove</button>
                <button @click="modalDelete = false"
                    class="btn border-primary !bg-white !text-primary w-full max-w-[15rem]">Cancel</button>
            </div>
        </Modal>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

useHead({
    title: "Account Details - Products Store"
});

import { productsStore } from '~/store/productsStore';

const { $toast } = useNuxtApp();

const store = productsStore();

const creditCard = ref({});

const loading = ref(true);

const modal = ref(false);
const modalDelete = ref(false);

const closeModal = () => {
    modal.value = false;
}

const addCreditcardInfo = (data) => {
    loading.value = true;
    if (data) {
        creditCard.value.cardNumber = data.cardNumber;
        creditCard.value.id = data.id;
    }

    loading.value = false;
}

const deleteCreditcard = async () => {
    try {
        await store.removeCreditCard(creditCard.value.id);
        creditCard.value = {};
        modalDelete.value = false;
        $toast.success("Card removed successfully!");
    } catch (error) {
        console.error(error);
        $toast.success("Failed to remove the card. Please try again.");
    }
}
</script>

<style scoped>
.payment-methods {
    @apply shadow-md rounded-lg bg-white flex flex-col gap-1.5 justify-between p-6;

    h2 {
        @apply text-2xl font-bold mb-4 text-primary;
    }
}
</style>