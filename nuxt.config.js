const pkg = require('./package')
const axios = require('axios')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'nlpaper.challenge - 自然言語処理の国際会議の完全読破 !',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'keywords',
        content:
          'nlpaper.challenge, cvpaper.challenge, nlp, natural language processing, paper, challenge, computer vision'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          '自然言語処理の国際会議の完全読破を目指すnlpaper.challenge公式ホームページです。 自然言語処理の発展のため、勉強会や交流会を企画していきます。'
      },
      {
        name: 'author',
        content: 'nlpaper.challenge'
      },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:site_name',
        content: 'nlpaper.challenge'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'nlpaper.challenge - 自然言語処理の国際会議の完全読破 !'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          '自然言語処理の国際会議の完全読破を目指すnlpaper.challenge公式ホームページです。 自然言語処理の発展のため、勉強会や交流会を企画していきます。'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'http://xpaperchallenge.org/nlp/image/logo/title.svg'
      },
      {
        hid: 'og:image',
        property: 'og:url',
        content: 'http://xpaperchallenge.org/nlp'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/nlp/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [],

  script: [
    {
      src: '@/assets/js/slider_cvpaperchallenge.js',
      type: 'text/javascript'
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    ,
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    'nuxt-fontawesome',
    '@nuxtjs/axios',
    '~/modules/fetchData',
    '~/modules/fetchData_emnlp2019'
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) { }
  },

  router: {
    base: '/nlp/'
  },

  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      }
    ]
  },

  axios: {
    baseURL: process.env.API_HOST || 'http://localhost/api'
  },

  generate: {
    routes: function () {
      const tags = require('./static/data/summaries/tags.json').content
      const allSummaries = require('./static/data/summaries/all.json').content
      const perPage = 5
      const numPage = Math.ceil(allSummaries.length / perPage)

      let routes = []
      for (let tag of tags) {
        routes.push(`/summaries/tag/${tag}`)
      }
      for (let i = 1; i <= allSummaries.length; i++) {
        routes.push(`/summaries/${i}`)
      }
      for (let page = 1; page <= numPage; page++) {
        routes.push(`/summaries/page/${page}`)
      }

      const emnlp2019_tags = require('./static/data/emnlp2019_summaries/tags.json').content;
      const emnlp2019_allSummaries = require('./static/data/emnlp2019_summaries/all.json').content;
      const emnlp2019_perPage = 5;
      const emnlp2019_numPage = Math.ceil(emnlp2019_allSummaries.length / emnlp2019_perPage);

      for (let tag of emnlp2019_tags) {
        routes.push(`/emnlp2019_summaries/tag/${tag}`);
      }
      for (let i = 1; i <= emnlp2019_allSummaries.length; i++) {
        routes.push(`/emnlp2019_summaries/${i}`);
      }
      for (let page = 1; page <= emnlp2019_numPage; page++) {
        routes.push(`/emnlp2019_summaries/page/${page}`);
      }

      return routes
    }
  }
}
