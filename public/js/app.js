(function () {
  const main = document.querySelector("main.page");
  if (!main) return;

  function setActive(path) {
    document.querySelectorAll(".tabs a").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("href") === path);
    });
  }

  async function navigate(url, push) {
    let html;
    try {
      const res = await fetch(url);
      html = await res.text();
    } catch (e) {
      window.location.href = url;
      return;
    }

    const doc = new DOMParser().parseFromString(html, "text/html");
    const next = doc.querySelector("main.page");
    if (!next) {
      window.location.href = url;
      return;
    }

    main.replaceChildren.apply(main, Array.from(next.childNodes));
    document.title = doc.title;
    setActive(new URL(url, location.href).pathname);
    window.scrollTo(0, 0);

    main.classList.remove("swap-in");
    void main.offsetWidth;
    main.classList.add("swap-in");

    if (push) history.pushState({}, "", url);
  }

  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;

    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;

    e.preventDefault();
    if (url.pathname === location.pathname) return;
    navigate(url.pathname + url.search, true);
  });

  window.addEventListener("popstate", function () {
    navigate(location.pathname + location.search, false);
  });
})();
