<template>
  <img
    :class="[shop.image, 'full-width mb-4']"
    src="@/assets/productBanner.png"
    alt="banner"
  />
  <div
    :class="{
      'mx-4 mb-4': screenSize.smAndDown,
    }"
  >
    <h2 class="mb-4">پرفروش ترین محصولات</h2>
    <div class="d-flex flex-wrap justify-space-between">
      <ProductsCard
        v-for="product in products"
        :key="product.id"
        v-bind="{ ...product }"
        class="mb-4"
      />

      <ProductsCardLoading v-show="productsLoading" v-for="n in 4" :key="n" />
      <span
        v-if="!products.length && !productsLoading"
        class="full-width text-center pa-16"
        >داده ای وجود ندارد</span
      >
    </div>
  </div>

  <img
    :class="[shop.banner, 'my-12']"
    src="@/assets/banner.png"
    alt="adBanner"
  />

  <CategoryGrid>
    <div
      v-for="(category, index) in categories"
      :key="index"
      :class="[
        { [shop[`large-1`]]: !(index % 3) && (index / 3) % 2 },
        { [shop[`large-2`]]: !(index % 3) && !((index / 3) % 2) },
        'primary-color secondary pa-2',
      ]"
      @click="goToCategoryPage(category.value)"
    >
      {{ category.title }}
    </div>
  </CategoryGrid>

  <div :class="['my-4', { 'mx-4': screenSize.smAndDown }]">
    <DefaultFooter />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable, useShoppingCart } from "@/store";
import { useRequest } from "@/store/request";
import ProductsCard from "@/components/ProductsCard.vue";
import CategoryGrid from "@/components/CategoryGrid.vue";
import DefaultFooter from "@/components/DefaultFooter.vue";
import ProductsCardLoading from "../components/skeleton-loading/ProductsCardLoading.vue";
export default {
  components: {
    ProductsCard,
    CategoryGrid,
    DefaultFooter,
    ProductsCardLoading,
  },
  data() {
    return {
      products: [],
      productsLoading: false,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
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

.large-1 {
  grid-row-start: 2;
  grid-row-end: 4;
  width: 100%;
  height: 100%;

  @media (min-width: 750px) {
    grid-row-start: 1;
    grid-row-end: 3;
  }
}
.large-2 {
  grid-row-start: 6;
  grid-row-end: 8;
  width: 100%;
  height: 100%;

  @media (min-width: 750px) {
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column: 2;
  }
}
</style>
