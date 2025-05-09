<template>
    <Form :validation-schema="schema" @submit="handleRegister">
        <h2>Register</h2>
        <div>
            <div class="input-container">
                <label>Username: </label>
                <Field v-model="username" name="userName" type="text" placeholder="Username" required />
            </div>
            <ErrorMessage name="userName" class="error-message" />
        </div>
        <div>
            <div class="input-container">
                <label>Email: </label>
                <Field v-model="email" name="email" type="email" placeholder="Email" required />
            </div>
            <ErrorMessage name="email" class="error-message" />
        </div>
        <div>
            <div class="input-container">
                <label>Password: </label>
                <Field v-model="password" name="password" type="text" placeholder="Password" required />
            </div>
            <ErrorMessage name="password" class="error-message" />
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
    </Form>
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
import { ErrorMessage, Field, Form } from "vee-validate";
import * as yup from "yup";

const { $toast, $firebaseConfig } = useNuxtApp();

const $emit = defineEmits(["changeFormType"]);

const schema = yup.object({
    userName: yup.string().required("User name is required"),
    email: yup.string().required("Email is required").email("Must be valid email"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

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