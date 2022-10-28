<template>
  <img :src="blog.cover" :alt="blog.title" />
  <div class="overlay primary"></div>
  <div class="content d-flex flex-column justify-start align-center">
    <div class="header d-flex flex-column justify-center align-start">
      <div
        class="secondary-color full-width d-flex justify-space-between align-center"
        :class="{ 'flex-column': screenSize.smAndDown }"
      >
        <h1
          class="secondary-color bold"
          :class="{ ' mb-4': screenSize.smAndDown }"
        >
          {{ blog.title }}
        </h1>
        <p>{{ date }}</p>
      </div>
    </div>
    <div class="body mb-4 secondary overflow-hidden pa-4 full-width">
      <div class="html-text" v-html="htmlContent"></div>
      <div class="full-width">
        <video
          :src="blog.video"
          class="full-width mt-4 rounded-sm"
          controls
        ></video>
      </div>
    </div>
    <!-- <div
      class="full-width"
      :class="{ 'd-flex justify-space-between ': !screenSize.smAndDown }"
    >
      <div class="d-flex align-center primary-color mb-4">
        <span v-if="!screenSize.smAndDown" class="icon-angle-right" />
        <p v-if="screenSize.smAndDown" class="ml-2 bold">بلاگ قبلی:</p>
        <p class="mr-2 bold">
          {{ blog.next?.title }}
        </p>
      </div>
      <div class="d-flex align-center primary-color">
        <p v-if="screenSize.smAndDown" class="ml-2 bold">بلاگ بعدی:</p>

        <p class="ml-2 bold">
          {{ blog.previous?.title }}
        </p>
        <span v-if="!screenSize.smAndDown" class="icon-angle-left" />
      </div>
    </div> -->
  </div>
  <div :class="['my-4', { 'mx-4': screenSize.smAndDown }]">
    <BaseFooter />
  </div>
</template>

<script>
import { useGlobalVariable } from "@/store/index";
import { mapActions, mapState } from "pinia";
import { useRequest } from "@/store/request";
import BaseFooter from "@/layout/BaseFooter.vue";
import { convertToShamsi } from "@/helpers/text";

export default {
  components: { BaseFooter },
  data() {
    return {
      blog: {},
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    htmlContent() {
      return this.blog.description
        ?.replaceAll("<img ", '<img style="width:100%; aspect-ratio: 16/9;"')
        .replaceAll("<p", '<p style="line-height: 2em; color: #444;"')
        .replaceAll("<h2", '<h2 style="color: #083830;" class="mb-4"')
        .replaceAll("<h3", '<h3 style="color: #083830;" class="mb-4"')
        .replaceAll("<h4", '<h4 style="color: #083830;" class="mb-4"')
        .replaceAll(
          "<a",
          '<a style="color: #083830;" class="mb-4 font-size-8"'
        );
    },
    date() {
      return this.blog.date_created
        ? "تاریخ : " + convertToShamsi(this.blog.date_created)
        : "";
    },
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),
    getBlogs() {
      this.fetchData({ url: `/blog/${this.$route.params.id}/` }).then(
        (response) => {
          this.blog = response;
        }
      );
    },
  },
  mounted() {
    this.getBlogs();
  },
};
</script>

<style lang="scss" scoped>
img {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 56px;
  right: 0;
  width: 100%;
  aspect-ratio: 16/7;
  z-index: 0;
  object-fit: cover;

  @media screen and (max-width: 900px) {
    aspect-ratio: 4/3;
  }
}

.overlay {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 56px;
  right: 0;
  width: 100%;
  height: (7 * 100vw / 16);
  opacity: 0.7;

  @media screen and (max-width: 900px) {
    height: (3 * 100vw / 4);
  }
}

.content {
  position: relative;
  z-index: 1;
  line-height: 1.75em;

  .header {
    width: 70%;
    height: (4 * 100vw / 16);

    @media screen and (max-width: 900px) {
      height: (2 * 100vw / 4);
    }
  }
}
</style>
