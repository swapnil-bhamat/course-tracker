// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  devServer: {
    port: parseInt(process.env.PORT || "3008"),
  },
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    preset: "netlify",
  },
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
    "@bootstrap-vue-next/nuxt",
  ],
  css: ["bootstrap/dist/css/bootstrap.min.css", "~/assets/css/main.css"],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
      Outfit: [400, 500, 600, 700],
    },
  },
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "",
    appSecret: process.env.APP_SECRET || "",
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3008",
    },
  },
});
