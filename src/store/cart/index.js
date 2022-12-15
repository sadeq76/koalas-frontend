import { defineStore } from "pinia";
import actions from "./actions";

export const cart = defineStore({
  id: "cart",
  state: () => ({
    products: [],
    categories: [
      {
        title: "پودر و دانه قهوه",
        value: "bean",
        imageId: 8,
        sub: [
          { title: "قهوه های تک خواستگاه", value: "single" },
          { title: "قهوه های ترکیبی", value: "multi" },
          { title: "قهوه های ترک", value: "turk" },
        ],
      },
      {
        title: "قهوه فوری",
        value: "powder",
        imageId: 6,
      },
      {
        title: "ماگ",
        value: "mug",
        imageId: 7,
      },
      {
        title: "اکسسوری های قهوه",
        value: "accessories",
        imageId: 5,
      },
      {
        title: "جعبه هدیه",
        value: "gift",
        imageId: 10,
      },
      {
        title: "سایر محصولات",
        value: "other",
        imageId: 9,
      },
    ],
    addresses: [],
  }),
  actions,
});
