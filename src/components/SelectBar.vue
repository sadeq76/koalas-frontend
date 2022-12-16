<template>
  <div
    @click="showOptions"
    class="position-relative full-width d-flex align-center pa-2 mb-4 pointer"
  >
    <div class="d-flex align-center grow-1 overflow-hidden">
      <!-- <span class="icon-pin ml-2 secondary-color  mr-2"></span> -->
      <h4>{{ label }} :</h4>
      <p class="more mr-2">
        {{ selectedOption ? selectedOption.title : placeholder }}
      </p>
    </div>
    <span class="icon-angle-down"></span>
    <div
      v-show="isVisible"
      :class="[
        selectBar.options,
        { [selectBar.top]: open === 'top' },
        { [selectBar.bottom]: open === 'bottom' },
        'shadow light pa-2 rounded-sm',
      ]"
    >
      <transition enter-active-class="fade-down" leave-active-class="fade-up">
        <ul class="primary-color" v-show="isVisible">
          <li
            v-for="(option, index) in options"
            :key="index"
            @click="selectOption(option)"
            :class="[selectBar.option, , 'full-width d-flex align-center']"
          >
            <h4 class="py-4 no-wrap ml-2">
              {{ option.title }}
            </h4>
            <p class="py-4 grow-1 more">
              {{ option.description }}
            </p>
          </li>
          <li v-if="!options?.length">آدرسی موجود نیست.</li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: false,
    },
    open: {
      type: String,
      required: false,
      default: "bottom",
    },
    modelValue: {},
  },
  data() {
    return {
      isVisible: false,
      selectedOption: "",
    };
  },
  methods: {
    showOptions() {
      this.isVisible = !this.isVisible;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.$emit("update:modelValue", this.selectedOption);
      this.$emit("changed");
    },
  },
};
</script>

<style lang="scss" module="selectBar">
.options {
  width: 100%;
  max-height: 250px;
  overflow-y: scroll;

  .option {
    border-bottom: solid 0.5px rgba(0, 0, 0, 0.1);
  }
  .option:last-child {
    border-bottom: none;
  }
}

.top {
  position: absolute;
  left: 0;
  z-index: 10;
  top: 0;
  transform: translateY(calc(-100% - 0.5rem));
}
.bottom {
  position: absolute;
  left: 0;
  z-index: 10;
  bottom: 0;
  transform: translateY(calc(100% + 0.5rem));
}
</style>
