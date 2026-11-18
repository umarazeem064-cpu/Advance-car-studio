export type LanguageCode = 'en' | 'ur' | 'ar' | 'es';
export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromUsd: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {code: 'PKR', symbol: '₨', label: 'PKR ₨', rateFromUsd: 278},
  USD: {code: 'USD', symbol: '$', label: 'USD $', rateFromUsd: 1},
  GBP: {code: 'GBP', symbol: '£', label: 'GBP £', rateFromUsd: 0.79},
  EUR: {code: 'EUR', symbol: '€', label: 'EUR €', rateFromUsd: 0.92},
};

export function formatCurrencyPrice(usdAmount: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency];
  const converted = usdAmount * cfg.rateFromUsd;
  const rounded =
    currency === 'PKR' ? Math.round(converted / 100) * 100 : Math.round(converted);
  return `${cfg.symbol}${rounded.toLocaleString('en-US')}`;
}

export const STUDIO_IMAGES = {
  heroBay: '/src/assets/images/hero_detailing_bay_1795001140641.jpg',
  beforeSwirls: '/src/assets/images/paint_before_swirls_1795001140323.jpg',
  afterCeramic: '/src/assets/images/paint_after_ceramic_1795001140244.jpg',
  expressWash: '/src/assets/images/package_express_wash_1795001140015.jpg',
  ceramicCraft: '/src/assets/images/package_ceramic_interior_1795001141035.jpg',
  interiorRestored: '/src/assets/images/package_interior_detail_1795001139621.jpg',
} as const;

export const STUDIO_GROUNDED_INFO = {
  name: 'Advance Car Studio',
  shortCity: 'Islamabad, Pakistan',
  coordinates: {lat: 33.5624505, lng: 73.134171},
  address:
    'Plot 8-E, Shop 3, Abdullah Centre, Block A, Police Foundation (Near Attock Petrol Pump), Islamabad, Pakistan',
  phoneDisplay: '+92 314 5593546',
  phoneLocal: '0314 5593546',
  phoneHref: 'tel:+923145593546',
  whatsappDigits: '923145593546',
  googleMapsUrl: 'https://maps.app.goo.gl/zBBka8jRhtn5ukNR6',
  defaultHoursSummary: 'Mon – Sun · 9:00 AM – 10:30 PM',
  defaultWeekdayHours: [
    'Monday: 9:00 AM – 10:30 PM',
    'Tuesday: 9:00 AM – 10:30 PM',
    'Wednesday: 9:00 AM – 10:30 PM',
    'Thursday: 9:00 AM – 10:30 PM',
    'Friday: 9:00 AM – 10:30 PM',
    'Saturday: 9:00 AM – 10:30 PM',
    'Sunday: 9:00 AM – 10:30 PM',
  ],
  socials: {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    youtube: 'https://www.youtube.com/',
    facebook: 'https://www.facebook.com/',
  },
} as const;

