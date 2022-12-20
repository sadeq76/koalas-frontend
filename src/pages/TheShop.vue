<template>
  <div
    :class="[
      {
        'mx-4': screenSize.smAndDown,
      },
      'mb-4',
    ]"
  >
    <h2 class="mb-4">پرفروش ترین محصولات</h2>
    <div class="d-flex flex-wrap">
      <ProductsCard
        v-for="product in products"
        :key="product.id"
        v-bind="{ ...product }"
      />

      <ProductsCardLoading v-show="productsLoading" v-for="n in 4" :key="n" />
      <span
        v-if="!products.length && !productsLoading"
        class="full-width text-center pa-16"
        >داده ای وجود ندارد</span
      >
    </div>
  </div>

  <section :class="[shop.container, { 'mx-4': screenSize.smAndDown }]">
    <div
      v-for="(category, index) in categories"
      :key="index"
      :style="`background-image: url(${baseURL}banner/${
        category.imageId + 1
      }/); grid-area: ${category.value}`"
      :class="[
        shop['bg-img'],
        { [shop['bg-50-100']]: index > 2, [shop['bg-100-50']]: index <= 2 },
        'primary-color secondary pa-2 bold pointer',
      ]"
      @click="goToCategoryPage(category.value)"
    >
      <span class="hidden">
        {{ category.title }}
      </span>
    </div>
  </section>
  <img
    :class="[shop.image, 'full-width my-4']"
    :src="baseURL + 'banner/2/'"
    alt="banner"
  />

  <div :class="['my-4', { 'mx-4': screenSize.smAndDown }]">
    <BaseFooter />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable, useShoppingCart } from "@/store";
import { useRequest } from "@/store/request";
import ProductsCard from "@/components/ProductsCard.vue";
import BaseFooter from "@/layout/BaseFooter.vue";
import ProductsCardLoading from "../components/skeleton-loading/ProductsCardLoading.vue";
export default {
  components: {
    ProductsCard,
    BaseFooter,
    ProductsCardLoading,
  },
  data() {
    return {
      products: [],
      productsLoading: false,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize", "baseURL"]),
    ...mapState(useShoppingCart, ["categories"]),
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),
    goToCategoryPage(value) {
      this.$router.push({ name: "products", params: { category: value } });
    },
    getProducts() {
      this.productsLoading = true;
      this.fetchData({
        url: "/product/",
        params: { limit: 4, offset: 0 },
      })
        .then((response) => {
          this.products = response.result;
        })
        .finally(() => (this.productsLoading = false));
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style lang="scss" module="shop">
.image {
  aspect-ratio: 16/6;
  object-fit: cover;
}

.banner {
  aspect-ratio: 16/5;
  width: 100%;
  object-fit: cover;

  @media (min-width: 750px) {
    aspect-ratio: 16/4;
  }
}
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(8, 1fr);
  gap: 1rem;
  grid-template-areas:
    "bean"
    "bean"
    "powder"
    "powder"
    "accessories"
    "accessories"
    "mug"
    "gift";
  height: 200%;

  @media (min-width: 750px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:
      "bean powder"
      "bean powder"
      "accessories mug"
      "accessories gift";
    height: 100%;
  }
}

.bg-img {
  // background-size: 100% 100%;
  background-origin: center;
  background-position: center;
  background-size: 95% 100%;
  background-repeat: no-repeat;
}
</style>
