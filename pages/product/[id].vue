<template>
    <div class="content">
        <div class="card">
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
                                +{{ formattedPrice(product.price * 0.2) }} estimated tax
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
                            <button @click="store.addToWish(product.id)" class="favorite-btn">
                                <i v-if="isFavorite" class="material-icons text-red-500">favorite</i>
                                <i v-else class="material-icons text-red-500">favorite_border</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h2 class="text-3xl font-bold mb-4">Similar itens</h2>
        <div v-if="loading" class="flex gap-8 justify-around overflow-auto">
            <div v-for="index in 3" :key="index"
                class="skeleton-loader sm:my-8 sm:mx-8 max-w-[304px] 2xl:max-w-[336px] h-[380px]">
            </div>
        </div>
        <client-only v-else>
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
const { $toast } = useNuxtApp();

const addProduct = store.addProduct;

const router = useRouter();

const { id } = useRoute().params;
const products = ref([]);
const loading = ref(true);

const { data: product } = await useFetch(`https://fakestoreapi.com/products/${id}`);

useHead({
    title: `${product.value.title} - Products Store`
});

const loadSimilar = async () => {
    loading.value = true;
    try {
        const data = await $fetch(`https://fakestoreapi.com/products/category/${product.value.category}`);
        const produtosFiltrados = data.filter((item) => item.id !== Number(id));
        products.value = produtosFiltrados;
    } catch (e) {
        console.log("Error: ", e);
    } finally {
        loading.value = false;
    }
}

loadSimilar();

const quantity = ref(1);

if (!product.value) {
    throw createError({ statusCode: 404, statusMessage: "Product not found!", fatal: true });
}

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

onMounted(async () => {
    const wishList = await store.fetchWishList();
    isFavorite.value = wishList.find((product) => product.itemId === id);
})


// favorited(id) {
//     return this.wishList.find((product) => product.itemId === id);
// }
</script>

<style scoped>
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
