<template>
  <div
    :class="[
      product.container,
      'rounded-sm d-flex flex-column align-center pa-2 pointer overflow-hidden',
    ]"
    @click="productPage"
  >
    <div
      :class="[
        product.image,
        'rounded-sm d-flex justify-center align-center secondary pa-8',
      ]"
    >
      <img
        style="filter: drop-shadow(0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.5))"
        :src="productImage"
        :alt="imagAlt"
      />
    </div>
    <div
      :class="[
        product.information,
        'mt-2 d-flex flex-column justify-center align-center',
      ]"
    >
      <h3 class="thin more">
        {{ title ? title.substring(0, 18) : "بدون نام"
        }}{{ title.length > 18 ? "..." : "" }}
      </h3>
      <p class="bold mt-2 primary-color">
        {{ productPrice }}
      </p>
      <button
        @click.stop="
          addProduct({ id, image, title, price, store: qty, qty: 1, has_mill })
        "
        class="my-2 icon d-flex justify-center align-center"
      >
        <span class="bold font-size-8 more primary-color"> افزودن به سبد </span>
        <span class="icon-plus pointer"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useShoppingCart } from "@/store";
import { convertToRls } from "../helpers/text";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      validator(value) {
        if (!["jpg", "png", "svg"].includes(value)) {
          console.warn("should be jpg , png or svg");
        }
        if (["https://www.", "http://www."].includes(value)) {
          console.warn("shouldn't contain baseUrl");
        }
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {},
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },

    has_mill: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    productImage() {
      return this.image ? this.image : "@/assets/defaultProduct.svg";
    },
    imageAlt() {
      return "تصویر " + this.title;
    },

    productPrice() {
      return this.price ? convertToRls(this.price) : "ناموجود";
    },
  },
  methods: {
    ...mapActions(useShoppingCart, ["addProduct"]),
    productPage() {
      this.$router.push({
        name: "product",
        params: { id: this.id },
        query: {
          title: this.title,
          image: this.image,
          description: this.description,
          qty: this.qty,
          price: this.price,
          has_mill: this.has_mill,
        },
      });
    },
  },
};
</script>

<style lang="scss" module="product">
.container {
  overflow: hidden;
  background-color: transparent;
  width: 50%;
  @media (min-width: 750px) {
    width: 25%;
  }

  .image {
    width: 100%;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: contain;
    }
  }
  .information {
    p {
      letter-spacing: 0.08rem;
    }
  }
}
</style>
