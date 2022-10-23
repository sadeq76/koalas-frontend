<template>
  <div
    :class="[addressesCard.container, 'pa-4 full-width shadow white rounded']"
  >
    <div class="full-width d-flex justify-space-between">
      <h3 class="mb-2 primary-color">{{ title || "بدون عنوان" }}</h3>
      <span @click="deleteAddress" class="icon-delete"></span>
    </div>
    <p class="mb-2">
      <strong class="dark-color">آدرس :</strong>
      {{ address || "بدون آدرس" }}
    </p>
    <p class="mb-4">
      <strong class="dark-color">کدپستی :</strong>
      {{ zip_code || "بدون کد پستی" }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { useRequest } from "@/store/request";
import { useGlobalVariable, useShoppingCart } from "@/store";
export default {
  props: {
    id: {},
    title: {},
    address: {},
    zip_code: {},
    latitude: {},
    longitude: {},
  },
  data() {
    return {
      center: { lat: +this.latitude, lng: +this.longitude },
    };
  },
  computed: {
    ...mapWritableState(useShoppingCart, ["addresses"]),
  },
  methods: {
    ...mapActions(useRequest, ["fetchData"]),
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    deleteAddress() {
      this.fetchData({
        url: `/user/address/${this.id}/`,
        method: "DELETE",
      })
        .then(() => {
          this.addresses = this.addresses.filter((item) => item.id !== this.id);
          this.openSnackbar({
            status: "info",
            message: "آدرس حذف شد",
          });
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss" module="addressesCard">
.container {
  width: 100%;
  @media (min-width: 750px) {
    width: calc(50% - 0.5em);
  }
}
</style>
