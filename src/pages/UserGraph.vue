<template>
    <div>
        <!-- CASE ADMIN -->
        <table class="table table-striped table-hover" v-if="admin">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Prénom</th>
                    <th scope="col">Role</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td><b>{{ user.id }}</b></td>
                    <td><b>{{ user.first_name }}</b></td>
                    <td><b>{{ user.last_name }}</b></td>
                    <td><b>{{ user.role }}</b></td>
                </tr>
            </tbody>
      </table>

      <!-- CASE MANAGER -->

      <table class="table table-striped table-hover" v-if="manager">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">teamId</th>
                    <th scope="col">managerId</th>
                    <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user_manager in allMyUsersOnMyTeams" :key="user_manager.id">
                    <td><b>{{ user_manager.id }}</b></td>
                    <td><b>{{ user_manager.teamId }}</b></td>
                    <td><b>{{ user_manager.employeeId }}</b></td>
                    <td><b>NOM EQUIPE</b></td>
                    <td><button v-on:click="edit(user.id)">Editer</button> | <button v-on:click="remove(user.id)">Supprimer</button></td>
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
    name: 'UserGraph',

    data() {
        return {
        allTeams: [],
        myTeams: [],
        myTeamsContent: [],
        myUsersOnTeam: [],
        allMyUsersOnMyTeams: [],
        users: [],
        users_manager: [],
        name: '',
        nameState: 'null',
        admin: null,
        manager: null
        }
    },

    created() {
        this.checkRole();
        this.getUsers();
    },

    methods: {

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
                for (var i = 0; i < this.allTeams.length; i=i+1) {
                    if (this.allTeams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
                        this.myTeams.push(this.allTeams[i]);
                    }
                }

                axios.get('http://localhost:3000/api/teamscontent/team')

            })
            .catch((errors) => {
                console.log(errors);
            });
        },

        display() {
            alert('GRAPH');
        }
    }
}
</script>
