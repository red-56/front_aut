<template >
<div class="bg">
  <form class="form-signin" @submit.prevent="login">
    <p class="h4 text-center">Sign in</p>
    <div class="h4 text-center mb-4">
      <mdb-input icon="envelope" v-model="email" type="email" placeholder="  Email"/>
      <mdb-input icon="lock" v-model="password" type="password" placeholder="  Password"/>
    </div>
    <div class="text-center">
      
        <mdb-btn type='submit'>Connect</mdb-btn>
      
    </div>
    <div class="text-center">
      <router-link to="/signup">
        <mdb-btn>Sign Up</mdb-btn>
      </router-link>
    </div>
  </form>
  </div>
</template>
<script>



import { mdbInput, mdbBtn } from "mdbvue";
export default {
  name: "Basic",
  components: {
    mdbInput,
    mdbBtn
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
   methods: {
      login: function () {
        let email = this.email 
        let password = this.password
        this.$store.dispatch('login', { email, password })
       .then(() => this.$router.push('/'))
       .catch(err => console.log(err))
      }
    } 
};
</script>
 
 <style scoped>

.h4.text-center {
  margin: 0;
}
form {
  background: grey;
  padding: 1rem;
  border-radius: 20px;
}
.bg{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
background: url("~@/assets/img/Gotham_City.png");
background-repeat: no-repeat;
background-size: 100% 100%;
} 
</style>
 