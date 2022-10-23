<template>
  <img
    :class="[Blogs.image, 'full-width mb-4']"
    src="@/assets/productBanner.png"
    alt="banner"
  />

  <section class="d-flex flex-column">
    <div
      :class="[
        { 'px-4': screenSize.smAndDown },
        'primary-color mb-4 d-flex justify-space-between',
      ]"
    >
      <h2>بلاگ ها</h2>
    </div>
    <BlogCard v-for="blog in blogs" :key="blog.id" v-bind="{ ...blog }" />
    <BlogCardLoading v-show="loading" v-for="n in 4" :key="n" />
    <span
      v-if="!blogs.length && !loading"
      class="full-width text-center pa-16 my-16"
      >داده ای وجود ندارد</span
    >
  </section>

  <div :class="['my-4', { 'mx-4': screenSize.smAndDown }]">
    <DefaultFooter />
  </div>
</template>

<script>
import { useGlobalVariable } from "@/store";
import { mapActions, mapState } from "pinia";
import { useRequest } from "@/store/request";
import BlogCard from "@/components/BlogCard.vue";
import BlogCardLoading from "@/components/skeleton-loading/BlogCardLoading.vue";
import DefaultFooter from "@/components/DefaultFooter.vue";

export default {
  components: { BlogCard, BlogCardLoading, DefaultFooter },
  data() {
    return {
      email: null,
      blogs: [],
      loading: false,
      offset: 0,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),
    getBlogs() {
      this.loading = true;
      this.fetchData({
        url: "/blog/",
        params: {},
      })
        .then((response) => {
          this.blogs = response.result;
        })
        .finally(() => (this.loading = false));
    },
  },
  mounted() {
    this.getBlogs();
  },
};
</script>

<style lang="scss" module="Blogs">
.image {
  aspect-ratio: 16/6;
  object-fit: cover;
}
</style>
