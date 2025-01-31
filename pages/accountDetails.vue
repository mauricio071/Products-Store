<template>
    <div>
        <div v-if="loading" class="loading-screen">
            <span v-if="loading" class="loader-primary"></span>
        </div>
        <div v-else class="max-w-4xl mx-auto space-y-4">
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
                <h2>Credit card</h2>
                <div class="relative w-full  h-52 bg-gray-200 p-4 flex justify-center items-center md:w-1/2">
                    <p v-if="!creditCard" @click="modal = true" class="flex gap-2 font-bold cursor-pointer">
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
        <CreditCardModal :modal="modal" :disabledInputs="true" @close-modal="closeModal" />
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
useHead({
    title: "Account Details - Products Store"
});

import { productsStore } from '~/store/productsStore';

const { $toast } = useNuxtApp();

const store = productsStore();

const { wishList, creditCard } = storeToRefs(store);

const products = ref([]);
const loading = ref(true);

const userData = ref({});

const modal = ref(false);
const modalDelete = ref(false);

const closeModal = () => {
    modal.value = false;
}

const { data } = await useFetch('https://fakestoreapi.com/users/2');
userData.value = data.value;
loading.value = false;

const deleteCreditcard = () => {
    store.removeCreditCard();
    modalDelete.value = false;
    $toast.success("Card removed successfully!");
}
</script>

<style scoped>
.loading-screen {
    @apply flex justify-center;
    height: calc(100vh - 156px);
}

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
</style>