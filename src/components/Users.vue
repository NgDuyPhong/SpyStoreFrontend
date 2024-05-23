<template>
  <div id="user-container">
    <v-btn @click="openAddUserModal()">
      Add user
    </v-btn>

    <div v-for="(user, index) in users" :key="index" class="user-row">
      <div class="d-flex align-center">
        {{ user.username }}
      </div>

      <div class="d-flex align-center">
        {{ user.password }}
      </div>

      <div>
        <v-btn @click="deleteUser(user)">
          Delete
        </v-btn>
      </div>
    </div>

    <v-dialog
        v-model="addUserModalVisible"
    >
      <v-card id="modal">
        <v-text-field
            label="User name"
            v-model="addingUser.username"
        ></v-text-field>

        <v-text-field
            label="Password"
            v-model="addingUser.password"
            type="password"
        ></v-text-field>

        <v-btn @click="addUser()">Add user</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'users',

  props: {
    links: Object,
  },

  data() {
    return {
      users: [],
      userLinks: {},
      addUserModalVisible: false,
      addingUser: {},
    };
  },

  async mounted() {
    await this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      const apiUri = this.links.fetch_users.href;

      const [resp, err] = await this.$to(this.$http.get(apiUri));

      if (resp) {
        this.users = resp.data._embedded.userList;
        this.userLinks = resp.data._links;
      } else if (err) {
        alert('Error');
      }
    },

    async deleteUser(user) {
      const apiUri = this.userLinks.delete_user.href;

      const [resp, err] = await this.$to(this.$http.delete(apiUri, user));

      if (resp) {
        this.users = resp._embedded.userList;
      } else if (err) {
        alert('Error');
      }
    },

    openAddUserModal() {
      this.addUserModalVisible = true;
    },

    async addUser() {
      if (!this.addingUser.username || !this.addingUser.password) {
        return;
      }

      const apiUri = this.userLinks.add_user.href;

      const [resp, err] = await this.$to(this.$http.post(apiUri, this.addingUser));

      if (resp) {
        this.users = resp.data._embedded.userList;
      } else if (err) {
        alert('Error');
      }

      this.addUserModalVisible = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
#user-container
  padding 60px

.user-row
  margin 20px 0
  padding 10px 0
  display grid
  grid-template-columns 4fr 4fr 1fr
  grid-gap 20px
  border 1px solid grey
</style>
