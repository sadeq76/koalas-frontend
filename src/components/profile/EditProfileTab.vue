<template>
  <div class="full-width mt-4 px-4 primary-color d-flex justify-space-between">
    <h2>آدرس های شما</h2>
    <div class="pointer bold d-flex align-center" @click="toggleModal">
      <span class="ml-4"> افزودن آدرس </span>
      <span class="icon-plus"></span>
    </div>
  </div>
  <div class="d-flex flex-wrap justify-space-between mt-4 px-4">
    <AddressCard
      v-for="address in addresses"
      :key="address.id"
      v-bind="{ ...address }"
      class="mb-4"
    ></AddressCard>
    <span
      v-if="!addresses.length && !loading"
      class="full-width text-center pa-16"
      >داده ای وجود ندارد</span
    >
  </div>
  <AddAddressModal v-if="isOpen" @close="toggleModal"></AddAddressModal>
</template>

<script>
import AddressCard from "../AddressCard.vue";
import AddAddressModal from "../AddAddressModal.vue";
import { mapActions, mapState } from "pinia";
import { useShoppingCart } from "@/store";
export default {
  components: { AddressCard, AddAddressModal },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapState(useShoppingCart, ["addresses"]),
  },
  methods: {
    ...mapActions(useShoppingCart, ["getAddresses"]),
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
  },
  mounted() {
    this.getAddresses();
  },
};
</script>

<style lang="scss" module="editProfile">
.avatar {
  width: 130px;
  height: 130px;
  border: 5px solid $primary-color;
  overflow: hidden;

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
}
.input {
  width: calc(50% - 1em);
}
</style>
