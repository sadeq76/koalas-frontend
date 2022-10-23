<template>
  <button
    ref="btn"
    :class="[
      { 'primary-btn': primary },
      { 'secondary-btn': !primary },
      'rounded-sm text-center',
    ]"
    @click="clicked"
  >
    <slot v-if="!loading"></slot>
    <object v-else :data="getImgUrl()" type="image/svg+xml"></object>
  </button>
</template>

<script>
export default {
  props: {
    disable: {
      type: Boolean,
      required: false,
      default: false,
    },
    primary: {
      type: Boolean,
      required: false,
      default: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    getImgUrl() {
      var images = require.context("../../assets/", false, /\.svg$/);
      return images("./spiner.svg");
    },
    clicked() {
      if (!this.loading) {
        this.$emit("clicked");
      }
    },
  },
  watch: {
    disable: function () {
      this.disable
        ? this.$refs.btn.setAttribute("disabled", "")
        : this.$refs.btn.removeAttribute("disabled");
    },
  },
  mounted() {
    this.disable ? this.$refs.btn.setAttribute("disabled", "") : {};
  },
};
</script>

<style lang="scss" scoped>
.primary-btn {
  background-color: $primary-color;
  color: $secondary-color;
}
.secondary-btn {
  background-color: $secondary-color;
  color: $primary-color;
}
button:disabled {
  background-color: gainsboro;
  color: whitesmoke;
  cursor: not-allowed;
}
</style>
