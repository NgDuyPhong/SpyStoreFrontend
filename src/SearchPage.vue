<template>
  <div id="search-page">
    <v-overlay :value="overlay"></v-overlay>
    <div id="filters">
      <div class="filters-option">
        <v-text-field
            label="Rank from"
            v-model="filter.higherThanRank"
        ></v-text-field>

         <v-text-field
             label="Rank to"
             v-model="filter.lessThanRank"
         ></v-text-field>
      </div>

      <div class="filters-option">
       <date-input
           :input-date="filter.afterDate"
           label="Added date from"
           ref="afterDate"
       >
        </date-input>

        <date-input
            v-model="filter.beforeDate"
            label="Added date to"
            ref="beforeDate"
        >
        </date-input>

        <v-btn @click="clearDate()">Clear date</v-btn>
      </div>

      <div class="filters-option">
        <v-text-field
            label="Review from"
            v-model="filter.higherThanReview"
        ></v-text-field>

        <v-text-field
            label="Review to"
            v-model="filter.lessThanReview"
        ></v-text-field>
      </div>

      <div></div>

      <div id="btn-container">
        <v-btn @click="search()" class="ml-5">Search</v-btn>
        <v-btn @click="openConfirmDeleteData()">Delete data</v-btn>
      </div>
    </div>

    <div id="search-results">
      <search-results
          :items="items"
      ></search-results>
    </div>

    <v-dialog
      v-model="confirmationModal"
      max-width="500"
    >
      <div id="confirmation-modal">
        <label>Are you sure to delete data?</label>

        <v-btn @click="deleteData()">Yes</v-btn>
        <v-btn @click="confirmationModal = false">No</v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>

import SearchAlias from "@/search/search-alias-enum";
import SearchResults from "@/SearchResults";
import DateInput from "@/components/DateInput";

export default {
  name: 'search-page',
  components: {DateInput, SearchResults},

  data() {
    return {
      filter: {},
      categories: SearchAlias,
      overlay: false,
      items: [],
      snackbar: false,
      confirmationModal: false,
    };
  },

  mounted() {
    const previousFilter = localStorage.getItem("filter");

    if (previousFilter) {
      this.filter = JSON.parse(previousFilter);
    }
  },

  methods: {
    async search() {
      this.filter.afterDate = this.$refs.afterDate.getDate();
      this.filter.beforeDate = this.$refs.beforeDate.getDate();

      const [resp, err] = await this.$to(this.$http.get('http://34.27.44.242:8030/extensions/products', {params: this.filter}));

      if (resp) {
        this.items = resp.data;
        localStorage.setItem("filter", JSON.stringify(this.filter));
      } else if (err) {
        console.log('Error', err);
      }
    },

    openConfirmDeleteData() {
      this.confirmationModal = true;
    },

    async deleteData() {
      this.confirmationModal = false;
      const [resp, err] = await this.$to(this.$http.delete('http://34.27.44.242:8030/extensions/products'));

      if (resp) {
        await this.search();
      } else if (err) {
        console.log('Error', err);
      }
    },

    clearDate() {
      this.filter.afterDate = '';
      this.filter.beforeDate = '';
      this.$refs.afterDate.clearDate();
      this.$refs.beforeDate.clearDate();
    },
  },
}
</script>

<style lang="stylus">
#btn-container
  display flex
  width 100%
  align-items center
  column-gap 20px

#search-results
  background-color white
  margin-top 60px

#search-page
  padding 60px
  background-color rgb(250, 250, 250)

#filters
  display grid
  grid-template-columns 1fr
  grid-gap 20px
  background-color white
  padding 20px

#items-container
  display grid
  grid-template-columns 1fr 1fr 1fr 1fr
  grid-gap 20px
  margin-top 20px

.item-container
  display flex
  flex-direction column
  row-gap 10px
  border 0.5px solid grey
  padding 10px

.image
  border-radius 5px
  max-width 100%
  border 1px solid white
  max-height 200px

.item-row
  display flex
  justify-content space-between

.filters-option
  display grid
  grid-template-columns 1fr 1fr 1fr
  grid-gap 20px

#confirmation-modal
  display flex
  background-color white
  row-gap 20px
  padding 20px
  flex-direction column
</style>
