export default defineNuxtRouteMiddleware(async () => {
    const { $auth } = useNuxtApp();

    return new Promise((resolve) => {
        $auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                resolve(navigateTo("/login", { replace: true }));
            } else {
                resolve();
            }
        });
    });
});
