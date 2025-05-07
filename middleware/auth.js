export default defineNuxtRouteMiddleware(async () => {
    if (!process.client) return;
    const { $auth, $toast } = useNuxtApp();

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
