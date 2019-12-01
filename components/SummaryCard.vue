<template>
  <b-card class="with-shadow">
    <b-media>
      <h5 class="mt-0"><nuxt-link :to="`/summaries/${confKey}/${summary.id}`">{{ summary.title }}</nuxt-link></h5>
      <div>by: {{ summary.resumer }}</div>
      <nuxt-link :to="`/summaries/${confKey}/tag/${normalizeTag(tag)}`" class="tag tag-primary mr-2" v-for="(tag, idx) in nonEmptyTags" :key="idx">
        {{ tag }}
      </nuxt-link>
    </b-media>
  </b-card>
</template>

<script>
export default {
  props: {
    summary: Object,
    confKey: String
  },
  computed: {
    nonEmptyTags() {
      // Filter undefined tag
      return this.summary.tags.filter(tag => tag)
    }
  },
  methods: {
    normalizeTag(tag) {
      return tag.toLowerCase().replace(/\s+/g, '-').replace('#', '')
    }
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
