<template>
  <div>
    <!-- breadcrumb section -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Main Page</el-breadcrumb-item>
      <el-breadcrumb-item>Statistics</el-breadcrumb-item>
      <el-breadcrumb-item>Data Report</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 750px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script type="text/javascript">
import Vue from 'vue'
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data: function () {
    return {
      graphData: {},
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  created: async function () {
  },
  mounted: async function () {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await Vue.axios.get('reports/type/1')
    if (res.meta.status === 200) {
      this.graphData = _.merge(res.data, this.options)
      console.log(res.data)
    } else {
      this.$message.error('failed to request data for graph')
    }
    myChart.setOption(this.graphData)
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
