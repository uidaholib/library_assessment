<template>
  <el-date-picker class="date-range-picker" v-model="rangeValue" type="datetimerange" align="left" placeholder="Date Range" :picker-options="pickerOptions" :format="format">
  </el-date-picker>
</template>

<script>
import moment from 'moment'
import { mapMutations, mapGetters } from 'vuex'


export default {
  props: ['dateRange', 'timeScope'],
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
  computed: {
    ...mapGetters({
      calendar: 'getCalendar'
    })
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
      let startHour, endHour
      if (this.timeScope) {
        switch (this.timeScope) {
          case 'All Hours':
            startHour = 0 //00am
            endHour = 23 //11pm
            break;
          case 'Day (6AM-6PM)':
            startHour = 6 //6am
            endHour = 17 //5:59pm -> 6pm
            break
          case 'Night (6PM-6AM)':
            startHour = 18 //6pm
            endHour = 29 // 23 + 6 hour => 6am
            break
          default:
            break
        }
        const payload = [startHour, endHour]
        this.setCalendar({ dateRange: value, timeScopes: payload })
      }
      else {
        this.setCalendar({ dateRange: value })
      }
    }
  },
}
</script>

<style scoped>
.date-range-picker {
  width: 200px;
}
</style>
