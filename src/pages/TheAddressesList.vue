<template>
  <div
    class="full-width full-height primary-color d-flex flex-column"
  >
    <div
      class="full-width mt-4 px-4 primary-color d-flex justify-space-between"
    >
      <h2>آدرس های شما</h2>
      <div @click="toggleModal"><span class="icon-plus"></span></div>
    </div>
    <div class="mt-4 px-4">
      <AddressCard
        v-for="address in addresses"
        :key="address.id"
        v-bind="{ ...address }"
        class="mb-4"
      ></AddressCard>
    </div>
    <div
      v-if="!addresses?.length"
      class="full-width grow-1 text-center d-flex justify-center align-center"
    >
      داده ای وجود ندارد
    </div>
    <AddAddressModal v-if="isOpen" @close="toggleModal"></AddAddressModal>
  </div>
</template>

<script>
import AddressCard from "../components/AddressCard.vue";
import AddAddressModal from "../components/AddAddressModal.vue";
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

<style lang="scss" module="addresses"></style>
