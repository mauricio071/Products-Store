<template>
    <div>
        <carousel :items-to-show="1" wrapAround :autoplay="5000" pauseAutoplayOnHover>
            <slide v-for="i in 3" :key="i">
                <img :src="`/img/banner-${i}.png`" alt="banner" class="carousel__item">
            </slide>

            <template #addons>
                <Navigation />
            </template>
        </carousel>
        <div class="filters">
            <div v-for="filter in filters" :key="filter">
                <button @click="categoryFilter(filter)" :class="{ 'active': filter === currentFilter }"
                    class="capitalize">
                    {{ filter }}
                </button>
            </div>
        </div>

        <template v-if="status !== 'success' || loading">
            <span class="loader-primary m-auto"></span>
        </template>
        <template v-else>
            <div class="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div v-for="product in products" :key="product.id">
                    <Card :product="product" />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
const loading = ref(false)

const { data: products, status } = await useFetch('https://fakestoreapi.com/products')

const filters = ['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"]

const currentFilter = ref('all')

const categoryFilter = async (filter) => {
    loading.value = true
    const filterType = filter === "all" ? '' : `/category/${filter}`
    const { data } = await useFetch(`https://fakestoreapi.com/products${filterType}`)
    products.value = data.value
    currentFilter.value = filter
    loading.value = false
}
</script>

<style scoped>
:deep(.carousel) {
    @apply mx-[-2rem] lg:mx-0;
}

.carousel__item {
    @apply min-h-[200px] max-h-[480px] w-full rounded-lg flex justify-center items-center;
}

.carousel__slide {
    @apply p-[10px];
}

:deep(.carousel) .carousel__prev,
:deep(.carousel) .carousel__next {
    @apply text-white bg-primary rounded-lg w-8 h-8 lg:w-10 lg:h-10;
}

.filters {
    @apply flex flex-wrap justify-center gap-4 mt-8 mb-12 lg:justify-end;
}

.filters button {
    @apply border rounded-xl px-4 py-2 duration-300 sm:px-6;
}

.filters button:hover {
    @apply bg-primary border-primary text-white;
}

.active {
    @apply bg-primary border-primary text-white;
}
</style>