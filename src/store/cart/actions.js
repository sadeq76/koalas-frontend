import { useGlobalVariable } from "../index";
import { useRequest } from "../request";

export default {
  checkArray(newProduct) {
    let sameIndexes = [];
    let exactSame;
    for (let [index, product] of this.products.entries()) {
      if (product.id === newProduct.id) {
        sameIndexes.push(index)
        if (product.mill?.value === newProduct.mill?.value) {
          exactSame = index
        }
      }
    }
    return { sameIndexes, exactSame };
  },
  updateProductsStore(sameIndexes, operation) {
    for (const index in sameIndexes) {
      operation === 'add' ?
        this.products[index].store++ :
        this.products[index].store--;
    }
  },
  addProduct(product) {
    const snackbar = useGlobalVariable();
    const obj = this.checkArray(product);
    if (obj.sameIndexes.length) {
      if (this.products[obj.sameIndexes[0]].store) {
        if (typeof obj.exactSame === 'number') {
          this.products[obj.exactSame].qty++
        } else {
          product.store = this.products[obj.sameIndexes[0]].store - 1
          this.products.push(product);
        }
        this.updateProductsStore(obj.sameIndexes, 'minus')
        snackbar.openSnackbar({
          status: "success",
          message: "محصول با موفقیت به سبد شما اضافه شد",
        });
      } else {
        snackbar.openSnackbar({
          status: "error",
          message: "محصول موجود نیست",
        });
      }
    } else {
      product.store--;
      this.products.push(product);
      snackbar.openSnackbar({
        status: "success",
        message: "محصول با موفقیت به سبد شما اضافه شد",
      });
    }
    this.updateLocalStorage();
  },
  increaseQty(product) {
    const snackbar = useGlobalVariable();
    const obj = this.checkArray(product);
    if (this.products[obj.exactSame].store) {
      this.products[obj.exactSame].qty++
      this.updateProductsStore(obj.sameIndexes, 'minus');
    } else {
      snackbar.openSnackbar({
        status: "error",
        message: "محصول موجود نیست",
      });
    }
    this.updateLocalStorage();
  },

  decreaseQty(product) {
    const obj = this.checkArray(product);
    if (this.products[obj.exactSame].qty > 1) {
      this.products[obj.exactSame].qty--
      this.updateProductsStore(obj.sameIndexes, 'add');
    } else {
      this.products.splice(obj.exactSame, 1);
      this.updateProductsStore(obj.sameIndexes, 'add');
    }
    this.updateLocalStorage();
  },

  removeItem(product) {
    this.products = this.products.filter((p) => p.id !== product.id || (p.id == product.id && p.mill !== product.mill));
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
