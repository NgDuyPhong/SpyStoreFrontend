<template>
  <div id="search-error--container">
    <div
        class="search-error--row"
        v-for="(error, index) in uniqSearchErrors"
        :key="index"
    >
      <div>
        <label>{{ index + 1 }}</label>
      </div>

      <div>
        <a class="error-link" :href="error.pageUrl" target="_blank">{{ error.pageUrl }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import {uniqBy} from "lodash";

export default {
  name: 'search-errors',

  data() {
    return {
      searchErrors: [],
    };
  },

  async mounted() {
    await this.fetchSearchErrors();
  },

  computed: {
    uniqSearchErrors() {
      return uniqBy(this.searchErrors, 'productId');
    },
  },

  methods: {
    async fetchSearchErrors() {
      const [resp, err] = await this.$to(this.$http.get('http://34.27.44.242:8030/v1/errors'));

      if (resp) {
        this.searchErrors = resp.data;
      } else if (err) {
        console.log('err' ,err);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
#search-error--container
  max-width 1000px
  margin auto
  display grid
  grid-template-columns 1fr
  grid-gap 10px

  .search-error--row
    display grid
    grid-template-columns 20px 1fr
    grid-gap 10px
    border 1px solid grey

  .error-link
    text-align start
</style>
