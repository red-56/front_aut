<template>
  <div>

    <select v-if="admin" id="listTeams">
        <option>Choisissez une équipe</option>
        <option v-for="team in myTeams" :key="team.id" :value="team.id" v-on:click="selectedValue">{{ team.name }}</option>
    </select>

    <select v-if="manager" id="listTeams">
        <option>Choisissez une équipe</option>
        <option v-for="team in myTeams" :key="team.id" :value="team.id" v-on:click="selectedValue">{{ team.name }}</option>
    </select>

    <br><br>
    <center><button v-on:click="display">Afficher le graph</button></center>
    <br/>
    <div class="graph" ref="chartdiv"></div>

  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import DashboardLayout from '@/pages';
import moment from 'moment';

am4core.useTheme(am4themes_animated);

export default {
  name: 'TeamGraph',
  data() {
    return {
      admin: null,
      manager: null,
      allTeams: [],
      myTeams: [],
      name: '',
      nameState: 'null',
      teamId: null,
      teamName: null,
      managerId: null,
      nameTeam: null
    }
  },
  
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  created() {
    this.checkRole();
    this.getTeams();
  },
  mounted() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
        chart.data = [];
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
  methods: {
    selectedValue(e){
      this.teamId = e.target.value;
    },
    checkRole() {
      if (jwt_decode(localStorage.getItem('token')).role == 'Administrator') {
        this.admin = true;
        this.manager = false;
      } else if (jwt_decode(localStorage.getItem('token')).role == 'Manager') {
        this.manager = true;
        this.admin = false;
      } else {
        this.admin = false;
        this.manager = false;
      }
    },
    getTeams() {
      axios.get('http://localhost:3000/api/teams', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      })
      .then((response) => {
          this.allTeams = response.data;
        if (jwt_decode(localStorage.getItem('token')).role == 'Administrator') {
            this.myTeams = this.allTeams;
        } else if (jwt_decode(localStorage.getItem('token')).role == 'Manager') {
            for (var i = 0; i < this.allTeams.length; i++) {
            if (this.allTeams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
              this.myTeams.push(this.allTeams[i]);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      }) 
    },
    display() {
      if (this.teamId == null) {
        alert('Erreur: aucune team selectionnée');
      } else {
        this.update_data();
      }
    },
  update_data() {
    var self = this;
    var graphData = [];
    axios.get('http://localhost:3000/api/workingtimes/team/' +  this.teamId, {
      headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
    })
    .then(function(result) {
    var data = result.data;
    var employees = [];
    var dailyHours = 0;
    var index, obj;
    data.forEach(obj => {
    if (!(obj.employeeId in employees)) {
    employees.push(obj.employeeId);
    }
    });
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
    })
    .then(() => {
      self.chart.data = graphData
    })
  }
  }
};
</script>

<style>
#listTeams {
  width: 80%;
  display: block;
  margin: 0 auto;
}
.graph {
  width: 100%;
  height: 500px;
}
</style>
