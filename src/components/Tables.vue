<template>
  <v-card class="mt-4" v-if="items.length !== 0">
    <v-card-title>
      <h5>{{tableTitle.title}}</h5>
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-card-row class="pl-4">
      <h6>{{tableTitle.subtitle}}</h6>
    </v-card-row>
    <v-card-row>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template slot="headers" scope="props">
          <span v-tooltip:bottom="{ 'html': props.item.text }">
            {{ props.item.text }}
          </span>
        </template>
        <template slot="items" scope="props">
          <td class="text-xs-left" v-tooltip:top="{ html: toDate(props.item.date) }">{{ props.item.date | formatDate }}</td>
          <td class="text-xs-right">{{ props.item.use }}</td>
          <td class="text-xs-right">{{ props.item.numberOfUsers }}</td>
        </template>
      </v-data-table>
    </v-card-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      search: '',
      pagination: {}
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters({
      datatable: 'getDataTable'
    }),
    tableTitle() {
      return this.datatable.tableTitle
    },
    headers() {
      return this.datatable.headers
    },
    items() {
      return this.datatable.items
    }
  },
  methods: {
    tableSorter(values) {
      console.log('values')
    },
    toDate(value) {
      return moment(value).utc().format('dddd, MMM Do YYYY, h:mm a')
    }
  },
  mounted() {
  },
  filters: {
    formatDate(value) {
      return moment(value).format('DD/MM/YYYY')
    }
  }
}
</script>

<style scoped>

</style>
