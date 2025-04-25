<template>
    <div class="content">
        <div class="banner-img-side">
        </div>
        <div class="form-side">
            <div class="form-container">
                <template v-if="formType === 'login'">
                    <LoginBox @change-form-type="formType = 'register'" />
                </template>
                <template v-else>
                    <RegisterBox @change-form-type="formType = 'login'" />
                </template>
            </div>
            <span class="text-gray-800 -mb-4">&#169; Products Store</span>
        </div>
    </div>
</template>

<script setup>
import RegisterBox from '~/components/login/RegisterBox.vue';

definePageMeta({
    layout: false,
    middleware: 'login'
});

useHead({
    title: "Login - Products Store"
});

const formType = ref("login");
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

        .form-container {
            @apply w-full max-w-xl bg-white flex flex-col gap-5 shadow-md rounded-lg p-8;
        }
    }
}
</style>