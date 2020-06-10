export default {
  mode: 'universal',
  env: {
    baseURL: 'http://localhost:3000'
  },
  generate: {
    routes: [
      '/'
    ]
  },
  loading: { color: '#fff' },
  modules: [
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    sass: [
      './assets/*.sass'
    ],
  },
  build: {
    extend (config, ctx) {
    },
    build: {
      postcss: {
        plugins: {
          'postcss-url': false,
          'postcss-nested': {},
          'postcss-responsive-type': {},
          'postcss-hexrgba': {}
        },
        preset: {
          autoprefixer: {
            grid: true
          }
        }
      }
    }
  }
}
