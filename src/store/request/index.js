import { defineStore } from "pinia";
import actions from "./actions";

export const useRequest = defineStore({
  id: "request",
  state: () => ({
    baseURL: "https://api.koalascoffee.com",
  }),
  actions,
});
