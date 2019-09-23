import Router from 'vue-router';
import Vue from 'vue';

// IMPORT COMPONENTS
/*import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TimeManager from "@/pages/TimeManager.vue";
import TeamGraph from "@/pages/TeamGraph.vue";
import UserGraph from "@/pages/UserGraph.vue";
import UserManager from "@/pages/UserManager.vue";
import store from "@/store/store.js";*/

import Login from "@/components/Authentication/Login.vue";
import SignUp from "@/components/Authentication/SignUp.vue";

Vue.use(Router);

export default new Router({

  routes: [
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
  ]
})

/*let router = new Router({
  mode: 'history',
  routes: [
    {
    path: '/',
    redirect: '/d/dashboard'
  },
  {
   path: "/login",
   name: "Login",
   component: Login
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
   },
  {
    path: "/d/",
    component: DashboardLayout,
    meta: { 
      requiresAuth: true
    },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile
      },
      {
        path: "timemanager",
        name: "Time Manager",
        component: TimeManager
      },
      {
        path: "teamgraph",
        name: "Team Graph",
        component: TeamGraph
      },
      {
        path: "usergraph",
        name: "User Graph",
        component: UserGraph
      },
      {
        path: "usermanager",
        name: "User Manager",
        component: UserManager
      }

    ]
  }
]});*/

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

