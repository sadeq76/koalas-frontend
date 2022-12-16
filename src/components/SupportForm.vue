<template>
  <form @submit.prevent="sendMessage" class="full-height d-flex flex-column">
    <h1 class="mb-4">پشتیبانی</h1>
    <textarea
      class="full-width pa-2 rounded-sm"
      aria-label="message"
      placeholder="پیام خود را وارد کنید ..."
      :value="modelValue"
      @input="updateValue"
    ></textarea>
    <div
      :class="[
        { 'flex-column justify-end': screenSize.smAndDown },
        'mb-4 grow-1 d-flex align-end',
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        id="file"
        @change="submitFile"
      />
      <button
        @click.prevent="changeFile"
        :class="[
          { 'full-width mb-4 secondary ': screenSize.smAndDown },
          { 'ml-4 light': !screenSize.smAndDown },
          ,
          'position-relative px-4 d-flex  primary-color rounded-sm full-width',
        ]"
      >
        <span class="grow-1 more">
          {{ file?.name || "آپلود" }}
        </span>
        <span class="no-wrap" v-if="file">| {{ fileSize }}</span>
        <span
          v-if="file"
          :class="[
            supportForm.close,
            'd-flex justify-center align-center icon-close font-size-2',
          ]"
        ></span>
      </button>
      <BaseButton
        @clicked="submit"
        :loading="loading"
        :disable="!modelValue"
        :class="[
          { 'flex-column': screenSize.smAndDown },
          'full-width d-flex justify-center align-center',
        ]"
      >
        ارسال
      </BaseButton>
    </div>
  </form>
</template>

<script>
import { useGlobalVariable } from "@/store";
import { mapState } from "pinia";
import BaseButton from "./ui/BaseButton.vue";

export default {
  props: {
    modelValue: {},
  },
  emits: ["send"],
  data() {
    return {
      file: null,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    fileSize() {
      return (this.file?.size / 1024).toFixed(1) + " کیلوبایت";
    },
  },
  methods: {
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
    submitFile(e) {
      this.file = e.target.files[0];
    },
    async changeFile() {
      if (this.file) {
        this.file = null;
        this.$refs.fileInput.value = null;
      } else {
        this.$refs.fileInput.click();
      }
    },
    sendMessage() {
      this.$emit("send", this.file);
      this.file = null;
    },
  },
  components: { BaseButton },
};
</script>

<style lang="scss" module="supportForm">
.close {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-30%, -30%);
  width: 20px;
  height: 20px;
  color: white;
  background-color: red;
  border-radius: 50%;
}
</style>
