// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "vue3-carousel-nuxt",
        "@nuxt/fonts",
    ],
    app: {
        head: {
            title: "Products Store",
            meta: [{ name: "description", content: "Only quality products!!" }],
            link: [
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                },
            ],
        },
    },

    runtimeConfig: {
        public: {
            FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
            FIREBASE_PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
            FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        },
    },
});
