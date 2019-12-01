<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-container>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">
        <b-img
          thumbnail
          height="50"
          width="250"
          :src="require('~/static/image/logo/brand.svg')"
          class="d-inline-block align-top"
          fluid
          alt="Brand"
        />
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/schedule" :active="isActive('/schedule')">スケジュール</b-nav-item>
          <b-nav-item to="/members" :active="isActive('/members')">メンバー</b-nav-item>
          <b-nav-item to="/resources" :active="isActive('/resources')">リソース</b-nav-item>
          <b-nav-item-dropdown
            text="論文サマリ"
            class="mr-3"
          >
            <b-dropdown-item to="/summaries/acl2019" :active="isActive('/summaries/acl2019')">ACL 2019</b-dropdown-item>
            <b-dropdown-item to="/summaries/emnlp2019" :active="isActive('/summaries/emnlp2019')">EMNLP 2019</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-button
            href="http://xpaperchallenge.org/cv/"
            variant="primary main-button"
            target="_blank"
          >
            <span>cvpaper.challenge</span>
            <font-awesome-icon icon="external-link-alt" />
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  methods: {
    isActive(path) {
      return this.$router.path == path;
    }
  }
};
</script>

<style>
.main-button {
  border-radius: 25px;
}
</style>
