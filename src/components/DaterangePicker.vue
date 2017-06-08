<template>
  <el-date-picker v-model="rangeValue" type="daterange" align="left" placeholder="Date Range" :picker-options="pickerOptions" :format="format">
  </el-date-picker>
</template>

<script>
import moment from 'moment'
import { mapMutations } from 'vuex'


export default {
  props: ['dateRange'],
  data() {
    return {
      format: 'yyyy/MM/dd', 
      pickerOptions: {
        shortcuts: [
          {
            text: 'Today',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: 'Last Year',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: 'All',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 100);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      rangeValue: ''
    };
  },
  methods: {
    ...mapMutations({
      setCalendar: 'setCalendar'
    }),
    formatDate(value) {
      return moment(value).format('DD/MM/YYYY')
    }
  },
  watch: {
    rangeValue(value) {
      this.setCalendar({ dateRange: value })
    }
  }
}
</script>

<style scoped>

</style>
