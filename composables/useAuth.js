import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
    const { $auth } = useNuxtApp();
    const user = ref(null);
    const isLoggedIn = ref(false);
    const isAuthResolved = ref(false);

    onAuthStateChanged($auth, (currentUser) => {
        user.value = currentUser;
        isLoggedIn.value = !!currentUser;
        isAuthResolved.value = true;
    });

    return {
        user,
        isLoggedIn,
        isAuthResolved,
    };
};
