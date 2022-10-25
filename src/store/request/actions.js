import { useGlobalVariable } from "../../store";
export default {
  async fetchData({ headers, url, params, method = "GET", body, isJSON }) {
    const globalVar = useGlobalVariable();
    const requestHeaders = this.addHeaders(headers, isJSON);
    const requestParams = this.addParams(params);

    var requestOptions = {
      method: method,
      body: body,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      redirect: "follow",
      headers: requestHeaders,
    };
    console.log(requestOptions);
    let path = url + (requestParams ? "?" : "") + requestParams;

    return fetch(this.baseURL + path, requestOptions).then((response) => {
      if (response.ok) {
        return response
          .text()
          .then((result) => (result ? JSON.parse(result) : ""));
      } else {
        if (response.status < 500 || response.status >= 400) {
          if (response.status === 401) {
            localStorage.clear();
            this.globalVar.toggleLoginStatus();
            this.$router.push({ name: "landing" });
          }
          globalVar.openSnackbar({
            message: "خطایی رخ داده است ...",
            status: "error",
            timeout: 3000,
          });
        }
        if (response.status >= 500) {
          globalVar.openSnackbar({
            message: "مشکل از سمت سرور ...",
            status: "error",
            timeout: 3000,
          });
        }
        throw new Error(`${response.status} : ${response.statusText}`);
      }
    });
  },

  addHeaders(headers, isJSON) {
    const requestHeaders = new Headers();
    if (isJSON) { 
      requestHeaders.append("Accept", "application/json");
      requestHeaders.append("Content-Type", "application/json");
    }
    if (localStorage.getItem("token")) {
      requestHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );
    }
    for (const header in headers) {
      requestHeaders.append(header, headers[header]);
    }
    return requestHeaders;
  },

  addParams(params) {
    const requestParams = new URLSearchParams("");
    for (const param in params) {
      requestParams.append(param, params[param]);
    }
    return requestParams;
  },
};
