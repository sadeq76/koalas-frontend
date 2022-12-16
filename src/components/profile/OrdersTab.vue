<template>
  <h3 class="mb-4 primary-color">لیست سفارشات</h3>
  <div class="d-flex flex-wrap justify-space-between">
    <OrderCard
      v-for="order in orders"
      :key="order.id"
      v-bind="{ ...order }"
      class="mb-4"
    ></OrderCard>
    <span v-if="!orders.length && !loading" class="full-width text-center pa-16"
      >داده ای وجود ندارد</span
    >
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useGlobalVariable } from "@/store";
import { useRequest } from "@/store/request";
import OrderCard from "../OrderCard.vue";
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
      }).then((result) => {
        this.orders = result;
      });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>

<style lang="scss" module="ordersTab"></style>
