import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/e2610bfe-e2b1-483f-a986-41a6ba82b212/files/595ae338-bca7-49c0-9bd9-ee6f2db0b10a.jpg";

const NAV_LINKS = [
  { label: "Главная", href: "#home" },
  { label: "Услуги", href: "#services" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Цены", href: "#prices" },
  { label: "О нас", href: "#about" },
  { label: "Контакты", href: "#contacts" },
];

const SERVICES = [
  { icon: "Monitor", title: "Билборды", desc: "Масштабные форматы 6×3 и 12×4 в ключевых точках города", color: "var(--neon-yellow)" },
  { icon: "Layers", title: "Ситилайты", desc: "Подсвечиваемые конструкции у пешеходных потоков", color: "var(--neon-pink)" },
  { icon: "Tv", title: "Цифровые экраны", desc: "LED-панели с ротацией рекламных слотов", color: "var(--neon-blue)" },
  { icon: "MapPin", title: "Брандмауэры", desc: "Огромные настенные изображения на фасадах зданий", color: "var(--neon-yellow)" },
  { icon: "Truck", title: "Транзитная реклама", desc: "Брендирование автобусов, трамваев и маршруток", color: "var(--neon-pink)" },
  { icon: "Zap", title: "Нестандарт", desc: "Арт-объекты, инсталляции, 3D-конструкции", color: "var(--neon-blue)" },
];

const PRICE_TABLE = [
  {
    type: "Билборд 6×3",
    locations: ["Центр", "Спальный район", "Трасса"],
    prices: [45000, 25000, 18000],
    period: "/ мес",
  },
  {
    type: "Ситилайт",
    locations: ["Центр", "Торговая зона", "Метро"],
    prices: [22000, 15000, 18000],
    period: "/ мес",
  },
  {
    type: "Цифровой экран",
    locations: ["Пакет 100 выходов", "Пакет 300 выходов", "Пакет 500 выходов"],
    prices: [12000, 30000, 45000],
    period: "",
  },
  {
    type: "Брандмауэр",
    locations: ["до 100 м²", "100–300 м²", "от 300 м²"],
    prices: [80000, 180000, 320000],
    period: "/ мес",
  },
  {
    type: "Транзит",
    locations: ["1 борт", "5 бортов", "Парк 10+ бортов"],
    prices: [8000, 35000, 60000],
    period: "/ мес",
  },
];

const STATS = [
  { value: "250+", label: "конструкций в городе" },
  { value: "7 лет", label: "на рынке" },
  { value: "1500+", label: "довольных клиентов" },
  { value: "×3", label: "рост охвата за год" },
];

const TICKER_ITEMS = [
  "БИЛБОРДЫ", "СИТИЛАЙТЫ", "ЦИФРОВЫЕ ЭКРАНЫ", "БРАНДМАУЭРЫ", "ТРАНЗИТ", "НЕСТАНДАРТ",
  "БИЛБОРДЫ", "СИТИЛАЙТЫ", "ЦИФРОВЫЕ ЭКРАНЫ", "БРАНДМАУЭРЫ", "ТРАНЗИТ", "НЕСТАНДАРТ",
];

const CALC_OPTIONS = {
  type: [
    { label: "Билборд 6×3", base: 25000 },
    { label: "Ситилайт", base: 15000 },
    { label: "Цифровой экран", base: 12000 },
    { label: "Брандмауэр", base: 100000 },
    { label: "Транзитная реклама", base: 8000 },
  ],
  location: [
    { label: "Центр города", mult: 1.8 },
    { label: "Спальный район", mult: 1.0 },
    { label: "Торговая зона", mult: 1.4 },
    { label: "Трасса", mult: 0.8 },
  ],
};

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [calcType, setCalcType] = useState(0);
  const [calcLocation, setCalcLocation] = useState(0);
  const [calcMonths, setCalcMonths] = useState(1);
  const [calcQty, setCalcQty] = useState(1);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const calcPrice =
    CALC_OPTIONS.type[calcType].base *
    CALC_OPTIONS.location[calcLocation].mult *
    calcMonths *
    calcQty;

  const formatPrice = (n: number) =>
    Math.round(n).toLocaleString("ru-RU") + " ₽";

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)", color: "white" }}>
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #222" : "none",
        }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <span
              className="text-2xl font-bold tracking-wider"
              style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)" }}
            >
              Визуал
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--neon-pink)",
                color: "white",
                fontFamily: "Oswald, sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              ПРО
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link text-gray-300">
                {link.label}
              </a>
            ))}
          </div>

          <a href="#contacts" className="hidden md:block neon-btn px-6 py-2.5 rounded text-sm">
            Заказать рекламу
          </a>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={28} />
          </button>
        </div>

        {menuOpen && (
          <div
            className="md:hidden px-6 pb-6 flex flex-col gap-4"
            style={{ background: "rgba(10,10,10,0.98)" }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-gray-300 py-2 border-b"
                style={{ borderColor: "#222" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#contacts" className="neon-btn px-6 py-3 rounded text-center mt-2">
              Заказать рекламу
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="hero" className="w-full h-full object-cover" style={{ opacity: 0.25 }} />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.85) 100%)",
            }}
          />
        </div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,229,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,229,0,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 animate-float" style={{ background: "var(--neon-yellow)" }} />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-15 animate-float-delay" style={{ background: "var(--neon-pink)" }} />

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl">
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs tracking-widest"
              style={{
                border: "1px solid rgba(255,229,0,0.4)",
                color: "var(--neon-yellow)",
                fontFamily: "Oswald, sans-serif",
                background: "rgba(255,229,0,0.05)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--neon-yellow)" }} />
              РЕКЛАМНОЕ АГЕНТСТВО № 1 В ГОРОДЕ
            </div>

            <h1
              className="text-6xl md:text-8xl font-bold mb-6 leading-none"
              style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "-0.02em" }}
            >
              ВЗРЫВНАЯ
              <br />
              <span className="gradient-text">РЕКЛАМА</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-2xl" style={{ color: "#999", lineHeight: 1.6 }}>
              Наружная реклама, которую невозможно не заметить. <br />
              Билборды, ситилайты, цифровые экраны — весь город работает на тебя.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#calculator" className="neon-btn px-8 py-4 rounded text-lg">
                Рассчитать стоимость
              </a>
              <a href="#services" className="neon-btn-outline px-8 py-4 rounded text-lg">
                Смотреть услуги
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs tracking-widest" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>СКРОЛЛ</span>
          <div className="w-px h-12 animate-pulse" style={{ background: "var(--neon-yellow)" }} />
        </div>
      </section>

      {/* TICKER */}
      <div className="py-4 overflow-hidden" style={{ background: "var(--neon-yellow)", color: "#0A0A0A" }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="mx-8 text-sm font-bold tracking-widest flex items-center gap-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              {item}
              <span className="opacity-30">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section id="stats" data-animate className="py-20" style={{ background: "var(--card-bg)" }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  opacity: isVisible("stats") ? 1 : 0,
                  transform: isVisible("stats") ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.6s ease ${i * 0.1}s`,
                }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2" style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)" }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "#666" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24" data-animate>
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <p className="text-sm tracking-widest mb-3" style={{ color: "var(--neon-pink)", fontFamily: "Oswald, sans-serif" }}>ЧТО МЫ ДЕЛАЕМ</p>
            <h2 className="section-title text-5xl md:text-6xl">НАШИ <span className="gradient-text">УСЛУГИ</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <div
                key={i}
                className="card-hover rounded-lg p-8 cursor-pointer"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  opacity: isVisible("services") ? 1 : 0,
                  transform: isVisible("services") ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.6s ease ${i * 0.1}s`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-6"
                  style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}40` }}
                >
                  <Icon name={svc.icon} fallback="Zap" size={24} style={{ color: svc.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Oswald, sans-serif", color: svc.color }}>{svc.title}</h3>
                <p style={{ color: "#888", lineHeight: 1.6 }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-24" style={{ background: "var(--card-bg)" }} data-animate>
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-16 text-center">
            <p className="text-sm tracking-widest mb-3" style={{ color: "var(--neon-blue)", fontFamily: "Oswald, sans-serif" }}>БЫСТРО И ТОЧНО</p>
            <h2 className="section-title text-5xl md:text-6xl">КАЛЬКУЛЯТОР <span className="gradient-text">ЦЕНЫ</span></h2>
            <p className="mt-4 text-gray-500">Выберите параметры — узнайте стоимость мгновенно</p>
          </div>

          <div className="rounded-2xl p-8 md:p-12" style={{ background: "#0D0D0D", border: "1px solid #222" }}>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-xs tracking-widest mb-4" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>
                    ТИП КОНСТРУКЦИИ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CALC_OPTIONS.type.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setCalcType(i)}
                        className="px-4 py-2 rounded text-sm transition-all duration-200"
                        style={{
                          fontFamily: "Rubik, sans-serif",
                          background: calcType === i ? "var(--neon-yellow)" : "transparent",
                          color: calcType === i ? "#0A0A0A" : "#666",
                          border: calcType === i ? "1px solid var(--neon-yellow)" : "1px solid #333",
                          fontWeight: calcType === i ? 600 : 400,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest mb-4" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>
                    РАСПОЛОЖЕНИЕ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CALC_OPTIONS.location.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setCalcLocation(i)}
                        className="px-4 py-2 rounded text-sm transition-all duration-200"
                        style={{
                          fontFamily: "Rubik, sans-serif",
                          background: calcLocation === i ? "var(--neon-pink)" : "transparent",
                          color: calcLocation === i ? "white" : "#666",
                          border: calcLocation === i ? "1px solid var(--neon-pink)" : "1px solid #333",
                          fontWeight: calcLocation === i ? 600 : 400,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest mb-4" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>
                    СРОК: {calcMonths} МЕС.
                  </label>
                  <input type="range" min={1} max={12} value={calcMonths} onChange={(e) => setCalcMonths(+e.target.value)} className="range-neon w-full" />
                  <div className="flex justify-between text-xs mt-2" style={{ color: "#555" }}>
                    <span>1 мес</span><span>6 мес</span><span>12 мес</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest mb-4" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>
                    КОЛИЧЕСТВО: {calcQty} шт.
                  </label>
                  <input type="range" min={1} max={20} value={calcQty} onChange={(e) => setCalcQty(+e.target.value)} className="range-neon w-full" />
                  <div className="flex justify-between text-xs mt-2" style={{ color: "#555" }}>
                    <span>1</span><span>10</span><span>20</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className="rounded-2xl p-10 w-full"
                  style={{
                    background: "linear-gradient(135deg, #111 0%, #1a1a00 100%)",
                    border: "1px solid rgba(255,229,0,0.3)",
                    boxShadow: "0 0 40px rgba(255,229,0,0.1)",
                  }}
                >
                  <p className="text-xs tracking-widest mb-4" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>ИТОГОВАЯ СТОИМОСТЬ</p>
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)" }}>
                    {formatPrice(calcPrice)}
                  </div>
                  <p className="text-xs mb-8" style={{ color: "#555" }}>
                    {CALC_OPTIONS.type[calcType].label} · {CALC_OPTIONS.location[calcLocation].label}
                    <br />{calcQty} шт. × {calcMonths} мес.
                  </p>
                  {calcMonths >= 3 && (
                    <div
                      className="text-xs px-3 py-2 rounded mb-6"
                      style={{
                        background: "rgba(255,45,155,0.1)",
                        border: "1px solid rgba(255,45,155,0.3)",
                        color: "var(--neon-pink)",
                        fontFamily: "Oswald, sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      🎯 СКИДКА 10% ПРИ ЗАКАЗЕ ОТ 3 МЕС
                    </div>
                  )}
                  <a href="#contacts" className="neon-btn block w-full py-4 rounded text-base">
                    Получить точный расчёт
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="py-24" data-animate>
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <p className="text-sm tracking-widest mb-3" style={{ color: "var(--neon-yellow)", fontFamily: "Oswald, sans-serif" }}>ПРОЗРАЧНО И ЧЕСТНО</p>
            <h2 className="section-title text-5xl md:text-6xl">ТАБЛИЦА <span className="gradient-text">ЦЕН</span></h2>
          </div>

          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #222" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,229,0,0.05)", borderBottom: "1px solid #222" }}>
                  <th className="text-left px-6 py-5 text-sm" style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)", letterSpacing: "0.1em" }}>
                    ТИП КОНСТРУКЦИИ
                  </th>
                  <th className="text-left px-6 py-5 text-sm" style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)", letterSpacing: "0.1em" }}>
                    ВАРИАНТ
                  </th>
                  <th className="text-right px-6 py-5 text-sm" style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)", letterSpacing: "0.1em" }}>
                    ЦЕНА
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map((row, ri) =>
                  row.locations.map((loc, li) => (
                    <tr
                      key={`${ri}-${li}`}
                      className="transition-colors duration-200"
                      style={{ borderBottom: "1px solid #181818" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,229,0,0.04)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td className="px-6 py-4">
                        {li === 0 ? (
                          <span className="font-semibold" style={{ fontFamily: "Oswald, sans-serif", color: "white", fontSize: "1rem" }}>
                            {row.type}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#888" }}>{loc}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-lg" style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)" }}>
                          {row.prices[li].toLocaleString("ru-RU")} ₽
                        </span>
                        <span className="text-xs ml-1" style={{ color: "#555" }}>{row.period}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-center mt-6 text-sm" style={{ color: "#555" }}>
            * Цены указаны без НДС. Возможны скидки при долгосрочном сотрудничестве.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24" style={{ background: "var(--card-bg)" }} data-animate>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div
              style={{
                opacity: isVisible("about") ? 1 : 0,
                transform: isVisible("about") ? "translateX(0)" : "translateX(-40px)",
                transition: "all 0.8s ease",
              }}
            >
              <p className="text-sm tracking-widest mb-4" style={{ color: "var(--neon-blue)", fontFamily: "Oswald, sans-serif" }}>КТО МЫ</p>
              <h2 className="section-title text-5xl mb-8">О <span className="gradient-text">НАС</span></h2>
              <p className="text-lg mb-6" style={{ color: "#888", lineHeight: 1.8 }}>
                ADVERT — команда профессионалов, которая превращает рекламные бюджеты в реальный охват и узнаваемость бренда. Мы работаем с 2017 года и управляем более чем 250 рекламными конструкциями по всему городу.
              </p>
              <p className="text-lg mb-10" style={{ color: "#888", lineHeight: 1.8 }}>
                Наш подход — прозрачные цены, честная аналитика и результат, который можно измерить. Никаких скрытых платежей и сюрпризов после запуска.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Прозрачные цены", "Гарантия размещения", "Аналитика охвата", "Личный менеджер"].map((tag, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm" style={{ border: "1px solid #333", color: "#aaa" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="grid grid-cols-2 gap-4"
              style={{
                opacity: isVisible("about") ? 1 : 0,
                transform: isVisible("about") ? "translateX(0)" : "translateX(40px)",
                transition: "all 0.8s ease 0.2s",
              }}
            >
              {[
                { icon: "Shield", title: "7 лет опыта", desc: "На рынке наружной рекламы" },
                { icon: "Star", title: "Рейтинг 4.9", desc: "По отзывам клиентов" },
                { icon: "Users", title: "50 человек", desc: "В нашей команде" },
                { icon: "Award", title: "12 наград", desc: "Индустриальные премии" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-6" style={{ background: "#111", border: "1px solid #222" }}>
                  <Icon name={item.icon} fallback="Star" size={28} style={{ color: "var(--neon-yellow)", marginBottom: 12 }} />
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: "Oswald, sans-serif" }}>{item.title}</div>
                  <div className="text-sm" style={{ color: "#666" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24" data-animate>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-sm tracking-widest mb-4" style={{ color: "var(--neon-pink)", fontFamily: "Oswald, sans-serif" }}>НАЧНЁМ РАБОТУ</p>
          <h2 className="section-title text-5xl md:text-6xl mb-6">СВЯЗАТЬСЯ <span className="gradient-text">С НАМИ</span></h2>
          <p className="mb-12 text-lg" style={{ color: "#888" }}>Оставьте заявку — свяжемся в течение 30 минут в рабочее время</p>

          <div className="rounded-2xl p-8 md:p-12 text-left" style={{ background: "#0D0D0D", border: "1px solid #222" }}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs tracking-widest mb-2" style={{ color: "#666", fontFamily: "Oswald, sans-serif" }}>ИМЯ</label>
                <input type="text" placeholder="Иван Петров" className="input-neon w-full px-4 py-3 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs tracking-widest mb-2" style={{ color: "#666", fontFamily: "Oswald, sans-serif" }}>ТЕЛЕФОН</label>
                <input type="tel" placeholder="+7 (900) 000-00-00" className="input-neon w-full px-4 py-3 rounded-lg text-sm" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs tracking-widest mb-2" style={{ color: "#666", fontFamily: "Oswald, sans-serif" }}>ЧТО НУЖНО</label>
              <textarea rows={4} placeholder="Расскажите о вашем проекте — тип рекламы, бюджет, сроки..." className="input-neon w-full px-4 py-3 rounded-lg text-sm resize-none" />
            </div>
            <button className="neon-btn w-full py-4 rounded-lg text-base">Отправить заявку</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: "Phone", label: "ТЕЛЕФОН", value: "+7 (800) 123-45-67" },
              { icon: "Mail", label: "EMAIL", value: "hello@advert.ru" },
              { icon: "MapPin", label: "АДРЕС", value: "ул. Ленина, 1, офис 405" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <Icon name={item.icon} fallback="Phone" size={20} className="mx-auto mb-2" style={{ color: "var(--neon-yellow)" }} />
                <p className="text-xs tracking-widest mb-1" style={{ color: "#555", fontFamily: "Oswald, sans-serif" }}>{item.label}</p>
                <p className="text-sm" style={{ color: "#ccc" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm border-t" style={{ borderColor: "#1a1a1a", color: "#444" }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span style={{ fontFamily: "Oswald, sans-serif", color: "var(--neon-yellow)", fontSize: "1.1rem" }}>Визуал ПРО</span>
          <span>© 2024 Рекламное агентство Визуал ПРО. Все права защищены.</span>
          <div className="flex gap-6">
            {["ВКонтакте", "Telegram", "WhatsApp"].map((s) => (
              <a key={s} href="#contacts" className="text-xs transition-colors duration-200 hover:text-white" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.08em" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}