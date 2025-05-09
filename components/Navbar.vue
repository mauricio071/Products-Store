<template>
    <header class="shadow-md">
        <nav class="flex justify-between flex-wrap sm:flex-nowrap container mx-auto px-8 py-7">
            <NuxtLink to="/" class="font-bold text-xl flex gap-2 items-center">
                <LazyIconsShopping class="rotate-[-20deg]" />
                Products Store
            </NuxtLink>
            <button @click="visible = !visible" class="sm:hidden">
                <IconsMenu />
            </button>

            <template v-if="route.name !== 'payment'">
                <ul class="space-y-4 sm:space-y-0 mt-8 sm:my-0 justify-between items-center gap-4 w-full sm:w-[unset] sm:flex sm:flex-row"
                    :class="{ 'flex flex-col': visible, 'hidden': !visible }">
                    <li>
                        <NuxtLink to="/" class="text-xl btn">Products</NuxtLink>
                    </li>
                    <li v-if="isAuthResolved">
                        <div class="user-account">
                            <IconsUser />
                            <div class="submenu">
                                <template v-if="isLoggedIn">
                                    <div class="submenu-username">
                                        <div>
                                            Welcome back,
                                            <span class="font-semibold">{{ user.displayName }}</span>!
                                        </div>
                                        <span @click="logout"
                                            class="flex items-center gap-2 text-blue-500 w-fit cursor-pointer">
                                            <i class="material-icons ml-0.5 -mr-0.25">logout</i>
                                            Logout
                                        </span>
                                    </div>
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
                                    <div>
                                        <nuxt-link to="/accountDetails" class="menu-item">
                                            <IconsAccountCircle class="w-[1.6rem] h-[1.6rem] -ml-0.25" />
                                            Account
                                        </nuxt-link>
                                    </div>
                                </template>
                                <template v-else>
                                    <div @click="login" class="login-btn">
                                        <i class="material-icons -ml-4">login</i>
                                        Login
                                    </div>
                                    <nuxt-link to="/login?register=true" class="text-gray-500 text-center mt-2">
                                        Register
                                    </nuxt-link>
                                </template>
                            </div>
                            <div class="flex flex-col max-w-[5rem]">
                                <span v-if="user?.displayName" class="text-xs truncate">Hi, {{ user.displayName }}
                                </span>
                                <span class="font-bold text-sm ">Account</span>
                            </div>
                        </div>
                    </li>
                    <li class="relative">
                        <nuxt-link to="/cart" class="flex items-end">
                            <div v-if="cart.length > 0" class="product-counter">{{ cart.length }}</div>
                            <i class="material-icons">shopping_cart</i>
                            <span class="font-bold text-sm ml-1">Cart</span>
                        </nuxt-link>
                    </li>
                </ul>
            </template>
        </nav>
    </header>
</template>

<script setup>
import { productsStore } from '../store/productsStore'
import { signOut } from "firebase/auth";
import { storeToRefs } from 'pinia';

const { $auth } = useNuxtApp();

const router = useRouter();
const route = useRoute();

const visible = ref(false);

const store = productsStore();

const { cart } = storeToRefs(store);

const { isAuthResolved, isLoggedIn, user } = useAuth();

const login = () => {
    router.push("/login");
}

const logout = async () => {
    await signOut($auth);
    router.push("/login");
}

watch(() => route.path, (newValue) => {
    visible.value = false;
}, { deep: true });
</script>

<style scoped>
.user-account {
    @apply flex items-center gap-2 relative;

    &:hover {
        .submenu {
            @apply flex;
        }
    }

    .submenu {
        @apply hidden absolute top-[1.5rem] left-[-6rem] w-[19rem] flex-col gap-1 bg-white py-4 px-2 rounded-lg shadow-lg z-10;

        .login-btn {
            @apply bg-primary text-white flex justify-center items-center gap-3 duration-300 px-4 py-3 w-60 mx-auto cursor-pointer font-semibold text-base rounded-3xl;

            &:hover {
                @apply bg-[#109471];
            }
        }

        .submenu-username {
            @apply flex flex-col gap-3 border-b border-b-gray-200 pt-2.5 pb-4 mb-2 mx-4;
        }

        .menu-item {
            @apply flex items-center gap-3 duration-300 px-4 py-3 w-full cursor-pointer rounded-lg font-semibold text-base;

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