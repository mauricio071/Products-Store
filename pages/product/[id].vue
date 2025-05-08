<template>
    <div class="content">
        <div v-if="loading" class="card w-full">
            <div class="h-full lg:grid lg:grid-cols-2 items-center">
                <div class="sm:p-7">
                    <SkeletonLoader max-height="27rem" />
                    <!-- <img :src="product.image" :alt="product.description"
                            class="max-h-[18rem] mx-auto mb-4 2xl:max-w-[30rem] 2xl:max-h-[27rem]"> -->
                </div>
                <div class="pt-10 sm:p-7">
                    <div class="skeleton-container">
                        <SkeletonLoader max-height="3rem" margin-bottom="2rem" />
                        <SkeletonLoader max-height="1.5rem" />
                        <SkeletonLoader max-height="1.5rem" />
                        <SkeletonLoader max-height="1.5rem" />
                    </div>
                    <div class="skeleton-container mb-8">
                        <SkeletonLoader max-height="1.5rem" />
                        <SkeletonLoader max-height="1.5rem" />
                        <SkeletonLoader max-height="1.5rem" />
                        <SkeletonLoader max-height="1.5rem" />
                    </div>
                    <div class="flex gap-4 mt-4">
                        <SkeletonLoader max-height="3rem" max-width="8rem" />
                        <SkeletonLoader max-height="3rem" max-width="8rem" />
                        <SkeletonLoader max-height="3rem" max-width="4rem" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="card">
            <div class="lg:grid lg:grid-cols-2 items-center">
                <div class="sm:p-7">
                    <img :src="product.image" :alt="product.description"
                        class="max-h-[18rem] mx-auto mb-4 2xl:max-w-[30rem] 2xl:max-h-[27rem]">
                </div>
                <div class="sm:p-7">
                    <h1 class="text-xl md:text-3xl">{{ product.title }}</h1>
                    <div class="rating">
                        <IconsStar />
                        <p>{{ product.rating.rate }}</p>
                    </div>
                    <div class="flex justify-between items-center mt-2 mb-8">
                        <div>
                            <h2 class="text-lg md:text-2xl font-bold">Price: {{ formattedPrice(product.price) }}
                            </h2>
                            <span class="text-gray-600 block !mt-1">
                                +{{ formattedPrice(product.price * taxRate) }} estimated tax
                            </span>
                        </div>
                        <p class="text-lg font-semibold">{{ product.rating.count }} sold</p>
                    </div>
                    <div class="description space-y-6">
                        <h3 class="font-bold border-b-2 pb-2 mb-4">Product description:</h3>
                        <p>{{ product.description }}</p>
                        <div class="quantity">
                            <h3 class="font-bold">Quantity:</h3>
                            <IconsMinus @click="removeUnitProduct" class="max-w-[1.5rem] text-gray-500 cursor-pointer"
                                :class="quantity === 1 ? '!text-[#d1d5db] !cursor-not-allowed' : 'text-gray-500'" />
                            <span class="font-semibold">{{ quantity }}</span>
                            <IconsPlus @click="addUnitProduct" class="max-w-[1.5rem] text-gray-500 cursor-pointer" />
                        </div>
                        <div class="flex flex-col items-[unset] sm:flex-row sm:items-center gap-4">
                            <button @click="addToCart" class="btn flex justify-center items-center gap-x-2">
                                <i class="material-icons">add_shopping_cart</i>
                                <span class="font-semibold">Add to cart</span>
                            </button>
                            <button @click="addToCart('payment')" class="btn flex justify-center items-center gap-x-2">
                                <i class="material-icons">shopping_cart</i>
                                <span class="font-semibold">Buy now</span>
                            </button>
                            <button @click="onToggleFavorite" class="favorite-btn">
                                <i v-if="isFavorite" class="material-icons text-red-500">favorite</i>
                                <i v-else class="material-icons text-red-500">favorite_border</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loadingSimilar">
            <SkeletonLoader max-height="3rem" max-width="12rem" margin-bottom="1rem" />
            <div class="flex gap-8 justify-around overflow-auto">
                <div v-for="index in 3" :key="index"
                    class="skeleton-loader sm:my-8 sm:mx-8 max-w-[304px] 2xl:max-w-[336px] h-[380px]">
                </div>
            </div>
        </div>
        <div v-else>
            <h2 class="text-3xl font-bold mb-4">Similar itens</h2>
            <client-only>
                <carousel :items-to-show="1" :breakpoints="breakpoints">
                    <slide v-for="product in products" :key="product.id">
                        <Card :product="product" class="similar" />
                    </slide>

                    <template #addons>
                        <Navigation />
                    </template>
                </carousel>
            </client-only>
        </div>
    </div>
</template>

<script setup>
import { productsStore } from '../store/productsStore';

const breakpoints = {
    768: {
        itemsToShow: 2,
    },
    1280: {
        itemsToShow: 3,
    },
}

const store = productsStore();
const { taxRate } = storeToRefs(store);

const { $toast } = useNuxtApp();
const { isLoggedIn } = useAuth();

const addProduct = store.addProduct;

const router = useRouter();

const { id } = useRoute().params;
const products = ref([]);
const loading = ref(true);
const loadingSimilar = ref(true);

const product = ref(null);

const loadSimilar = async () => {
    loadingSimilar.value = true;
    try {
        const data = await $fetch(`https://fakestoreapi.com/products/category/${product.value.category}`);
        const produtosFiltrados = data.filter((item) => item.id !== Number(id));
        products.value = produtosFiltrados;
    } catch (e) {
        console.log("Error: ", e);
    } finally {
        loadingSimilar.value = false;
    }
}

const quantity = ref(1);

const removeUnitProduct = () => {
    if (quantity.value > 1) {
        quantity.value -= 1;
    }
}

const addUnitProduct = () => {
    quantity.value += 1
}

const addToCart = (payment) => {
    try {
        addProduct(product.value, quantity.value);

        if (payment === "payment") {
            router.push({ path: "/payment" }).then(() => {
                $toast.success("Product added!");
            });
        } else {
            router.push({ path: "/" }).then(() => {
                $toast.success("Product added!");
            });
        }
    } catch (error) {
        $toast.error("There was an error processing your request");
    }
}

const isFavorite = ref(false);

const onToggleFavorite = async () => {
    if (!isLoggedIn.value) {
        await navigateTo('/login');
        $toast.warning("Login is required!");
        return
    }

    try {
        isFavorite.value = !isFavorite.value;
        await store.addToWish(id);
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    loading.value = true
    try {
        const data = await $fetch(`https://fakestoreapi.com/products/${id}`);
        product.value = data;

        if (data) {
            useHead({
                title: `${product.value.title} - Products Store`
            });

            if (isLoggedIn.value) {
                const wishList = await store.fetchWishList();
                isFavorite.value = !!wishList.find((product) => product.itemId === id);
            }
            loadSimilar();
        } else {
            await navigateTo('/', { replace: true });
            $toast.error("This product doesn't exist!");
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.skeleton-container {
    @apply flex flex-col gap-2.5;

    &:first-child {
        @apply border-b-2 pb-6 mb-6;
    }
}

.quantity {
    @apply flex items-center gap-2;
}

.favorite-btn {
    @apply flex items-center justify-center rounded-lg border border-red-500 p-2;
}

.similar.card {
    @apply w-full my-8 mx-4 max-h-[25rem] max-w-[19rem] 2xl:min-w-[23rem];
}

:deep(.carousel) .carousel__icon {
    @apply fill-white bg-primary w-20 h-8 rounded-[50%];
}
</style>