export interface ServicePackage {
  id: string;
  indexLabel: string;
  name: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  duration: Record<LanguageCode, string>;
  usdPrice: number;
  featured?: boolean;
  image: string;
  imageAlt: string;
  features: Record<LanguageCode, string[]>;
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'express-wash-vacuum',
    indexLabel: '01',
    name: {
      en: 'Express Exterior Wash & Interior Vacuum',
      ur: 'ایکسپریس ایکسٹیریئر واش اور انٹیریئر ویکیوم',
      ar: 'غسيل خارجي سريع وتنظيف داخلي بالمكنسة',
      es: 'Lavado Exterior Express y Aspirado Interior',
    },
    subtitle: {
      en: 'Safe pH-neutral snow foam decontamination and cabin refresh for daily drivers.',
      ur: 'روزمرہ گاڑیوں کے لیے پی ایچ نیوٹرل سنو فوم واش اور کیبن کی مکمل صفائی۔',
      ar: 'غسيل رغوي متعادل الحموضة وتنظيف مقصورة القيادة للسيارات اليومية.',
      es: 'Descontaminación segura con espuma pH neutro y refresco integral de cabina.',
    },
    duration: {
      en: '2 Hours',
      ur: '2 گھنٹے',
      ar: 'ساعتان',
      es: '2 Horas',
    },
    usdPrice: 35,
    image: STUDIO_IMAGES.expressWash,
    imageAlt: 'Luxury SUV covered in pH-neutral snow foam inside Advance Car Studio wash bay',
    features: {
      en: [
        'pH-neutral snow foam pre-soak to lift road grime safely',
        'Two-bucket grit-guard microfiber contact hand wash',
        'Alloy wheel barrel, brake caliper & tire decontamination',
        'Compressed air purge & deep interior cabin vacuum',
        'Streak-free interior & exterior optical glass cleaning',
        'Satin UV-protective dressing on tires and trim',
      ],
      ur: [
        'محفوظ صفائی کے لیے پی ایچ نیوٹرل سنو فوم پری واش',
        'ٹو-بکٹ مائیکرو فائبر ہینڈ واش (سکریچ فری)',
        'الائے رمز، بریک کیلیپرز اور ٹائروں کی گہری صفائی',
        'کمپریسڈ ایئر اور مکمل کیبن ویکیوم صفائی',
        'اندرونی اور بیرونی شیشوں کی بے داغ چمک',
        'ٹائروں اور ٹرم کے لیے سیٹن یو وی ڈریسنگ',
      ],
      ar: [
        'نقع مسبق بالرغوة المتعادلة لإزالة الأوساخ بأمان',
        'غسيل يدوي بنظام الدلوين ومناشف المايكروفايبر',
        'تنظيف عميق للجنوط وملاقط المكابح والإطارات',
        'شفط عميق للمقصورة وإزالة الغبار بالهواء المضغوط',
        'تنظيف الزجاج الداخلي والخارجي بدون خطوط',
        'حماية ساتان للإطارات والأجزاء البلاستيكية من الأشعة',
      ],
      es: [
        'Pre-lavado con espuma activa pH neutro para retirar suciedad',
        'Lavado manual con método de dos cubetas y microfibra',
        'Descontaminación profunda de rines, calipers y neumáticos',
        'Purga de aire comprimido y aspirado completo de cabina',
        'Limpieza óptica de cristales interiores y exteriores',
        'Acondicionador satinado con protección UV en neumáticos',
      ],
    },
  },
  {
    id: 'multi-stage-paint-correction',
    indexLabel: '02',
    name: {
      en: 'Multi-Stage Paint Correction & Gloss Enhancement',
      ur: 'ملٹی اسٹیج پینٹ کریکشن اور گلاس انہانسمنٹ',
      ar: 'تصحيح الطلاء متعدد المراحل وتعزيز اللمعان',
      es: 'Corrección de Pintura Multietapa y Brillo',
    },
    subtitle: {
      en: 'Machine compounding and jewel-polishing to remove wash swirls, haze, and oxidation.',
      ur: 'سوئیرل مارکس، خراشوں اور دھندلے پن کے خاتمے کے لیے مشین کمپاؤنڈنگ اور پالشنگ۔',
      ar: 'تلميع آلي متعدد المراحل لإزالة الدوائر والخدوش السطحية والأكسدة.',
      es: 'Pulido de precisión por etapas para eliminar remolinos, velos y oxidación.',
    },
    duration: {
      en: '1–2 Days',
      ur: '1 سے 2 دن',
      ar: '1–2 يوم',
      es: '1–2 Días',
    },
    usdPrice: 180,
    image: STUDIO_IMAGES.afterCeramic,
    imageAlt: 'Mirror-gloss black hood reflecting LED studio lights after multi-stage paint correction',
    features: {
      en: [
        'Full chemical iron fallout & clay bar decontamination',
        'Ultrasonic clear-coat micron depth mapping per panel',
        '2-to-3 stage rotary & dual-action machine polishing',
        '85–95% swirl mark, micro-marring & hologram removal',
        'Isopropyl alcohol (IPA) panel prep & LED swirl audit',
        '6-month hydrophobic SiO2 spray sealant protection',
      ],
      ur: [
        'آئرن فال آؤٹ اور کلے بار سے مکمل پینٹ ڈی کنٹیمینیشن',
        'ہر پینل کی کلیئر کوٹ مائکرون گہرائی کی پیمائش',
        '2 سے 3 اسٹیج روٹری اور ڈیول ایکشن مشین پالشنگ',
        '85 سے 95 فیصد سوئیرل مارکس اور خراشوں کا خاتمہ',
        'ایل ای ڈی انسپیکشن لائٹس کے نیچے فائنل پینل آڈٹ',
        '6 ماہ کے لیے ہائیڈروفوبک SiO2 گلاس سیلنٹ',
      ],
      ar: [
        'إزالة شاملة لرواسب الحديد وتنظيف بالطين التجميلي',
        'قياس سماكة طبقة اللكر بالميكرون لكل جزء',
        'تلميع آلي من مرحلتين إلى ثلاث مراحل بدقة عالية',
        'إزالة 85% إلى 95% من الخدوش الدائرية والهولوجرام',
        'فحص دقيق تحت أضواء كشف العيوب LED',
        'طبقة حماية SiO2 طاردة للماء لمدة 6 أشهر',
      ],
      es: [
        'Descontaminación férrica química y barra de arcilla completa',
        'Medición ultrasónica de micras del barniz por panel',
        'Pulido rotativo y orbital de 2 a 3 etapas de precisión',
        'Eliminación del 85–95% de remolinos y hologramas',
        'Desengrasado IPA e inspección con lámpara LED de defectos',
        'Sellador hidrofóbico SiO2 de alto brillo por 6 meses',
      ],
    },
  },
  {
    id: 'ultimate-9h-ceramic-interior',
    indexLabel: '03',
    name: {
      en: 'Ultimate 9H Ceramic Coating & Full Interior Deep Restoration',
      ur: 'الٹیمیٹ 9H سیرامک کوٹنگ اور مکمل انٹیریئر ریسٹوریشن',
      ar: 'طلاء سيراميك 9H الفاخر وترميم داخلي كامل',
      es: 'Recubrimiento Cerámico 9H y Restauración Interior Total',
    },
    subtitle: {
      en: 'Our flagship studio treatment combining multi-stage correction, infrared-cured 9H ceramic, and cabin renewal.',
      ur: 'ہمارا فلیگ شپ پیکج: ملٹی اسٹیج پینٹ کریکشن، انفراریڈ کیورڈ 9H سیرامک اور مکمل کیبن ریسٹوریشن۔',
      ar: 'باقتنا الرئيسية التي تجمع بين تصحيح الطلاء وطلاء السيراميك 9H وتجديد المقصورة.',
      es: 'Nuestro paquete insignia con corrección total, cerámico 9H curado y renovación de cabina.',
    },
    duration: {
      en: '2–3 Days',
      ur: '2 سے 3 دن',
      ar: '2–3 أيام',
      es: '2–3 Días',
    },
    usdPrice: 420,
    featured: true,
    image: STUDIO_IMAGES.ceramicCraft,
    imageAlt: 'Detailing specialist applying 9H ceramic coating with microfiber block onto luxury vehicle',
    features: {
      en: [
        'Complete multi-stage paint correction prior to bonding',
        'Dual-layer certified 9H SiO2 ceramic paint protection',
        'Infrared-lamp controlled curing for deep glass clarity',
        'Hydrophobic ceramic coating on glass & alloy wheel faces',
        'Hot-vapor steam sanitation & matte Nappa leather conditioning',
        'Engine bay detailing & 5-year studio warranty certificate',
      ],
      ur: [
        'کوٹنگ سے قبل مکمل ملٹی اسٹیج پینٹ کریکشن',
        'ڈبل لیئر سرٹیفائیڈ 9H SiO2 سیرامک پینٹ پروٹیکشن',
        'شیشے جیسی چمک کے لیے انفراریڈ لیمپ کیورنگ',
        'شیشوں اور الائے رمز پر ہائیڈروفوبک سیرامک کوٹنگ',
        'اسٹیم سینیٹائزیشن اور نیپا لیدر سیٹوں کی کنڈیشننگ',
        'انجن بے ڈیٹیلنگ اور 5 سالہ اسٹوڈیو وارنٹی سرٹیفکیٹ',
      ],
      ar: [
        'تصحيح كامل متعدد المراحل للطلاء قبل التطبيق',
        'طبقتان من طلاء السيراميك المعتمد 9H SiO2',
        'معالجة حرارية بمصابيح الأشعة تحت الحمراء لثبات فائق',
        'طلاء سيراميك طارد للماء للزجاج وواجهات الجنوط',
        'تعقيم بالبخار وترطيب فاخر للجلد الطبيعي بلمسة مطفية',
        'تنظيف حجرة المحرك وشهادة ضمان لمدة 5 سنوات',
      ],
      es: [
        'Corrección completa multietapa previa al sellado cerámico',
        'Doble capa certificada de recubrimiento cerámico 9H SiO2',
        'Curado controlado bajo lámparas infrarrojas de precisión',
        'Protección hidrofóbica en cristales y caras de rines',
        'Sanitización a vapor y nutrición mate de piel Nappa',
        'Detallado de compartimento de motor y garantía de 5 años',
      ],
    },
  },
  {
    id: 'full-body-ppf-shield',
    indexLabel: '04',
    name: {
      en: 'Self-Healing TPU Paint Protection Film (PPF)',
      ur: 'سیلف ہیلنگ ٹی پی یو پینٹ پروٹیکشن فلم (PPF)',
      ar: 'فيلم حماية الطلاء الذاتي الالتئام (PPF)',
      es: 'Película de Protección de Pintura TPU (PPF)',
    },
    subtitle: {
      en: 'Optically invisible 8.5-mil aliphatic TPU armor defending against highway stone chips and scrapes.',
      ur: 'ہائی وے پتھروں اور خراشوں سے بچاؤ کے لیے اعلیٰ معیار کی سیلف ہیلنگ پی پی ایف فلم۔',
      ar: 'درع شفاف ذاتي الالتئام بسمك 8.5 ميل لحماية الطلاء من الحصى والخدوش.',
      es: 'Blindaje transparente de TPU autorreparable contra gravilla y rayones.',
    },
    duration: {
      en: '3–4 Days',
      ur: '3 سے 4 دن',
      ar: '3–4 أيام',
      es: '3–4 Días',
    },
    usdPrice: 1250,
    image: STUDIO_IMAGES.interiorRestored,
    imageAlt: 'Restored luxury sedan finished inside Advance Car Studio Islamabad',
    features: {
      en: [
        'Precision plotter-cut templates with wrapped panel edges',
        'Heat-activated self-healing top coat eliminates light marks',
        'High-gloss or stealth satin matte finish options',
        'Anti-yellowing UV warranty built for Islamabad summers',
      ],
      ur: [
        'پریسیژن کٹنگ اور فولڈڈ ایجز کے ساتھ بے جوڑ انسٹالیشن',
        'حرارت سے خود ٹھیک ہونے والی سیلف ہیلنگ ٹاپ کوٹ',
        'ہائی گلاس یا میٹ اسٹیلتھ فنش کے آپشنز',
        'اسلام آباد کی گرمی کے لیے اینٹی ییلوئنگ یو وی وارنٹی',
      ],
      ar: [
        'قص دقيق بالكمبيوتر مع طي الحواف لمظهر مخفي بالكامل',
        'طبقة علوية ذاتية الالتئام بالحرارة لإخفاء الخدوش الخفيفة',
        'خيارات لمعة فائقة أو مطفي ستيلث',
        'ضمان ضد الاصفرار ومقاوم لأشعة الشمس الحارقة',
      ],
      es: [
        'Cortes por plotter de precisión con bordes envueltos',
        'Capa superior autorreparable con calor ante microrayones',
        'Acabado espejo brillante o satinado mate sigiloso',
        'Garantía anti-amarillamiento diseñada para sol intenso',
      ],
    },
  },
];

