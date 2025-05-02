<template>
    <div>
        <div v-if="loading" class="loading-screen">
            <span class="loader-primary"></span>
        </div>
        <div v-else class="max-w-4xl mx-auto space-y-4">
            <ShippingAddress />
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
        <CreditCardModal :modal="modal" :disabledInputs="true" @close-modal="closeModal"
            @addCreditcardInfo="completed" />
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

import { collection, getDocs, query, where } from 'firebase/firestore';
import { productsStore } from '~/store/productsStore';

const { $toast, $auth, $db } = useNuxtApp();

const store = productsStore();

const { creditCard } = storeToRefs(store);

const loading = ref(false);

const modal = ref(false);
const modalDelete = ref(false);

const closeModal = () => {
    modal.value = false;
}

const completed = () => {
    $toast.success("Card added successfully!");
}

const deleteCreditcard = () => {
    store.removeCreditCard();
    modalDelete.value = false;
    $toast.success("Card removed successfully!");
}

// onMounted(async () => {
//     loading.value = true;
//     try {
//         const addressInfoCollection = collection($db, "addressInfo");
//         const addressInfoQuery = query(
//             addressInfoCollection,
//             where("uid", "==", $auth.currentUser.uid)
//         );
//         const querySnapShot = await getDocs(addressInfoQuery);
//         const addressInfoFire = querySnapShot.docs.map((doc) => ({
//             ...doc.data(),
//             id: doc.id,
//         }))[0];

//         addressInfoFire && addressSaved(addressInfoFire);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         loading.value = false;
//     }
// });
</script>

<style scoped>
.payment-methods {
    @apply shadow-md rounded-lg bg-white flex flex-col gap-1.5 justify-between p-6;

    h2 {
        @apply text-2xl font-bold mb-4 text-primary;
    }
}
</style>