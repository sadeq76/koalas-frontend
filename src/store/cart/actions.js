import { useGlobalVariable } from "../index";
import { useRequest } from "../request";

export default {
  addProduct(product) {
    const snackbar = useGlobalVariable();
    const indexNumber = this.products.findIndex(
      (item) => item.id === product.id
    );
    if (
      indexNumber === -1 ||
      this.products[indexNumber].store > this.products[indexNumber].qty
    ) {
      if (indexNumber === -1) {
        this.products.push(product);
      } else {
        this.products[indexNumber].qty++;
      }
      snackbar.openSnackbar({
        status: "success",
        message: "محصول با موفقیت به سبد شما اضافه شد",
      });
      this.updateLocalStorage();
    } else {
      snackbar.openSnackbar({
        status: "error",
        message: "محصول موجود نیست",
      });
    }
  },
  increaseQty(id) {
    const snackbar = useGlobalVariable();
    const indexNumber = this.products.findIndex((product) => product.id === id);
    if (
      indexNumber === -1 ||
      this.products[indexNumber].store > this.products[indexNumber].qty
    ) {
      this.products[indexNumber].qty++;
      this.updateLocalStorage();
    } else {
      snackbar.openSnackbar({
        status: "error",
        message: "محصول موجود نیست",
      });
    }
  },

  decreaseQty(id) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products[index].qty--;
    this.updateLocalStorage();
  },

  removeItem(id) {
    this.products = this.products.filter((product) => product.id !== id);
    this.updateLocalStorage();
  },
  updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.products));
  },

  updateProductStorage() {
    if (this.products.length) {
      const request = useRequest();
      let body = [];
      for (const product in this.products) {
        body.push(this.products[product].id);
      }
      body = JSON.stringify(body);
      request
        .fetchData({
          url: "/product/qty/",
          method: "POST",
          body,
          isJSON: true,
        })
        .then((response) => {
          for (const [index, product] of this.products.entries()) {
            if (response[product.id] == "0") {
              this.products.splice(index, 1);
            }
            if (response[product.id] < product.qty) {
              product.store = response[product.id];
              product.qty = response[product.id];
            }
          }
          this.updateLocalStorage();
        });
    }
  },

  async getAddresses() {
    const request = useRequest();
    request
      .fetchData({
        url: "/user/profile/",
      })
      .then((result) => {
        this.addresses = result.addresses;
      });
  },
};
