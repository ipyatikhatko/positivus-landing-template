import "../styles/main.scss";

// Your JavaScript code here
console.log("Website loaded!");

if (module.hot) {
  module.hot.accept();

  // Dynamically accept all Pug templates
  const pugContext = require.context("../views/pages/", true, /\.pug$/);
  pugContext.keys().forEach((template) => {
    module.hot.accept(pugContext.resolve(template), () => {
      window.location.reload();
    });
  });
}
