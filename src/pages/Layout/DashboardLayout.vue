<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
   

    <side-bar>
      <sidebar-link to="/d/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/d/user">
        <md-icon>person</md-icon>
        <p>User Profile</p>
      </sidebar-link>
      <sidebar-link to="/d/timemanager">
        <md-icon>content_paste</md-icon>
        <p>Time Manager</p>
      </sidebar-link>
      <sidebar-link to="/d/teamgraph">
        <md-icon>library_books</md-icon>
        <p>Team Graph</p>
      </sidebar-link>
      <sidebar-link to="/d/usergraph">
        <md-icon>bubble_chart</md-icon>
        <p>User Graph</p>
      </sidebar-link>
      <sidebar-link v-show="seen" to="/d/usermanager">
        <md-icon>supervisor_account</md-icon>
        <p>User Manager</p>
      </sidebar-link>
        <md-icon>power_settings_new</md-icon>
        <button v-on:click="logout">Déconnexion</button>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      
    </div>
  </div>
</template>

<script>

import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import { mapActions } from 'vuex';
import store from '@/store/store'


export default {

  name: 'DashboardLayout',
  data() {
    return {
      seen: true
    }
  },
  components: {
    TopNavbar,
    DashboardContent
  },

  methods: {
    ...mapActions(["logout"])
  }
};

</script>

<style lang="scss">

</style>