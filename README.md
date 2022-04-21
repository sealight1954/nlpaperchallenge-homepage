# Read Excel Sample
本リポジトリは[xpaperchallenge/nlpaperchallenge-homepage](https://github.com/xpaperchallenge/nlpaperchallenge-homepage)をもとにローカルに配置したエクセルから論文サマリーを抽出するように変更したものです。

# 自分用メモ

## 2022.04.22 デバッグ方法
- https://nullpoint.hatenablog.com/entry/2019/10/14/210107
- package.json, nuxt.config.jsonを書き換える．昔やった気がしたができてない？
## 親ディレクトリ、呼び出し元からの情報のもらい方。
- 例えばcomponents/SummaryCard.vueはsummaryとconfKeyをprops(プロパティ,入力)として持っていて、1つの論文要約の情報にアクセスして表示できる。これは具体的にはどこからもらっている？
- nuxt.config.jsの中で動的なルーティングを行なっている。 https://nuxtjs.org/ja/docs/features/file-system-routing/
  - .../_confKey/があったら、そのcomponentは.../_confKey/index.vueになる。
  - `.../_confKey/index.vue`中の`asyncData({ params }) {`のparamsには、confKeyが属性として入っている。これは/_confKey/の効果 ... ?リンクの時に/summaries/PaperSurveyTest でリンク指定していて、この時params.confKeyにはPaperSurveyTestが入っている。
  - 以上より、summaries/index.vue以外のファイルを呼び出したい、事務作業QAの場合はerrands_qa/_group/index.vueを準備するのが良い
- もう一点、_page.vueなどで`<summary-card :summary="summary" :conf-key="confKey"/>`でSummaryCard.vueのコンポーネントが呼び出されている様子。SummaryCard->summary-cardの変換を自動でやってくれる？
  - ここにhttps://vuejs.org/v2/style-guide/#Multi-word-component-names-essential　Essentialって書いてあるが、等価と捉えていいのか？どこかで見た気がする。。
- https://nuxtjs.org/ja/docs/directory-structure/pages も重要そう。asyncDataの中の作法

## asyncDataの中の作法
```
return {
      id,
      confKey,
      summary,
      totalCount,
      isLoading: false,
      header
    };
```
- としている箇所が_id, index, _page, _tagそれぞれである。それぞれから_id.vueに遷移できて、<template>の中で個々のsummaryを表示
- summary-cardはindex, pageなどで呼ばれて、_idとtag表示用。
  ```
  <nuxt-link :to="`/summaries/${confKey}/${summary.id}`">{{ summary.title }}</nuxt-link>
  ```
  の部分

## summaries部分を_articleKeyなど？
どうやって複数の記事typeを持たせる？
- summaries
- qa
どうする？
- index.vueを作る？

- _idの中で分岐
  - confKeyに応じて表示内容変える。
  - 美しくない。。
summary-cardの中で分岐？
- 異なる_id
## 新しい形式の_id?
- _idだけ異なる
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
