import { productsStore } from "~/store/productsStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const store = productsStore();

    if (store.cart.length === 0) {
        return navigateTo("/");
    }
});
