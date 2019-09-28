<template>
    <div>
        <p> <b>&nbsp;&nbsp;&nbsp;{{ today }}</b></p>
        <center><b-jumbotron header="Pointez" lead="Pensez à pointer à votre arrivé, et dès votre départ" class="center" border-variant="dark"><br>
            <b-button variant="primary" v-on:click="postClock" v-if="!statusClock">Démarrer</b-button>
            <b-button variant="primary" v-on:click="postClock" v-if="statusClock">{{chrono}} | stop</b-button><br><br>
            <b><span class="float-left">Arrivé(e): {{ arrival }}</span></b><b><span class="float-right">Parti(e): {{ departure }}</span></b>
        </b-jumbotron></center><br><br>
        <b-card bg-variant="light" text-variant="dark" border-variant="dark" title="Récapitulatif horaire d'aujourd'hui">
            <b-card-text>
                Arrivé(e): <date-picker format="DD/MM/YYYY HH:mm:ss" valueType="format" v-model="setArrival" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
            </b-card-text>
            <b-card-text>
                Parti(e): <date-picker format="DD/MM/YYYY HH:mm:ss" valueType="format" v-model="setDeparture" type="datetime" :time-picker-options="timeOptions" :lang="lang" :shortcuts="shortcuts"></date-picker>
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
                start: '28/09/2019 13:27:00',
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
                const now = moment.now();
                this.arrival = moment().toISOString().substring(0, moment().toISOString().length -1)
                this.setArrival = this.arrival
                this.clocks = {
                    status: true,
                    time: moment().toISOString().substring(0, moment().toISOString().length -1)
                };

                axios.patch('http://localhost:3000/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id,  this.clocks, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    console.log(response);
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
                this.setDeparture = this.departure;
                   this.clocks = {
                    status: false,
                    time: moment().toISOString().substring(0, moment().toISOString().length -1)
                };

                axios.patch('http://localhost:3000/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id,  this.clocks, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                })

                clearInterval(this.interval);
                Swal.fire("Vous avez travaillez " + this.finalChrono + " aujourd'hui");
            }

        },

        setWorkingTime() {

            if (this.setArrival != null && this.setDeparture != null) {
                // SET L ARRIVEE
                axios.patch('http://localhost:3000/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id, {status: true, time: this.setArrival}, {
                    headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });

                // SET LE DEPART
                axios.patch('http://localhost:3000/api/clocks/user/' + jwt_decode(localStorage.getItem('token')).id, {status: false, time: this.setDeparture}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    console.log(response);
                    return;
                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                alert('Rien à mettre à jour');
            }
        }
    }





}
</script>
