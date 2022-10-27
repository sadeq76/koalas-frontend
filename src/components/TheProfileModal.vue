<template>
  <BaseModal :fullscreen="true" :persistent="true">
    <button
      @click="closeModal"
      :class="[profile['dialog-close'], 'primary-color icon']"
    >
      <span class="icon-angle-down pointer" />
    </button>
    <div class="full-width full-height d-flex flex-column align-center">
      <div
        :class="[
          profile.avatar,
          'primary mb-4 rounded-circle d-flex justify-center align-center',
        ]"
      >
        <span class="secondary-color icon-user"></span>
      </div>
      <p class="mb-2 font-size-8 bold primary-color">
        {{ name }}
      </p>
      <div class="full-width d-flex flex-column align-start justify-start">
        <h2 class="mb-4 primary-color">لیست ها</h2>
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="goTo(item.path)"
          class="pointer shadow rounded-sm full-width d-flex pa-2 mb-4"
        >
          <div
            :class="[
              profile.icon,
              'ml-2 primary secondary-color rounded-circle d-flex justify-center align-center',
            ]"
          >
            <span :class="`secondary-color icon-${item.icon}`"></span>
          </div>
          <h3 class="primary-color d-flex align-center">{{ item.title }}</h3>
          <div class="grow-1 d-flex justify-end align-center">
            <span class="icon-angle-left" />
          </div>
        </div>
      </div>
      <div
        @click="logout"
        class="grow-1 full-width d-flex justify-end align-end my-4"
      >
        <div class="d-flex align-center">
          <span class="ml-2">خروج</span>
          <span class="icon-angle-left"></span>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import { mapActions, mapState } from "pinia";
import BaseModal from "./popup/BaseModal.vue";
import { useGlobalVariable } from "@/store";
import { useRequest } from "@/store/request";

export default {
  components: { BaseModal },
  data() {
    return {
      list: [
        { icon: "home-address", title: "آدرس های شما", path: "/addresses" },
        { icon: "list", title: "سفارشات شما", path: "/orders" },
      ],
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["isLoggedIn"]),
    icon() {
      return this.fullscreen ? "angle-down" : "close";
    },
    name() {
      return localStorage.getItem("name");
    },
  },
  methods: {
    ...mapActions(useRequest, ["fetchData"]),
    ...mapActions(useGlobalVariable, [
      "toggleModal",
      "openSnackbar",
      "toggleLoginStatus",
    ]),
    closeModal() {
      this.$emit("close");
    },
    goTo(path) {
      this.$router.push(path);
      this.closeModal();
    },
    logout() {
      this.toggleLoginStatus();
      localStorage.removeItem("token");
      this.fetchData({ url: "/user/logout/", method: "POST" }).finally(() => {
        this.openSnackbar({
          message: "از سیستم خارج شدید",
          status: "info",
        });
      });
    },
  },
};
</script>

<style lang="scss" module="profile">
.avatar {
  width: 100px;
  height: 100px;
  border: 5px solid $primary-color;
  overflow: hidden;

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
}
.icon {
  width: 50px;
  height: 50px;
}
.dialog-close {
  position: absolute;
  top: 1em;
  left: 1em;
}
</style>
