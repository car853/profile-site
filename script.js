// テーマの初期値は index.html の head で設定済み。ここでは切り替えだけ扱う（設定はブラウザに保存）
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // 保存できない環境でも切り替え自体は続ける
  }
});

// モバイルメニュー
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", false);
    menuBtn.textContent = "☰";
  });
});

// スクロールでフェードイン（動きを減らす設定のときはすぐ表示）
const fadeEls = document.querySelectorAll(".fade-in");

if (reduceMotion || !("IntersectionObserver" in window)) {
  fadeEls.forEach((el) => el.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  fadeEls.forEach((el) => observer.observe(el));
}

// 現在表示中のセクションに合わせてナビをハイライト
const sections = document.querySelectorAll("main section[id]");
const navLinks = nav.querySelectorAll("a");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", active);
          if (active) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );
  sections.forEach((section) => navObserver.observe(section));
}

// ページトップへ戻るボタン
const toTop = document.getElementById("to-top");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 400);
});
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
);

// フッターの年
document.getElementById("year").textContent = new Date().getFullYear();
