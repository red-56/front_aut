<template>
    <div>
        <!-- CASE ADMIN -->

        <select v-if="admin" id="listUsers">
            <option>Choisissez un utilisateur</option>
            <option v-for="user in users" :key="user.id" :value="user.id" v-on:click="selectedValue">{{ user.first_name }} / {{ user.last_name }} / {{ user.role }}</option>
        </select>
        

      <!-- CASE MANAGER -->

        <select v-if="manager" id="listUsers">
            <option>Choisissez un utilisateur</option>
            <option v-for="user in myUsersInfo" :key="user.id" :value="user.id" v-on:click="selectedValue">{{ user.first_name }} / {{ user.last_name }} / {{ user.role }}</option>
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
    name: 'UserGraph',

    data() {
        return {
            // FOR ROLES
            admin: null,
            manager: null,

            // CASE ADMIN
            users: [],

            // CASE MANAGER
            myUsers: [],
            myTeams: [],
            myUsersInfo: [],

            // FOR ALL
            userId: null,
        }
    },

    created() {
        this.checkRole();
        this.getUsers();
        this.getTeams();
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

        getTeams() {
            axios.get('http://localhost:3000/api/teams', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.allTeams = response.data;

                if (this.manager) {
                    for (var i = 0; i < this.allTeams.length; i=i+1) {
                        if (this.allTeams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
                            this.myTeams.push(this.allTeams[i]);
                        }
                    }

                    for (var j = 0; j < this.myTeams.length; j++) {
                        axios.get('http://localhost:3000/api/teamscontent/team/' + this.myTeams[j].id, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((resp) => {
                            for (var k = 0; k < resp.data.length; k++) {
                                this.myUsers.push(resp.data[k].employeeId);
                            }

                            for (var l = 0; l < this.myUsers.length; l++) {
                                axios.get('http://localhost:3000/api/users/' + this.myUsers[l], {
                                    headers: {
                                        Authorization: 'Bearer ' + localStorage.getItem('token')
                                    }
                                })
                                .then((res) => {
                                    this.myUsersInfo.push(res.data);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            }

                            console.log('MY USERS');
                            console.log(this.myUsersInfo);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                }
            })
            .catch((errors) => {
                console.log(errors);
            });
            
        },

        display() {
            if (this.userId == null) {
                alert('Erreur: aucun utilisateur selectionné');
            } else {
                alert('AFFICHER LE GRAPH DU USER ID: ' + this.userId);
            }
            
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
</style>
