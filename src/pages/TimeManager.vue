<template>
    <div>
        <p> <b>&nbsp;&nbsp;&nbsp;{{ today }}</b></p>
        <center><b-jumbotron header="Pointer" lead="Pensez à pointer à votre arrivé, et dès votre départ" class="center" border-variant="dark"><br>
            <b-button variant="primary" v-on:click="postClock" v-if="!statusClock">Démarrer</b-button>
            <b-button variant="primary" v-on:click="postClock" v-if="statusClock">{{chrono}} | stop</b-button><br><br>
            <b><span class="float-left">Arrivé(e): {{ arrival }}</span></b><b><span class="float-right">Parti(e): {{ departure }}</span></b>
        </b-jumbotron></center><br><br>
        <b-card bg-variant="light" text-variant="dark" border-variant="dark" title="Récapitulatif horaire d'aujourd'hui">
            <b-card-text>
                Arrivé(e): <datetime class="arrivalInput" format="MM/DD/YYYY h:i:s" width="300px" v-model="setArrival" id="arrival"></datetime>
            </b-card-text>
            <b-card-text>
                Parti(e): <datetime format="MM/DD/YYYY h:i:s" width="300px" v-model="setDeparture"></datetime>
            </b-card-text>
            <center><b-button href="#" variant="primary">Mettez à jours vos horaires</b-button></center>
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

document.getElementsByClassName("arrivalInput").value('sdfsdf')
export default {
    
    name: 'TimeManager',

    components: {
        datetime
    },

    data() {
        return {
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
                this.arrival = moment().lang('fr').format('DD/MM/YYYY HH:mm:ss');
                this.clocks = {
                    status: true,
                    time: moment().toISOString().substring(0, moment().toISOString().length -1)
                };

                console.log(this.clocks.time)
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
                this.departure = moment().lang('fr').format('DD/MM/YYYY HH:mm:ss')
                   this.clocks = {
                    status: false,
                    time: moment().toISOString().substring(0, moment().toISOString().length -1)
                };


                console.log(this.clocks.time)
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

        }
    }





}
</script>
