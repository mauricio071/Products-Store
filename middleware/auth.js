export default defineNuxtRouteMiddleware((to, from) => {
    const loginToken = useCookie("loginToken");

    if (!loginToken.value) {
        return navigateTo("/login");
    }
});
