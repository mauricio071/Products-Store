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
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined",
                },
            ],
        },
    },
});
