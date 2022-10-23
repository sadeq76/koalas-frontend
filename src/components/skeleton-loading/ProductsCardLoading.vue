<template>
  <div
    :class="[
      product.container,
      'rounded-sm d-flex flex-column align-center pa-2',
    ]"
  >
    <div
      :class="[
        product.image,
        'skeleton rounded-sm d-flex justify-center align-center secondary',
      ]"
    ></div>
    <div
      :class="[
        product.information,
        'mt-2 d-flex flex-column justify-center align-center',
      ]"
    >
      <h3>
        <span class="text-loading" />
      </h3>
      <span class="text-loading mt-2" />
      <span class="text-loading mt-2" />
    </div>
  </div>
</template>

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
    padding-bottom: 100%;
    overflow: hidden;
  }
  .information {
    p {
      letter-spacing: 0.08rem;
    }
  }
}
</style>
