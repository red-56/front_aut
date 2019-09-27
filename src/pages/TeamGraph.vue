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
    <center><button v-on:click="display">Afficher le graph</button>&nbsp;&nbsp;&nbsp;<b-button v-b-modal.edit-team v-on:click="edit" v-if="admin">Editer</b-button>&nbsp;&nbsp;&nbsp;<button v-on:click="remove" v-if="admin">Supprimer</button></center>

    <b-modal id="edit-team" ref="modal" title="Modifier cette équipe" @show="resetModal" @hidden="resetModal" @ok="handleOk">
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label="Nom de l'équipe" label-for="nameTeam">
                    <b-form-input id="nameTeam" v-model="nameTeam"></b-form-input>
                </b-form-group>
            </form>
    </b-modal>

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

    edit(teamName) {
      console.log(this.teamId);
      
      if (this.teamId == null) {
        alert('Erreur: aucune équipe selectionnée');
      } else {
        axios.get('http://localhost:3000/api/teams/' + this.teamId, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then((resp) => {
          this.teamName = resp.data.name;
          this.managerId = resp.data.managerId;
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },

    remove() {

      if (this.teamId == null) {
        alert('Erreur: aucune équipe selectionnée');
      } else {
        axios.delete('http://localhost:3000/api/teams/' + this.teamId, {
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
      }

      console.log(this.teamId);
    },

    display() {
      if (this.teamId == null) {
        alert('Erreur: aucune team selectionnée');
      } else {
        alert('GRAPH DE LA TEAM ID: ' + this.teamId);
      }
    },

    // ###########################################################################

    resetModal() {
            this.nameTeam = this.teamName;
    },

        handleOk(bvModalEvt) {
          // Prevent modal from closing
          bvModalEvt.preventDefault()
          // Trigger submit handler
          this.handleSubmit()
        },

        handleSubmit() {

            axios.put('http://localhost:3000/api/teams/' + this.teamId, {name: this.nameTeam, managerId: this.managerId}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                alert('Equipe mise à jour avec succès');
            })
            .catch((error) => {
                console.log(error);
            });
            this.$nextTick(() => {
                this.$refs.modal.hide()
            })
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

