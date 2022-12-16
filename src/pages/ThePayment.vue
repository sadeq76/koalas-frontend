<template>
  <div class="full-width full-height d-flex justify-center align-center">
    <div
      class="card rounded-sm pa-8 d-flex flex-column align-center"
      :class="[
        { 'success-border': isSuccessful },
        { 'error-border': !isSuccessful },
      ]"
    >
      <img v-if="isSuccessful" src="../assets/smile.svg" alt="" />
      <img v-else src="../assets/sad.svg" alt="" />
      <h1
        :class="[
          { 'success-color': isSuccessful },
          { 'error-color': !isSuccessful },
          'my-4 text-center',
        ]"
      >
        {{ result }}
      </h1>
      <p class="font-size-10 mb-4">مبلغ</p>
      <p class="bold primary-color font-size-12 mb-4">
        {{ this.$route.query.amount || 0 }}
      </p>
      <p class="font-size-10 mb-4">کد رهگیری</p>
      <p class="bold primary-color font-size-12">
        {{ this.$route.query.tracking_id || "بدون کد رهگیری" }}
      </p>
      <button
        @click="goToHome"
        class="primary secondary-color rounded-sm full-width text-center mt-8"
      >
        بازگشت به سایت
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useShoppingCart } from "@/store";
export default {
  data() {
    return {
      isSuccessful: this.$route.query.success == "True",
    };
  },
  computed: {
    result() {
      return this.isSuccessful ? "پرداخت موفقیت آمیز" : "مشکل در پرداخت";
    },
  },
  methods: {
    ...mapActions(useShoppingCart, ["clearCart"]),
    goToHome() {
      this.$router.push("/");
    },
  },
  mounted() {
    if (this.isSuccessful) this.clearCart();
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 2px solid;
  width: 90%;
  height: 90%;
  @media only screen and (min-width: 900px) {
    width: 40%;
    height: 80%;
  }

  img {
    aspect-ratio: 1;
    width: 140px;
  }
}
</style>
