export default defineNuxtRouteMiddleware(async () => {
    if (!process.client) return;
    const { $auth, $toast } = useNuxtApp();

    return new Promise((resolve) => {
        $auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                $toast.warning("Login is required");
                resolve(navigateTo("/login", { replace: true }));
            } else {
                resolve();
            }
        });
    });
});
