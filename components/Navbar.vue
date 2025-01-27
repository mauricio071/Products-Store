<template>
    <header class="shadow-md">
        <nav class="flex justify-between flex-wrap md:flex-nowrap container mx-auto p-8">
            <NuxtLink to="/" class="font-bold text-xl flex gap-2 items-center">
                <LazyIconsShopping class="rotate-[-20deg]" />
                Products Store
            </NuxtLink>
            <button @click="visible = !visible" class="md:hidden">
                <IconsMenu />
            </button>
            <template v-if="route.name !== 'payment'">
                <ul class="space-y-8 md:space-y-0 mt-8 md:my-0 justify-between gap-4 w-full md:w-[unset] md:flex"
                    :class="{ 'block': visible, 'hidden': !visible }">
                    <li>
                        <NuxtLink to="/" class="text-xl btn">Products</NuxtLink>
                    </li>
                    <li>
                        <div class="user-account">
                            <IconsUser />
                            <div class="submenu">
                                <template v-if="loginToken">
                                    <div>
                                        <nuxt-link to="/myOrders" class="menu-item">
                                            <IconsShoppingBag />
                                            My Orders
                                        </nuxt-link>
                                    </div>
                                    <div>
                                        <nuxt-link to="/wishList" class="menu-item">
                                            <i class="material-icons">favorite_border</i>
                                            Wish List
                                        </nuxt-link>
                                    </div>
                                    <div @click="logout" class="menu-item">
                                        <i class="material-icons ml-0.5 -mr-0.5">logout</i>
                                        Logout
                                    </div>
                                </template>
                                <div v-else @click="login" class="menu-item">
                                    <i class="material-icons">login</i>
                                    Login
                                </div>
                            </div>
                            <span class="font-semibold text-sm ml-1">Account</span>
                        </div>
                    </li>
                    <li class="relative">
                        <nuxt-link to="/cart" class="flex items-end">
                            <div v-if="cart.length > 0" class="product-counter">{{ cart.length }}</div>
                            <i class="material-icons">shopping_cart</i>
                            <span class="font-semibold text-sm ml-1">Cart</span>
                        </nuxt-link>
                    </li>
                </ul>
            </template>
        </nav>
    </header>
</template>

<script setup>
import { productsStore } from '../store/productsStore'
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();

const visible = ref(false);

const store = productsStore();

const { cart } = storeToRefs(store);

const loginToken = useCookie('loginToken');

const login = () => {
    router.push("/login");
}

const logout = () => {
    loginToken.value = undefined;
    router.push("/login");
}
</script>

<style scoped>
.user-account {
    @apply flex items-end gap-2 relative;

    &:hover {
        .submenu {
            @apply flex;
        }
    }

    .submenu {
        @apply hidden absolute top-[1.5rem] left-[-2rem] w-40 flex-col font-semibold bg-white py-2 rounded-lg shadow-lg cursor-pointer z-10;

        .menu-item {
            @apply flex items-center gap-3 duration-300 p-4 w-full;

            &:hover {
                @apply bg-gray-200 text-primary;
            }
        }
    }
}

.product-counter {
    @apply absolute bottom-[20px] left-4 bg-primary text-white rounded-[50%] py-[1px] px-[6px] text-[10px];
}
</style>