<template>
  <div id="search-page">
    <v-dialog v-model="confirmationModal" max-width="500">
      <!-- Các thành phần của confirmation modal -->
    </v-dialog>

    <!-- Thêm thành phần mới cho trang Store -->
    <div id="store-page">
      <h2>SPY SELLER</h2>

      <div class="row gx-5 mb-2">
        <div class="col">
          <v-text-field v-model="sellerName" label="Tên Seller" required></v-text-field>
          <v-text-field v-model="storeName" label="Tên Store" required></v-text-field>
          <v-text-field v-model="storeLink" label="Seller page" required></v-text-field>
          <!-- Button thêm Store -->
          <div class="d-flex justify-content-start">
            <v-btn @click="addStore()" class="w-btn">Thêm Store</v-btn>
          </div>
        </div>
        <div class="col">
          <div class="row justify-content-end">
            <div style="max-width: fit-content" class="justify-content-end">
              <!-- Input nhập số -->
              <v-text-field v-model="storeNumber" label="Quét store đến page:"></v-text-field>
              <!-- Button "Spy Store" -->
              <v-btn @click="scanSpyStore()" class="w-btn">Quét</v-btn>
            </div>
          </div>
        </div>
      </div>

      <h3 class="mb-2">Tất cả stores</h3>
      <!-- Bảng thông tin Store -->
      <v-data-table :headers="headers" :items="storeItems" :items-per-page="perPage" :page="currentPage">
        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ item.seller }}</td>
            <td>{{ item.name }}</td>
            <td data-bs-toggle="tooltip" data-bs-placement="top" :title="item.url">{{ item.url }}</td>
            <td><v-btn @click="deleteSpyStore(item)">Xóa Store</v-btn></td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import SearchAlias from "@/search/search-alias-enum";
