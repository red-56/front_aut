<template>
    <div>
        <b-card-text>
            &nbsp;&nbsp;&nbsp;Start: <date-picker format="DD/MM/YYYY HH:mm:ss" valueType="format" v-model="setStart" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
        </b-card-text>
        <b-card-text>
            &nbsp;&nbsp;&nbsp;End: &nbsp;&nbsp;<date-picker format="DD/MM/YYYY HH:mm:ss" valueType="format" v-model="setEnd" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
        </b-card-text>
        <br><br><br>
        <select id="listUsers">
            <option>Choisissez un utilisateur</option>
            <option v-for="user in users" :key="user.id" :value="user.id" v-on:click="selectedValue">{{ user.first_name }} / {{ user.last_name }} / {{ user.role }}</option>
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
import moment from 'moment';
import DatePicker from 'vue2-datepicker'

am4core.useTheme(am4themes_animated);

export default {
    name: 'UserGraph',

    components: {
        DatePicker
    },
    data() {
        return {
            // FOR ROLES
            admin: null,
            manager: null,

            // CASE ADMIN
            users: [],

            // CASE MANAGER
            allTeams: [],
            myTeams: [],
            myUsers: [],
            myUsersInfo: [],
            myUsersInfoUnique: [],

            // FOR ALL
            userId: null,
            setStart: null,
            setEnd: null,

            shortcuts: [
                {
                    text: 'OK',
                    onClick: () => {
                        this.setArrival = [new Date()],
                        this.departure = [new Date()]
                    }
                }
            ],
            timeOptions: {
                start: '',
                step: '',
                end: ''
            },
            lang: {
                days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
        }
    },
    created() {
        this.checkRole();
        this.getUsers();
        this.getMyUsers();
    },
    mounted() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
        chart.data = [];
        // XY
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

        selectedValue(e) {
            this.userId = e.target.value;
        },

        checkRole() {
            if (jwt_decode(localStorage.getItem('token')).role == 'Administrator') {
                this.admin = true;
            } else if (jwt_decode(localStorage.getItem('token')).role == 'Manager'){
                this.manager = true;
                this.admin = false;
            } else {
                this.admin = false;
                this.manager = false;
            }
        },

        getUsers() {
            axios.get('http://localhost:3000/api/users', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.users = response.data;
                this.users.splice(0, 1);
            })
            .catch((errors) => {
                console.log(errors);
            })
        },

    

        getMyUsers() {

            // GET ALL THE TEAMS
            axios.get('http://localhost:3000/api/teams', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.allTeams = response.data;

                // GET MY TEAMS ONLY
                for (var i = 0; i < this.allTeams.length; i++) {
                    if (this.allTeams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
                        this.myTeams.push(this.allTeams[i]);
                    }
                }

                // GET MY USERS
                for (var j = 0; j < this.myTeams.length; j++) {
                    axios.get('http://localhost:3000/api/teamscontent/team/' + this.myTeams[j].id, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then((resp) => {
                        for (var k = 0; k < resp.data.length; k++) {
                            this.myUsers.push(resp.data[k]);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }

                console.log(this.myUsers.length);
               
                
            })
            .catch((error) => {
                console.log(error);
            });

            

        },
        display() {
            if (this.userId == null) {
                alert('Erreur: aucun utilisateur selectionné');
            } else {
                this.update_data();
            }
        },
        update_data() {
            var self = this;
            axios.get('http://localhost:3000/api/workingtimes/user/' +  this.userId, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
            })
            .then(function(result) {
            var data = result.data;
            var graphData = [];
            var dailyHours = 0;
            var index, obj;

            for (var [index, obj] of data.entries()) {
                var start = moment(obj.start);
                var end = moment(obj.end);
                dailyHours += end.diff(start, 'hours');
                if (data[index+1] == undefined || !(moment(data[index+1].start).isSame(start, 'day'))) {
                graphData.push({
                    date: `${start.year().toString()}-${(start.month() + 1).toString()}-${start.date().toString()}`,
                    hours: dailyHours
                });
                dailyHours = 0;
                }
            }
            self.chart.data = graphData;
            })
        },
    }
}
</script>

<style>
#listUsers {
    width: 80%;
    display: block;
    margin: 0 auto;
}
.graph {
  width: 100%;
  height: 500px;
}
</style>
