<template>
    <div>
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
                <td><button v-on:click="promote(id, first_name)">Promouvoir</button> | <button v-on:click="deleting(id)">Supprimer</button></td>
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
            token: localStorage.getItem('token'),
            perPage: 10,
            total: null,
            currentPage: 1
        }
    },

    created() {
        this.getUsers();
    },

    methods: {

        getUsers() {
            axios.get('http://localhost:3000/api/users', {headers: {
                Authorization: 'Bearer ' + this.token
            }}).then((response) => {
                this.users = response.data;
                this.users.splice(0, 1);
                this.total = this.users.length;
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
                    });
                }
            })
        },

        promote(id, first_name) {
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


    }
}
</script>
