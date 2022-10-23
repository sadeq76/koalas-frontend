<template>
  <transition enter-active-class="bounce-in" leave-active-class="bounce-out ">
    <div
      v-if="snackbar"
      :class="[
        bar.container,
        snackbarStatus,
        'pa-4 rounded-sm d-flex justify-space-between',
      ]"
    >
      <p class="secondary-color">
        {{ snackbarMessage }}
      </p>
      <button @click="closeSnackbar" class="icon">
        <span class="icon-close secondary-color pointer" />
      </button>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable } from "@/store";
export default {
  computed: {
    ...mapState(useGlobalVariable, [
      "snackbarMessage",
      "snackbarStatus",
      "snackbar",
    ]),
  },
  methods: {
    ...mapActions(useGlobalVariable, ["closeSnackbar"]),
  },
};
</script>

<style lang="scss" module="bar">
.container {
  position: fixed;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 5;
  height: fit-content;
  max-width: 500px;

  @media only screen and (min-width: 900px) {
    margin-inline: auto;
  }
}
</style>
