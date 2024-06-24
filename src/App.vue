<template>
  <div id="app" data-app>
    <div id="header" v-if="isLoggedIn">
      <div> {{ loggedInUserName }} </div>
      |
      <v-btn text @click="logOut()">Logout</v-btn>
    </div>

    <div id="nav">
      <router-link to="/">Search page</router-link>
      |
      <template v-if="canEditUser">
        |
        <router-link to="/users">Users</router-link>
      </template>
    </div>

    <v-dialog
        v-model="loginModal"
        persistent
    >
      <v-card id="modal">
        <v-text-field
            label="User name"
            v-model="username"
        ></v-text-field>

        <v-text-field
            label="Password"
            v-model="password"
            type="password"
        ></v-text-field>

        <v-btn @click="login">Login</v-btn>
      </v-card>
    </v-dialog>
    <router-view :links="links"/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loginModal: false,
      username: '',
      password: '',
      links: {},
    };
  },

  async mounted() {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken || accessToken === 'undefined' || accessToken.length === 0) {
      this.loginModal = true;
    } else {
      await this.revokeToken(accessToken);
    }
  },

  computed: {
    canEditUser() {
      return this.links && this.links.fetch_users && this.links.fetch_users.href;
    },

    loggedInUserName() {
      return this.links && this.links.username && this.links.username.href;
    },

    isLoggedIn() {
      return this.loggedInUserName;
    },
  },

  methods: {
    async revokeToken(accessToken) {
      const [resp] = await this.$to(this.$http.post(`${process.env.VUE_APP_API_ENDPOINT}users/revoke-token`, accessToken));

      if (resp) {
        localStorage.setItem('accessToken', resp.data.token);
        this.links = resp.data._links;
        this.loginModal = false;
      } else {
        localStorage.setItem('accessToken', '');
        this.logOut();
        alert('Error');
      }
    },

    async login() {
      const [resp] = await this.$to(this.$http.post(`${process.env.VUE_APP_API_ENDPOINT}users/authenticate`, { username: this.username, password: this.password }));

      if (resp) {
        localStorage.setItem('accessToken', resp.data.token);
        this.links = resp.data._links;
        this.loginModal = false;
      } else {
        localStorage.setItem('accessToken', '');
        alert('Error');
      }
    },

    logOut() {
      localStorage.setItem('accessToken', '');
      this.loginModal = true;
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss">
#header {
  display: flex;
  justify-content: center;
  align-items: center;
}

#modal {
  padding: 60px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
