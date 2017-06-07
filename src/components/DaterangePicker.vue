<template>
  <el-date-picker v-model="rangeValue" type="daterange" align="left" placeholder="Pick a range" :picker-options="pickerOptions">
  </el-date-picker>
</template>

<script>
import moment from 'moment'
import { mapMutations } from 'vuex'


export default {
  props: ['dateRange'],
  data() {
    return {
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
          }, {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      rangeValue: ''
    };
  },
  methods: {
   ...mapMutations({
      setCalendar: 'setCalendar'
    }),
  },
  watch: {
    rangeValue(value) {
      this.setCalendar({dateRange: value})
    }
  }
}
</script>

<style scoped>

</style>
