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

  </div>
</template>

<script>

import axios from 'axios';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

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
        alert('GRAPH DE LA TEAM ID: ' + this.teamId);
      }
    },
  }
};
</script>

<style>

#listTeams {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>

