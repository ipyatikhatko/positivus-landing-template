function initMobileNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavButton = document.querySelector(".mobile-header__menu-button");

  mobileNavButton.addEventListener("click", () => {
    console.log("clicked", mobileNavButton);
    mobileNav.dataset.open =
      mobileNav.dataset.open === "true" ? "false" : "true";
  });

  const navCloseButton = document.querySelector(".mobile-nav__close-button");

  navCloseButton.addEventListener("click", () => {
    mobileNav.dataset.open = "false";
  });
}

export { initMobileNav };
