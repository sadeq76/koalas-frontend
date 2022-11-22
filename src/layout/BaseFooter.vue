<template>
  <footer class="pa-4 full-width primary rounded-sm">
    <section class="d-flex flex-column align-center">
      <img
        class="mb-4"
        src="@/assets/orginal-logo.png"
        alt="koalas coffee logo"
      />
      <div class="icons d-flex justify-center align-center mb-8">
        <a
          class="mx-2"
          v-for="(social, index) in socials"
          :key="index"
          :href="social.path"
        >
          <span :class="`secondary-color icon-${social.icon}`" />
        </a>
      </div>
    </section>

    <div
      :class="{
        'flex-column': screenSize.smAndDown,
        'd-flex align-space-between': true,
      }"
    >
      <div
        :class="{
          'align-center': screenSize.smAndDown,
          'half-width': !screenSize.smAndDown,
          'd-flex flex-column mb-4': true,
        }"
      >
        <h3 class="mb-4 secondary-color">لینک ها</h3>
        <ul
          :class="[
            { 'flex-column align-center': screenSize.smAndDown },
            'px-2',
          ]"
        >
          <li
            v-for="link in links"
            :key="link"
            :class="{
              'mb-4': true,
              'd-flex justify-center': screenSize.smAndDown,
            }"
          >
            <RouterLink class="secondary-color font-size-6" :to="link.path">{{
              link.title
            }}</RouterLink>
          </li>
        </ul>
      </div>

      <div
        class="d-flex flex-column mb-4"
        :class="{
          'align-center': screenSize.smAndDown,
        }"
      >
        <h3 class="mb-4 secondary-color">تماس با ما</h3>
        <address class="px-2" :class="{ 'px-8': screenSize.smAndDown }">
          <div
            v-for="(contact, index) in contactInformation"
            :key="index"
            class="d-flex align-start vertical-middel mb-2"
            :class="{ 'justify-center': screenSize.smAndDown }"
          >
            <h4 class="secondary-color ml-2">{{ contact.title }}:</h4>
            <a
              class="secondary-color text-justify regular font-size-8"
              :href="contact.path"
              dir="ltr"
              >{{ contact.description }}</a
            >
          </div>
        </address>
      </div>
    </div>

    <section class="d-flex flex-column align-center">
      <hr class="full-width" />
      <p class="my-2 secondary-color text-center font-size-4">
        کلیه حقوق این سایت نزد کوآلازکافی محفوظ بوده و کپی با ذکر منبع بلامانع است
      </p>
      <p class="mb-2 secondary-color text-center font-size-6">
        powerd by
        <a
          href="https://alirn.ir"
          target="_blank"
          style="text-decoration: none"
          class="secondary-color font-size-8"
        >
          <strong>AliRn</strong></a
        >
      </p>
    </section>
  </footer>
</template>

<script>
import { useGlobalVariable } from "@/store/index";
import { mapState } from "pinia";
export default {
  data() {
    return {
      links: [
        { title: "خانه", path: "/" },
        { title: "محصولات", path: "/shop" },
        { title: "بلاگ ها", path: "/blogs" },
        { title: "پشتیبانی", path: "/support" },
      ],
      socials: [
        { icon: "insta", path: "instagram.com/koalascoffee" },
        { icon: "telegram", path: "t.me/koalascoffee" },
      ],
      contactInformation: [
        {
          title: "شماره تماس",
          description: "+98 919 0400 529",
          path: "tel:+989190400529",
        },
        {
          title: "ایمیل",
          description: "KoalasCoffee@gmail.com",
          path: "KoalasCoffee@gmail.com",
        },
      ],
    };
  },
  computed: {
    ...mapState(useGlobalVariable, ["screenSize"]),
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 90px;
  height: 90px;
}
</style>
