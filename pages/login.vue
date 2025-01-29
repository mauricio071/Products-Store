<template>
    <div class="content">
        <div class="banner-img-side">
        </div>
        <div class="form-side">
            <form @submit.prevent="login">
                <h2>Log in</h2>
                <div class="input-container">
                    <label>Type your username: </label>
                    <input v-model="username" type="text" placeholder="Username" required>
                </div>
                <div class="input-container">
                    <label>Type your password: </label>
                    <input v-model="password" type="password" placeholder="Password" required>
                </div>
                <button type="submit" :disabled="loading" class="submit-btn">
                    <span v-if="loading" class="loader"></span>
                    <span v-else>Submit</span>
                </button>
            </form>
            <span class="text-gray-800 -mb-4">&#169; Products Store</span>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false,
    middleware: 'login'
});

useHead({
    title: "Login - Products Store"
});

const { $toast } = useNuxtApp();
const router = useRouter();

const loginToken = useCookie("loginToken");

const username = ref("mor_2314");
const password = ref("83r5^_");

const loading = ref(false);

const login = async () => {
    loading.value = true;
    try {
        const { data, error } = await useFetch("https://fakestoreapi.com/auth/login", {
            method: "post",
            body: {
                username,
                password
            }
        });

        if (error.value) {
            $toast.error("Username or password is incorrect");
        }

        if (data.value.token) {
            loginToken.value = data.value.token;
            router.push("/");
        } else {
            $toast.error("Empty token");
        }
    } catch (e) {
        console.log(e);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.content {
    @apply bg-[#fcfdfdb0] flex p-4;

    .banner-img-side {
        @apply w-0 bg-[url("/assets/login-banner.png")] bg-cover bg-center bg-no-repeat rounded-lg;
        height: calc(100vh - 32px);

        @screen lg {
            @apply w-1/2;
        }
    }

    .form-side {
        @apply w-full flex flex-col gap-4 justify-center items-center;

        @screen lg {
            @apply w-1/2 pl-4;
        }

        form {
            @apply w-full max-w-xl bg-white flex flex-col gap-8 text-center shadow-md rounded-lg px-8 py-8;

            h2 {
                @apply text-3xl font-bold text-primary pb-4 border-b-2 border-b-[#12b48913];
            }

            .submit-btn {
                @apply bg-primary px-4 py-2 rounded-xl duration-300;

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
    }
}
</style>