# Read Excel Sample
本リポジトリは[xpaperchallenge/nlpaperchallenge-homepage](https://github.com/xpaperchallenge/nlpaperchallenge-homepage)をもとにローカルに配置したエクセルから論文サマリーを抽出するように変更したものです。

# 自分用メモ
## 親ディレクトリ、呼び出し元からの情報のもらい方。
- 例えばcomponents/SummaryCard.vueはsummaryとconfKeyをprops(プロパティ,入力)として持っていて、1つの論文要約の情報にアクセスして表示できる。これは具体的にはどこからもらっている？
- nuxt.config.jsの中で動的なルーティングを行なっている。 https://nuxtjs.org/ja/docs/features/file-system-routing/
  - .../_confKey/があったら、そのcomponentは.../_confKey/index.vueになる。
  - `.../_confKey/index.vue`中の`asyncData({ params }) {`のparamsには、confKeyが属性として入っている。これは/_confKey/の効果 ... ?リンクの時に/summaries/PaperSurveyTest でリンク指定していて、この時params.confKeyにはPaperSurveyTestが入っている。
  - 以上より、summaries/index.vue以外のファイルを呼び出したい、事務作業QAの場合はerrands_qa/_group/index.vueを準備するのが良い
- もう一点、_page.vueなどで`<summary-card :summary="summary" :conf-key="confKey"/>`でSummaryCard.vueのコンポーネントが呼び出されている様子。SummaryCard->summary-cardの変換を自動でやってくれる？
  - ここにhttps://vuejs.org/v2/style-guide/#Multi-word-component-names-essential　Essentialって書いてあるが、等価と捉えていいのか？どこかで見た気がする。。
- https://nuxtjs.org/ja/docs/directory-structure/pages も重要そう。asyncDataの中の作法
# nlpaperchallenge-homepage

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
