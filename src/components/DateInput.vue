<template>
  <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          v-model="date"
          :label="label"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
      ></v-text-field>
    </template>

    <v-date-picker
        color="blue"
        no-title
        v-model="date"
        @input="menu = false"
    >
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    inputDate: String,
    label: String,
  },

  data: () => ({
    date: '',
    menu: false,
  }),

  watch: {
    inputDate: {
      handler(value) {
        if (value) {
          this.date = this.inputDate;
        }
      },

      deep: true,
    },
  },

  methods: {
    getDate() {
      return this.date;
    },

    clearDate() {
      this.date = '';
    },
  },
}
</script>

<style lang="stylus">
.v-date-picker-table .v-btn.v-btn--active
  color dodgerblue
</style>
