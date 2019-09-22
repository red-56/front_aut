<template>
  <!-- Material form register -->
  <div class="bg">
  <form>
    <p class="h4 text-center mb-4">Sign up</p>
    <div class="h4 text-center mb-4">
      <mdb-input icon="user" type="text" placeholder="  Your name"/>
      <mdb-input  icon="envelope" type="email" placeholder="  Your email"/>
      <mdb-input  icon="exclamation-triangle" type="text" placeholder="  Confirm your email"/>
      <mdb-input  icon="lock" type="password" placeholder="  Your password"/>
    </div>
    <div class="text-center">
         <router-link to="/">
      <mdb-btn color="primary">Register</mdb-btn>
      </router-link>
    </div>
  </form>
  </div>
</template>

<script>
  import { mdbInput, mdbBtn } from 'mdbvue';
  export default {
    name: 'Basic',
    components: {
    mdbInput,
    mdbBtn
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