export interface Translations {
  dir: 'ltr' | 'rtl';
  nav: {
    home: string;
    gallery: string;
    packages: string;
    reviews: string;
    contact: string;
    bookNow: string;
    whatsapp: string;
  };
  hero: {
    locationLine: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    stripRating: string;
    stripHours: string;
    stripLocation: string;
    stripDirect: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    dragHint: string;
    modeSlider: string;
    modeSideBySide: string;
    studioHighlightsTitle: string;
  };
  packages: {
    eyebrow: string;
    title: string;
    subtitle: string;
    selectBtn: string;
    selectedBtn: string;
    recommendedLabel: string;
    durationLabel: string;
    startingFrom: string;
    ppfSpotlightLabel: string;
    ppfCta: string;
  };
  credentials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    statCars: string;
    statYears: string;
    statRating: string;
    statHardness: string;
  };
  reviews: {
    eyebrow: string;
    title: string;
    subtitle: string;
    verifiedSource: string;
    viewAllGoogle: string;
    loadingText: string;
    fallbackHeadline: string;
    fallbackBody: string;
    basedOn: string;
  };
  booking: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fullName: string;
    phone: string;
    whatsapp: string;
    sameAsPhone: string;
    vehicle: string;
    vehiclePlaceholder: string;
    packageLabel: string;
    dateLabel: string;
    timeLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    conciergeTitle: string;
    conciergeBody: string;
    whatsappCta: string;
    estimatedTotal: string;
    modalTitle: string;
    modalSubtitle: string;
    referenceLabel: string;
    sendWhatsAppBtn: string;
    closeBtn: string;
  };
  footer: {
    eyebrow: string;
    title: string;
    addressLabel: string;
    hoursLabel: string;
    contactLabel: string;
    directionsBtn: string;
    followUs: string;
    mapsTermsNotice: string;
    copyright: string;
    credit: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    dir: 'ltr',
    nav: {
      home: 'Home',
      gallery: 'Before / After',
      packages: 'Packages',
      reviews: 'Reviews',
      contact: 'Contact',
      bookNow: 'Book Now',
      whatsapp: 'WhatsApp',
    },
    hero: {
      locationLine: 'Police Foundation, Islamabad · Certified 9H Ceramic & PPF Studio',
      headline: 'Unleash Ultimate Gloss & 9H Ceramic Protection',
      subheadline:
        'Advance Car Studio brings precision multi-stage paint correction, infrared-cured 9H ceramic coatings, and self-healing PPF installation to Islamabad’s discerning vehicle owners.',
      primaryCta: 'Book Detailing Slot',
      secondaryCta: 'Explore Packages',
      stripRating: 'Google Rating',
      stripHours: 'Studio Hours',
      stripLocation: 'Islamabad Studio',
      stripDirect: 'Direct Desk',
    },
    gallery: {
      eyebrow: 'Paint Correction Evidence',
      title: 'Live Before & After Transformation',
      subtitle:
        'Drag the inspection bar to compare heavy wash swirls and dull oxidation against our multi-stage corrected, 9H ceramic-bonded mirror finish.',
      beforeLabel: 'Before — Swirls & Haze',
      afterLabel: 'After — 9H Mirror Gloss',
      dragHint: 'Drag slider or use arrow keys to inspect paint clarity',
      modeSlider: 'Interactive Slider',
      modeSideBySide: 'Side-by-Side',
      studioHighlightsTitle: 'Inside the Detailing Bays',
    },
    packages: {
      eyebrow: 'Packages & Pricing',
      title: 'Tailored Automotive Protection Packages',
      subtitle:
        'Transparent studio rates converted in real time. Select any package to pre-fill your detailing appointment slot below.',
      selectBtn: 'Select Package',
      selectedBtn: 'Selected for Booking',
      recommendedLabel: 'Studio Flagship',
      durationLabel: 'Estimated Time',
      startingFrom: 'Starting at',
      ppfSpotlightLabel: 'Signature Armored Protection',
      ppfCta: 'Select PPF Protection',
    },
    credentials: {
      eyebrow: 'Studio Credentials',
      title: 'Engineered for Showroom Clarity, Built for Islamabad Roads',
      subtitle:
        'Every vehicle enters our climate-controlled LED inspection bays with ultrasonic clear-coat readings and leaves with documented surface protection.',
      statCars: 'Vehicles Detailed',
      statYears: 'Years Craftsmanship',
      statRating: 'Google Maps Rating',
      statHardness: 'Ceramic Hardness',
    },
    reviews: {
      eyebrow: 'Verified Google Reviews',
      title: 'Trusted by Islamabad Car Enthusiasts',
      subtitle:
        'Live customer ratings and reviews synchronized directly from the Advance Car Studio Google Maps profile.',
      verifiedSource: 'Live from Google Maps',
      viewAllGoogle: 'View All Reviews on Google Maps',
      loadingText: 'Syncing verified Google Maps reviews...',
      fallbackHeadline: 'Verified on Google Maps',
      fallbackBody:
        'Browse client photos, PPF installation feedback, and verified 5-star reviews directly on our official Google Maps listing.',
      basedOn: 'Google Maps reviews',
    },
    booking: {
      eyebrow: 'Reserve Your Bay',
      title: 'Schedule Your Detailing Appointment',
      subtitle:
        'Lock in a dedicated studio bay at Advance Car Studio, Police Foundation, Islamabad. Instant booking reference and optional WhatsApp confirmation.',
      fullName: 'Full Name',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      sameAsPhone: 'Same as phone number',
      vehicle: 'Vehicle Make, Model & Year',
      vehiclePlaceholder: 'e.g., Audi A6, 2025 or Toyota Land Cruiser Prado, 2024',
      packageLabel: 'Service Package',
      dateLabel: 'Preferred Date',
      timeLabel: 'Preferred Time Slot',
      notesLabel: 'Paint Condition or Special Requests (Optional)',
      notesPlaceholder: 'Swirl marks on hood, matte leather care, front bumper PPF inquiry...',
      submitBtn: 'Confirm Detailing Slot',
      conciergeTitle: 'Need a Custom Inspection?',
      conciergeBody:
        'Send photos of your vehicle directly to our detailing desk on WhatsApp for an immediate bay availability check.',
      whatsappCta: 'Chat on WhatsApp',
      estimatedTotal: 'Selected Package Estimate',
      modalTitle: 'Appointment Request Confirmed',
      modalSubtitle: 'Your detailing bay reservation at Advance Car Studio has been logged.',
      referenceLabel: 'Booking Reference',
      sendWhatsAppBtn: 'Send Slip via WhatsApp',
      closeBtn: 'Done',
    },
    footer: {
      eyebrow: 'Visit the Studio',
      title: 'Advance Car Studio — Islamabad',
      addressLabel: 'Studio Address',
      hoursLabel: 'Opening Hours',
      contactLabel: 'Phone & WhatsApp Desk',
      directionsBtn: 'Open in Google Maps',
      followUs: 'Follow Our Work',
      mapsTermsNotice:
        'Interactive map and live business listing powered by Google Maps Platform, subject to Google Maps End User Terms.',
      copyright: '© 2026 Advance Car Studio Islamabad. All rights reserved.',
      credit: 'Precision Automotive Care · Police Foundation, Islamabad',
    },
  },
  ur: {
    dir: 'rtl',
    nav: {
      home: 'ہوم',
      gallery: 'پہلے اور بعد',
      packages: 'پیکجز',
      reviews: 'ریویوز',
      contact: 'رابطہ',
      bookNow: 'بکنگ کریں',
      whatsapp: 'واٹس ایپ',
    },
    hero: {
      locationLine: 'پولیس فاؤنڈیشن، اسلام آباد · سرٹیفائیڈ 9H سیرامک اور PPF اسٹوڈیو',
      headline: 'بے مثال چمک اور 9H سیرامک پروٹیکشن کا تجربہ کریں',
      subheadline:
        'ایڈوانس کار اسٹوڈیو اسلام آباد میں ملٹی اسٹیج پینٹ کریکشن، 9H سیرامک کوٹنگ اور سیلف ہیلنگ پی پی ایف کی اعلیٰ ترین سہولیات فراہم کرتا ہے۔',
      primaryCta: 'اپائنٹمنٹ بک کریں',
      secondaryCta: 'پیکجز دیکھیں',
      stripRating: 'گوگل ریٹنگ',
      stripHours: 'اوقات کار',
      stripLocation: 'اسلام آباد اسٹوڈیو',
      stripDirect: 'براہِ راست رابطہ',
    },
    gallery: {
      eyebrow: 'پینٹ کریکشن کے نتائج',
      title: 'لائیو پہلے اور بعد کی تبدیلی',
      subtitle:
        'سلائیڈر کو حرکت دے کر خراشوں والے دھندلے پینٹ اور 9H سیرامک شیشے جیسی چمک کا واضح فرق دیکھیں۔',
      beforeLabel: 'پہلے — خراشیں اور دھندلا پن',
      afterLabel: 'بعد — 9H مرر گلاس فنش',
      dragHint: 'موازنہ کرنے کے لیے سلائیڈر کو دائیں یا بائیں کھینچیں',
      modeSlider: 'انٹرایکٹو سلائیڈر',
      modeSideBySide: 'سائیڈ بائی سائیڈ',
      studioHighlightsTitle: 'اسٹوڈیو کے اندر کی جھلکیاں',
    },
    packages: {
      eyebrow: 'سروسز اور قیمتیں',
      title: 'آپ کی گاڑی کے لیے خصوصی پیکجز',
      subtitle:
        'شفاف نرخ جو منتخب کرنسی میں فوراً تبدیل ہوتے ہیں۔ بکنگ فارم میں شامل کرنے کے لیے پیکج منتخب کریں۔',
      selectBtn: 'پیکج منتخب کریں',
      selectedBtn: 'بکنگ کے لیے منتخب',
      recommendedLabel: 'اسٹوڈیو فلیگ شپ',
      durationLabel: 'متوقع وقت',
      startingFrom: 'شروعاتی قیمت',
      ppfSpotlightLabel: 'اعلیٰ تحفظ',
      ppfCta: 'PPF پروٹیکشن منتخب کریں',
    },
    credentials: {
      eyebrow: 'اسٹوڈیو کا معیار',
      title: 'شوروم جیسی چمک اور پائیدار تحفظ',
      subtitle:
        'ہر گاڑی کا جدید ایل ای ڈی انسپیکشن بے میں معائنہ کیا جاتا ہے اور مستند کیمیکلز سے تحفظ فراہم کیا جاتا ہے۔',
      statCars: 'گاڑیاں ڈیٹیل ہو چکی ہیں',
      statYears: 'سال کا تجربہ',
      statRating: 'گوگل میپس ریٹنگ',
      statHardness: 'سیرامک ہارڈنس',
    },
    reviews: {
      eyebrow: 'مصدقہ گوگل ریویوز',
      title: 'اسلام آباد کے کار مالکان کا اعتماد',
      subtitle:
        'ایڈوانس کار اسٹوڈیو کے گوگل میپس پروفائل سے براہِ راست موصول ہونے والے صارفین کے تبصرے۔',
      verifiedSource: 'گوگل میپس سے لائیو',
      viewAllGoogle: 'گوگل میپس پر تمام ریویوز دیکھیں',
      loadingText: 'گوگل میپس ریویوز لوڈ ہو رہے ہیں...',
      fallbackHeadline: 'گوگل میپس پر مصدقہ اسٹوڈیو',
      fallbackBody:
        'ہمارے آفیشل گوگل میپس پروفائل پر صارفین کے 5 اسٹار ریویوز اور گاڑیوں کی تصاویر ملاحظہ کریں۔',
      basedOn: 'گوگل میپس ریویوز',
    },
    booking: {
      eyebrow: 'بکنگ فارم',
      title: 'اپنا ڈیٹیلنگ سلاٹ بک کروائیں',
      subtitle:
        'ایڈوانس کار اسٹوڈیو، پولیس فاؤنڈیشن، اسلام آباد میں اپنی گاڑی کے لیے وقت محفوظ کریں۔',
      fullName: 'مکمل نام',
      phone: 'فون نمبر',
      whatsapp: 'واٹس ایپ نمبر',
      sameAsPhone: 'فون نمبر والا ہی واٹس ایپ ہے',
      vehicle: 'گاڑی کا نام، ماڈل اور سال',
      vehiclePlaceholder: 'مثال: Audi A6, 2025 یا Honda Civic, 2024',
      packageLabel: 'سروس پیکج منتخب کریں',
      dateLabel: 'پسندیدہ تاریخ',
      timeLabel: 'پسندیدہ وقت',
      notesLabel: 'اضافی ہدایات (اختیاری)',
      notesPlaceholder: 'پینٹ کی حالت یا خاص درخواست لکھیں...',
      submitBtn: 'بکنگ کی تصدیق کریں',
      conciergeTitle: 'واٹس ایپ پر فوری مشورہ',
      conciergeBody:
        'اپنی گاڑی کی تصاویر ہمارے ماہرین کو واٹس ایپ پر بھیجیں اور فوری رہنمائی حاصل کریں۔',
      whatsappCta: 'واٹس ایپ چیٹ شروع کریں',
      estimatedTotal: 'منتخب پیکج کا تخمینہ',
      modalTitle: 'آپ کی بکنگ درج ہو گئی ہے',
      modalSubtitle: 'ایڈوانس کار اسٹوڈیو میں آپ کی درخواست موصول ہو چکی ہے۔',
      referenceLabel: 'بکنگ ریفرنس نمبر',
      sendWhatsAppBtn: 'واٹس ایپ پر سلپ بھیجیں',
      closeBtn: 'بند کریں',
    },
    footer: {
      eyebrow: 'اسٹوڈیو کا پتہ',
      title: 'ایڈوانس کار اسٹوڈیو — اسلام آباد',
      addressLabel: 'پتہ',
      hoursLabel: 'اوقات کار',
      contactLabel: 'فون اور واٹس ایپ',
      directionsBtn: 'گوگل میپس پر راستہ دیکھیں',
      followUs: 'سوشل میڈیا',
      mapsTermsNotice:
        'انٹرایکٹو نقشہ اور کاروباری تفصیلات گوگل میپس پلیٹ فارم کے ذریعے فراہم کی گئی ہیں۔',
      copyright: '© 2026 ایڈوانس کار اسٹوڈیو اسلام آباد۔ جملہ حقوق محفوظ ہیں۔',
      credit: 'پولیس فاؤنڈیشن، اسلام آباد',
    },
  },
  ar: {
    dir: 'rtl',
    nav: {
      home: 'الرئيسية',
      gallery: 'قبل وبعد',
      packages: 'الباقات',
      reviews: 'التقييمات',
      contact: 'اتصل بنا',
      bookNow: 'احجز الآن',
      whatsapp: 'واتساب',
    },
    hero: {
      locationLine: 'بوليس فاونديشن، إسلام أباد · استوديو سيراميك 9H وحماية PPF معتمد',
      headline: 'أطلق العنان لأقصى لمعان وحماية سيراميك 9H',
      subheadline:
        'يقدم استوديو Advance Car Studio في إسلام أباد تصحيح الطلاء متعدد المراحل وطلاء السيراميك 9H وتركيب أفلام الحماية الذاتية PPF بدقة فائقة.',
      primaryCta: 'احجز موعد العناية',
      secondaryCta: 'استكشف الباقات',
      stripRating: 'تقييم جوجل',
      stripHours: 'ساعات العمل',
      stripLocation: 'استوديو إسلام أباد',
      stripDirect: 'التواصل المباشر',
    },
    gallery: {
      eyebrow: 'نتائج تصحيح الطلاء',
      title: 'التحول المباشر قبل وبعد العناية',
      subtitle:
        'اسحب شريط المقارنة لرؤية الفرق الواضح بين الدوائر والخدوش وبين اللمعان المرآتي بطلاء السيراميك 9H.',
      beforeLabel: 'قبل — خدوش دائرية وبهتان',
      afterLabel: 'بعد — لمعان سيراميك 9H',
      dragHint: 'اسحب الشريط أو استخدم الأسهم لفحص صفاء الطلاء',
      modeSlider: 'مقارنة تفاعلية',
      modeSideBySide: 'جنباً إلى جنب',
      studioHighlightsTitle: 'داخل حجرات العناية بالسيارات',
    },
    packages: {
      eyebrow: 'الباقات والأسعار',
      title: 'باقات حماية وعناية مصممة لسيارتك',
      subtitle:
        'أسعار شفافة تتحول فورياً حسب العملة المختارة. اختر أي باقة لتعبئة نموذج الحجز تلقائياً.',
      selectBtn: 'اختر الباقة',
      selectedBtn: 'تم الاختيار للحجز',
      recommendedLabel: 'الباقة الفاخرة',
      durationLabel: 'المدة المقدرة',
      startingFrom: 'تبدأ من',
      ppfSpotlightLabel: 'حماية فائقة للطلاء',
      ppfCta: 'اختر حماية PPF',
    },
    credentials: {
      eyebrow: 'معايير الاستوديو',
      title: 'دقة المعارض الفاخرة وحماية تدوم لسنوات',
      subtitle:
        'تخضع كل سيارة لفحص سماكة الطلاء تحت إضاءة LED متخصصة قبل تطبيق طبقات الحماية المعتمدة.',
      statCars: 'سيارة تمت العناية بها',
      statYears: 'سنوات من الخبرة',
      statRating: 'تقييم خرائط جوجل',
      statHardness: 'صلابة السيراميك',
    },
    reviews: {
      eyebrow: 'تقييمات جوجل الموثقة',
      title: 'ثقة عشاق السيارات في إسلام أباد',
      subtitle:
        'تقييمات ومراجعات حقيقية متزامنة مباشرة من ملف Advance Car Studio على خرائط جوجل.',
      verifiedSource: 'مباشرة من خرائط جوجل',
      viewAllGoogle: 'عرض جميع التقييمات على خرائط جوجل',
      loadingText: 'جاري تحميل تقييمات خرائط جوجل...',
      fallbackHeadline: 'موثق على خرائط جوجل',
      fallbackBody:
        'تصفح صور السيارات وتقييمات العملاء من فئة 5 نجوم مباشرة على صفحتنا الرسمية في خرائط جوجل.',
      basedOn: 'تقييم على خرائط جوجل',
    },
    booking: {
      eyebrow: 'احجز موعدك',
      title: 'جدول موعد العناية بسيارتك',
      subtitle:
        'احجز حجرة مخصصة في Advance Car Studio بإسلام أباد مع تأكيد فوري وخيار الإرسال عبر واتساب.',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      whatsapp: 'رقم الواتساب',
      sameAsPhone: 'نفس رقم الهاتف',
      vehicle: 'نوع وموديل وسنة السيارة',
      vehiclePlaceholder: 'مثال: Audi A6, 2025 أو Toyota Land Cruiser, 2024',
      packageLabel: 'باقة الخدمة',
      dateLabel: 'التاريخ المفضل',
      timeLabel: 'الوقت المفضل',
      notesLabel: 'حالة الطلاء أو ملاحظات إضافية (اختياري)',
      notesPlaceholder: 'خدوش على الغطاء الأمامي، عناية بالجلد، استفسار PPF...',
      submitBtn: 'تأكيد حجز الموعد',
      conciergeTitle: 'تحتاج فحصاً مخصصاً؟',
      conciergeBody:
        'أرسل صور سيارتك مباشرة عبر واتساب للحصول على تقييم فوري وتأكيد توفر الموعد.',
      whatsappCta: 'تحدث عبر واتساب',
      estimatedTotal: 'التكلفة التقديرية للباقة',
      modalTitle: 'تم تأكيد طلب الحجز',
      modalSubtitle: 'تم تسجيل حجزك في استوديو Advance Car Studio بنجاح.',
      referenceLabel: 'رقم المرجع',
      sendWhatsAppBtn: 'إرسال التفاصيل عبر واتساب',
      closeBtn: 'تم',
    },
    footer: {
      eyebrow: 'موقع الاستوديو',
      title: 'Advance Car Studio — إسلام أباد',
      addressLabel: 'العنوان',
      hoursLabel: 'ساعات العمل',
      contactLabel: 'الهاتف وواتساب',
      directionsBtn: 'فتح في خرائط جوجل',
      followUs: 'تابع أعمالنا',
      mapsTermsNotice:
        'تعمل الخريطة التفاعلية وبيانات الموقع عبر Google Maps Platform وتخضع لشروط مستخدمي خرائط جوجل.',
      copyright: '© 2026 Advance Car Studio إسلام أباد. جميع الحقوق محفوظة.',
      credit: 'بوليس فاونديشن، إسلام أباد',
    },
  },
  es: {
    dir: 'ltr',
    nav: {
      home: 'Inicio',
      gallery: 'Antes / Después',
      packages: 'Paquetes',
      reviews: 'Reseñas',
      contact: 'Contacto',
      bookNow: 'Reservar',
      whatsapp: 'WhatsApp',
    },
    hero: {
      locationLine: 'Police Foundation, Islamabad · Estudio Certificado 9H y PPF',
      headline: 'Desata el Máximo Brillo y Protección Cerámica 9H',
      subheadline:
        'Advance Car Studio ofrece corrección de pintura multietapa, recubrimientos cerámicos 9H curados por infrarrojos e instalación de PPF autorreparable en Islamabad.',
      primaryCta: 'Reservar Turno',
      secondaryCta: 'Ver Paquetes',
      stripRating: 'Calificación Google',
      stripHours: 'Horario',
      stripLocation: 'Estudio Islamabad',
      stripDirect: 'Línea Directa',
    },
    gallery: {
      eyebrow: 'Evidencia de Corrección',
      title: 'Transformación en Vivo Antes y Después',
      subtitle:
        'Desliza la barra de inspección para comparar remolinos severos y opacidad frente a nuestro acabado espejo con cerámico 9H.',
      beforeLabel: 'Antes — Remolinos y Opacidad',
      afterLabel: 'Después — Espejo Cerámico 9H',
      dragHint: 'Arrastra el control o usa las flechas para inspeccionar el acabado',
      modeSlider: 'Comparador Interactivo',
      modeSideBySide: 'Lado a Lado',
      studioHighlightsTitle: 'Dentro de Nuestras Bahías',
    },
    packages: {
      eyebrow: 'Paquetes y Tarifas',
      title: 'Paquetes de Protección Automotriz a Medida',
      subtitle:
        'Tarifas transparentes convertidas en tiempo real. Selecciona cualquier paquete para completar automáticamente tu reserva.',
      selectBtn: 'Elegir Paquete',
      selectedBtn: 'Seleccionado',
      recommendedLabel: 'Estudio Insignia',
      durationLabel: 'Duración Estimada',
      startingFrom: 'Desde',
      ppfSpotlightLabel: 'Blindaje Transparente',
      ppfCta: 'Elegir Protección PPF',
    },
    credentials: {
      eyebrow: 'Credenciales del Estudio',
      title: 'Precisión de Exhibición para las Rutas de Islamabad',
      subtitle:
        'Cada vehículo ingresa a bahías con iluminación LED calibrada, medición ultrasónica de barniz y químicos pH neutro certificados.',
      statCars: 'Autos Detallados',
      statYears: 'Años de Experiencia',
      statRating: 'Nota en Google Maps',
      statHardness: 'Dureza Cerámica',
    },
    reviews: {
      eyebrow: 'Reseñas Verificadas de Google',
      title: 'Respaldado por Entusiastas en Islamabad',
      subtitle:
        'Calificaciones y reseñas reales sincronizadas directamente desde el perfil de Advance Car Studio en Google Maps.',
      verifiedSource: 'En vivo desde Google Maps',
      viewAllGoogle: 'Ver Todas las Reseñas en Google Maps',
      loadingText: 'Sincronizando reseñas de Google Maps...',
      fallbackHeadline: 'Verificado en Google Maps',
      fallbackBody:
        'Explora fotografías reales de entregas, instalaciones de PPF y reseñas verificadas directamente en nuestra ficha oficial.',
      basedOn: 'reseñas en Google Maps',
    },
    booking: {
      eyebrow: 'Reserva Tu Bahía',
      title: 'Agenda Tu Cita de Detallado',
      subtitle:
        'Asegura tu turno en Advance Car Studio, Police Foundation, Islamabad con referencia inmediata y envío opcional por WhatsApp.',
      fullName: 'Nombre Completo',
      phone: 'Teléfono',
      whatsapp: 'Número de WhatsApp',
      sameAsPhone: 'Igual que el teléfono',
      vehicle: 'Marca, Modelo y Año del Vehículo',
      vehiclePlaceholder: 'ej., Audi A6, 2025 o Toyota Prado, 2024',
      packageLabel: 'Paquete de Servicio',
      dateLabel: 'Fecha Preferida',
      timeLabel: 'Horario Preferido',
      notesLabel: 'Estado de Pintura o Solicitudes (Opcional)',
      notesPlaceholder: 'Remolinos en capó, cuidado de piel mate, cotización PPF...',
      submitBtn: 'Confirmar Cita de Detallado',
      conciergeTitle: '¿Prefieres Evaluación Rápida?',
      conciergeBody:
        'Envía fotos de tu auto directamente a nuestro equipo por WhatsApp para verificar disponibilidad inmediata.',
      whatsappCta: 'Chatear en WhatsApp',
      estimatedTotal: 'Estimado del Paquete Seleccionado',
      modalTitle: 'Solicitud de Cita Confirmada',
      modalSubtitle: 'Tu reserva de bahía en Advance Car Studio ha quedado registrada.',
      referenceLabel: 'Referencia de Reserva',
      sendWhatsAppBtn: 'Enviar Comprobante por WhatsApp',
      closeBtn: 'Listo',
    },
    footer: {
      eyebrow: 'Visita el Estudio',
      title: 'Advance Car Studio — Islamabad',
      addressLabel: 'Dirección del Estudio',
      hoursLabel: 'Horario de Atención',
      contactLabel: 'Teléfono y WhatsApp',
      directionsBtn: 'Abrir en Google Maps',
      followUs: 'Sigue Nuestro Trabajo',
      mapsTermsNotice:
        'Mapa interactivo y ficha comercial en vivo operados con Google Maps Platform, sujetos a los Términos de Google Maps.',
      copyright: '© 2026 Advance Car Studio Islamabad. Todos los derechos reservados.',
      credit: 'Cuidado Automotriz de Precisión · Police Foundation, Islamabad',
    },
  },
};
