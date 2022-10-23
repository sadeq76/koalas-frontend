export default function auth(router) {
  router.beforeEach((to) => {
    if (to.name === "profile" && !localStorage.getItem("token")) {
      return { name: "landing" };
    }
  });
}
