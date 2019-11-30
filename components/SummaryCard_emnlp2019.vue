<template>
  <b-card class="with-shadow">
    <b-media>
      <h5 class="mt-0">
        <nuxt-link :to="`/summaries_emnlp2019/${summary.id}`">{{ summary.title }}</nuxt-link>
      </h5>
      <div>by: {{ summary.resumer }}</div>
      <nuxt-link
        :to="`/summaries_emnlp2019/tag/${tag.toLowerCase()}`"
        class="tag tag-primary"
        v-for="(tag, idx) in summary.tags"
        :key="idx"
      >{{ tag }}</nuxt-link>
    </b-media>
  </b-card>
</template>

<script>
export default {
  props: {
    summary: Object
  }
};
</script>

<style>
.tag {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: bold;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 5rem;
}
.tag-primary {
  background-color: #1dbba6;
}
</style>
