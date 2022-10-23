<template>
  <TheNavbar @open="toggleModal" />
  <div :class="['main', { 'px-4': !screenSize.smAndDown }]">
    <RouterView />
  </div>
  <TheLogin v-if="isOpen && !isLoggedIn" @close="toggleModal" />
  <TheProfileModal
    v-if="isOpen && isLoggedIn && screenSize.smAndDown"
    @close="toggleModal"
  />
  <BaseSnackbar />
  <button
    v-if="basketCounter && screenSize.smAndDown && $route.path !== '/cart'"
    @click="goToBasket"
    :data-content="basketCounter"
    class="basket-btn secondary rounded-circle"
  >
    <span class="icon-basket"></span>
  </button>
</template>

<script>
import TheNavbar from "./layout/TheNavbar.vue";
import TheLogin from "./components/TheLogin.vue";
import TheProfileModal from "./components/TheProfileModal.vue";
import { useGlobalVariable, useShoppingCart } from "@/store/index";
import { mapState, mapWritableState } from "pinia";
import BaseSnackbar from "./components/popup/BaseSnackbar.vue";

export default {
  name: "App",
  components: {
    TheNavbar,
    TheLogin,
    TheProfileModal,
    BaseSnackbar,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize", "isLoggedIn"]),
    ...mapWritableState(useShoppingCart, ["products"]),
    basketCounter() {
      return this.products.length;
    },
  },
  methods: {
    toggleModal() {
      if (!this.screenSize.smAndDown && this.isLoggedIn) {
        this.isOpen = false;
        this.$router.push("profile");
      } else {
        this.isOpen = !this.isOpen;
      }
    },
    goToBasket() {
      this.$router.push("/cart");
    },
  },
  mounted() {
    if (localStorage.getItem("cart")) {
      this.products = JSON.parse(localStorage.getItem("cart"));
    }
  },
};
</script>

<style lang="scss">
body {
  background-color: $light-color;
}
#app {
  width: 100%;
}
.main {
  margin-inline: auto;
  margin-top: 56px;
  height: 100%;
  width: 100%;
  max-width: 1400px;
}
.basket-btn {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  width: 48px;
  height: 48px;
  box-shadow: 0px 0px 8px 1px #0838306b;
}
.basket-btn::before {
  content: attr(data-content);
  border-radius: 50%;
  background-color: #083830;
  color: #e4f6f8;
  position: absolute;
  width: 20px;
  height: 20px;
  transform: translate(25%, 25%);
  right: 0;
  bottom: 0;
}
</style>
