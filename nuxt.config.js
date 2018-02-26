module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'BitMonitor',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Monitor de cryptomoedas' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** CSS
  */
  css: [
    // 'element-ui/lib/theme-chalk/index.css'
  ],
  
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          use: [
            {
              loader: 'eslint-loader',
              options: {}
            }
          ],
          exclude: /(node_modules)/
        })
      }
      config.node = { fs: 'empty' }
    }
  },

  /*
  ** Plugins
  */
  plugins: [
    { src: '~/plugins/elementui.js', ssr: false },
    { src: '~/plugins/coinmarketcap', ssr: false },
    { src: '~/plugins/localstorage.js', ssr: false },
    { src: '~/plugins/filters.js' },
  ],
}
