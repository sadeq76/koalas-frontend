<template>
  <div class="full-width full-height py-2">
    <SupportForm
      v-if="screenSize.smAndDown"
      class="pa-4"
      v-model="message"
      @send="sendMessage"
    ></SupportForm>
    <section
      v-else
      :class="[support.container, 'position-relative full-width']"
    >
      <div :class="[support.main, 'secondary rounded']">
        <div :class="support.form">
          <SupportForm v-model="message" @send="sendMessage"></SupportForm>
        </div>
      </div>
      <div :class="[support['contact-info'], 'rounded']">
        <div
          :class="[
            support.content,
            'pa-8 full-height full-width d-flex flex-column justify-center',
          ]"
        >
          <address>
            <div
              v-for="(contact, index) in contactInformation"
              :key="index"
              class="d-flex align-start vertical-middle mb-8"
            >
              <h3 class="secondary-color ml-2 font-size-6">
                {{ contact.title }}:
              </h3>
              <a
                class="secondary-color text-justify font-size-6"
                :href="contact.path"
                dir="ltr"
                >{{ contact.description }}</a
              >
            </div>
          </address>
        </div>
      </div>
    </section>
    <TheLogin v-if="isOpen" @close="closeModal" />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useGlobalVariable } from "@/store";
import { useRequest } from "../store/request";
import SupportForm from "@/components/SupportForm.vue";
import TheLogin from "@/components/TheLogin.vue";

export default {
  components: { SupportForm, TheLogin },
  data() {
    return {
      loading: false,
      message: "",
      isOpen: false,
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
    ...mapState(useGlobalVariable, ["screenSize", "isLoggedIn"]),
  },
  methods: {
    ...mapActions(useGlobalVariable, ["openSnackbar"]),
    ...mapActions(useRequest, ["fetchData"]),
    async sendMessage(file) {
      if (!this.isLoggedIn) {
        this.isOpen = true;
      } else if (this.message) {
        this.loading = true;
        let body = new FormData();
        body.append("message", this.message);
        body.append("file", file);

        this.fetchData({ url: "/user/support/", method: "POST", body })
          .then(() => {
            this.openSnackbar({
              message: "پیام شما ارسال شد",
              status: "success",
            });
          })
          .finally(() => (this.loading = false));
      }
    },
    closeModal() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss" module="support">
.container {
  padding-top: 52%;

  .main {
    position: absolute;
    top: 0;
    right: 0;
    width: 80%;
    height: 100%;

    .form {
      position: absolute;
      top: 10%;
      bottom: 10%;
      right: 8%;
      width: 60%;
    }
  }

  .contact-info {
    position: absolute;
    top: 10%;
    left: 0;
    width: 40%;
    height: 80%;
    background-image: url("http://api.koalascoffee.com/banner/4/");
    background-size: cover;
    background-position: center;
    overflow: hidden;

    .content {
      background-color: rgba(8, 56, 48, 0.9);
    }
  }
}
</style>
