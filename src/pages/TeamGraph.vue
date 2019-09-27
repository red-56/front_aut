<template>
  <div class="hello" ref="chartdiv"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import DashboardLayout from '@/pages';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

am4core.useTheme(am4themes_animated);

export default {
  name: 'TeamGraph',
  mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    let token = localStorage.getItem('token');
    if (token == null) {
      // ya pas de token
    }
    let teamid = 1;

    axios.get('http://localhost:3000/api/workingtimes/team/' +  teamid, {
      headers: {Authorization: 'Bearer ' + token}
      })
    .then(function(result) {
      var data = result.data;

      var graphData = [];
      var employees = [];
      var dailyHours = 0;
      var index, obj;

      data.forEach(obj => {
        console.log(obj);
        if (!(obj.employeeId in employees)) {
          employees.push(obj.employeeId);
        }
      });
      console.log(employees);
      for (var [index, obj] of data.entries()) {
        var start = moment(obj.start);
        var end = moment(obj.end);
        dailyHours += end.diff(start, 'hours');
        if (data[index+1] == undefined || !(moment(data[index+1].start).isSame(start, 'day'))) {
           graphData.push({
            date: `${start.year().toString()}-${(start.month() + 1).toString()}-${start.date().toString()}`,
            hours: dailyHours / employees.length
          });
          dailyHours = 0;
        }
      }
      chart.data = graphData;
    })
    chart.dateFormatter.dateFormat = "yyyy-MM-dd";
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "hours";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";
    series.dataFields.value = "hours";
    series.columns.template.width = am4core.percent(50);

    series.tooltip.pointerOrientation = "vertical";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;

    //chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarX = new am4core.Scrollbar();

    this.chart = chart;
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  components: {
    DashboardLayout
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 100%;
  height: 500px;
}
</style>
