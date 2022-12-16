import { defineStore } from "pinia";
import actions from "./actions";

export const cart = defineStore({
  id: "cart",
  state: () => ({
    products: [],
    categories: [
      {
        title: "دان و پودر قهوه",
        value: "bean",
        imageId: 8,
        sub: [
          { title: "قهوه های تک خواستگاه", value: "single" },
          { title: "قهوه های ترکیبی", value: "multi" },
          { title: "قهوه های ترک", value: "turk" },
        ],
      },
      {
        title: "محصولات فوری",
        value: "powder",
        imageId: 6,
      },
      {
        title: "اکسسوری و لوازم دم آوری قهوه",
        value: "accessories",
        imageId: 5,
      },
      {
        title: "ماگ",
        value: "mug",
        imageId: 7,
      },
      {
        title: "جعبه هدیه",
        value: "gift",
        imageId: 10,
      },
    ],
    addresses: [],
  }),
  actions,
});
