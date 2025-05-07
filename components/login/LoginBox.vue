<template>
    <Form :validation-schema="schema" @submit="handleLogin">
        <h2>Login</h2>
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
                <Field v-model="password" name="password" type="password" placeholder="Password" required />
            </div>
            <ErrorMessage name="password" class="error-message" />
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading" class="loader"></span>
            <span v-else>Submit</span>
        </button>
        <p>Don't have an account? <span @click="toggleFormType"
                class="text-blue-500 cursor-pointer hover:underline">Sign
                up</span> </p>
        <span class="divider">or</span>
    </form>
    <button @click="signGoogle" class="google-login-btn">
        <IconsGoogle />
        <h3>Login with Google account</h3>
    </button>
</template>

<script setup>
import {
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { ErrorMessage, Field, Form } from "vee-validate";
import * as yup from "yup";

const { $toast, $auth, $googleProvider } = useNuxtApp();

const $emit = defineEmits(["changeFormType"]);

const loading = ref(false);

const router = useRouter();

const email = ref("");
const password = ref("");

const toggleFormType = () => {
    $emit("changeFormType");
}

const schema = yup.object({
    email: yup.string().required("Email is required").email("Must be valid email"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const handleLogin = async () => {
    loading.value = true;
    try {
        await signInWithEmailAndPassword($auth, email.value, password.value);
        router.push("/").then(() => $toast.success("Login successful!"));
    } catch (error) {
        $toast.error("Error logging in. Please check your credentials!");
        console.error(error);
    } finally {
        loading.value = false;
    }
}

const signGoogle = async () => {
    try {
        const result = await signInWithPopup($auth, $googleProvider);

        if (
            result.user.metadata.creationTime ===
            result.user.metadata.lastSignInTime
        ) {
            // await createAllDocuments(db, result.user.uid);
        }

        router.push("/").then(() => $toast.success("Login successful!"));
    } catch (error) {
        if (error.code === "auth/popup-closed-by-user") {
            return;
        } else {
            $toast.error("Erro ao fazer login. Tente novamente.");
            console.error(error);
        }
    }
}
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

.google-login-btn {
    @apply text-gray-500 flex items-center justify-center gap-4 py-3 border border-gray-300 rounded-md duration-300;

    &:hover {
        @apply bg-gray-50;
    }
}
</style>