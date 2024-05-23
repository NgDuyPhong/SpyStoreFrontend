<template>
  <div id="search-results">
    <div id="filters">
      <v-text-field
          v-model="filter.searchText"
          label="Search"
          outlined
      ></v-text-field>

      <v-checkbox
          label="Show only favorite"
          v-model="showOnlyFavorite"
      >
      </v-checkbox>
    </div>

    <div id="sort">
      <v-select
          label="Sort by"
          :items="sortOptions"
          v-model="sortOption"
          return-object
      ></v-select>

      <div class="total-items">
        <label>Total items: </label>
        {{ totalItems }}
      </div>

      <div class="total-items">
        <label>From {{ startItemIndex + 1 }}</label>
        &nbsp;
        <label>To {{ (endItemIndex + 1) > totalItems ? totalItems : (endItemIndex + 1)}} </label>
      </div>
    </div>

    <div id="items-container">
      <div
          v-for="(item, index) in pagedItems"
          :key="index"
          class="item-container"
      >
        <div class="favorite">
          <v-icon
              @click="favoriteItem(item)"
              v-if="!item.favorite"
          >
            mdi-heart-outline
          </v-icon>

          <v-icon
              @click="unfavoriteItem(item)"
              color="red"
              v-if="item.favorite"
          >
            mdi-heart
          </v-icon>
        </div>

        <div>
          <v-img
              class="image"
              :src="item.mainImage"
              contain
          ></v-img>
        </div>

        <label>{{ item.title }}</label>

        <div class="item-row asin" @click="openAmazonPage(item)">
          <span>ASIN:</span>
          <span>{{ item.asin }}</span>
        </div>

        <div class="item-row">
          <label>Ratings:</label>
          <label>{{ item.reviewsText }}</label>
        </div>

        <div class="item-row">
          <label>Rank: </label>
          <label>{{ item.rankText }}</label>
        </div>

        <div class="item-row">
          <label>Date first available:</label>
          <label>{{ item.dateFirstAvailable }}</label>
        </div>

        <div class="item-row">
          <label>Brand:</label>
          <label>{{ item.brand }}</label>
        </div>
      </div>
    </div>

    <div id="pagination">
      <v-select
          label="Items per page"
          :items="rowsPerPageItems"
          v-model="itemsPerPage"
      >
      </v-select>

      <div class="total-items">
        <label>Page </label>&nbsp; {{ page }} &nbsp; / &nbsp; {{ totalPages }}
        &nbsp;
        <v-icon
            @click="page -= 1"
            :disabled="page === 1"
        >mdi-arrow-left</v-icon>

        <v-icon
            @click="page += 1"
            :disabled="page === totalPages"
        >mdi-arrow-right</v-icon>
      </div>
    </div>
    <v-snackbar v-model="snackbar" :timeout="5000">Reload success</v-snackbar>
  </div>
</template>

<script>
import {cloneDeep, orderBy} from "lodash";

export default {
  name: 'search-results',

  props: {
    items: Array,
  },

  data() {
    return {
      overlay: false,
      snackbar: false,
      filter: {},
      filteredItems: [],
      searchIds: [],
      menu: false,
      showOnlyFavorite: false,
      sortOptions: [
        {
          text: 'Rank',
          value: 'rank',
        },
        {
          text: 'Date first available',
          value: 'addedDate',
        }
      ],

      sortOption: {},
      itemsPerPage: 40,
      rowsPerPageItems: [
        {
          text: 40,
          value: 40,
        },
        {
          text: 80,
          value: 80,
        },
        {
          text: 'All',
          value: -1,
        },
      ],
      page: 1,
    };
  },

  computed: {
    pagedItems() {
      return this.filteredItems.slice(this.startItemIndex, this.endItemIndex);
    },

    totalItems() {
      return this.filteredItems.length;
    },

    startItemIndex() {
      return (this.page - 1) * this.itemsPerPage;
    },

    endItemIndex() {
      return (this.page * this.itemsPerPage) - 1;
    },

    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },

  watch: {
    items: {
      async handler(items) {
        if (items) {
          this.filteredItems = cloneDeep(items);
        }
      },

      deep: true,
    },

    showOnlyFavorite: {
      async handler(favorite) {
        this.filteredItems = this.items.filter(item => !favorite || item.favorite === favorite);
      },
    },

    filter: {
      async handler(filter) {
        this.filteredItems = this.items.filter(item => item.title.toLowerCase().includes(filter.searchText.toLowerCase()));
        this.page = 1;
      },

      deep: true,
    },

    sortOption: {
      async handler(sort) {
        if (sort.value === 'rank') {
          this.filteredItems = orderBy(this.filteredItems, 'rank');
        }

        if (sort.value === 'addedDate') {
          this.filteredItems = orderBy(this.filteredItems, (item) => new Date(item.addedDate).getTime(), 'desc');
        }
      },

      deep: true,
    },

    itemsPerPage() {
      this.page = 1;
    },
  },

  methods: {
    async favoriteItem(item) {
      item.favorite = true;
      await this.$to(this.$http.put(item.links.find(link => link.rel === 'favorite_item').href));
    },

    async unfavoriteItem(item) {
      item.favorite = false;
      await this.$to(this.$http.put(item.links.find(link => link.rel === 'unfavorite_item').href));
    },

    openAmazonPage(item) {
      window.open(item.productUrl, '_blank');
    },

    getItemRankText(item) {
      return item.rankText && item.rankText.split('#')[1]
          .split('(')[0];
    },
  },
}
</script>

<style lang="stylus" scoped>
#pagination
  display grid
  grid-template-columns 1fr 1fr 6fr
  grid-gap 20px
  margin-top 20px

.total-items
  display flex
  align-items center
  justify-content center

#sort
  display grid
  grid-template-columns 1fr 1fr 8fr
  grid-gap 20px

#search-results
  padding 20px

.red--text
  color red

#search-text
  display grid
  grid-template-columns 3fr 1fr 1fr
  grid-gap 20px
  margin-bottom 20px

.item-container
  display flex
  flex-direction column
  row-gap 10px
  border 0.5px solid grey
  padding 10px
  min-width 0

  &:hover
    background-color aqua

.image
  border-radius 5px
  max-width 100%
  border 1px solid white

.item-row
  display flex
  justify-content space-between

.filters-option
  display grid
  grid-template-columns 1fr 1fr 1fr
  grid-gap 20px

.asin
  color cornflowerblue
  cursor pointer
  width 100%
  display flex

#filters
  display grid
  grid-template-columns 4fr 1fr
  grid-gap 20px
</style>
