<template>
  <div
    v-if="screenSize.smAndDown"
    :class="[TheLanding['green-rect'], 'primary']"
  ></div>

  <LandingHeader />

  <div
    :class="{
      'ma-4': screenSize.smAndDown,
    }"
  >
    <div class="primary-color mt-4 d-flex justify-space-between">
      <h2>محصولات</h2>
      <button class="icon primary-color">
        <span @click="goTocat" class="ml-2 font-size-8">{{
          !screenSize.smAndDown ? "مشاهده همه محصولات" : "بیشتر"
        }}</span>
        <span class="icon-angle-left pointer" />
      </button>
    </div>
    <ul class="d-flex overflow-scroll hide-scroll my-4">
      <li
        class="pointer ml-4 no-wrap font-size-8"
        v-for="(category, index) in categories"
        :key="index"
        :class="[{ active: selectedCategory == category.value }]"
        @click="selectCategory(category.value)"
      >
        {{ category.title }}
      </li>
    </ul>
    <div class="d-flex flex-wrap">
      <ProductsCard
        v-for="product in products"
        :key="product.id"
        v-bind="{ ...product }"
        class="mb-4"
      />
      <ProductsCardLoading v-show="productsLoading" v-for="n in 4" :key="n" />
      <span
        v-if="!products.length && !productsLoading"
        class="full-width text-center pa-16 my-16"
        >داده ای وجود ندارد</span
      >
    </div>
  </div>

  <img
    :class="[TheLanding.banner, { 'my-8': !screenSize.smAndDown }, 'my-4']"
    :src="baseURL + 'banner/1/'"
    alt="adBanner"
  />

  <div
    :class="{
      'ma-4': screenSize.smAndDown,
    }"
  >
    <div class="primary-color mt-4 d-flex justify-space-between">
      <h2>بلاگ ها</h2>
      <button class="icon primary-color">
        <span @click="goToBlogs" class="ml-2 font-size-8">{{
          screenSize.mdAndUp ? "مشاهده همه بلاگ ها" : "بیشتر"
        }}</span>
        <span class="icon-angle-left" />
      </button>
    </div>
    <div
      v-if="screenSize.mdAndUp"
      :class="[{ [TheLanding.blogs]: blogs.length }, 'mt-4']"
    >
      <LandingBlogCard
        v-for="blog in blogs"
        :key="blog.id"
        v-bind="{ ...blog }"
      />
      <LandingBlogLoading v-show="blogsLoading" v-for="n in 4" :key="n" />
      <div v-if="!blogs.length && !blogsLoading" class="full-width text-center">
        داده ای وجود ندارد
      </div>
    </div>
    <div class="mt-4" v-else>
      <ImagesCarousel :items="blogs" />
      <div
        v-if="!blogs.length && !blogsLoading"
        :class="[
          TheLanding.loading,
          { 'skeleton primary': blogsLoading },
          'position-relative rounded-sm full-width',
        ]"
      >
        <span
          style="position: absolute"
          class="full-height full-width d-flex justify-center align-center"
        >
          داده ای وجود ندارد.
        </span>
      </div>
    </div>
  </div>

  <div :class="['my-4', { 'mx-4': screenSize.smAndDown }]">
    <BaseFooter />
  </div>
</template>

<script>
import { useGlobalVariable, useShoppingCart } from "@/store/index";
import { mapActions, mapState } from "pinia";
import { useRequest } from "../store/request";
//components
import LandingHeader from "@/components/LandingHeader.vue";
import ProductsCard from "@/components/ProductsCard.vue";
import LandingBlogCard from "@/components/LandingBlogCard.vue";
import ImagesCarousel from "@/components/ImagesCarousel.vue";
import BaseFooter from "@/layout/BaseFooter.vue";
//loading
import ProductsCardLoading from "@/components/skeleton-loading/ProductsCardLoading.vue";
import LandingBlogLoading from "@/components/skeleton-loading/LandingBlogLoading.vue";

export default {
  components: {
    ProductsCard,
    LandingBlogCard,
    LandingBlogLoading,
    BaseFooter,
    LandingHeader,
    ImagesCarousel,
    ProductsCardLoading,
  },
  data() {
    return {
      counters: {},
      products: [],
      blogs: [],
      selectedCategory: "bean",
      productsLoading: false,
      blogsLoading: false,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize", "baseURL"]),
    ...mapState(useShoppingCart, ["categories"]),
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),

    goTocat() {
      this.$router.push("/shop");
    },
    goToBlogs() {
      this.$router.push("/blogs");
    },
    selectCategory(value) {
      this.selectedCategory = value;
      this.getProducts();
    },
    getProducts() {
      this.products = [];
      this.productsLoading = true;
      this.fetchData({
        url: "/product/",
        params: { limit: 4, offset: 0, category: this.selectedCategory },
      })
        .then((response) => {
          this.products = response.result;
        })
        .finally(() => (this.productsLoading = false));
    },

    getBlogs() {
      this.blogsLoading = true;
      this.fetchData({
        url: "/blog/",
        params: { limit: 4, offset: 0 },
      })
        .then((response) => {
          this.blogs = response.result;
        })
        .finally(() => (this.blogsLoading = false));
    },
  },
  async mounted() {
    this.getProducts();
    this.getBlogs();
  },
};
</script>

<style lang="scss" module="TheLanding">
.green-rect {
  position: absolute;
  right: 0;
  top: 0;
  height: 95vw;
  width: 50vw;
  z-index: 0;
}

.banner {
  aspect-ratio: 4/2;
  width: 100%;
  object-fit: cover;

  @media (min-width: 750px) {
    aspect-ratio: 16/4;
  }
}

.blogs {
  width: 100%;
  height: calc(9 * (min(100vw, 1400px) - 4em / 2) / 16);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1em;
}

.loading {
  padding-bottom: 56%;
}
</style>
