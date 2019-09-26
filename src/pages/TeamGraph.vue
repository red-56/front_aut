<template>
  <div>
    <table class="table table-striped table-hover">
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
                <td><button v-on:click="edit">Editer</button> | <button v-on:click="remove(id)">Supprimer</button></td>
                </tr>
            </tbody>
      </table>
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
    this.getTeams();
  },

  methods: {
    edit(id) {//FAIRE LE MODAL
      axios.put('http://localhost:3000/api/teams/' + id, {/*OBJET*/}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((response) => {
        Swal.fire(
                    'Félicitation!',
                    'Team modifiée avec succès',
                    'success'
        )
      })
      .catch((error) => {
          Swal.fire({
              type: 'error',
              title: 'Erreur',
              text: 'Modification impossible'
          })
      });
    },

    remove(id) {
      console.log(id);

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
        for (var i = 0; i < this.allTeams.length; i=i+1) {
          if (this.allTeams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
            this.myTeams.push(this.allTeams[i]);
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }
  }
};
</script>
