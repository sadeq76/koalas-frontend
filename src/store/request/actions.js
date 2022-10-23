import { useGlobalVariable } from "../../store";
export default {
  async fetchData({ headers, url, params, method = "GET", body }) {
    const globalVar = useGlobalVariable();
    const requestHeaders = this.addHeaders(headers);
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

    let path = url + (requestParams ? "?" : "") + requestParams;

    return fetch(this.baseURL + path, requestOptions).then((response) => {
      if (response.ok) {
        return response
          .text()
          .then((result) => (result ? JSON.parse(result) : ""));
      } else {
        if (response.status < 500 || response.status >= 400) {
          if (response.status === 401) {
            localStorage.removeItem();
            this.globalVar.isLoggedIn = false;
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

  addHeaders(headers) {
    const requestHeaders = new Headers();
    // headers.append("Accept", "application/json");
    // headers.append("Content-Type", "application/json");
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
