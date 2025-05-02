<template>
    <form @submit.prevent="handleRegister">
        <h2>Register</h2>
        <div class="input-container">
            <label>Username: </label>
            <input v-model="username" type="text" placeholder="Username" required>
        </div>
        <div class="input-container">
            <label>Email: </label>
            <input v-model="email" type="email" placeholder="Email" required>
        </div>
        <div class="input-container">
            <label>Password: </label>
            <input v-model="password" type="text" placeholder="Password" required>
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading" class="loader"></span>
            <span v-else>Submit</span>
        </button>
        <p @click="toggleFormType"
            class="flex gap-2 justify-center items-center text-blue-500 cursor-pointer hover:underline">
            <IconsArrowLeft />
            Back to login screen
        </p>
    </form>
</template>

<script setup>
import { initializeApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signOut,
    updateProfile,
} from "firebase/auth";
import { createUserInfo } from "~/firebase/createUserAction";

const { $toast, $firebaseConfig } = useNuxtApp();

const $emit = defineEmits(["changeFormType"]);

const loading = ref(false);

const username = ref("");
const email = ref("");
const password = ref("");

const toggleFormType = () => {
    $emit("changeFormType");
}

const createUserWithoutLogin = async () => {
    const secondaryApp = initializeApp($firebaseConfig, "Secondary");

    const secondaryAuth = getAuth(secondaryApp);

    const secondaryDb = getFirestore(secondaryApp);

    try {
        const userCredential = await createUserWithEmailAndPassword(
            secondaryAuth,
            email.value,
            password.value
        );

        await updateProfile(userCredential.user, { displayName: username.value });

        // await createUserInfo(secondaryDb, userCredential.user.displayName.trim().split(" ")[0]);

        await signOut(secondaryAuth);

        return userCredential;
    } finally {
        await deleteApp(secondaryApp);
    }
};

const handleRegister = async () => {
    loading.value = true;

    try {
        await createUserWithoutLogin();

        $toast.success("Account created successfully!");
        toggleFormType();
    } catch (error) {
        const errorMessage =
            error.code.includes("email-already-in-use") &&
            "This email is already in use!";

        $toast.error(errorMessage || "Error creating account. Please try again!");
        console.error(error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
form {
    @apply flex flex-col gap-5;

    h2 {
        @apply text-3xl font-bold text-center text-primary pb-4 border-b-2 border-b-[#12b48913];
    }

    .submit-btn {
        @apply bg-primary px-4 py-2 rounded-xl duration-300 mt-3;

        &:hover {
            @apply bg-[#10a17b];
        }

        &:disabled {
            @apply bg-slate-300;
        }

        span {
            @apply text-white;
        }
    }
}
</style>