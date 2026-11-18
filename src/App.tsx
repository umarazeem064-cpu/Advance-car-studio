import {useCallback, useEffect, useRef, useState} from 'react';
import {APIProvider} from '@vis.gl/react-google-maps';
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  ShieldCheck,
  Star,
  Sun,
  X,
} from 'lucide-react';
import {
  CURRENCIES,
  SERVICE_PACKAGES,
  STUDIO_GROUNDED_INFO,
  STUDIO_IMAGES,
  TRANSLATIONS,
  formatCurrencyPrice,
  type CurrencyCode,
  type LanguageCode,
} from './data/studioData';
import {useStudioPlaceData, type StudioPlaceData} from './hooks/useStudioPlaceData';
import {Preloader} from './components/Preloader';
import {SafeImage} from './components/SafeImage';
import {BeforeAfterGallery} from './components/BeforeAfterGallery';
import {AnimatedCounter} from './components/AnimatedCounter';
import {ReviewsSection} from './components/ReviewsSection';
import {BookingSection} from './components/BookingSection';
import {StudioMap} from './components/StudioMap';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();

const DEFAULT_PLACE_DATA: StudioPlaceData = {
  placeId: null,
  displayName: STUDIO_GROUNDED_INFO.name,
  formattedAddress: STUDIO_GROUNDED_INFO.address,
  location: STUDIO_GROUNDED_INFO.coordinates,
  rating: null,
  userRatingCount: null,
  phoneNumber: STUDIO_GROUNDED_INFO.phoneDisplay,
  whatsappDigits: STUDIO_GROUNDED_INFO.whatsappDigits,
  weekdayHours: [...STUDIO_GROUNDED_INFO.defaultWeekdayHours],
  googleMapsUri: STUDIO_GROUNDED_INFO.googleMapsUrl,
  reviews: [],
  isLoading: false,
  isLiveSynced: false,
};

