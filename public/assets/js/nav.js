(() => {
  // src/assets/js/nav.js
  var bodyElement = document.querySelector("body");
  var navbarMenu = document.querySelector("header");
  var hamburgerMenu = document.querySelector("header #mobile-menu-toggle");
  function toggleAriaExpanded(element) {
    const isExpanded = element.getAttribute("aria-expanded") === "true";
    element.setAttribute("aria-expanded", (!isExpanded).toString());
  }
  function toggleMenu() {
    hamburgerMenu.classList.toggle("active");
    navbarMenu.classList.toggle("active");
    bodyElement.classList.toggle("mobile-menu");
    toggleAriaExpanded(hamburgerMenu);
  }
  hamburgerMenu.addEventListener("click", toggleMenu);
  navbarMenu.addEventListener("click", function(event) {
    if (event.target === navbarMenu && navbarMenu.classList.contains("active")) {
      toggleMenu();
    }
  });
  function toggleDropdown(element, event) {
    event?.stopPropagation();
    element.classList.toggle("active");
    const dropdownButton = element.querySelector(".dropdown-button");
    if (dropdownButton) {
      toggleAriaExpanded(dropdownButton);
    }
    const dropdownContent = element.querySelector(".dropdown-content");
    if (dropdownContent) {
      const isVisible = element.classList.contains("active");
      dropdownContent.setAttribute("aria-hidden", (!isVisible).toString());
    }
  }
  function closeDropdown(element) {
    element.classList.remove("active");
    const dropdownButton = element.querySelector(".dropdown-button");
    const dropdownContent = element.querySelector(".dropdown-content");
    if (dropdownButton) {
      dropdownButton.setAttribute("aria-expanded", "false");
    }
    if (dropdownContent) {
      dropdownContent.setAttribute("aria-hidden", "true");
    }
  }
  var dropdownElements = document.querySelectorAll(".dropdown");
  dropdownElements.forEach((dropdown) => {
    const dropdownButton = dropdown.querySelector(".dropdown-button");
    const dropdownContent = dropdown.querySelector(".dropdown-content");
    if (dropdownButton) {
      dropdownButton.setAttribute("aria-expanded", "false");
      dropdownButton.setAttribute("aria-haspopup", "true");
    }
    if (dropdownContent) {
      dropdownContent.setAttribute("aria-hidden", "true");
    }
    dropdownButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleDropdown(dropdown, event);
    });
    dropdown.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown(dropdown);
        dropdownButton?.focus();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDropdown(dropdown, event);
      }
    });
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        closeDropdown(dropdown);
      }
    });
  });
  var dropdownLinks = document.querySelectorAll(".drop-li > .li-link");
  dropdownLinks.forEach((link) => {
    link.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        window.location.href = this.href;
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hamburgerMenu.classList.contains("active")) {
      toggleMenu();
    }
  });
  document.addEventListener("scroll", () => {
    const scroll = document.documentElement.scrollTop;
    bodyElement.classList.toggle("scroll", scroll >= 100);
  });
})();
//# sourceMappingURL=nav.js.map
