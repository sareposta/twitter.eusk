export default {
    mode: 'spa',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://tailwindcomponents.com/css/component.dashboard-template.css' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100&display=swap' }
        ],
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: [
        "vue-select/src/scss/vue-select.scss"
    ],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        "@plugins/select.js",
        "@plugins/placeholder.js"
    ],
    router: {
        middleware: ['auth']
    },
    auth: {
        redirect: {
            login: '/login', // redirect user when not connected
            callback: '/auth/signed-in'
        },
        strategies: {
            local: false,
            auth0: {
                allowLogin: false,
                language: 'es',
                domain: 'dev-7tyl4nov.us.auth0.com',
                client_id: 'wGs5lgBGqTXfHnKEBGR4tmQPdv2lnawF'
            }
        }
    },
    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        '@inkline/nuxt'
    ],
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {},
    },
};