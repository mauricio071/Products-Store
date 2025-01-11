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
                <button type="submit" class="submit-btn">Submit</button>
            </form>
            <span>&#169; Products Store</span>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
});
const router = useRouter();

const username = ref("mor_2314");
const password = ref("83r5^_");

const login = async () => {
    const { loading } = await useFetch("https://fakestoreapi.com/auth/login", {
        method: "post",
        body: {
            username,
            password
        }
    }).then((res) => {
        router.push("/");
        console.log('certo');
    })
}
</script>

<style scoped>
.content {
    @apply flex p-4;

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
            @apply w-full max-w-xl flex flex-col gap-8 text-center shadow-md rounded-lg px-8 py-8;

            h2 {
                @apply text-3xl font-bold text-[#12b488] pb-4 border-b-2 border-b-[#12b48913];
            }

            .input-container {
                @apply flex flex-col items-start gap-4;

                label {
                    @apply text-[#12b488] font-bold;
                }

                input {
                    @apply w-full p-4 rounded-lg border outline-none;
                }
            }

            .submit-btn {
                @apply bg-[#12b488] text-white px-4 py-2 rounded-xl duration-300;

                &:hover {
                    @apply bg-[#10a17b];
                }
            }
        }

        span {
            @apply text-gray-800 -mb-4;
        }
    }
}
</style>