<template>
  <div
    :class="{
      'ma-4': screenSize.smAndDown,
    }"
  >
    <h2 class="mb-4">{{ categoryName }}</h2>
    <div
      class="full-width overflow-hidden overflow-x-scroll d-flex hide-scroll"
    >
      <BaseChip
        class="ml-4"
        v-for="(sub, index) in subCat"
        :key="index"
        :active="selectedCategory == sub.value"
        :value="sub.value"
        v-model="selectedCategory"
        @click="getProducts"
        @close="removeFilter"
      >
        <p class="no-wrap">
          {{ sub.title }}
        </p></BaseChip
      >
    </div>
    <div class="d-flex flex-wrap">
      <ProductsCard
        class="mb-4 card"
        v-for="product in products"
        :key="product.id"
        v-bind="{ ...product }"
      />

      <ProductsCardLoading v-show="productsLoading" v-for="n in 12" :key="n" />
      <span
        v-if="!products.length && !productsLoading"
        class="full-width text-center pa-16 ma-16"
        >داده ای وجود ندارد</span
      >
    </div>
  </div>
  <BaseFooter> </BaseFooter>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable, useShoppingCart } from "@/store";
import { useRequest } from "@/store/request";
import ProductsCard from "@/components/ProductsCard.vue";
import BaseFooter from "@/layout/BaseFooter.vue";
import ProductsCardLoading from "../components/skeleton-loading/ProductsCardLoading.vue";
import BaseChip from "@/components/ui/BaseChip.vue";
export default {
  components: { ProductsCard, BaseFooter, ProductsCardLoading, BaseChip },
  data() {
    return {
      products: [],
      productsLoading: false,
      selectedCategory: this.$route.params.category,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    ...mapState(useShoppingCart, ["categories"]),
    subCat() {
      let index = this.categories.findIndex(
        (item) => item.value == this.$route.params.category
      );
      return this.categories[index].sub;
    },
    categoryName() {
      return this.categories.find(
        (item) => item.value === this.$route.params.category
      )["title"];
    },
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),
    getProducts() {
      this.productsLoading = true;
      this.fetchData({
        url: "/product/",
        params: {
          category: this.selectedCategory,
        },
      })
        .then((response) => {
          this.products = response.result;
        })
        .finally(() => (this.productsLoading = false));
    },
    removeFilter() {
      this.selectedCategory = "bean";
      this.getProducts();
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
