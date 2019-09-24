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
                <td><b><button v-on:click="edit(id)">Editer</button> | <button v-on:click="remove(id)">Supprimer</button></b></td>
                </tr>
            </tbody>
      </table>
  </div>
</template>

<script>

import axios from 'axios';
import Swal from 'sweetalert2';

export default {

  name: 'TeamGraph',

  data() {
    return {
      allTeams: [],
      myTeams: []
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
      Swal.fire({
                title: 'Êtes vous sûr de vouloir supprimer cette team ?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui supprimer'
                }).then((result) => {
                if (result.value) {
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
                        console.log(id);
                    });
                }
            })
    },

    getTeams() {
      axios.get('http://localhost:3000/api/teams', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then((response) => {
      this.allTeams = response.data;

      if (localStorage.getItem('role') == 'Administrator') {
        this.myTeams = this.allTeams;
      } else if (localStorage.getItem('role') == 'Manager') {
        for (var i = 0; i < this.allTeams.length; i=i+1) {
          if (this.allTeams[i].managerId == localStorage.getItem('id')) {
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
