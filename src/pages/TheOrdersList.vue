<template>
  <div class="full-width full-height my-4 px-4 primary-color d-flex flex-column">
    <h2 class="mb-4">سفارشات شما</h2>
    <OrderCard
      v-for="order in orders"
      :key="order.id"
      v-bind="{ ...order }"
      class="mb-4"
    ></OrderCard>
    <div
          v-if="!orders.length"
          class="full-width grow-1 text-center grow-1 d-flex justify-center align-center"
        >
          داده ای وجود ندارد
        </div>
  </div>
</template>

<script>
import OrderCard from "../components/OrderCard.vue";
import { mapActions } from "pinia";
import { useGlobalVariable } from "@/store";
import { useRequest } from '@/store/request';
export default {
  components: { OrderCard },
  data() {
    return {
      orders: [],
      offset: 0,
    };
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),
    getOrders() {
      this.fetchData({
        url: "/product/order/",
      })
        .then((result) => {
          this.orders = result;
        })
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>

<style lang="scss" module="orders"></style>
