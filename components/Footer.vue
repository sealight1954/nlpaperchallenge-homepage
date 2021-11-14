<template>
  <footer class="footer mt-5">
    <div class="container">
      <div class="text-center mt-5 mb-5">
          <a class="unstyled" href="https://twitter.com/" target="_blank">
            <font-awesome-icon class="mr-5" :icon="['fab', 'twitter']" size="2x" />
          </a>
          <a class="unstyled" href="https://github.com/" target="_blank">
            <font-awesome-icon class="mr-5" :icon="['fab', 'github']" size="2x" />
          </a>
          <a class="unstyled" href="https://www.slideshare.net/" target="_blank">
            <font-awesome-icon :icon="['fab', 'slideshare']" size="2x" />
          </a>
      </div>
    </div>
    <div class="bg-info">
        <h5 class="text-center pt-2 pb-2 mb-0">&copy;2019 nlpaper.challenge</h5>
    </div>
  </footer>
</template>

<style>
a.unstyled {
  color: inherit;
}
a.unstyled:hover {
  text-decoration: none;
}
</style>
