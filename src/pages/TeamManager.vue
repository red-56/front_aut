<template>
  <div>
    <!-- FOR ADMIN -->

    <select v-if="admin" id="listTeams">
      <option>Choisissez une équipe</option>
      <option v-for="team in teams" :key="team.id" :value="team.id" v-on:click="selectedValueTeam">{{ team.name }}</option>
    </select>

    <br><br><br>

    <select v-if="admin" id="listTeams">
      <option>Choisissez un employé à ajouter/supprimer dans/de l'équipe choisie</option>
      <option v-for="employee in employees" :key="employee.id" :value="employee.id" v-on:click="selectedValueEmployee">{{ employee.first_name }} {{ employee.last_name }} /{{ employee.role }}</option>
    </select>

    <!-- FOR MANAGER -->

    <select v-if="manager" id="listTeams">
      <option>Choisissez une équipe</option>
      <option v-for="myTeam in myTeams" :key="myTeam.id" :value="myTeam.id" v-on:click="selectedValueMyTeam">{{ myTeam.name }}</option>
    </select>

    <br><br><br>

    <select v-if="manager" id="listTeams">
      <option>Choisissez un employé à ajouter dans l'équipe choisie</option>
      <option v-for="employee in myEmployeesInfo" :key="employee.id" :value="employee.id" v-on:click="selectedValueMyEmployee">{{ employee.first_name }} {{ employee.last_name }} /{{ employee.role }}</option>
    </select>

    <br>
    <br>
    <center>
      <button v-on:click="addTo">Ajouter à</button>&nbsp;&nbsp;&nbsp;
      <button v-on:click="removeFrom">Supprimer de:</button>
    </center>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

export default {
  name: "TeamManager",

  data() {
    return {
      // FOR ROLES
      admin: false,
      manager: false,

      // FOR ADMIN
      users: [],
      teams: [],
      employees: [],
      employeeId: null,
      teamId: null,

      // MANAGER
      myTeams: [],
      myEmployees: [],
      myEmployeesInfo: [],
      myEmployeeId: null,
      myTeamId: null,

      // FOR ALL

      members: [],
      into: null,
    };
  },

  created() {
    this.checkRole();
    this.getEmployees();
    this.getTeams();
  },

  methods: {
    checkRole() {
      if (jwt_decode(localStorage.getItem("token")).role == "Administrator") {
        this.admin = true;
        this.manager = false;
      } else if (jwt_decode(localStorage.getItem("token")).role == "Manager") {
        this.admin = false;
        this.manager = true;
      } else {
        this.admin = false;
        this.manager = false;
      }
    },

    selectedValueEmployee(e) {
        this.employeeId = e.target.value
    },

    selectedValueTeam(e) {
        this.teamId = e.target.value
    },

    selectedValueMyEmployee(e) {
        this.myEmployeeId = e.target.value;
    },

    selectedValueMyTeam(e) {
        this.myTeamId = e.target.value;
    },

    getEmployees() {
      axios
        .get("http://localhost:3000/api/users", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          // RETRIEVE USERS WITHOUT ADMIN
          this.users = response.data;
          this.users.splice(0, 1);

          // RETRIEVE EMPLOYEES

          if (this.admin) {
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].role == "Employee") {
                        this.employees.push(this.users[i]);
                    }
                }
          }
          
        })
        .catch(error => {
          console.log(error);
        });
    },

    getTeams() {
      axios
        .get("http://localhost:3000/api/teams", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          // CHECK IF ADMIN OR MANAGER
          if (this.admin) {
            this.teams = response.data;
          } else if (this.manager) {
            this.teams = response.data;
            for (var i = 0; i < this.teams.length; i++) {
              if (this.teams[i].managerId == jwt_decode(localStorage.getItem("token")).id) {
                this.myTeams.push(this.teams[i]);
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    addTo() {
        if (this.employeeId == null && this.teamId == null) {
            alert('Erreur: employé ou équipe non selectionné(e)s')
        } else {
            // RECUPERER LES EQUIPES OU CET EMPLOYE APPARTIENT
            axios.get('http://localhost:3000/api/teamscontent/user/' + this.employeeId, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                console.log(response.data);
                console.log('TEAM CHOISIE' + this.teamId);

                this.members = response.data;

                for (var i = 0; i < this.members.length; i++) {
                    if (this.members[i].teamId == this.teamId) {
                        alert('User existe deja dans cette team');
                        return;
                    }
                }

                axios.post('http://localhost:3000/api/teamscontent', {teamId: this.teamId, employeeId: this.employeeId}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((resp) => {
                    console.log(resp);
                })
                .catch((err) => {
                    console.log(err);
                })
            })
            .catch((error) => {
                console.log(error);
            });
        }
    },

    addToMyTeam() {

        if (this.myEmployeeId == null && this.myTeamId == null) {
            alert('Erreur: employé ou équipe non selectionné(e)s')
        } else {
            // RECUPERER LES EQUIPES OU CET EMPLOYE APPARTIENT
            axios.get('http://localhost:3000/api/teamscontent/user/' + this.myEmployeeId, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                console.log(response.data);
                console.log('TEAM CHOISIE' + this.myTeamId);

                this.members = response.data;

                for (var i = 0; i < this.members.length; i++) {
                    if (this.members[i].teamId == this.myTeamId) {
                        alert('User existe deja dans cette team');
                        return;
                    }
                }

                axios.post('http://localhost:3000/api/teamscontent', {teamId: this.myTeamId, employeeId: this.myEmployeeId}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((resp) => {
                    console.log(resp);
                })
                .catch((err) => {
                    console.log(err);
                })
            })
            .catch((error) => {
                console.log(error);
            });
        }

    },

    removeFrom() {
        if (this.employeeId == null && this.teamId == null) {
            alert('Erreur: employé ou équipe non selectionné(e)s')
        } else {
            // RECUPERER LES EQUIPES OU CET EMPLOYE APPARTIENT
            axios.get('http://localhost:3000/api/teamscontent/user/' + this.employeeId, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {

                this.members = response.data;

                for (var i = 0; i < this.members.length; i++) {
                    if (this.members[i].teamId == this.teamId) {
                        axios.delete('http://localhost:3000/api/team/' + this.teamId + '/user/' + this.employeeId, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((resp) => {
                            console.log(resp);
                            alert('Employé supprimé avec succès');
                            return;
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    }
                }
                alert('Erreur de suppression: Cet utilisateur n existe meme pas dans cette team');
            })
            .catch((error) => {
                console.log(error);
            });
        }
    },

    removeFromMyTeam() {
        if (this.myEmployeeId == null && this.myTeamId == null) {
            alert('Erreur: employé ou équipe non selectionné(e)s')
        } else {
            // RECUPERER LES EQUIPES OU CET EMPLOYE APPARTIENT
            axios.get('http://localhost:3000/api/teamscontent/user/' + this.myEmployeeId, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {

                this.members = response.data;

                for (var i = 0; i < this.members.length; i++) {
                    if (this.members[i].myTeamId == this.teamId) {
                        axios.delete('http://localhost:3000/api/team/' + this.myTeamId + '/user/' + this.myEmployeeId, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                        .then((resp) => {
                            console.log(resp);
                            alert('Employé supprimé avec succès');
                            return;
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    }
                }
                alert('Erreur de suppression: Cet utilisateur n existe meme pas dans cette team');
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }
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
