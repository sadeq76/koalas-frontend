<template>
  <div :class="['full-height full-width d-flex flex-column']">
    <section :class="['full-width grow-1 overflow-scroll hide-scroll']">
      <div class="full-height d-flex">
        <div
          :class="[
            product.container,
            'full-height full-width d-flex flex-column secondary',
          ]"
        >
          <span
            @click="back"
            :class="[product.back, 'primary-color icon-angle-right pointer']"
          />
          <div class="grow-1 pa-12 overflow-hidden">
            <img :class="product.image" :src="image" :alt="title" />
          </div>
          <div v-if="screenSize.smAndDown" class="full-width pa-4">
            <h1 class="mb-2 primary-color">{{ title }}</h1>
            <p>{{ description }}</p>
          </div>
        </div>
        <div
          v-if="!screenSize.smAndDown"
          class="d-flex flex-column grow-1 overflow-hidden"
        >
          <h1 class="mb-2 primary-color px-4 pt-4">{{ title }}</h1>
          <p class="px-4 pb-4">{{ description }}</p>
          <p class="px-4 pb-8 bold primary-color font-size-12">
            قیمت : {{ price }}
          </p>
        </div>
      </div>
    </section>
    <div
      v-if="screenSize.smAndDown"
      :class="[
        product['action-bar'],
        'full-width fit-content pa-4 d-flex justify-space-between align-center',
      ]"
    >
      <div>
        <h2 class="regular">قیمت:</h2>
        <span
          :class="[product['total-price'], 'primary-color font-size-12 bold']"
        >
          {{ productPrice }}</span
        >
      </div>
      <button
        @click="
          addProduct({
            id: +this.$route.params.id,
            image,
            title,
            price,
            store: qty,
            qty: 1,
          })
        "
        class="primary secondary-color px-4 rounded-pill"
      >
        افزودن به سبد
        <span icon="icon-plus mr-2" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable, useShoppingCart } from "@/store";
import { convertToRls } from "../helpers/text";
export default {
  data() {
    return {
      title: "",
      image: "",
      description: "",
      price: 0,
      store: 0,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    productPrice() {
      return this.price ? convertToRls(this.price) : "بدون قیمت";
    },
  },
  methods: {
    ...mapActions(useShoppingCart, ["addProduct"]),
    back() {
      this.$router.back();
    },
    queryToObj() {
      this.title = this.$route.query.title;
      this.image = this.$route.query.image;
      this.description = this.$route.query.description;
      this.price = +this.$route.query.price;
      this.store = this.$route.query.qty;
    },
  },
  mounted() {
    this.queryToObj();
  },
};
</script>

<style lang="scss" module="product">
.container {
  position: relative;
  @media (min-width: 750px) {
    min-width: 50%;
    width: 50%;
  }

  .image {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
  .back {
    position: absolute;
    top: 1em;
    right: 1em;
  }
}
</style>
