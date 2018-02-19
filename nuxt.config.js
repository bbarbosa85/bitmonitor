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
    'iview/dist/styles/iview.css'
  ],
  
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'iview'
    ],
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
            },
            {
              loader: 'iview-loader',
              options:{
                prefix: false
              },
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
    { src: '~/plugins/coinmarketcap', ssr: false },
    { src: '~/plugins/iview.js', ssr: true },
    { src: '~/plugins/inputmoney.js', ssr: false },
    { src: '~/plugins/localstorage.js', ssr: false }
  ],
}
