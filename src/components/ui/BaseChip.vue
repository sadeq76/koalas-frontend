<template>
  <div
    :modelValue="searchText"
    @click="$emit('update:modelValue', value)"
    :class="[
      chip.container,
      { 'primary secondary-color': active },
      'pa-2 fit-width rounded-pill d-flex align-center pointer',
    ]"
  >
    <slot class="font-size-6"></slot>
    <span
      v-if="active"
      @click.stop="close"
      class="icon-close mr-4 font-size-6 secondary-color"
    ></span>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
      required: false,
    },
    value: {
      type: String,
      required: true,
    },
  },
  emits: ["toogleStatus", "close"],
  methods: {
    toogleStatus() {
      this.$emit("toogleStatus");
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" module="chip">
.container {
  height: 1.5rem;
  border: 2px solid $primary-color;
}
</style>
