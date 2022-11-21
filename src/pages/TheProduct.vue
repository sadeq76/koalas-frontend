<template>
  <div :class="['full-height full-width d-flex flex-column']">
    <section :class="['full-width grow-1 overflow-scroll hide-scroll']">
      <div class="full-height d-flex">
        <div
          :class="[
            product.container,
            'full-height full-width d-flex flex-column secondary',
          ]"
        >
          <!-- <span
            @click="back"
            :class="[product.back, 'primary-color icon-angle-right pointer']"
          /> -->
          <SelectBar
            v-if="has_mill && screenSize.smAndDown"
            v-model="mill"
            :label="'نوع آسیاب'"
            :placeholder="'لطفا نوع آسیاب را انتخاب کنید'"
            :options="MillOptions"
          />
          <div class="grow-1 pa-12 overflow-hidden">
            <img :class="product.image" :src="image" :alt="title" />
          </div>
          <div v-if="screenSize.smAndDown" class="full-width pa-4">
            <h1 class="mb-2 primary-color">{{ title }}</h1>
            <p>{{ description }}</p>
          </div>
        </div>
        <div
          v-if="!screenSize.smAndDown"
          class="d-flex flex-column grow-1 overflow-hidden px-4"
        >
          <h1 class="mb-2 primary-color pt-4">{{ title }}</h1>
          <p class="pb-4">{{ description }}</p>
          <p class="pb-8 bold primary-color font-size-12">قیمت : {{ price }}</p>
          <SelectBar
            v-if="has_mill"
            v-model="mill"
            :label="'نوع آسیاب'"
            :placeholder="'لطفا نوع آسیاب را انتخاب کنید'"
            :options="MillOptions"
          />
          <div
            v-if="!screenSize.smAndDown"
            class="grow-1 d-flex align-end ma-4"
          >
            <BaseButton
              @click="
                addProduct({
                  id: +$route.params.id,
                  image,
                  title,
                  price,
                  store: +store,
                  qty: 1,
                  has_mill,
                  mill,
                })
              "
              class="primary secondary-color px-4 rounded-pill full-width"
            >
              افزودن به سبد
            </BaseButton>
          </div>
        </div>
      </div>
    </section>
    <div
      v-if="screenSize.smAndDown"
      :class="[
        product['action-bar'],
        'full-width fit-content pa-4 d-flex justify-space-between align-center',
      ]"
    >
      <div>
        <h2 class="regular">قیمت:</h2>
        <span
          :class="[product['total-price'], 'primary-color font-size-12 bold']"
        >
          {{ productPrice }}</span
        >
      </div>
      <BaseButton
        :disable="has_mill && !mill"
        @click="
          addProduct({
            id: +$route.params.id,
            image,
            title,
            price,
            store: +store,
            qty: 1,
            has_mill,
            mill,
          })
        "
        class="primary secondary-color px-4 rounded-pill"
      >
        افزودن به سبد
        <span icon="icon-plus mr-2" />
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable, useShoppingCart } from "@/store";
import { convertToRls } from "../helpers/text";
import SelectBar from "../components/SelectBar.vue";
import BaseButton from "../components/ui/BaseButton.vue";
export default {
  components: { SelectBar, BaseButton },
  data() {
    return {
      title: "",
      image: "",
      description: "",
      price: 0,
      has_mill: false,
      store: 1,
      MillOptions: [
        { title: "دستگاه اسپرسو ساز خانگی", value: "home-espresso-machine" },
        { title: "دستگاه فیلتری قهوه دمی یا فرانسه", value: "french-coffee" },
        { title: "فرنچ پرس", value: "french-press" },
        { title: "موکاپات", value: "moka-pot" },
        { title: "مینی پرس - نانو پرسی", value: "mini-press" },
        { title: "دان (آسیاب نشده)", value: "bean" },
      ],
      mill: null,
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    productPrice() {
      return this.price ? convertToRls(this.price) : "بدون قیمت";
    },
  },
  methods: {
    ...mapActions(useShoppingCart, ["addProduct"]),
    back() {
      this.$router.back();
    },
    queryToObj() {
      this.title = this.$route.query.title;
      this.image = this.$route.query.image;
      this.description = this.$route.query.description;
      this.price = +this.$route.query.price;
      this.store = this.$route.query.qty;
      this.has_mill = this.$route.query.has_mill === "true";
    },
  },
  mounted() {
    this.queryToObj();
  },
};
</script>

<style lang="scss" module="product">
.container {
  position: relative;
  @media (min-width: 750px) {
    min-width: 50%;
    width: 50%;
  }

  .image {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
  .back {
    position: absolute;
    top: 1em;
    right: 1em;
  }
}
</style>
