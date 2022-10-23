<template>
  <BaseModal :fullscreen="screenSize.smAndDown" width="25%" :persistent="true">
    <button
      @click="closeModal"
      :class="[login['dialog-close'], 'primary-color icon']"
    >
      <span :class="`icon-${icon} pointer`" />
    </button>
    <div class="d-flex flex-column align-center">
      <img
        :class="[login.logo, 'mb-4']"
        src="@/assets/orginal-primary-logo.png"
        alt="koalas-coffee logo"
      />
      <h1 class="mb-2 primary-color">صفحه ورود</h1>
      <p class="mb-4">{{ description }}</p>
      <div v-if="step == 2" class="mb-4 d-flex justify-center align-center">
        <button @click="priviousStep" class="icon ml-4">
          <span class="icon-edit" />
        </button>

        <p :class="[login['phone-number-letter-space'], 'primary-color bold']">
          {{ "09" + phoneNumber }}
        </p>
      </div>
      <BaseInput
        class="full-width mb-8"
        v-bind="{
          name,
          type,
          placeholder,
          append,
          label,
          required,
          maxlength,
          autocomplete,
          textAlign,
          rules,
          seperator,
        }"
        dir="ltr"
        v-model="inputText"
        @keypress.enter="submit"
        @keyup="addDash"
        color="primary"
      />
    </div>
    <div class="full-width d-flex flex-column justify-end align-center">
      <BaseButton
        :loading="loading"
        :disable="!isValid"
        @clicked="submit"
        class="full-width"
      >
        {{ buttonText }}
      </BaseButton>
      <p class="font-size-6 my-4 tex-center">
        ورود در کوآلاز به معنی پذیرش <strong>قوانین و مقررات</strong> است
      </p>
    </div>
  </BaseModal>
</template>

<script>
import { useGlobalVariable, useShoppingCart } from "../store";
import { mapActions, mapState } from "pinia";
import { useRequest } from "@/store/request";
import BaseModal from "./popup/BaseModal.vue";
import BaseInput from "./ui/BaseInput.vue";
import BaseButton from "./ui/BaseButton.vue";
import { persianToEnglish } from "@/helpers/text";

export default {
  components: { BaseModal, BaseInput, BaseButton },
  data() {
    return {
      loading: false,
      step: 1,
      prefix: "09",
      inputText: "",
      phoneNumber: "",
      code: null,
      type: "tel",
      autocomplete: "off",
      codeLength: 4,
      phoneNumberRules: [
        {
          validation: (value) => !!value || "شماره همراه الزامیست",
          type: "error",
        },
        {
          validation: (value) => value.length === 9 || "۹ رقم الزامیست",
          type: "error",
        },
        {
          validation: (value) =>
            !value.startsWith("09") || "پیش شماره را حذف کنید",
          type: "warn",
        },
      ],
      codeRules: [
        {
          validation: (value) => !!value || "کد الزامیست",
          type: "error",
        },
        {
          validation: (value) =>
            value.length === 2 * this.codeLength - 1 ||
            `کد${this.codeLength} رقمی است`,
          type: "error",
        },
      ],
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    icon() {
      return this.screenSize.smAndDown ? "angle-down" : "close";
    },
    description() {
      return this.step === 1
        ? "لطفا شماره تماس خود را وارد کنید"
        : "کد ارسالی به شماره تماس زیر را وارد کنید";
    },

    name() {
      return this.step == 1 ? "phone" : "code";
    },
    placeholder() {
      return this.step == 1 ? "شماره تماس" : "کد";
    },
    append() {
      return this.step == 1 ? "۰۹" : "";
    },
    label() {
      return this.step == 1 ? "همراه" : "کد";
    },
    required() {
      return this.step == 1 ? true : false;
    },
    maxlength() {
      return this.step == 1 ? 9 : this.codeLength;
    },
    textAlign() {
      return this.step === 1 ? "left" : "center";
    },
    rules() {
      return this.step === 1 ? this.phoneNumberRules : this.codeRules;
    },
    seperator() {
      return this.step === 1 ? null : "-";
    },
    buttonText() {
      return this.step === 1 ? "مرحله بعد" : "ورود";
    },
    isValid() {
      return (
        (this.inputText.length == 9 && this.step == 1) ||
        (this.inputText.length == 4 && this.step == 2)
      );
    },
  },
  methods: {
    ...mapActions(useGlobalVariable, [
      "toggleModal",
      "toggleLoginStatus",
      "openSnackbar",
    ]),
    priviousStep() {
      this.inputText = this.phoneNumber;
      this.step = 1;
    },
    ...mapActions(useShoppingCart, ["getAddresses"]),
    ...mapActions(useRequest, ["fetchData"]),

    submit() {
      if (this.step === 1) {
        this.sendPhoneNumber();
      } else {
        this.sendOTP();
      }
    },

    sendPhoneNumber() {
      this.loading = true;
      let body = new FormData();
      body.append("phone_number", `09${persianToEnglish(this.inputText)}`);

      this.fetchData({ url: "/user/login/", method: "POST", body })
        .then(() => {
          this.phoneNumber = this.inputText;
          this.inputText = "";
          this.step = 2;
        })
        .finally(() => (this.loading = false));
    },

    sendOTP() {
      this.loading = true;
      let body = new FormData();
      body.append("phone_number", `09${persianToEnglish(this.phoneNumber)}`);
      body.append("otp", persianToEnglish(this.inputText));

      this.fetchData({ url: "/user/otp/", method: "POST", body })
        .then((response) => {
          if (!response.is_admin) {
            this.toggleLoginStatus();
            localStorage.setItem("token", response.token);
            this.$router.push({
              name: "profile",
            });
          } else {
            this.toggleSnackbar({
              status: "error",
              message: "شما ادمین هستید",
            });
          }
        })
        .finally(() => (this.loading = false));
    },

    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" module="login">
.logo {
  width: 30%;
}
.phone-number-letter-space {
  letter-spacing: 0.25ch;
}
.dialog-close {
  position: absolute;
  top: 1em;
  left: 1em;
}
</style>
