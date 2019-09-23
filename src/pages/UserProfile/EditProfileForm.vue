<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Editez votre profil</h4>
        <p class="category">Complétez votre profil</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Prénom</label>
              <md-input v-model="firstname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Nom</label>
              <md-input v-model="lastname" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>E-mail</label>
              <md-input v-model="email" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Mot de passe</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>
          </div>
          <div></div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" v-on:click="edit">Mettre à jour</md-button>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" v-on:click="remove">Supprimer votre compte</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>


<script>

import axios from 'axios';

export default {

  name: "edit-profile-form",

  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      errors: [],
      currentUser: {},
      lastname: null,
      firstname: null,
      email: null,
      password: null,
      created_at: null,
      updated_at: null,
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    
    fetchData() {
      axios.get('http://localhost:3000/api/users')
      .then((response) => {
          this.currentUser = response.data[0];
          this.lastname = this.currentUser.last_name;
          this.firstname = this.currentUser.first_name;
          this.email = this.currentUser.email;
          this.password = this.currentUser.password;
      })
      .catch((error) => {
          this.errors.push(error);
      })
    },

    edit() {

      this.currentUser.first_name = this.firstname;
      this.currentUser.last_name = this.lastname;
      this.currentUser.email = this.email;
      this.currentUser.password = this.password;
      axios.put('http://localhost:3000/api/users/' + this.currentUser.id, this.currentUser)
      .then((response) => {
          console.log(response);
          alert('MIS A JOUR');
      })
      .catch((e) => {
          this.errors.push(e);
      })
    },

    remove() {
      axios.delete('http://localhost:3000/api/users/' + this.currentUser.id)
      .then((response) => {
          console.log(response);
      })
      .catch((error) => {
          this.errors.push(error);
      })
    }
  }
};

</script>
