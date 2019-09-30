<template>
    <div>
        <p> <b>&nbsp;&nbsp;&nbsp;{{ today }}</b></p>
        <center><b-jumbotron header="Pointez" lead="Pensez à pointer à votre arrivée, et dès votre départ." class="center" border-variant="dark"><br>
            <b-button variant="primary" v-on:click="postClock" v-if="!statusClock">Démarrer</b-button>
            <b-button variant="primary" v-on:click="postClock" v-if="statusClock">{{chrono}} | stop</b-button><br><br>
            <b><span class="float-left">Arrivé(e): {{ arrival }}</span></b><b><span class="float-right">Parti(e): {{ departure }}</span></b>
        </b-jumbotron></center><br><br>
        <b-card bg-variant="light" text-variant="dark" border-variant="dark" title="Récapitulatif horaire d'aujourd'hui">
            <b-card-text>
                Arrivé(e): <date-picker format="YYYY-MM-DD HH:mm:ss" valueType="format" v-model="setArrival" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
            </b-card-text>
            <b-card-text>
                Parti(e): <date-picker format="YYYY-MM-DD HH:mm:ss" valueType="format" v-model="setDeparture" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
            </b-card-text>
            <center><b-button href="#" variant="primary" v-on:click="setWorkingTime">Mettez à jours vos horaires</b-button></center>
        </b-card>
    </div>
</template>

<script>

import moment from 'moment';
import { setInterval, clearInterval } from 'timers';
import axios from 'axios';
import Swal from 'sweetalert2';
import datetime from 'vuejs-datetimepicker';
import jwt_decode from 'jwt-decode';
import DatePicker from 'vue2-datepicker'

export default {
    
    name: 'TimeManager',

    components: {
        datetime,
        DatePicker
    },

    data() {
        return {
            shortcuts: [
                {
                    text: 'OK',
                    onClick: () => {
                        this.setArrival = [new Date()],
                        this.departure = [new Date()]
                    }
                }
            ],
            timeOptions: {
                start: '',
                step: '',
                end: ''
            },
            lang: {
                days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            today: moment().format('LLLL'),
            interval: null,
            chrono: null,
            arrival: null,
            departure: null,
            statusClock: false,
            finalChrono: null,
            setDeparture: null,
            setArrival: null,
            clocks: {
                status: '',
                time: ''
            }
        }
    },
    created(){

    },
    methods:{
        postClock(){

            if (this.chrono == null){

                this.statusClock = true;
                const now = moment(moment.now()).add(1, 'hours');
                this.arrival = moment().toISOString().substring(0, moment().toISOString().length -1)
                this.clocks = {
                    status: true,
                    time: moment().toISOString().substring(0, moment().toISOString().length -1)
                };

                axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id,  this.clocks, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {

                })
                .catch((error) => {
                    console.log(error);
                });
                
                this.interval = setInterval(()=> {
                    this.chrono = moment(moment().diff(now)).format("HH:mm:ss")
                }, 1000);

            }else {
                this.finalChrono = this.chrono;
                
                this.chrono = null;
                this.statusClock = false;
                this.departure = moment().toISOString().substring(0, moment().toISOString().length -1);
                   this.clocks = {
                    status: false,
                    time: moment().toISOString().substring(0, moment().toISOString().length -1)
                };

                axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id,  this.clocks, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {

                })
                .catch((error) => {
                    console.log(error);
                })

                clearInterval(this.interval);
                Swal.fire("Vous avez travaillé " + this.finalChrono);
            }

        },

        setWorkingTime() {

            if (this.chrono == null && (this.setDeparture == null || this.setArrival == null)) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: rien à mettre à jour!',
                    footer: 'Merci de réessayez'
                })
                return;
            }

            if (this.chrono != null && (this.setDeparture == null || this.setArrival == null)) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: Vous ne pouvez pas mettre à jour, le chronomètre tourne toujours',
                    footer: 'Merci de le mettre à jour après avoir fini votre travail'
                })
                return;
            }

            if (this.statusClock == false && this.setArrival != null && this.setDeparture != null) {

                this.clocks = {
                    status: true,
                    time: this.setArrival
                }

                // SET L ARRIVEE
                axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id, this.clocks, {
                    headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {

                    this.clocks = {
                        status: false,
                        time: this.setDeparture
                    }

                    // SET LE DEPART
                    axios.patch('https://timepool.me:3001/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id, this.clocks, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then((response) => {
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Erreur: rien à mettre à jour',
                    footer: 'Merci de réessayez'
                })
            }

        }
    }





}
</script>
