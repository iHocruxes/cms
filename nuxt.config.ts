// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss", 
    "@nuxtjs/color-mode",
    "@nuxtjs/cloudinary",
    "@pinia/nuxt",
  ],
  tailwindcss: { exposeConfig: true },
  app: {
    head: {
      title: "Healthline",
      link: [
        // Favicon
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        //Inter font
        // { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        // { rel: "preconnect", href: "https://rsms.me/" },
      ],
      script: [
        {
          src: "https://cdn.lordicon.com/lordicon-1.2.0.js",
        },
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["lord-icon"].includes(tag),
    },
  },
  // Simple usage:
  ssr: false,
  css: ["~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.PUBLIC_API,
    },
  },
  spaLoadingTemplate: "spa-loading-template.html",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
  },
});
