<template>
  <div>
    <table class="table table-striped table-hover" v-if="admin">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Nom de l'équipe</th>
                <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{id, name} in myTeams" :key="id">
                <td><b>{{ id }}</b></td>
                <td><b>{{ name }}</b></td>
                <td><button v-on:click="edit(id)">Editer</button> | <button v-on:click="remove(id)">Supprimer</button></td>
                </tr>
            </tbody>
      </table>

      <table class="table table-striped table-hover" v-if="manager">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Nom de l'équipe</th>
                <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="myTeam in myTeams" :key="myTeam.id">
                <td><b>{{ myTeam.id }}</b></td>
                <td><b>{{ myTeam.name }}</b></td>
                <td><button v-on:click="edit(myTeam.id)">Editer</button> | <button v-on:click="remove(myTeam.id)">Supprimer</button></td>
                </tr>
            </tbody>
      </table>

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
      nameState: 'null'
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
          console.log(this.myTeams);
        }
      })
      .catch((error) => {
        console.log(error);
      })
    },

    edit(id) {
      alert('ho')
    },

    remove(id) {

      axios.delete('http://localhost:3000/api/teams/' + id, {
              headers: {
                      Authorization: 'Bearer ' + localStorage.getItem('token')
              }
      }).then(response => {
              this.getTeams();
              Swal.fire(
                      'Supprimé!',
                      'success'
              )
      }).catch(err => {
              Swal.fire({
                      type: 'error',
                      title: 'Erreur',
                      text: 'Suppression impossible'
              })
      });
    },

    display() {
      alert('GRAPH');
    }
  }
};
</script>
