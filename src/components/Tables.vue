<template>
  <v-card>
    <v-card-title>
      <h5>{{tableTitle.title}}</h5>
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-card-text>
      <h6 class="text-xs-left">{{tableTitle.subtitle}}</h6>
    </v-card-text>
    <v-data-table v-bind:headers="headers" v-bind:items="items" v-bind:search="search">
      <template slot="items" scope="props">
        <td class="text-xs-right" v-tooltip:right="{ html: toDate(props.item.date) }">{{ props.item.date | formatDate }}</td>
        <td class="text-xs-right">{{ props.item.use }}</td>
        <td class="text-xs-right">{{ props.item.numberOfUsers }}</td>
      </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
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
    },
    available() {
      return (this.items && this.items.length)
    }
  },
  methods: {
    toDate(value) {
      return moment(value).utc().format('ddd, MMM Do YYYY, h:mm a')
    }
  },
  mounted() {
  },
  filters: {
    formatDate(value) {
      return moment(value).format('MM/DD/YYYY')
    }
  }
}
</script>

<style scoped>

</style>
