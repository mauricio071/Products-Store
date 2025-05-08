<template>
    <div>
        <EmptyScreen v-if="cart.length < 1" message="Your cart is empty!" />
        <div v-else class="container flex flex-col lg:flex-row gap-4">
            <div class="left-side">
                <div class="title-container">
                    <h1>Shopping cart ({{ cart.length }})</h1>
                    <div class="flex items-center max-w-sm">
                        <label class="checkbox ">
                            <input v-model="selectAll" @click="store.checkAllProduct" type="checkbox" id="select-all">
                            <span class="check"></span>
                            Select all items
                        </label>
                        <p v-if="checkedAny" @click="modal = true" class="delete-items">
                            Delete selected items
                        </p>
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
                    <h2 class="text-2xl font-bold mb-4 text-primary">Summary</h2>
                    <p v-if="subTotal > 0" class="font-semibold text-xl flex justify-between">
                        <span>Subtotal:</span>
                        <span>{{ formattedPrice(subTotal) }}</span>
                    </p>
                    <p v-if="subTotal > 0"
                        class="font-semibold text-xl flex justify-between pb-4 border-b border-b-gray">
                        <span>Total saved:</span>
                        <span class="text-red-500"> -{{ formattedPrice(totalSaved) }}</span>
                    </p>
                    <p class="font-bold text-2xl flex justify-between">
                        <span>Estimated total:</span>
                        <span>{{ formattedPrice(subTotal) }}</span>
                    </p>
                    <p v-if="subTotal > 0" class="font-semibold text-xl flex justify-between text-gray-500">
                        <span>Estimated tax:</span>
                        <span>{{ formattedPrice(tax) }}</span>
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
        <Modal :isVisible="modal" @close="closeModal">
            <div class="flex flex-col gap-4 items-center justify-between lg:-mb-4">
                <h3 class="text-2xl font-bold text-center">Remove</h3>
                <i class="material-icons text-yellow-400 text-[5rem]">warning</i>
                <p class="text-center max-w-lg text-gray-700 mb-4">
                    This action will remove checked items from your shopping cart.
                </p>
                <button @click="removeProducts"
                    class="btn w-full hover:bg-[#11c091] !text-white max-w-[15rem]">Remove</button>
                <button @click="closeModal"
                    class="btn border-primary !bg-white !text-primary w-full max-w-[15rem]">Cancel</button>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { productsStore } from '~/store/productsStore';
import { storeToRefs } from 'pinia'
const router = useRouter();
const { $toast } = useNuxtApp();

useHead({
    title: "Shopping Cart - Products Store"
});

const store = productsStore();

const { cart, subTotal, tax, totalSaved, checkoutCart, selectAll, checkedAny, productsQuantity } = storeToRefs(store);

const modal = ref(false);

const { isLoggedIn } = useAuth();

const closeModal = () => {
    modal.value = false;
}

const removeProducts = () => {
    store.deleteCheckedProducts();
    closeModal();
    $toast.success("Removed!");
}

const checkout = () => {
    if (!isLoggedIn.value) {
        router.push("/login").then(() => $toast.warning("Login is required"));
    } else {
        router.push("/payment");
    }
}
</script>

<style scoped>
.left-side {
    @apply space-y-4 lg:w-[70%];

    .title-container {

        p,
        label {
            @apply cursor-pointer;
        }

        p.delete-items {
            @apply font-bold underline text-blue-500 border-l border-l-gray-300 pl-4 ml-4;
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