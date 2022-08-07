export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'prismic-jest-path',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/styles/reset-css.css', '~assets/styles/variables.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/prismic',
      {
        endpoint: `https://${process.env.PRISMIC_REPOSITORY}.cdn.prismic.io/api/v2`,
      },
    ],
  ],

  styleResources: {
    scss: ['./assets/styles/*.scss'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['@prismicio/vue'],
  },
  prismic: {
    apiOptions: {
      routes: [
        // Resolves the Homepage document to "/"
        {
          type: 'single-page',
          path: '/:uid',
        },
      ],
      accessToken: `${process.env.CONTENT_API_KEY}`,
    },
    preview: true,
  },
}
