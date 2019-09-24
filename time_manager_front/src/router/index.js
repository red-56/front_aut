import Router from 'vue-router';
import Vue from 'vue';

// IMPORT COMPONENTS
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TimeManager from "@/pages/TimeManager.vue";
import TeamGraph from "@/pages/TeamGraph.vue";
import UserGraph from "@/pages/UserGraph.vue";
import UserManager from "@/pages/UserManager.vue";
import Dashboard from '@/pages/Dashboard.vue';
import store from "@/store/store.js";

import Login from "@/components/Authentication/Login.vue";
import SignUp from "@/components/Authentication/SignUp.vue";

Vue.use(Router);

export default new Router({

  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: "/d/",
      component: DashboardLayout,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp
    },
    {
      path: '/d/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/d/user',
      name: 'UserProfile',
      component: UserProfile
    },
    {
      path: '/d/timemanager',
      name: 'TimeManager',
      component: TimeManager
    },
    {
      path: '/d/usermanager',
      name: 'UserManager',
      component: UserManager
    },
    {
      path: '/d/teamgraph',
      name: 'TeamGraph',
      component: TeamGraph
    },
    {
      path: '/d/usergraph',
      name: 'UserGraph',
      component: UserGraph
    }
  ]
})

/*router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
});*/

