(() => {
  const root = document.documentElement;
  const loader = document.querySelector(".loader");
  const toast = document.querySelector(".toast");
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = [...document.querySelectorAll("[data-chapter]")];
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");

  const setLang = (lang) => {
    root.lang = lang;
    root.dir = lang === "fa" ? "rtl" : "ltr";
    document.querySelectorAll(".lang button").forEach((b) => {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });
    localStorage.setItem("bison-lang", lang);
  };

  const saved = localStorage.getItem("bison-lang");
  setLang(saved === "en" ? "en" : "fa");

  document.querySelectorAll(".lang button").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });

  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("is-done"), 700);
  });

  burger?.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
  });
  navLinks?.addEventListener("click", (e) => {
    if (e.target.closest("a")) navLinks.classList.remove("is-open");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const value = el.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const t = document.createElement("textarea");
        t.value = value;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      if (toast) {
        toast.textContent = value;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1400);
      }
    });
  });
})();
