<template>
  <div class="full-width full-height py-2">
    <div
      v-if="screenSize.smAndDown"
      class="full-height overflow-hidden pa-4 d-flex flex-column"
    >
      <div
        class="mb-4 grow-1 overflow-scroll overflow-x-hidden d-flex flex-column"
      >
        <SelectBar
          v-if="options.length"
          v-model="address"
          v-bind="{ placeholder, options, label }"
        />
        <CartCard
          v-for="product in productsList"
          :key="product.id"
          v-bind="{ ...product }"
          v-on="{ increase, decrease, remove }"
          class="mb-4"
        ></CartCard>
        <div
          v-if="!productsList.length"
          class="
            full-width
            text-center
            grow-1
            d-flex
            justify-center
            align-center
          "
        >
          داده ای وجود ندارد
        </div>
      </div>
      <div class="primary full-width pa-2 rounded">
        <div class="mb-2 secondary-color d-flex justify-space-between">
          <h4 class="regular">مجموع قیمت کالاها</h4>
          <p class="bold font-size-10">
            {{ productsPrice }} <span class="regular">تومان</span>
          </p>
        </div>
        <div class="mb-2 secondary-color d-flex justify-space-between">
          <h4 class="regular">هزینه ارسال</h4>
          <p class="bold font-size-10">
            {{ deliveryPrice }} <span class="regular">تومان</span>
          </p>
        </div>
        <div class="mb-2 secondary-color d-flex justify-space-between">
          <h4 class="regular">مبلغ نهایی</h4>
          <p class="bold font-size-10">
            {{ finalPrice }} <span class="regular">تومان</span>
          </p>
        </div>
        <BaseButton
          class="full-width"
          :loading="loading"
          :disable="(!productsList.length || !address) && options.length"
          @clicked="buttonClicked"
          :primary="false"
        >
          {{ buttonTitle }}
        </BaseButton>
      </div>
    </div>
    <section v-else :class="[cart.container, 'position-relative full-width']">
      <div :class="[cart.main, 'secondary rounded']">
        <div :class="[cart.products, 'overflow-scroll']">
          <CartCard
            v-for="product in productsList"
            :key="product.id"
            v-bind="{ ...product }"
            v-on="{ increase, decrease, remove }"
            class="mb-4"
          ></CartCard>
        </div>
      </div>
      <div :class="[cart.price, 'pa-4 primary rounded d-flex flex-column']">
        <div class="mb-2 secondary-color d-flex justify-space-between">
          <h4 class="regular">مجموع قیمت کالاها</h4>
          <p class="bold font-size-10">
            {{ productsPrice }} <span class="regular">تومان</span>
          </p>
        </div>
        <div class="mb-2 secondary-color d-flex justify-space-between">
          <h4 class="regular">هزینه ارسال</h4>
          <p class="bold font-size-10">
            {{ deliveryPrice }} <span class="regular">تومان</span>
          </p>
        </div>
        <div class="secondary-color d-flex justify-space-between">
          <h4 class="regular">مبلغ نهایی</h4>
          <p class="bold font-size-10">
            {{ finalPrice }} <span class="regular">تومان</span>
          </p>
        </div>
        <hr v-if="options.length" class="my-2" />
        <SelectBar
          v-if="options.length"
          v-model="address"
          v-bind="{ placeholder, options, label }"
          class="secondary-color"
        />
        <div class="grow-1 d-flex align-end">
          <BaseButton
            class="full-width"
            :loading="loading"
            :disable="(!productsList.length || !address) && options.length"
            @click="buttonClicked"
            :primary="false"
          >
            {{ buttonTitle }}
          </BaseButton>
        </div>
      </div>
    </section>
    <TheLogin v-if="isOpen" @close="toggleModal" />
  </div>
</template>

<script>
import { useGlobalVariable, useShoppingCart } from "@/store";
import { mapActions, mapState } from "pinia";
import { useRequest } from "../store/request";
import { convertToRls, persianToEnglish } from "@/helpers/text";
import CartCard from "@/components/CartCard.vue";
import SelectBar from "@/components/SelectBar.vue";
import TheLogin from "@/components/TheLogin.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

export default {
  components: { CartCard, SelectBar, TheLogin, BaseButton },
  data() {
    return {
      loading: false,
      address: "",
      isOpen: false,
      placeholder: "آدرس را انتخاب کنید",
      label: "آدرس",
      postage: {},
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize", "isLoggedIn"]),
    ...mapState(useShoppingCart, {
      options: "addresses",
      productsList: "products",
    }),

    productsPrice() {
      let sum = 0;
      this.productsList?.map((product) => (sum += product.price * product.qty));
      return convertToRls(sum);
    },
    deliveryPrice() {
      const sum = Number(
        persianToEnglish(this.productsPrice.replaceAll("٬", ""))
      );
      if (sum > this.postage?.free_fee) {
        return "رایگان";
      } else if (this.address.is_tehran) {
        return convertToRls(this.postage.internal_postage_fee);
      } else if (!this.address.is_tehran) {
        return convertToRls(this.postage.foreign_postage_fee);
      } else {
        return "بدون داده";
      }
    },

    finalPrice() {
      return convertToRls(
        Number(persianToEnglish(this.productsPrice.replaceAll("٬", ""))) +
          (this.deliveryPrice !== "رایگان"
            ? Number(persianToEnglish(this.deliveryPrice.replaceAll("٬", "")))
            : 0)
      );
    },

    buttonTitle() {
      return this.isLoggedIn ? "پرداخت نهایی" : "ورود";
    },
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useShoppingCart, {
      increase: "increaseQty",
      decrease: "decreaseQty",
      remove: "removeItem",
      getAddresses: "getAddresses",
      updateInformaion: "updateProductStorage",
    }),
    ...mapActions(useRequest, ["fetchData"]),
    buttonClicked() {
      if (!this.isLoggedIn) {
        this.isOpen = true;
      } else {
        this.getAddresses();
        if (this.isLoggedIn && !this.options.length) {
          this.openSnackbar({
            status: "error",
            message: "لطفا داخل پروفایل خود یک آدرس ثبت کنید",
          });
        } else {
          this.loading = true;
          let products = [];
          for (let product of this.productsList) {
            products.push({
              product_id: product.id,
              qty: product.qty,
              ...(product.mill ? { mill_type: product.mill } : {}),
            });
          }
          let body = JSON.stringify({
            address_id: this.address.id,
            products,
          });
          this.fetchData({
            url: "/product/order/",
            method: "POST",
            body,
            isJSON: true,
          })
            .then((response) => {
              window.open(response.link.pay_url, "_self");
              localStorage.removeItem("cart");
            })
            .catch(() => (this.loading = false));
        }
      }
    },
    getPostageInformation() {
      this.fetchData({
        url: "/postage/",
      })
        .then((response) => {
          this.postage = response;
        })
        .catch(() => (this.loading = false));
    },
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getAddresses();
    }
    this.updateInformaion();
    this.getPostageInformation();
  },
};
</script>

<style lang="scss" module="cart">
.container {
  padding-top: 52%;

  .main {
    position: absolute;
    top: 0;
    right: 0;
    width: 80%;
    height: 100%;

    .products {
      position: absolute;
      top: 10%;
      bottom: 10%;
      right: 2%;
      width: 70%;
    }
  }

  .price {
    position: absolute;
    top: 10%;
    left: 0;
    width: 40%;
    height: 80%;
  }
}
</style>
