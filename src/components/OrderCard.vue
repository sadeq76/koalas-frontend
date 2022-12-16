<template>
  <div :class="[order.container, 'pa-2 white shadow rounded-sm']">
    <div class="d-flex justify-space-between">
      <h3>
        سفارش &nbsp;<span>{{ id }}</span> #
      </h3>
      <p>{{ date }}</p>
    </div>
    <div :class="[order.products, 'hide-scroll']">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="pa-2 mb-2 d-flex align-center"
      >
        <div :class="[order.image, 'pa-2 ml-2 secondary rounded-circle']">
          <img :src="product.image" alt="" />
        </div>
        <div>
          <h4 class="mb-2 regular">{{ product.title }}</h4>
          <p class="bold">{{ product.price }} تومان</p>
        </div>
        <p v-if="product.qty != 1" class="grow-1 text-end bold">
          ×{{ product.qty }}
        </p>
      </div>
    </div>
    <hr class="mb-2 full-width" />
    <div class="mb-4 d-flex justify-space-between">
      <p>قیمت نهایی :</p>
      <p class="bold">{{ finalPrice }} <span>تومان</span></p>
    </div>
    <p><span>آدرس :</span>{{ address }}</p>
    <div
      :class="[
        order.status,
        colors,
        'full-width rounded-sm text-center pa-2 my-2',
      ]"
    >
      {{ statusTitle }}
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useGlobalVariable } from "@/store";
import { convertToRls, convertToShamsi } from "@/helpers/text";
export default {
  props: {
    id: {},
    date_created: {},
    address: {},
    status: {},
    products: {},
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    date() {
      return convertToShamsi(this.date_created);
    },
    finalPrice() {
      let sum = 0;
      this.products?.map((product) => (sum += product.price));
      return convertToRls(sum);
    },
    statusTitle() {
      return this.status === "Sent"
        ? "ارسال شده"
        : this.status === "InProgress"
        ? "در حال آماده سازی"
        : "لغو شده";
    },
    colors() {
      return this.status === "Sent"
        ? "border-info info-color"
        : this.status === "InProgress"
        ? "border-warn warn-color"
        : "border-error error-color";
    },
  },
};
</script>

<style lang="scss" module="order">
.container {
  width: 100%;
  @media (min-width: 750px) {
    width: calc(50% - 0.5em);
  }
  .image {
    width: 50px;
    height: 50px;

    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: contain;
    }
  }
  .status {
    border: 1px solid;
  }
  .products {
    height: 8rem;
    overflow-y: scroll;
  }
}
</style>
