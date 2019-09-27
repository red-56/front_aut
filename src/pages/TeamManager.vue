<template>
    <div>
        <!-- FOR ADMIN -->
        <table class="table table-striped table-hover" v-if="admin">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Ajouter à l'équipe</th>
                <th scope="col">Supprimer de l'équipe</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{id, last_name, first_name, email, role} in employees" :key="id">
                    <td><b>{{ id }}</b></td>
                    <td><b>{{ last_name }}</b></td>
                    <td><b>{{ first_name }}</b></td>
                    <td><b>{{ email }}</b></td>
                    <td><b>{{ role }}</b></td>
                    <td>
                        <select v-model="toAdd">
                            <option value="">Choisissez</option>
                            <option v-for="team in teams" :key="team.id">{{ team.id }} | {{ team.name }}</option>
                        </select>&nbsp;
                        <button v-on:click="addToTeam(id)">Ajouter</button>
                    </td>
                    <td>
                        <select v-model="toRemove">
                            <option value="">Choisissez</option>
                            <option v-for="team in teams" :key="team.id">{{ team.id }} | {{ team.name }}</option>
                        </select>&nbsp;
                        <button v-on:click="removeFromTeam(id)">Supprimer</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- FOR MANAGER -->
        <table class="table table-striped table-hover" v-if="manager">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Ajouter à l'équipe</th>
                <th scope="col">Supprimer de l'équipe</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="myEmployeeInfo in myEmployeesInfo" :key="myEmployeeInfo.id">
                    <td><b>{{ myEmployeeInfo.id }}</b></td>
                    <td><b>{{ myEmployeeInfo.last_name }}</b></td>
                    <td><b>{{ myEmployeeInfo.first_name }}</b></td>
                    <td><b>{{ myEmployeeInfo.email }}</b></td>
                    <td><b>{{ myEmployeeInfo.role }}</b></td>
                    <td>
                        <select v-model="toAdd">
                            <option value="">Choisissez</option>
                            <option v-for="myTeam in myTeams" :key="myTeam.id">{{ myTeam.id }} | {{ myTeam.name }}</option>
                        </select>&nbsp;
                        <button v-on:click="addToTeam(myEmployeeInfo.id)">Ajouter</button>
                    </td>
                    <td>
                        <select v-model="toRemove">
                            <option value="">Choisissez</option>
                            <option v-for="myTeam in myTeams" :key="myTeam.id">{{ myTeam.id }} | {{ myTeam.name }}</option>
                        </select>&nbsp;
                        <button v-on:click="removeFromTeam(myEmployeeInfo.id)">Supprimer</button>
                    </td>
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
    name: 'TeamManager',

    data() {
        return {
            admin: false,
            manager: false,
            users: [],
            teams: [],
            myTeams: [],
            employees: [],
            myEmployees: [],
            myEmployeesInfo: [],
            toAdd: null,
            toRemove: null,
            teamId: null,
            teamsEmployee: [],
            into: false
        }
    },

    created() {
        this.checkRole();
        this.getEmployees();
        this.getTeams();
    },

    methods: {

        checkRole() {
            if (jwt_decode(localStorage.getItem('token')).role == 'Administrator') {
                this.admin = true;
                this.manager = false;
            } else if (jwt_decode(localStorage.getItem('token')).role == 'Manager') {
                this.admin = false;
                this.manager = true;
            } else {
                this.admin = false;
                this.manager = false;
            }
        },

        getEmployees() {
            axios.get('http://localhost:3000/api/users', {headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }}).then((response) => {
                // RETRIEVE USERS
                this.users = response.data;
                this.users.splice(0, 1);
                this.total = this.users.length;

                // RETRIEVE EMPLOYEES
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].role == 'Employee') {
                        this.employees.push(this.users[i]);
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        getTeams() {
            axios.get('http://localhost:3000/api/teams', {headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }}).then((response) => {

                // CHECK IF ADMIN OR MANAGER
                if (this.admin) {
                    this.teams = response.data;
                } else if (this.manager) {
                    this.teams = response.data;
                    for (var i = 0; i < this.teams.length; i++) {
                        if (this.teams[i].managerId == jwt_decode(localStorage.getItem('token')).id) {
                            this.myTeams.push(this.teams[i]);
                        }
                    }

                    console.log('MY ');
                    console.log(this.myTeams);

                    // RETRIEVES MY EMPLOYEES
                    for (var j = 0; j < this.myTeams.length; j++) {
                        axios.get('http://localhost:3000/api/teamscontent/team/' + this.myTeams[j].id, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((response) => {
                            for (var k = 0; k < response.data.length; k++) {
                                this.myEmployees.push(response.data[k]);
                            }

                            console.log('MY EMP ');
                            console.log(this.myEmployees);

                            for (var l = 0; l < this.myEmployees.length; l++) {
                                axios.get('http://localhost:3000/api/users/' + this.myEmployees[l].employeeId, {
                                    headers: {
                                        Authorization: 'Bearer ' + localStorage.getItem('token')
                                    }
                                })
                                .then((resp) => {
                                    /*for (var m = 0; m < resp.data.length; m++) {
                                        this.myEmployeesInfo.push(resp.data[m]);
                                    }*/
                                    this.myEmployeesInfo.push(resp.data);
                                    console.log('MY EMP INFO');
                                    console.log(this.myEmployeesInfo);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    }
                }
                
            }).catch((error) => {
                console.log(error);
            });
        },

        addToTeam(employeeId) {
            this.teamId = this.toAdd.substring(0, 1);

            console.log('teams id: ' + this.teamId + " employeeId: " + employeeId);

            // VERIFIER S'IL A DEJA UNE TEAM
            axios.get('http://localhost:3000/api/teamscontent/user/' + employeeId, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.teamsEmployee = response.data;

                if (this.teamsEmployee.length == 0) {
                    axios.post('http://localhost:3000/api/teamscontent', {teamId: this.teamId, employeeId: employeeId}, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then((response) => {
                        console.log('ADDED');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                } else {
                    for (var i = 0; i < this.teamsEmployee.length; i++){
                        if (this.teamsEmployee[i].teamId == this.teamId) {
                            this.into = true;
                        }
                    }

                    if (this.into) {
                        alert('Cet user existe déjà dans cette équipe');
                    } else {
                        axios.post('http://localhost:3000/api/teamscontent', {teamId: this.teamId, employeeId: employeeId}, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((response) => {
                            console.log('ADDED');
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
        },

        removeFromTeam(employeeId) {
            this.teamId = this.toRemove.substring(0, 1);
            console.log('teams id: ' + this.teamId + " employeeId: " + employeeId);

            // VERIFIER S'IL A DEJA UNE TEAM
            
            /*axios.get('http://localhost:3000/api/teamscontent/user/' + employeeId, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                this.teamsEmployee = response.data;

                if (this.teamsEmployee.length == 0) {
                    alert('Erreur: cet utilisateur n a aucune équipe');
                } else {
                    for (var i = 0; i < this.teamsEmployee.length; i++){
                        if (this.teamsEmployee[i].teamId == this.teamId) {
                            axios.delete('http://localhost:3000/api/')
                        }
                    }

                    if (this.into) {
                        alert('Cet user existe déjà dans cette équipe');
                    } else {
                        axios.post('http://localhost:3000/api/teamscontent', {teamId: this.teamId, employeeId: employeeId}, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((response) => {
                            console.log('ADDED');
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });*/
        }
        
    }
}
</script>
