<template>
    <div>
        <b-button v-b-modal.add-team class="float-right">Créer une équipe</b-button><br><br>
        <b-modal id="add-team" ref="modal" title="Créer une équipe" @show="resetModal" @hidden="resetModal" @ok="handleOk">
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label="Nom de l'équipe" label-for="teamName" invalid-feedback="Nom de l'équipe est obligatoire">
                    <b-form-input id="teamName" v-model="teamName" required></b-form-input>
                </b-form-group>
                <b-form-group label="Choisissez un employé" invalid-feedback="Vous devez choisir un employé">
                    <b-form-select v-model="selected">
                        <option v-for="manager in managers" :key="manager.id">{{ manager.id }} | {{ manager.first_name }}</option>
                    </b-form-select>
                </b-form-group>
            </form>
        </b-modal>

        <table class="table table-striped table-hover">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{id, last_name, first_name, email, role} in users" :key="id">
                <td><b>{{ id }}</b></td>
                <td><b>{{ last_name }}</b></td>
                <td><b>{{ first_name }}</b></td>
                <td><b>{{ email }}</b></td>
                <td><b>{{ role }}</b></td>
                <td><button v-on:click="promote(id, first_name, role)">Promouvoir</button> | <button v-on:click="deleting(id)">Supprimer</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'UserManager',

    data() {
        return {
            users: [],
            managers: [],
            token: localStorage.getItem('token'),
            teamName: '',
            selected: null,
            team: {
                name: '',
                managerId: 0
            }
        }
    },

    created() {
        this.getUsersAndManagers();
    },

    methods: {

        getUsersAndManagers() {
            axios.get('http://localhost:3000/api/users', {headers: {
                Authorization: 'Bearer ' + this.token
            }}).then((response) => {
                // RETRIEVE USERS
                this.users = response.data;
                this.users.splice(0, 1);
                this.total = this.users.length;

                // RETRIEVE MANAGERS
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].role == 'Manager') {
                        this.managers.push(this.users[i]);
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        deleting(id) {
            Swal.fire({
                title: 'Êtes vous sûr de vouloir supprimer cet utilisateur ?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui supprimer'
                }).then((result) => {
                if (result.value) {
                    axios.delete('http://localhost:3000/api/users/' + id, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.getUsers();
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
                        console.log(err);
                    });
                }
            })
        },

        promote(id, first_name, role) {
            if (role == 'Manager') {
                Swal.fire({
                    type: 'error',
                    title: 'Erreur',
                    text: first_name + ' est déjà Manager'
                });
            } else {
                axios.patch('http://localhost:3000/api/users/' + id, {role: 'Manager'}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }   
                })
                .then((response) => {
                    this.getUsers();
                    Swal.fire(
                        'Félicitation!',
                        first_name + ' est devenu(e) Manager',
                        'success'
                    )
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            
        },

        // FOR MODAL TEAM ###############################################################

        resetModal() {
            this.teamName = '';
            this.selected = null;
        },

        handleOk(bvModalEvt) {
          // Prevent modal from closing
          bvModalEvt.preventDefault()
          // Trigger submit handler
          this.handleSubmit()
        },

        handleSubmit() {

            this.team = {
                name: this.teamName,
                managerId: this.selected.substring(0, 1)
            }

            axios.post('http://localhost:3000/api/teams', this.team, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                alert('Equipe créée avec succès');
            })
            .catch((error) => {
                console.log(error);
            });
            this.$nextTick(() => {
                this.$refs.modal.hide()
            })
        },
        
    }
}
</script>
