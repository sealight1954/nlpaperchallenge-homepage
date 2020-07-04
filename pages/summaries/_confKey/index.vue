<template>
  <div>
    <b-jumbotron header-level="4">
      <template slot="header">
        <b-container>
          <div class="text-center">論文サマリ</div>
        </b-container>
      </template>
      <template slot="lead">
        <b-container>
          <div class="text-center">{{ confKey }}</div>
        </b-container>
      </template>
    </b-jumbotron>

    <b-container v-if="!isLoading">
      <div class="mb-4">
        <b-pagination
          :value="1"
          :total-rows="totalCount"
          :per-page="5"
          align="center"
          @change="handleChangePage">
        </b-pagination>
      </div>
      <div class="mb-4" v-for="(summary, idx) in summaries" :key="idx">
        <summary-card :summary="summary" :conf-key="confKey"/>
      </div>
      <b-pagination
        :value="1"
        :total-rows="totalCount"
        :per-page="5"
        align="center"
        @change="handleChangePage">
      </b-pagination>
    </b-container>
    <p v-else class="text-center">
      <font-awesome-icon class="mr-5" :icon="['fas', 'spinner']" pulse size="2x"/>
    </p>
  </div>
</template>

<script>
import SummaryCard from "~/components/SummaryCard.vue";
import axios from "axios";

export default {
  components: {
    SummaryCard
  },
  asyncData({ params }) {
    let confKey = params.confKey
    let summaries = [];
    let totalCount = 0;
    try {
      let ret = require(`~/static/data/summaries/${confKey}/page/1/list.json`);
      summaries = ret["content"];
      totalCount = ret["meta"]["totalCount"]
    }
    catch(e) {
    }
    let header = require(`./header.json`)[confKey];
    return {
      summaries,
      confKey,
      totalCount,
      isLoading: false,
      header
    }
  },
  methods: {
    handleChangePage(page) {
      this.$router.push(`/summaries/${this.confKey}/page/${page}`);
    }
  },
  head() {
    return this.header;
  },
};
</script>