function BrandEmblem({className = 'w-6 h-6'}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24 4L40 10.5V22.5C40 33.1 33.1 41.2 24 44C14.9 41.2 8 33.1 8 22.5V10.5L24 4Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M15 28.5L24 14L33 28.5H27.7L24 22.1L20.3 28.5H15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StudioExperience({
  placeData,
  hasApiKey,
  quotaExceeded,
}: {
  placeData: StudioPlaceData;
  hasApiKey: boolean;
  quotaExceeded: boolean;
}) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    'ultimate-9h-ceramic-interior',
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('acs_theme', theme);
    } catch {
      // Ignore storage access restrictions inside sandboxed iframes
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = language;
  }, [language, t.dir]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleSelectPackage = useCallback((pkgId: string) => {
    setSelectedPackageId(pkgId);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 450);
  }, []);

  const corePackages = SERVICE_PACKAGES.slice(0, 3);
  const ppfPackage = SERVICE_PACKAGES[3];

  const whatsappDirectUrl = `https://wa.me/${placeData.whatsappDigits}?text=${encodeURIComponent(
    `Hello ${placeData.displayName}, I would like to book a detailing slot in Islamabad.`,
  )}`;

  const liveRatingValue = placeData.rating ?? 5.0;

  return (
    <div
      dir={t.dir}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-200"
    >
      <Preloader />

      {/* Google Maps Platform Demo Quota Notice (Only rendered when quota error event fires) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation Header (Single-row 3-zone contract, <=15% mobile viewport height) */}
      <header
        className={`sticky ${
          quotaExceeded ? 'top-10' : 'top-0'
        } z-40 border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-200`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Clean Single-Line Brand Wordmark */}
          <a
            href="#home"
            className="inline-flex items-center gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
          >
            <BrandEmblem className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0" />
            <span>{placeData.displayName}</span>
          </a>

          {/* Zone 2: Clean Single-Line Text Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-300"
          >
            <a
              href="#home"
              className="hover:text-zinc-950 dark:hover:text-white underline-offset-8 hover:underline decoration-amber-500 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.home}
            </a>
            <a
              href="#gallery"
              className="hover:text-zinc-950 dark:hover:text-white underline-offset-8 hover:underline decoration-amber-500 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.gallery}
            </a>
            <a
              href="#packages"
              className="hover:text-zinc-950 dark:hover:text-white underline-offset-8 hover:underline decoration-amber-500 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.packages}
            </a>
            <a
              href="#reviews"
              className="hover:text-zinc-950 dark:hover:text-white underline-offset-8 hover:underline decoration-amber-500 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.reviews}
            </a>
            <a
              href="#contact"
              className="hover:text-zinc-950 dark:hover:text-white underline-offset-8 hover:underline decoration-amber-500 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Zone 3: Interactive Currency / Language / Theme Controls + Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <label htmlFor="header-currency" className="sr-only">
                Currency
              </label>
              <select
                id="header-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="h-9 px-2.5 text-xs font-mono font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.values(CURRENCIES).map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>

              <label htmlFor="header-language" className="sr-only">
                Language
              </label>
              <select
                id="header-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="h-9 px-2.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="ur">اردو</option>
                <option value="ar">العربية</option>
                <option value="es">ES</option>
              </select>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Advance Car Studio on WhatsApp"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 transition-colors shrink-0"
              title={t.nav.whatsapp}
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
            </a>

            <a
              href="#booking"
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-xs font-semibold rounded-md bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              {t.nav.bookNow}
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-5 space-y-5">
            <nav className="flex flex-col gap-3 text-sm font-medium">
              {[
                {href: '#home', label: t.nav.home},
                {href: '#gallery', label: t.nav.gallery},
                {href: '#packages', label: t.nav.packages},
                {href: '#reviews', label: t.nav.reviews},
                {href: '#contact', label: t.nav.contact},
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-zinc-700 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <label
                  htmlFor="mobile-currency"
                  className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Currency
                </label>
                <select
                  id="mobile-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full h-10 px-3 text-xs font-mono rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                >
                  {Object.values(CURRENCIES).map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="mobile-language"
                  className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Language
                </label>
                <select
                  id="mobile-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="w-full h-10 px-3 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="en">English</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.nav.whatsapp}</span>
              </a>
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-11 px-4 text-sm font-semibold rounded-lg bg-amber-600 dark:bg-amber-500 text-white dark:text-zinc-950"
              >
                {t.nav.bookNow}
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 1. HERO SECTION */}
        <section id="home" className="relative bg-zinc-950 text-zinc-50">
          <div className="relative min-h-[580px] lg:min-h-[680px] flex items-center overflow-hidden">
            {/* Full-bleed Studio Bay Background (.jpg) */}
            <div className="absolute inset-0">
              <SafeImage
                src={STUDIO_IMAGES.heroBay}
                alt="Glossy obsidian black performance sedan inside Advance Car Studio LED detailing bay"
                fallbackTitle="Advance Car Studio — Islamabad"
                loading="eager"
                className="w-full h-full object-cover object-center"
              />
              {/* Measured Contrast Scrim for Guaranteed WCAG AA/AAA Legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-zinc-950/92 via-zinc-950/72 to-zinc-950/30"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40"
              />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
              <div className="max-w-2xl">
                {/* Clean Unboxed Metadata Line (No Pills, No Pulsing Dots) */}
                <p className="text-xs sm:text-sm font-medium text-amber-400 tracking-wide">
                  {t.hero.locationLine}
                </p>

                <h1
                  className="mt-4 font-display font-bold tracking-tight text-white [text-wrap:balance]"
                  style={{
                    fontSize: 'clamp(2.25rem, 4.3vw, 3.85rem)',
                    lineHeight: 1.08,
                  }}
                >
                  {t.hero.headline}
                </h1>

                <p className="mt-6 text-base sm:text-lg text-zinc-200 leading-relaxed max-w-xl">
                  {t.hero.subheadline}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#booking"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  >
                    <span>{t.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>

                  <a
                    href="#packages"
                    className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium rounded-lg border border-zinc-400/50 bg-zinc-950/50 hover:bg-zinc-900/80 text-white transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {t.hero.secondaryCta}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Studio Utility Strip Below Hero Split */}
          <div className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
                <div className="py-5 sm:pe-6">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.hero.stripRating}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums flex items-center gap-1.5 text-zinc-950 dark:text-zinc-100">
                    <Star
                      className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{liveRatingValue.toFixed(1)} / 5.0</span>
                    {placeData.userRatingCount !== null && (
                      <span className="text-xs font-sans font-normal text-zinc-500 dark:text-zinc-400">
                        ({placeData.userRatingCount})
                      </span>
                    )}
                  </p>
                </div>

                <div className="py-5 sm:px-6">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.hero.stripHours}
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-100">
                    {STUDIO_GROUNDED_INFO.defaultHoursSummary}
                  </p>
                </div>

                <div className="py-5 sm:px-6">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.hero.stripLocation}
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-100 truncate">
                    Abdullah Centre, Police Foundation
                  </p>
                </div>

                <div className="py-5 sm:ps-6">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.hero.stripDirect}
                  </p>
                  <a
                    href={`tel:${placeData.phoneNumber.replace(/\s+/g, '')}`}
                    className="mt-1 inline-block font-mono text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    {placeData.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. LIVE BEFORE / AFTER TRANSFORMATION GALLERY */}
        <BeforeAfterGallery t={t.gallery} />

        {/* 3. SERVICES & DYNAMIC MULTI-CURRENCY PRICING PACKAGES */}
        <section
          id="packages"
          className="py-20 lg:py-28 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
                  {t.packages.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                  {t.packages.title}
                </h2>
                <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {t.packages.subtitle}
                </p>
              </div>

              {/* Synchronized Interactive Currency Segmented Control */}
              <div
                role="group"
                aria-label="Select pricing currency"
                className="inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start lg:self-end shrink-0"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-500 ${
                      currency === code
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                    }`}
                  >
                    {CURRENCIES[code].label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Core Detailing Packages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
              {corePackages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                const priceDisplay = formatCurrencyPrice(pkg.usdPrice, currency);

                return (
                  <article
                    key={pkg.id}
                    className={`flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 transition-colors ${
                      pkg.featured
                        ? 'border-2 border-amber-600 dark:border-amber-500'
                        : 'border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                      <SafeImage
                        src={pkg.image}
                        alt={pkg.imageAlt}
                        fallbackTitle={pkg.name.en}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Quiet Unboxed Metadata Line */}
                        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-mono tabular-nums">
                            {pkg.indexLabel} · {pkg.duration[language]}
                          </span>
                          {pkg.featured && (
                            <span className="font-medium text-amber-700 dark:text-amber-400">
                              {t.packages.recommendedLabel}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                          {pkg.name[language]}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {pkg.subtitle[language]}
                        </p>

                        <div className="mt-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                            {t.packages.startingFrom}
                          </span>
                          <span className="mt-1 block font-mono text-3xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
                            {priceDisplay}
                          </span>
                        </div>

                        <ul className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                          {pkg.features[language].map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <Check
                                className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`mt-8 w-full py-3 px-4 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                          isSelected
                            ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950'
                            : pkg.featured
                              ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950'
                              : 'border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {isSelected ? t.packages.selectedBtn : t.packages.selectBtn}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Asymmetric Signature Add-On Spotlight: Full-Body Self-Healing PPF */}
            <article className="mt-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto bg-zinc-900 overflow-hidden">
                <SafeImage
                  src={ppfPackage.image}
                  alt={ppfPackage.imageAlt}
                  fallbackTitle={ppfPackage.name.en}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    {ppfPackage.indexLabel} · {t.packages.ppfSpotlightLabel} ·{' '}
                    {ppfPackage.duration[language]}
                  </p>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                      {ppfPackage.name[language]}
                    </h3>
                    <span className="font-mono text-2xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50 shrink-0">
                      {formatCurrencyPrice(ppfPackage.usdPrice, currency)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    {ppfPackage.subtitle[language]}
                  </p>

                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    {ppfPackage.features[language].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check
                          className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Available in Gloss &amp; Stealth Satin · Full-body or Front-impact Kit
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(ppfPackage.id)}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 hover:bg-zinc-950 hover:text-white dark:hover:bg-amber-500 dark:hover:text-zinc-950 dark:hover:border-amber-500 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {selectedPackageId === ppfPackage.id
                      ? t.packages.selectedBtn
                      : t.packages.ppfCta}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 4. WHY CHOOSE US & STUDIO CREDENTIALS */}
        <section
          id="credentials"
          className="py-20 lg:py-28 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
                {t.credentials.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
                {t.credentials.title}
              </h2>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.credentials.subtitle}
              </p>
            </div>

            {/* Animated Counters Band */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mb-14">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
                <p className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-50">
                  <AnimatedCounter target={1500} suffix="+" />
                </p>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t.credentials.statCars}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
                <p className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-50">
                  <AnimatedCounter target={10} suffix="+" />
                </p>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t.credentials.statYears}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
                <p className="text-3xl sm:text-4xl font-bold text-amber-700 dark:text-amber-400">
                  <AnimatedCounter target={liveRatingValue} decimals={1} suffix=" ★" />
                </p>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t.credentials.statRating}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
                <p className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-zinc-950 dark:text-zinc-50">
                  9H
                </p>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t.credentials.statHardness}
                </p>
              </div>
            </div>

            {/* 4-Pillar Editorial Standards Grid (No generic icon-on-top clichés) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  index: '01',
                  title: 'Certified 9H SiO2 & Aliphatic TPU Films',
                  detail:
                    'We apply batch-verified ceramic coatings and non-yellowing TPU paint protection films backed by written studio warranty cards—never diluted wax glazes.',
                },
                {
                  index: '02',
                  title: '100% pH-Neutral & Deionized Wash Chemistry',
                  detail:
                    'Every pre-wash, contact shampoo, and wheel iron remover is clear-coat safe and pH balanced so delicate anodized trim, matte accents, and calipers stay unblemished.',
                },
                {
                  index: '03',
                  title: 'Ultrasonic Clear-Coat Audits & High-CRI Lighting',
                  detail:
                    'Before any machine pad touches paint, technicians log panel-by-panel clear-coat micron thickness and verify every compounding pass under dedicated swirl-finder LED arrays.',
                },
                {
                  index: '04',
                  title: 'Trained Detailing Specialists & Dust-Controlled Bays',
                  detail:
                    'Serving Islamabad, Police Foundation, Bahria Town, DHA, and PWD with enclosed curing bays, infrared heat lamps, and comprehensive delivery checklists.',
                },
              ].map((pillar) => (
                <div
                  key={pillar.index}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-6 sm:p-7"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                      {pillar.index}.
                    </span>
                    <h3 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. REAL GOOGLE REVIEWS & TESTIMONIALS */}
        <ReviewsSection placeData={placeData} t={t.reviews} />

        {/* 6. INTERACTIVE APPOINTMENT BOOKING SYSTEM */}
        <BookingSection
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
          currency={currency}
          language={language}
          t={t.booking}
          placeData={placeData}
          nameInputRef={nameInputRef}
        />
      </main>

      {/* 7. FOOTER & INTERACTIVE GOOGLE MAPS LOCATION */}
      <footer
        id="contact"
        className="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
              {t.footer.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {t.footer.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Live Interactive Google Maps Platform Canvas */}
            <div className="lg:col-span-7">
              <StudioMap
                hasApiKey={hasApiKey}
                placeData={placeData}
                directionsLabel={t.footer.directionsBtn}
              />
            </div>

            {/* Exact Address, Hours, Direct Phone/WhatsApp, Social Links */}
            <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>{t.footer.addressLabel}</span>
                  </h3>
                  <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {placeData.formattedAddress}
                  </p>
                  <a
                    href={placeData.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <span>{t.footer.directionsBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>{t.footer.hoursLabel}</span>
                  </h3>
                  <ul className="mt-2.5 space-y-1 text-xs text-zinc-700 dark:text-zinc-300 font-mono tabular-nums">
                    {placeData.weekdayHours.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    <span>{t.footer.contactLabel}</span>
                  </h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${placeData.phoneNumber.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-semibold tabular-nums rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-amber-500 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{placeData.phoneNumber}</span>
                    </a>
                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                  {t.footer.followUs}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <a
                    href={STUDIO_GROUNDED_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    Instagram
                  </a>
                  <span aria-hidden="true" className="text-zinc-400">
                    ·
                  </span>
                  <a
                    href={STUDIO_GROUNDED_INFO.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    TikTok
                  </a>
                  <span aria-hidden="true" className="text-zinc-400">
                    ·
                  </span>
                  <a
                    href={STUDIO_GROUNDED_INFO.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    YouTube
                  </a>
                  <span aria-hidden="true" className="text-zinc-400">
                    ·
                  </span>
                  <a
                    href={STUDIO_GROUNDED_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Legal, Google Maps Terms Notice, and Copyright Bar */}
          <div className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="space-y-1">
              <p>{t.footer.copyright}</p>
              <p className="flex flex-wrap items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
                <span>{t.footer.mapsTermsNotice}</span>
                <a
                  href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Google Maps Terms
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Google Privacy
                </a>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-zinc-600 dark:text-zinc-400">
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.footer.credit}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LiveMapsConnectedStudio({quotaExceeded}: {quotaExceeded: boolean}) {
  const placeData = useStudioPlaceData(true);
  return (
    <StudioExperience
      placeData={placeData}
      hasApiKey={true}
      quotaExceeded={quotaExceeded}
    />
  );
}

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  if (!MAPS_API_KEY) {
    return (
      <StudioExperience
        placeData={DEFAULT_PLACE_DATA}
        hasApiKey={false}
        quotaExceeded={quotaExceeded}
      />
    );
  }

  return (
    <APIProvider
      apiKey={MAPS_API_KEY}
      language="en"
      region="PK"
      libraries={['places', 'marker']}
    >
      <LiveMapsConnectedStudio quotaExceeded={quotaExceeded} />
    </APIProvider>
  );
}