import { jwtDecode } from "jwt-decode";
export default {
  name: "spy-store",
  components: {},

  data() {
    return {
      filter: {},
      categories: SearchAlias,
      overlay: false,
      items: [],
      snackbar: false,
      confirmationModal: false,
      storeNumber: "",
      headers: [
        { text: "STT", value: "index" },
        { text: "Tên Seller", value: "seller" },
        { text: "Tên Store", value: "name" },
        { text: "Link Store", value: "url" },
        { text: "Action", value: "" },
      ],
      storeItems: [],
      currentPage: 1,
      perPage: 10,
      totalStores: 0,
      storeName: "",
      storeLink: "",
      username: "",
      sellerName: "",
    };
  },

  mounted() {
    console.log("mounted");
    const previousFilter = localStorage.getItem("filter");
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      this.username = decodedToken.sub || null; // Giả định rằng username nằm trong payload của token
    }

    if (previousFilter) {
      this.filter = JSON.parse(previousFilter);
    }
    // Gọi API để lấy dữ liệu cho storeItems
    this.fetchAllStoreData();
  },

  methods: {
    async deleteSpyStore(store) {
      try {
        await this.$to(this.$http.delete(`${process.env.VUE_APP_API_ENDPOINT}spy-store/${store.id}`));
        alert("Store đã được xóa thành công");
        // Gọi lại hàm fetchAllStoreData để load lại dữ liệu
        await this.fetchAllStoreData();
      } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra khi xóa Store");
      }
    },
    async fetchSearchErrors() {
      const [resp, err] = await this.$to(this.$http.get(`${process.env.VUE_APP_API_ENDPOINT}v1/errors`));

      if (resp) {
        this.searchErrors = resp.data;
      } else if (err) {
        console.log("err", err);
      }
    },
    async fetchAllStoreData() {
      try {
        const [resp, err] = await this.$to(this.$http.get(`${process.env.VUE_APP_API_ENDPOINT}spy-store/all/${this.username}`));
        if (resp) {
          this.storeItems = resp.data;
          this.totalStores = this.storeItems.length;
        } else if (err) {
          console.log("err", err);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    },
    async search() {
      console.log("search");
      // Hàm search hiện tại
    },

    openConfirmDeleteData() {
      console.log("openConfirmDeleteData");
      // Hàm mở modal xác nhận xóa dữ liệu hiện tại
    },

    async deleteData() {
      console.log("deleteData");
      // Hàm xóa dữ liệu hiện tại
    },

    clearDate() {
      console.log("clearDate");
      // Hàm xóa ngày
    },

    // Thêm các phương thức mới cho trang Store
    async scanSpyStore() {
      if (!this.storeNumber || Number(this.storeNumber) < 0) {
        alert("Vui lòng nhập số page hợp lệ!");
        return;
      }
      try {
        const response = await fetch(`${process.env.VUE_APP_API_ENDPOINT}spy-store/run`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            maxPage: this.storeNumber,
          }),
        });
        // window.open("https://www.mozilla.org/", "mozillaTab");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.length <= 0) {
            alert("Chưa có store nào được thêm!");
            return;
          }
          window.open(`${data[0].url}&zIdSpyStore=${data[0].user.id}`);
          return;
        } else {
          alert("Có lỗi xảy ra khi thêm Store");
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    },

    async fetchStoreData() {
      // Simulate fetching store data (replace with actual API call)
      const data = [];
      // Logic to fetch data
      this.storeItems = data;
      this.totalStores = data.length; // Replace with actual count
    },

    async addStore() {
      if (!this.storeName || !this.storeLink || !this.sellerName) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      try {
        const response = await fetch(`${process.env.VUE_APP_API_ENDPOINT}spy-store/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.storeName,
            url: this.storeLink,
            seller: this.sellerName,
            currentPage: 0,
            maxPage: 0,
            user: {
              username: this.username,
            },
          }),
        });
        if (response.ok) {
          alert("Store đã được thêm thành công");
          this.storeName = "";
          this.storeLink = "";
          // Gọi lại hàm fetchAllStoreData để load lại dữ liệu
          await this.fetchAllStoreData();
        } else {
          alert("Có lỗi xảy ra khi thêm Store");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi thêm Store");
      }
    },

    async pageChanged(page) {
      this.currentPage = page;
      await this.fetchStoreData();
    },

    async search1() {
      this.filter.afterDate = this.$refs.afterDate.getDate();
      this.filter.beforeDate = this.$refs.beforeDate.getDate();

      const [resp, err] = await this.$to(this.$http.get(`${process.env.VUE_APP_API_ENDPOINT}extensions/products`, { params: this.filter }));

      if (resp) {
        this.items = resp.data;
        localStorage.setItem("filter", JSON.stringify(this.filter));
      } else if (err) {
        console.log("Error", err);
      }
    },

    openConfirmDeleteData1() {
      this.confirmationModal = true;
    },

    async deleteData1() {
      this.confirmationModal = false;
      const [resp, err] = await this.$to(this.$http.delete(`${process.env.VUE_APP_API_ENDPOINT}extensions/products`));

      if (resp) {
        await this.search();
      } else if (err) {
        console.log("Error", err);
      }
    },

    clearDate1() {
      this.filter.afterDate = "";
      this.filter.beforeDate = "";
      this.$refs.afterDate.clearDate();
      this.$refs.beforeDate.clearDate();
    },
  },
};
</script>

<style lang="stylus">
.w-btn
  width 200px
#btn-container
  display flex
  width 100%
  align-items center
  column-gap 20px

#search-results
  background-color white
  margin-top 60px

#search-page
  padding 60px
  background-color rgb(250, 250, 250)

#filters
  display grid
  grid-template-columns 1fr
  grid-gap 20px
  background-color white
  padding 20px

#items-container
  display grid
  grid-template-columns 1fr 1fr 1fr 1fr
  grid-gap 20px
  margin-top 20px

.item-container
  display flex
  flex-direction column
  row-gap 10px
  border 0.5px solid grey
  padding 10px

.image
  border-radius 5px
  max-width 100%
  border 1px solid white
  max-height 200px

.item-row
  display flex
  justify-content space-between

.filters-option
  display grid
  grid-template-columns 1fr 1fr 1fr
  grid-gap 20px

#confirmation-modal
  display flex
  background-color white
  row-gap 20px
  padding 20px
  flex-direction column
th, td
  text-align left
  max-width 500px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
</style>
