(() => {
  // src/assets/js/cards.js
  var cards = document.querySelectorAll(".card");
  var infos = document.querySelectorAll(".info");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.key;
      const info = document.querySelector(`.info[data-key="${key}"]`);
      const isActive = card.classList.contains("active");
      cards.forEach((c) => c.classList.remove("active"));
      infos.forEach((i) => i.classList.remove("active"));
      if (!isActive) {
        card.classList.add("active");
        info.classList.add("active");
      }
    });
  });
})();
//# sourceMappingURL=cards.js.map
