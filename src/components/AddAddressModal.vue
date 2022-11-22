<template>
  <BaseModal :fullscreen="screenSize.smAndDown" width="25%" :persistent="true">
    <span
      @click="closeModal"
      class="close primary-color"
      :class="`icon-${icon}`"
    />
    <h3 class="mb-4">افزودن آدرس</h3>
    <BaseInput
      type="text"
      name="title"
      label="عنوان"
      autocomplete="off"
      class="full-width"
      color="primary"
      :rules="titleRule"
      v-model="title"
    />
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 200px; width: 100%"
      class="map rounded-sm mb-4"
      @click="getPosition"
    >
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <!-- marker -->
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[...markerPosition]"></ol-geom-point>
            <ol-style>
              <ol-style-circle radius="8">
                <ol-style-fill color="red"></ol-style-fill>
                <ol-style-stroke color="red" :width="1"></ol-style-stroke>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

      <!-- controllers -->
      <ol-fullscreen-control />
      <ol-zoom-control />
    </ol-map>
    <textarea
      class="full-width pa-2 rounded-sm mb-4"
      aria-label="address"
      placeholder="متن آدرس خود را وارد کنید ..."
      v-model="address"
    ></textarea>
    <BaseInput
      type="tel"
      name="zip_code"
      label="کدپستی"
      maxlength="10"
      autocomplete="off"
      class="full-width"
      color="primary"
      :rules="zipCodeRule"
      v-model="zip_code"
    />
    <BaseButton
      :disable="!isValid"
      :loading="loading"
      @clicked="add"
      class="full-width"
    >
      ثبت
    </BaseButton>
  </BaseModal>
</template>

<script>
import { mapActions, mapState, mapWritableState } from "pinia";
import { useGlobalVariable, useShoppingCart } from "@/store";
import { useRequest } from "@/store/request";
import BaseModal from "./popup/BaseModal.vue";
import BaseInput from "./ui/BaseInput.vue";
import BaseButton from "./ui/BaseButton.vue";
export default {
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
  },
  data() {
    return {
      markerPosition: [],
      latitude: 35.65875,
      longitude: 51.352987,
      center: [51.352987, 35.65875],
      projection: "EPSG:4326",
      zoom: 14,
      rotation: 0,
      loading: false,
      disable: false,
      title: "",
      address: "",
      zip_code: "",
      titleRule: [
        {
          validation: (value) => !!value || "عنوان الزامیست",
          type: "error",
        },
      ],
      zipCodeRule: [
        {
          validation: (value) => !!value || "کد پستی الزامیست",
          type: "error",
        },
        {
          validation: (value) => value.length === 10 || "کد پستی نامعتبر",
          type: "error",
        },
      ],
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
    ...mapWritableState(useShoppingCart, ["addresses"]),
    icon() {
      return this.screenSize.smAndDown ? "angle-down" : "close";
    },
    isValid() {
      return (
        this.address &&
        this.zip_code.length === 10 &&
        this.title &&
        this.markerPosition[0] &&
        this.markerPosition[1]
      );
    },
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),

    getPosition(e) {
      if (e.coordinate) {
        this.markerPosition = e.coordinate;
        this.center = this.markerPosition;
        this.zoom = this.$refs.view.getZoom();
        this.fetchData({
          url: `/user/reverse-geocoding/${this.markerPosition[1]}/${this.markerPosition[0]}/`,
        }).then((response) => {
          this.address = response.address;
        })
      }
    },

    add() {
      this.loading = true;
      if (this.title && this.address && this.zip_code) {
        const body = new FormData();
        body.append("title", this.title);
        body.append("latitude", this.markerPosition[1]);
        body.append("longitude", this.markerPosition[0]);
        body.append("address", this.address);
        body.append("zip_code", this.zip_code);

        this.fetchData({ url: "/user/address/", method: "POST", body })
          .then((response) => {
            this.addresses.push(response);
            this.closeModal();
          })
          .finally(() => (this.loading = false));
      }
    },

    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.close {
  position: absolute;
  top: 1em;
  left: 1em;
}
.map {
  border: 1px solid $primary-color;
}
</style>
