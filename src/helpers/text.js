export const persianToEnglish = (string) =>
  string.toString().replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

export const convertToRls = (number) =>
  new Intl.NumberFormat("fa-IR").format(number);

export const convertToShamsi = (string) => {
  let options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(string).toLocaleDateString("fa-IR", options);
};
