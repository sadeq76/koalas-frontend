import { defineStore } from "pinia";
import actions from "./actions";

export const useRequest = defineStore({
  id: "request",
  state: () => ({
    baseURL: "http://api.koalascoffee.com",
  }),
  actions,
});
