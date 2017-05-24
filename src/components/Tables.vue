<template>
  <v-card>
    <v-card-title>
      {{title}}
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-card-row>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template slot="headers" scope="props">
          <span v-tooltip:bottom="{ 'html': props.item.text }">
            {{ props.item.text }}
          </span>
        </template>
        <template slot="items" scope="props">
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="text-xs-right">{{ props.item.use }}</td>
          <td class="text-xs-right">{{ props.item.numberOfUsers }}</td>
        </template>
      </v-data-table>
    </v-card-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

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
    title() {
      return this.datatable.title
    },
    headers() {
      return this.datatable.headers
    },
    items() {
      return this.datatable.items
    }
  }
}
</script>

<style scoped>

</style>
