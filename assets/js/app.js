/**
 * Qetaf Honey - Main Web Application
 * Handles Language Switcher (AR/EN), Cart Management, Checkout,
 * Hero Slider, Dynamic Product Filters & Multi-Image Gallery Modal.
 */

// Global State
const state = {
  lang: localStorage.getItem('qetaf_lang') || 'ar', // Default is Arabic as requested
  currentView: 'landing',
  storeData: null,
  cart: JSON.parse(localStorage.getItem('qetaf_cart') || '[]'),
  customer: JSON.parse(localStorage.getItem('qetaf_customer') || '{}'),
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  heroIndex: 0,
  heroTimer: null,
  modalProduct: null,
  modalImgIndex: 0
};

// UI Localization Dictionary
const i18n = {
  ar: {
    brand_name: "قطاف العسل",
    tagline: "نقاء الطبيعة.. من المناحل إلى مائدتكم",
    nav_home: "الرئيسية",
    nav_products: "المنتجات",
    nav_about: "من نحن",
    nav_offers: "العروض",
    nav_cart: "السلة",
    currency: "ج.م",
    in_stock: "متوفر بالمخزون",
    out_of_stock: "نفد من المخزون",
    add_to_cart: "أضف إلى السلة",
    quick_view: "معاينة سريعة",
    view_details: "تفاصيل المنتج",
    filter_all: "جميع المنتجات",
    filter_price: "تصفية بالسعر",
    sort_by: "ترتيب حسب:",
    sort_default: "الافتراضي",
    sort_price_asc: "السعر: من الأقل للأعلى",
    sort_price_desc: "السعر: من الأعلى للأقل",
    sort_discount: "أعلى نسبة خصم",
    sort_name: "الاسم أبجدياً",
    search_placeholder: "ابحث عن عسل، زهور، غذاء ملكات...",
    cart_title: "سلة المشتريات",
    cart_empty: "سلتك فارغة حالياً",
    cart_empty_sub: "تصفح أشهى أنواع العسل الطبيعي وأضفها إلى سلتك!",
    browse_products: "تصفح المنتجات الآن",
    subtotal: "المجموع الفرعي:",
    total: "الإجمالي النهائي:",
    checkout: "إتمام الطلب",
    continue_shopping: "متابعة التسوق",
    clear_cart: "تفريغ السلة",
    item_added: "تمت إضافة المنتج إلى السلة بنجاح! 🍯",
    item_removed: "تم حذف المنتج من السلة",
    
    // Checkout form labels
    checkout_title: "إتمام طلب الشراء",
    checkout_subtitle: "يرجى تعبئة بيانات التوصيل بدقة لنتمكن من توصيل طلبك بأسرع وقت",
    buyer_info: "بيانات المشتري",
    field_name: "الاسم بالكامل",
    field_phone: "رقم الهاتف / واتساب",
    field_email: "البريد الإلكتروني",
    field_city: "المدينة / المنطقة",
    field_street: "اسم الشارع",
    field_building: "رقم المبنى / العمارة",
    field_apt: "رقم الشقة",
    field_landmark: "أقرب معلم مميز",
    field_notes: "ملاحظات إضافية على الطلب",
    notice_title: "تنبيه هام:",
    optional: "(اختياري)",
    required: "*",
    confirm_order: "تأكيد وإرسال الطلب",
    whatsapp_order: "تأكيد الطلب فوراً عبر واتساب",
    
    // Success Modal & Dynamic Texts
    order_success_title: "تم انشاء طلبك",
    order_success_subtitle: "سيتم التواصل معك لتأكيد طلبك و البدء بعملية التوصيل",
    offers_section_title: "عروض وخصومات مميزة",
    offers_section_subtitle: "تشكيلة من أفضل العروض الحصرية وباقات التوفير العائلية",
    products_section_title: "المنتجات",
    products_section_subtitle: "استكشف باقتنا المتنوعة من الأعسال الطبيعية النادرة ومنتجات الخلية الملكية",
    back_to_store: "العودة للتسوق",
    
    // About Us Content
    about_hero_title: "قصتنا في قطاف العسل",
    about_hero_subtitle: "رحلة من الشغف بنقاء الطبيعة، نعتني بالنحل لنمنحكم عسلاً كما أراده الخالق.",
    about_p1: "في «قطاف العسل»، بدأنا رحلتنا من إيمان راسخ بأن العسل الطبيعي ليس مجرد غذاء بل هو شفاء وطاقة حيوية نقية. نختار مواقع مناحلنا بعناية في البيئات الجبلية والوديان والبراري المفتوحة بعيداً عن التلوث والمبيدات.",
    about_p2: "نلتزم بأعلى معايير فرز وتعبئة العسل دون تسخين أو فلترة مفرطة لنحافظ على كامل الإنزيمات الحية، الفيتامينات، وفوائد حبوب اللقاح الطبيعية، ليصلكم من المنحل إلى مائدتكم بكامل قيمته الغذائية.",
    
    val_1_title: "أمانة ومصداقية",
    val_1_desc: "نضمن نقاء كل قطرة عسل نقدمها، ونلتزم بالفحص الدوري بأدق المختبرات المتخصصة.",
    val_2_title: "إنتاج طبيعي مستدام",
    val_2_desc: "نتبع ممارسات تربية نحل رحيمة وصديقة للبيئة تضمن صحة النحل وتنوع المحاصيل.",
    val_3_title: "تنوع وجودة استثنائية",
    val_3_desc: "نوفر لكم تشكيلة واسعة من أعسال السدر الجبلي والأعشاب الطبية ومنتجات الخلية الملكية.",
    val_4_title: "ثقة ورضا عملائنا",
    val_4_desc: "آلاف العملاء يثقون في قطاف كمصدرهم المعتمد للعسل الطبيعي والمكملات الغذائية.",
    
    faq_title: "الأسئلة الشائعة",
    faq_1_q: "كيف أتأكد من أن عسل قطاف طبيعي 100%؟",
    faq_1_a: "جميع أعسالنا تخضع للفحص المخبري الدوري للتحقق من نسب السكروز والإنزيمات والنقاء التام. كما نقدم ضمان استرجاع كامل في حال ثبت عدم نقاء العسل.",
    faq_2_q: "هل العسل يتبلور؟ وهل التبلور دليل على الغش؟",
    faq_2_a: "على العكس تماماً! التبلور (التجمد) هو خاصية فيزيائية طبيعية تحدث لبعض أنواع العسل الخام غير المبستر مثل عسل الموالح والبرسيم، وهو أكبر دليل على أن العسل طبيعي وحي ولم يتعرض لحرارة عالية تتلف فوائده.",
    faq_3_q: "ما هي مدة التوصيل وتكلفة الشحن؟",
    faq_3_a: "يستغرق التوصيل عادة من 24 إلى 48 ساعة داخل مدينة الشروق ومدينتي وبدر والمدن المحيطة. الشحن مجاني للطلبات التي تتجاوز 500 جنيه.",
    
    footer_quick_links: "روابط سريعة",
    footer_contact_info: "معلومات التواصل",
    footer_guarantee: "ضمان قطاف الذهبي",
    footer_guarantee_text: "نضمن لك نقاء منتجاتنا بنسبة 100%.. إن لم ينل العسل رضاك، يمكنك استرجاعه واسترداد قيمته كاملة.",
    copyright: "جميع الحقوق محفوظة © قطاف العسل"
  },
  en: {
    brand_name: "Qetaf Honey",
    tagline: "Nature's Purest Harvest Straight to Your Table",
    nav_home: "Home",
    nav_products: "Products",
    nav_about: "About Us",
    nav_offers: "Offers",
    nav_cart: "Cart",
    currency: "EGP",
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    add_to_cart: "Add to Cart",
    quick_view: "Quick View",
    view_details: "Product Details",
    filter_all: "All Products",
    filter_price: "Filter by Price",
    sort_by: "Sort by:",
    sort_default: "Default",
    sort_price_asc: "Price: Low to High",
    sort_price_desc: "Price: High to Low",
    sort_discount: "Highest Discount",
    sort_name: "Alphabetical",
    search_placeholder: "Search honey, propolis, royal jelly...",
    cart_title: "Shopping Cart",
    cart_empty: "Your cart is currently empty",
    cart_empty_sub: "Discover our premium 100% raw honey and add your favorites!",
    browse_products: "Browse Products Now",
    subtotal: "Subtotal:",
    total: "Total:",
    checkout: "Checkout",
    continue_shopping: "Continue Shopping",
    clear_cart: "Clear Cart",
    item_added: "Product added to cart successfully! 🍯",
    item_removed: "Product removed from cart",
    
    // Checkout form labels
    checkout_title: "Complete Your Order",
    checkout_subtitle: "Please provide your delivery information accurately for prompt doorstep shipping",
    buyer_info: "Customer Information",
    field_name: "Full Name",
    field_phone: "Phone / WhatsApp",
    field_email: "Email Address",
    field_city: "City / Area",
    field_street: "Street Name",
    field_building: "Building Number",
    field_apt: "Apartment No.",
    field_landmark: "Nearest Landmark",
    field_notes: "Order Notes",
    notice_title: "Important Notice:",
    optional: "(Optional)",
    required: "*",
    confirm_order: "Confirm & Place Order",
    whatsapp_order: "Order Directly via WhatsApp",
    
    // Success Modal & Dynamic Texts
    order_success_title: "Your Order Has Been Created",
    order_success_subtitle: "We will contact you to confirm your order and begin the delivery process",
    offers_section_title: "Exclusive Offers & Deals",
    offers_section_subtitle: "A curated selection of exclusive offers & family value bundles",
    products_section_title: "Our Products",
    products_section_subtitle: "Explore our diverse range of rare raw honeys and royal hive treasures",
    back_to_store: "Back to Shopping",
    
    // About Us Content
    about_hero_title: "Our Story at Qetaf Honey",
    about_hero_subtitle: "A passionate journey to preserve nature's golden gift just as nature intended.",
    about_p1: "At Qetaf Honey, our passion was sparked by the understanding that pure raw honey is more than food—it is living wellness and holistic vitality. We locate our apiaries in untouched mountain valleys and wild botanical sanctuaries.",
    about_p2: "We adhere to uncompromised harvesting standards without excessive filtration or heat damage, preserving living enzymes, natural antioxidants, and precious flower pollens directly to your home.",
    
    val_1_title: "Authentic Purity",
    val_1_desc: "Every single drop is certified pure, supported by comprehensive laboratory testing.",
    val_2_title: "Sustainable Beekeeping",
    val_2_desc: "We practice ethical, bee-first apiculture ensuring healthy colonies and thriving biodiversity.",
    val_3_title: "Rare & Diverse Selection",
    val_3_desc: "Offering world-class mountain Sidr, herbal honeys, propolis, and fresh royal jelly blends.",
    val_4_title: "Customer Satisfaction",
    val_4_desc: "Thousands of families cherish Qetaf as their trusted natural wellness partner.",
    
    faq_title: "Frequently Asked Questions",
    faq_1_q: "How do I know Qetaf honey is 100% pure?",
    faq_1_a: "Our honey undergoes stringent third-party laboratory analysis verifying sucrose levels, moisture, and active pollen count. We provide a full money-back guarantee.",
    faq_2_q: "Does raw honey crystallize? Is crystallization bad?",
    faq_2_a: "Not at all! Crystallization is a natural physical hallmark of unpasteurized, enzyme-rich raw honey. It confirms that the honey was never overheated or artificially processed.",
    faq_3_q: "What are your delivery times and shipping costs?",
    faq_3_a: "Orders in El Shorouk, Madinaty, Badr, and surrounding areas arrive within 24-48 hours. Free delivery applies on orders above 500 EGP.",
    
    footer_quick_links: "Quick Links",
    footer_contact_info: "Contact Info",
    footer_guarantee: "Qetaf Golden Guarantee",
    footer_guarantee_text: "100% satisfaction guaranteed. If you are not delighted with your honey, return it for a complete hassle-free refund.",
    copyright: "All Rights Reserved © Qetaf Honey"
  }
};

/**
 * App Initialization
 */
document.addEventListener('DOMContentLoaded', async () => {
  setupLanguage(state.lang, false);
  setupEventListeners();
  
  // Load data from Excel / JSON
  try {
    const data = await DataLoader.loadStoreData();
    state.storeData = data;
    renderAll();
    setupRouting();
    startHeroAutoplay();
  } catch (err) {
    console.error('Failed to initialize store data:', err);
  }
});

/**
 * Configure Language and Direction (AR = RTL, EN = LTR)
 */
function setupLanguage(lang, rerender = true) {
  state.lang = lang;
  localStorage.setItem('qetaf_lang', lang);

  const html = document.documentElement;
  const body = document.body;

  if (lang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    body.classList.remove('lang-en');
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    body.classList.add('lang-en');
  }

  // Update switcher button label
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.innerHTML = lang === 'ar' 
      ? '<span class="lang-flag">🇬🇧</span><span>English</span>' 
      : '<span class="lang-flag">🇪🇬</span><span>العربية</span>';
  }

  // Translate static UI elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang] && i18n[lang][key]) {
      el.setAttribute('placeholder', i18n[lang][key]);
    }
  });

  if (rerender && state.storeData) {
    renderAll();
  } else if (state.storeData) {
    renderDynamicSiteTexts();
  }
}

/**
 * Main Render Pipeline
 */

/**
 * Helper to get a localized setting from state.storeData.Settings (from Excel)
 */
function getSetting(key, fallbackAr = "", fallbackEn = "") {
  const settings = state.storeData?.Settings || {};
  const item = settings[key];
  if (!item) {
    return state.lang === 'ar' ? fallbackAr : (fallbackEn || fallbackAr);
  }
  const val = state.lang === 'ar' 
    ? (item.value_ar !== undefined && String(item.value_ar).trim() !== "" ? item.value_ar : fallbackAr)
    : (item.value_en !== undefined && String(item.value_en).trim() !== "" ? item.value_en : (item.value_ar || fallbackEn || fallbackAr));
  return String(val).trim();
}

/**
 * Dynamically updates all text slots on the website from Excel Settings
 * Handles titles, subtitles, story, brand values, FAQs, footer, guarantee & copyright
 */
function renderDynamicSiteTexts() {
  if (!state.storeData) return;

  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null && text !== "") {
      el.textContent = text;
    }
  };

  // Section titles & subtitles
  setElText('offersSectionTitle', getSetting('offers_section_title', 'عروض وخصومات مميزة', 'Exclusive Offers & Deals'));
  setElText('offersSectionSubtitle', getSetting('offers_section_subtitle', 'تشكيلة من أفضل العروض الحصرية وباقات التوفير العائلية', 'A curated selection of exclusive offers & family value bundles'));
  setElText('productsSectionTitle', getSetting('products_section_title', 'المنتجات', 'Our Products'));
  setElText('productsSectionSubtitle', getSetting('products_section_subtitle', 'استكشف باقتنا المتنوعة من الأعسال الطبيعية النادرة ومنتجات الخلية الملكية', 'Explore our diverse range of rare raw honeys and royal hive treasures'));

  // About story
  setElText('aboutHeroTitle', getSetting('about_hero_title', 'قصتنا في قطاف العسل', 'Our Story at Qetaf Honey'));
  setElText('aboutHeroSubtitle', getSetting('about_hero_subtitle', 'رحلة من الشغف بنقاء الطبيعة، نعتني بالنحل لنمنحكم عسلاً كما أراده الخالق.', "A passionate journey to preserve nature's golden gift just as nature intended."));
  setElText('aboutP1', getSetting('about_p1', 'في «قطاف العسل»، بدأنا رحلتنا من إيمان راسخ بأن العسل الطبيعي ليس مجرد غذاء بل هو شفاء وطاقة حيوية نقية. نختار مواقع مناحلنا بعناية في البيئات الجبلية والوديان والبراري المفتوحة بعيداً عن التلوث والمبيدات.', 'At Qetaf Honey, our passion was sparked by the understanding that pure raw honey is more than food—it is living wellness and holistic vitality. We locate our apiaries in untouched mountain valleys and wild botanical sanctuaries.'));
  setElText('aboutP2', getSetting('about_p2', 'نلتزم بأعلى معايير فرز وتعبئة العسل دون تسخين أو فلترة مفرطة لنحافظ على كامل الإنزيمات الحية، الفيتامينات، وفوائد حبوب اللقاح الطبيعية، ليصلكم من المنحل إلى مائدتكم بكامل قيمته الغذائية.', 'We adhere to uncompromised harvesting standards without excessive filtration or heat damage, preserving living enzymes, natural antioxidants, and precious flower pollens directly to your home.'));

  // Brand values
  setElText('valuesSectionTitle', getSetting('values_section_title', 'قيمنا والتزامنا تجاهكم', 'Our Values & Commitment'));
  setElText('valuesSectionSubtitle', getSetting('values_section_subtitle', 'المعايير التي نحرص عليها في كل قطرة عسل تصل إلى بيتك', 'The standards we uphold in every drop of honey delivered to your home'));
  setElText('val1Title', getSetting('val_1_title', 'أمانة ومصداقية', 'Authentic Purity'));
  setElText('val1Desc', getSetting('val_1_desc', 'نضمن نقاء كل قطرة عسل نقدمها، ونلتزم بالفحص الدوري بأدق المختبرات المتخصصة.', 'Every single drop is certified pure, supported by comprehensive laboratory testing.'));
  setElText('val2Title', getSetting('val_2_title', 'إنتاج طبيعي مستدام', 'Sustainable Beekeeping'));
  setElText('val2Desc', getSetting('val_2_desc', 'نتبع ممارسات تربية نحل رحيمة وصديقة للبيئة تضمن صحة النحل وتنوع المحاصيل.', 'We practice ethical, bee-first apiculture ensuring healthy colonies and thriving biodiversity.'));
  setElText('val3Title', getSetting('val_3_title', 'تنوع وجودة استثنائية', 'Rare & Diverse Selection'));
  setElText('val3Desc', getSetting('val_3_desc', 'نوفر لكم تشكيلة واسعة من أعسال السدر الجبلي والأعشاب الطبية ومنتجات الخلية الملكية.', 'Offering world-class mountain Sidr, herbal honeys, propolis, and fresh royal jelly blends.'));
  setElText('val4Title', getSetting('val_4_title', 'ثقة ورضا عملائنا', 'Customer Trust & Satisfaction'));
  setElText('val4Desc', getSetting('val_4_desc', 'آلاف العملاء يثقون في قطاف كمصدرهم المعتمد للعسل الطبيعي والمكملات الغذائية.', 'Thousands of families cherish Qetaf as their trusted natural wellness partner.'));

  // FAQ
  setElText('faqSectionTitle', getSetting('faq_section_title', 'الأسئلة الشائعة', 'Frequently Asked Questions'));
  setElText('faq1Q', getSetting('faq_1_q', 'كيف أتأكد من أن عسل قطاف طبيعي 100%؟', 'How do I know Qetaf honey is 100% pure?'));
  setElText('faq1A', getSetting('faq_1_a', 'جميع أعسالنا تخضع للفحص المخبري الدوري للتحقق من نسب السكروز والإنزيمات والنقاء التام. كما نقدم ضمان استرجاع كامل في حال ثبت عدم نقاء العسل.', 'Our honey undergoes stringent third-party laboratory analysis verifying sucrose levels, moisture, and active pollen count. We provide a full money-back guarantee.'));
  setElText('faq2Q', getSetting('faq_2_q', 'هل العسل يتبلور؟ وهل التبلور دليل على الغش؟', 'Does raw honey crystallize? Is crystallization bad?'));
  setElText('faq2A', getSetting('faq_2_a', 'على العكس تماماً! التبلور (التجمد) هو خاصية فيزيائية طبيعية تحدث لبعض أنواع العسل الخام غير المبستر مثل عسل الموالح والبرسيم، وهو أكبر دليل على أن العسل طبيعي وحي ولم يتعرض لحرارة عالية تتلف فوائده.', 'Not at all! Crystallization is a natural physical hallmark of unpasteurized, enzyme-rich raw honey. It confirms that the honey was never overheated or artificially processed.'));
  setElText('faq3Q', getSetting('faq_3_q', 'ما هي مدة التوصيل وتكلفة الشحن؟', 'What are your delivery times and shipping costs?'));
  setElText('faq3A', getSetting('faq_3_a', 'يستغرق التوصيل عادة من 24 إلى 48 ساعة داخل مدينة الشروق ومدينتي وبدر والمدن المحيطة. الشحن مجاني للطلبات التي تتجاوز 500 جنيه.', 'Orders in El Shorouk, Madinaty, Badr, and surrounding areas arrive within 24-48 hours. Free delivery applies on orders above 500 EGP.'));

  // Footer
  setElText('footerTagline', getSetting('tagline', 'نقاء الطبيعة.. من المناحل إلى مائدتكم مباشرة. أعسال طبيعية مفحوصة ومضمونة الجودة والنقاء 100%.', "Nature's Purest Harvest Straight to Your Table. 100% pure lab-tested honey."));
  setElText('footerContactHeading', getSetting('footer_contact_heading', 'معلومات التواصل', 'Contact Info'));
  setElText('footerLinksHeading', getSetting('footer_links_heading', 'روابط سريعة', 'Quick Links'));
  setElText('footerGuaranteeTitle', getSetting('footer_guarantee_title', 'ضمان قطاف الذهبي', 'Qetaf Golden Guarantee'));
  setElText('footerGuaranteeText', getSetting('footer_guarantee_text', 'نضمن لك نقاء منتجاتنا بنسبة 100%.. إن لم ينل العسل رضاك، يمكنك استرجاعه واسترداد قيمته كاملة بدون أي تعقيد.', '100% satisfaction guaranteed. If you are not delighted with your honey, return it for a complete hassle-free refund.'));
  setElText('footerCopyright', getSetting('copyright_text', 'جميع الحقوق محفوظة © قطاف العسل', 'All Rights Reserved © Qetaf Honey'));

  // Order Success Modal
  setElText('orderSuccessTitle', getSetting('order_success_title', 'تم انشاء طلبك', 'Your Order Has Been Created'));
  setElText('orderSuccessMessage', getSetting('order_success_subtitle', 'سيتم التواصل معك لتأكيد طلبك و البدء بعملية التوصيل', 'We will contact you to confirm your order and begin the delivery process'));
}

function renderAll() {
  renderAnnouncementBanner();
  renderHeroSlider();
  renderSmallOffers();
  renderProducts();
  renderCategories();
  renderCart();
  renderCheckoutSummary();
  renderFooter();
  renderDeliveryCoverageNotice();
  renderDynamicSiteTexts();
  prefillCustomerForm();
}

/**
 * Top Announcement Banner
 * As specified: "should not be displayed if there's no data in the designated cell in the excel sheet"
 */
function renderAnnouncementBanner() {
  const banner = document.getElementById('announcementBanner');
  const bannerTextEl = document.getElementById('announcementText');
  if (!banner || !bannerTextEl || !state.storeData) return;

  const settings = state.storeData.Settings || {};
  const annSetting = settings.announcement_text || {};
  const text = state.lang === 'ar' ? (annSetting.value_ar || "") : (annSetting.value_en || annSetting.value_ar || "");

  if (text.trim().length > 0) {
    bannerTextEl.innerHTML = text;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

/**
 * Large Swiping Hero Slider (Offers Carousel)
 */
function renderHeroSlider() {
  const track = document.getElementById('heroTrack');
  const dotsContainer = document.getElementById('heroDots');
  if (!track || !state.storeData) return;

  const offers = (state.storeData.HeroOffers || []).filter(o => String(o.active).toLowerCase() !== 'no');
  if (offers.length === 0) return;

  // Build slides
  track.innerHTML = offers.map((offer, idx) => {
    const title = state.lang === 'ar' ? offer.title_ar : (offer.title_en || offer.title_ar);
    const subtitle = state.lang === 'ar' ? offer.subtitle_ar : (offer.subtitle_en || offer.subtitle_ar);
    const badge = state.lang === 'ar' ? offer.badge_ar : (offer.badge_en || offer.badge_ar);
    const btnText = state.lang === 'ar' ? offer.button_text_ar : (offer.button_text_en || offer.button_text_ar);
    const img = offer.image_path || 'assets/images/landing/hero/hero1.jpg';
    const link = offer.link_url || '#products';

    return `
      <div class="slide-card" data-index="${idx}">
        <div class="slide-content">
          ${badge ? `<div class="slide-badge"><span>🍯</span> ${badge}</div>` : ''}
          <h2 class="slide-title">${title}</h2>
          <p class="slide-subtitle">${subtitle}</p>
          <div class="slide-actions">
            <a href="${link}" class="btn btn-primary btn-lg" onclick="handleOfferLink('${link}')">
              ${btnText || (state.lang === 'ar' ? 'تصفح العرض' : 'Explore Offer')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
        <div class="slide-image-wrapper">
          <img src="${img}" alt="${title}" class="slide-image" loading="lazy" onerror="this.src='assets/images/landing/hero/hero1.jpg'">
        </div>
      </div>
    `;
  }).join('');

  // Build Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = offers.map((_, idx) => `
      <button class="slider-dot ${idx === state.heroIndex ? 'active' : ''}" 
              onclick="goToHeroSlide(${idx})" 
              aria-label="Slide ${idx + 1}"></button>
    `).join('');
  }

  updateHeroSlidePosition();
}

function updateHeroSlidePosition() {
  const track = document.getElementById('heroTrack');
  const dots = document.querySelectorAll('.slider-dot');
  if (!track) return;

  const isRTL = state.lang === 'ar';
  const offset = state.heroIndex * 100;
  // CSS transform handling with RTL direction
  track.style.transform = isRTL 
    ? `translateX(${offset}%)` 
    : `translateX(-${offset}%)`;

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === state.heroIndex);
  });
}

function nextHeroSlide() {
  const offers = (state.storeData?.HeroOffers || []).filter(o => String(o.active).toLowerCase() !== 'no');
  if (offers.length <= 1) return;
  state.heroIndex = (state.heroIndex + 1) % offers.length;
  updateHeroSlidePosition();
}

function prevHeroSlide() {
  const offers = (state.storeData?.HeroOffers || []).filter(o => String(o.active).toLowerCase() !== 'no');
  if (offers.length <= 1) return;
  state.heroIndex = (state.heroIndex - 1 + offers.length) % offers.length;
  updateHeroSlidePosition();
}

function goToHeroSlide(index) {
  state.heroIndex = index;
  updateHeroSlidePosition();
  resetHeroAutoplay();
}

function startHeroAutoplay() {
  if (state.heroTimer) clearInterval(state.heroTimer);
  state.heroTimer = setInterval(() => {
    nextHeroSlide();
  }, 6000);
}

function resetHeroAutoplay() {
  startHeroAutoplay();
}

/**
 * Smaller Offer Cards
 * Requirement:
 * "I want some smaller cards underneath to show some other smaller offers or deals or new products launches.
 * the first small card should be a general button that leads to the products page"
 */
function renderSmallOffers() {
  const container = document.getElementById('smallOffersGrid');
  if (!container || !state.storeData) return;

  const smallOffers = (state.storeData.SmallOffers || []).filter(o => String(o.active).toLowerCase() !== 'no');
  if (smallOffers.length === 0) return;

  container.innerHTML = smallOffers.map((card, idx) => {
    const isFirstCard = idx === 0 || String(card.is_all_products_btn).toLowerCase() === 'yes';
    const title = state.lang === 'ar' ? card.title_ar : (card.title_en || card.title_ar);
    const subtitle = state.lang === 'ar' ? card.subtitle_ar : (card.subtitle_en || card.subtitle_ar);
    const badge = state.lang === 'ar' ? card.badge_ar : (card.badge_en || card.badge_ar);
    const btnText = state.lang === 'ar' ? card.button_text_ar : (card.button_text_en || card.button_text_ar);
    const img = card.image_path || 'assets/images/landing/offers/offer1.jpg';
    const link = card.link_url || '#products';

    return `
      <div class="small-offer-card ${isFirstCard ? 'card-all-products' : ''}">
        <div class="card-img-wrapper">
          <img src="${img}" alt="${title}" class="card-offer-img" loading="lazy" onerror="this.src='assets/images/landing/offers/offer1.jpg'">
          ${badge ? `<div class="card-badge-tag">${badge}</div>` : ''}
        </div>
        <div class="small-offer-body">
          <h3 class="small-offer-title">${title}</h3>
          <p class="small-offer-subtitle">${subtitle}</p>
          <a href="${link}" class="btn ${isFirstCard ? 'btn-primary' : 'btn-outline'}" onclick="handleOfferLink('${link}')">
            <span>${btnText || (isFirstCard ? (state.lang === 'ar' ? 'عرض كل المنتجات' : 'View All Products') : (state.lang === 'ar' ? 'اطلب الآن' : 'Order Now'))}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Renders the product card action button or quantity stepper (+ / -)
 * If cartQty > 0: shows [-] [qty] [+]
 * If cartQty === 0: shows Add to Cart button
 */
function renderCardActionButtonHtml(product, cartQty) {
  const isOutOfStock = String(product.stock_status).toLowerCase().includes('out') || 
                       String(product.stock_status).includes('غير') || 
                       String(product.stock_status).includes('نفد');
  
  if (isOutOfStock) {
    return `
      <button type="button" class="btn btn-primary btn-add-cart" disabled>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <span>${i18n[state.lang].out_of_stock}</span>
      </button>
    `;
  }

  if (cartQty > 0) {
    return `
      <div class="card-qty-stepper" data-product-id="${product.id}" onclick="event.stopPropagation()">
        <button type="button" class="card-stepper-btn btn-minus" 
                onclick="event.stopPropagation(); updateCartQty('${product.id}', -1)" 
                title="${cartQty === 1 ? (state.lang === 'ar' ? 'حذف من السلة' : 'Remove from cart') : (state.lang === 'ar' ? 'إنقاص' : 'Decrease')}">
          ${cartQty === 1 
            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>` 
            : `−`}
        </button>
        <span class="card-stepper-val">${cartQty}</span>
        <button type="button" class="card-stepper-btn btn-plus" 
                onclick="event.stopPropagation(); updateCartQty('${product.id}', 1)" 
                title="${state.lang === 'ar' ? 'زيادة' : 'Increase'}">
          +
        </button>
      </div>
    `;
  }

  return `
    <button type="button" class="btn btn-primary btn-add-cart" 
            onclick="event.stopPropagation(); addToCart('${product.id}', 1)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      <span>${i18n[state.lang].add_to_cart}</span>
    </button>
  `;
}

function updateAllProductCardButtons() {
  if (!state.storeData || !state.storeData.Products) return;
  
  document.querySelectorAll('.card-action-slot').forEach(slot => {
    const productId = slot.getAttribute('data-slot-id');
    const product = state.storeData.Products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = state.cart.find(i => i.id === productId);
    const cartQty = cartItem ? cartItem.qty : 0;
    slot.innerHTML = renderCardActionButtonHtml(product, cartQty);
  });
}

/**
 * Category Filter Tags
 */
function renderCategories() {
  const container = document.getElementById('categoryTagsList');
  if (!container || !state.storeData) return;

  const products = state.storeData.Products || [];
  const categoriesMap = new Map();

  products.forEach(p => {
    const catAr = p.category_ar || 'عسل طبيعي';
    const catEn = p.category_en || 'Natural Honey';
    categoriesMap.set(catAr, catEn);
  });

  let html = `
    <button class="category-tag-btn ${state.activeCategory === 'all' ? 'active' : ''}" 
            onclick="setCategoryFilter('all')">
      ${i18n[state.lang].filter_all}
    </button>
  `;

  categoriesMap.forEach((catEn, catAr) => {
    const label = state.lang === 'ar' ? catAr : catEn;
    const catKey = catAr;
    html += `
      <button class="category-tag-btn ${state.activeCategory === catKey ? 'active' : ''}" 
              onclick="setCategoryFilter('${catKey}')">
        ${label}
      </button>
    `;
  });

  container.innerHTML = html;
}

function setCategoryFilter(catKey) {
  state.activeCategory = catKey;
  renderCategories();
  renderProducts();
}

/**
 * Products Grid
 * Requirements:
 * - Square image in card (1:1)
 * - Name, Price, discounted price (main price visible with red line across it)
 * - Stock availability
 * - Filter based on price or tag/category
 */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('filteredProductsCount');
  if (!grid || !state.storeData) return;

  let products = [...(state.storeData.Products || [])];

  // 1. Category Filter
  if (state.activeCategory !== 'all') {
    products = products.filter(p => p.category_ar === state.activeCategory || p.category_en === state.activeCategory);
  }

  // 2. Search Filter
  if (state.searchQuery.trim().length > 0) {
    const q = state.searchQuery.trim().toLowerCase();
    products = products.filter(p => {
      const matchAr = (p.name_ar + " " + p.description_ar + " " + (p.tags || []).join(' ')).toLowerCase().includes(q);
      const matchEn = (p.name_en + " " + p.description_en + " " + (p.tags || []).join(' ')).toLowerCase().includes(q);
      return matchAr || matchEn;
    });
  }

  // 3. Sorting
  if (state.sortBy === 'price_asc') {
    products.sort((a, b) => a.final_price - b.final_price);
  } else if (state.sortBy === 'price_desc') {
    products.sort((a, b) => b.final_price - a.final_price);
  } else if (state.sortBy === 'discount') {
    products.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
  } else if (state.sortBy === 'name') {
    const key = state.lang === 'ar' ? 'name_ar' : 'name_en';
    products.sort((a, b) => (a[key] || "").localeCompare(b[key] || ""));
  }

  if (countEl) {
    countEl.textContent = `${products.length} ${state.lang === 'ar' ? 'منتج متوفر' : 'products available'}`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-products-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B87B00" stroke-width="1.5" style="margin: 0 auto 1rem; opacity: 0.6;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <h3>${state.lang === 'ar' ? 'لم نجد أي منتجات تطابق بحثك' : 'No products found matching your filter'}</h3>
        <p style="color: var(--text-muted); margin-top: 0.4rem;">${state.lang === 'ar' ? 'جرب البحث بكلمات مختلفة أو تصفية تصنيف آخر' : 'Try adjusting your search or category filter'}</p>
        <button class="btn btn-outline" style="margin-top: 1rem;" onclick="resetFilters()">
          ${state.lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset Filters'}
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const name = state.lang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
    const category = state.lang === 'ar' ? product.category_ar : (product.category_en || product.category_ar);
    const hasDiscount = product.discount_percent > 0;
    const isOutOfStock = String(product.stock_status).toLowerCase().includes('out') || String(product.stock_status).includes('غير') || String(product.stock_status).includes('نفد');
    const mainImg = product.image_paths[0] || 'assets/images/landing/offers/offer1.jpg';
    const currency = i18n[state.lang].currency;
    const cartItem = state.cart.find(i => i.id === product.id);
    const cartQty = cartItem ? cartItem.qty : 0;

    return `
      <div class="product-card" data-id="${product.id}">
        <!-- Square Image Box -->
        <div class="product-img-box" onclick="openProductModal('${product.id}')">
          <img src="${mainImg}" alt="${name}" class="product-card-img" loading="lazy" onerror="this.src='assets/images/landing/offers/offer1.jpg'">
          ${hasDiscount ? `<div class="product-discount-badge">-${product.discount_percent}%</div>` : ''}
          <div class="product-stock-badge ${isOutOfStock ? 'out-stock' : 'in-stock'}">
            ${isOutOfStock ? i18n[state.lang].out_of_stock : i18n[state.lang].in_stock}
          </div>
        </div>

        <!-- Product Card Body -->
        <div class="product-card-body">
          <span class="product-category-name">${category}</span>
          <h3 class="product-title" onclick="openProductModal('${product.id}')">${name}</h3>
          
          <!-- Pricing: main price crossed with red line if discounted -->
          <div class="product-pricing-box">
            ${hasDiscount ? `
              <span class="original-price-crossed">${product.price} ${currency}</span>
            ` : ''}
            <span class="current-price">${product.final_price}</span>
            <span class="currency-symbol">${currency}</span>
          </div>

          <!-- Actions -->
          <div class="product-card-actions">
            <div class="card-action-slot" data-slot-id="${product.id}">
              ${renderCardActionButtonHtml(product, cartQty)}
            </div>
            <button type="button" class="btn-quick-view" onclick="event.stopPropagation(); openProductModal('${product.id}')" title="${i18n[state.lang].quick_view}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetFilters() {
  state.activeCategory = 'all';
  state.searchQuery = '';
  state.sortBy = 'default';
  const searchInput = document.getElementById('productSearchInput');
  const sortSelect = document.getElementById('productSortSelect');
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'default';
  renderCategories();
  renderProducts();
}

/**
 * Product Details Modal with Multiple Image Flipping
 * Requirement:
 * "path to all the images of the certain product (I will need to flip between all the iomages on the product page)"
 */
function openProductModal(productId) {
  const product = (state.storeData?.Products || []).find(p => p.id === productId);
  if (!product) return;

  state.modalProduct = product;
  state.modalImgIndex = 0;

  const modal = document.getElementById('productModal');
  const name = state.lang === 'ar' ? product.name_ar : (product.name_en || product.name_ar);
  const category = state.lang === 'ar' ? product.category_ar : (product.category_en || product.category_ar);
  const desc = state.lang === 'ar' ? product.description_ar : (product.description_en || product.description_ar);
  const hasDiscount = product.discount_percent > 0;
  const isOutOfStock = String(product.stock_status).toLowerCase().includes('out') || String(product.stock_status).includes('غير') || String(product.stock_status).includes('نفد');
  const currency = i18n[state.lang].currency;

  document.getElementById('modalCategory').textContent = category;
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalDesc').textContent = desc;

  // Stock Badge
  const stockBadge = document.getElementById('modalStockBadge');
  stockBadge.className = `product-stock-badge ${isOutOfStock ? 'out-stock' : 'in-stock'}`;
  stockBadge.textContent = isOutOfStock ? i18n[state.lang].out_of_stock : i18n[state.lang].in_stock;

  // Pricing
  const pricingBox = document.getElementById('modalPricingBox');
  pricingBox.innerHTML = `
    ${hasDiscount ? `<span class="original-price-crossed" style="font-size: 1.15rem;">${product.price} ${currency}</span>` : ''}
    <span class="current-price" style="font-size: 1.8rem;">${product.final_price}</span>
    <span class="currency-symbol" style="font-size: 1.1rem;">${currency}</span>
    ${hasDiscount ? `<span class="product-discount-badge" style="position: static; font-size: 0.9rem;">-${product.discount_percent}%</span>` : ''}
  `;

  // Tags
  const tagsBox = document.getElementById('modalTagsBox');
  if (product.tags && product.tags.length > 0) {
    tagsBox.innerHTML = product.tags.map(t => `<span class="modal-tag">#${t}</span>`).join('');
  } else {
    tagsBox.innerHTML = '';
  }

  // Stepper initialization: show current cart quantity if already in cart, else 1
  const existingCartItem = state.cart.find(i => i.id === product.id);
  const qtyInput = document.getElementById('modalQtyInput');
  if (qtyInput) qtyInput.value = existingCartItem ? existingCartItem.qty : 1;

  // Add to cart button state
  const addBtn = document.getElementById('modalAddToCartBtn');
  if (isOutOfStock) {
    addBtn.disabled = true;
    addBtn.textContent = i18n[state.lang].out_of_stock;
  } else {
    addBtn.disabled = false;
    addBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      <span>${i18n[state.lang].add_to_cart}</span>
    `;
  }

  renderModalGallery();
  modal.classList.add('open');
}

function renderModalGallery() {
  const product = state.modalProduct;
  if (!product) return;

  const images = product.image_paths || ['assets/images/landing/offers/offer1.jpg'];
  const currentSrc = images[state.modalImgIndex] || images[0];

  const mainImg = document.getElementById('modalMainImg');
  if (mainImg) {
    mainImg.src = currentSrc;
    mainImg.alt = product.name_ar;
  }

  const thumbsContainer = document.getElementById('modalThumbsRow');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = images.map((src, idx) => `
      <div class="gallery-thumb-item ${idx === state.modalImgIndex ? 'active' : ''}" 
           onclick="setModalImageIndex(${idx})">
        <img src="${src}" alt="Thumb ${idx + 1}" onerror="this.src='assets/images/landing/offers/offer1.jpg'">
      </div>
    `).join('');
  }
}

function setModalImageIndex(idx) {
  state.modalImgIndex = idx;
  renderModalGallery();
}

function nextModalImage() {
  const images = state.modalProduct?.image_paths || [];
  if (images.length <= 1) return;
  state.modalImgIndex = (state.modalImgIndex + 1) % images.length;
  renderModalGallery();
}

function prevModalImage() {
  const images = state.modalProduct?.image_paths || [];
  if (images.length <= 1) return;
  state.modalImgIndex = (state.modalImgIndex - 1 + images.length) % images.length;
  renderModalGallery();
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('open');
  state.modalProduct = null;
}

/**
 * Shopping Cart Management
 * Persisted locally in localStorage
 */
function addToCart(productId, quantity = 1) {
  const product = (state.storeData?.Products || []).find(p => p.id === productId);
  if (!product) return;

  const existingIndex = state.cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    state.cart[existingIndex].qty += quantity;
  } else {
    state.cart.push({
      id: productId,
      product: {
        id: product.id,
        name_ar: product.name_ar,
        name_en: product.name_en,
        price: product.price,
        discount_percent: product.discount_percent,
        final_price: product.final_price,
        image: product.image_paths[0] || 'assets/images/landing/offers/offer1.jpg'
      },
      qty: quantity
    });
  }

  saveCart();
  renderCart();
  showToast(i18n[state.lang].item_added, 'success');
}

function updateCartQty(productId, delta) {
  const index = state.cart.findIndex(i => i.id === productId);
  if (index === -1) {
    if (delta > 0) {
      addToCart(productId, delta);
    }
    return;
  }

  state.cart[index].qty += delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
    showToast(i18n[state.lang].item_removed, 'error');
  }

  saveCart();
  renderCart();
  renderCheckoutSummary();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
  renderCheckoutSummary();
  showToast(i18n[state.lang].item_removed, 'error');
}

function saveCart() {
  localStorage.setItem('qetaf_cart', JSON.stringify(state.cart));
}

function renderCart() {
  const countBadge = document.getElementById('cartBadgeCount');
  const itemsContainer = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const currency = i18n[state.lang].currency;

  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = state.cart.reduce((sum, item) => sum + (item.product.final_price * item.qty), 0);

  if (countBadge) {
    countBadge.textContent = totalCount;
  }

  if (subtotalEl) {
    subtotalEl.textContent = `${totalAmount} ${currency}`;
  }

  // Keep all product card buttons (+ / - steppers) 100% synchronized
  updateAllProductCardButtons();

  if (!itemsContainer) return;

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <p style="font-weight: 800; font-size: 1.15rem; color: var(--headline-color);">${i18n[state.lang].cart_empty}</p>
        <p style="margin-top: 0.3rem;">${i18n[state.lang].cart_empty_sub}</p>
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="closeCartDrawer(); window.location.hash='#products';">
          ${i18n[state.lang].browse_products}
        </button>
      </div>
    `;
    const checkoutBtn = document.getElementById('cartDrawerCheckoutBtn');
    if (checkoutBtn) checkoutBtn.classList.add('disabled');
    return;
  }

  const checkoutBtn = document.getElementById('cartDrawerCheckoutBtn');
  if (checkoutBtn) checkoutBtn.classList.remove('disabled');

  itemsContainer.innerHTML = state.cart.map(item => {
    const p = item.product;
    const name = state.lang === 'ar' ? p.name_ar : (p.name_en || p.name_ar);

    return `
      <div class="cart-item-card">
        <img src="${p.image}" alt="${name}" class="cart-item-thumb" onerror="this.src='assets/images/landing/offers/offer1.jpg'">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${name}</h4>
          <div class="cart-item-price">${p.final_price} ${currency}</div>
          <div class="cart-item-stepper">
            <button class="cart-stepper-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
            <span class="cart-stepper-val">${item.qty}</span>
            <button class="cart-stepper-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="${state.lang === 'ar' ? 'حذف' : 'Remove'}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `;
  }).join('');
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawerOverlay');
  if (drawer) drawer.classList.add('open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawerOverlay');
  if (drawer) drawer.classList.remove('open');
}

/**
 * Checkout Summary & Customer Prefill
 */
function renderCheckoutSummary() {
  const list = document.getElementById('checkoutSummaryList');
  const subtotalEl = document.getElementById('checkoutSummarySubtotal');
  const totalEl = document.getElementById('checkoutSummaryTotal');
  const currency = i18n[state.lang].currency;

  if (!list) return;

  const totalAmount = state.cart.reduce((sum, item) => sum + (item.product.final_price * item.qty), 0);

  if (subtotalEl) subtotalEl.textContent = `${totalAmount} ${currency}`;
  if (totalEl) totalEl.textContent = `${totalAmount} ${currency}`;

  list.innerHTML = state.cart.map(item => {
    const name = state.lang === 'ar' ? item.product.name_ar : (item.product.name_en || item.product.name_ar);
    return `
      <div class="summary-row">
        <span>${name} × ${item.qty}</span>
        <span style="font-weight: 700;">${item.product.final_price * item.qty} ${currency}</span>
      </div>
    `;
  }).join('');
}

/**
 * Delivery Coverage Notice (From Excel Settings)
 * "التوصيل حاليا متاح فقط في مدينة الشروق و مدينتي و بدر و المدن المحيطة"
 */
function renderDeliveryCoverageNotice() {
  const noticeContainer = document.getElementById('checkoutDeliveryNotice');
  const noticeTextEl = document.getElementById('deliveryNoticeContent');
  if (!noticeContainer || !noticeTextEl || !state.storeData) return;

  const settings = state.storeData.Settings || {};
  const noticeSetting = settings.delivery_coverage_notice || {};
  const text = state.lang === 'ar' 
    ? (noticeSetting.value_ar || "التوصيل حاليا متاح فقط في مدينة الشروق و مدينتي و بدر و المدن المحيطة") 
    : (noticeSetting.value_en || noticeSetting.value_ar || "Delivery is currently available only in El Shorouk, Madinaty, Badr, and surrounding areas");

  if (text && text.trim().length > 0) {
    noticeTextEl.textContent = text.trim();
    noticeContainer.classList.remove('hidden');
  } else {
    noticeContainer.classList.add('hidden');
  }
}

/**
 * Prefills the customer form from localStorage
 * Prompt: "I want to store the data of the buyer and his shopping cart locally on the device until he completes the purchase then we clear the cart only and not the data."
 */
function prefillCustomerForm() {
  const c = state.customer || {};
  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  };

  setField('checkoutName', c.name);
  setField('checkoutPhone', c.phone);
  setField('checkoutCity', c.city);
  setField('checkoutStreet', c.street);
  setField('checkoutBuilding', c.building);
  setField('checkoutApt', c.apt);
  setField('checkoutLandmark', c.landmark);
  setField('checkoutNotes', c.notes);
}

function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast(i18n[state.lang].cart_empty, 'error');
    return;
  }
  closeCartDrawer();
  renderCheckoutSummary();
  prefillCustomerForm();
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('open');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('open');
}

/**
 * Handle Order Submission
 * Requirements:
 * 1. Store customer info in localStorage (persist across orders).
 * 2. Clear the cart ONLY.
 * 3. Send email to buyer (if provided) and store owner via EmailJS.
 * 4. Show success message (Order Complete, we will contact you soon).
 * 5. Direct WhatsApp order option.
 */
async function handleCheckoutSubmit(e) {
  if (e) e.preventDefault();

  if (state.cart.length === 0) {
    showToast(i18n[state.lang].cart_empty, 'error');
    return;
  }

  // Get values
  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const city = document.getElementById('checkoutCity').value.trim();
  const street = document.getElementById('checkoutStreet').value.trim();
  const building = document.getElementById('checkoutBuilding').value.trim();
  const apt = document.getElementById('checkoutApt') ? document.getElementById('checkoutApt').value.trim() : '';
  const landmark = document.getElementById('checkoutLandmark') ? document.getElementById('checkoutLandmark').value.trim() : '';
  const notes = document.getElementById('checkoutNotes') ? document.getElementById('checkoutNotes').value.trim() : '';

  // Basic validation for required fields
  if (!name || !phone || !city || !street || !building) {
    alert(state.lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، المدينة / المنطقة، الشارع، المبنى)' : 'Please fill all required fields');
    return;
  }

  // 1. Save customer details to localStorage (PERSISTS)
  const customerData = {
    name, phone, city, street, building, apt, landmark, notes
  };
  state.customer = customerData;
  localStorage.setItem('qetaf_customer', JSON.stringify(customerData));

  // Snapshot current cart for order receipt before clearing
  const orderCart = [...state.cart];
  const orderId = 'QETAF-' + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = orderCart.reduce((sum, item) => sum + (item.product.final_price * item.qty), 0);
  const currency = i18n[state.lang].currency;

  // 2. Clear CART ONLY from localStorage
  state.cart = [];
  saveCart();
  renderCart();

  // Close checkout modal
  closeCheckoutModal();

  // 3. Attempt EmailJS notification
  sendOrderEmails({
    orderId,
    customer: customerData,
    items: orderCart,
    total: totalAmount,
    currency
  });

  // 4. Open Success Modal
  showOrderSuccessModal(orderId, customerData, orderCart, totalAmount);
}

/**
 * Static Site Email Dispatcher (EmailJS)
 * Orders are sent directly to the store owner ONLY.
 * The store owner then contacts the buyer directly on the phone number provided.
 */
function sendOrderEmails(orderPayload) {
  const settings = state.storeData?.Settings || {};
  const serviceId = settings.emailjs_service_id?.value_ar || 'service_qetaf';
  const sellerTemplate = settings.emailjs_template_seller?.value_ar || 'template_seller';
  const publicKey = settings.emailjs_public_key?.value_ar || '';
  const sellerEmail = settings.email?.value_ar || 'info@qetafhoney.com';

  // Format order items for email body
  const itemsText = orderPayload.items.map(i => 
    `- ${i.product.name_ar} (${i.product.name_en}) × ${i.qty} = ${i.product.final_price * i.qty} ${orderPayload.currency}`
  ).join('\n');

  const fullAddress = `${orderPayload.customer.city} - شارع ${orderPayload.customer.street} - مبنى ${orderPayload.customer.building}` +
    (orderPayload.customer.apt ? ` - شقة ${orderPayload.customer.apt}` : '') +
    (orderPayload.customer.landmark ? ` (علامة مميزة: ${orderPayload.customer.landmark})` : '');

  const templateParams = {
    order_id: orderPayload.orderId,
    customer_name: orderPayload.customer.name,
    customer_phone: orderPayload.customer.phone,
    customer_address: fullAddress,
    order_notes: orderPayload.customer.notes || 'لا توجد ملاحظات',
    order_items: itemsText,
    total_amount: `${orderPayload.total} ${orderPayload.currency}`,
    seller_email: sellerEmail
  };

  if (typeof emailjs !== 'undefined' && publicKey && publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(publicKey);

    // Send order notification email ONLY to store owner (Seller)
    emailjs.send(serviceId, sellerTemplate, templateParams)
      .then(res => console.log('Order notification email sent to seller:', res))
      .catch(err => console.warn('Order notification email to seller failed:', err));
  } else {
    console.info('EmailJS credentials are in setup/demo mode. See README.md to activate live EmailJS keys in Settings sheet.');
  }
}

/**
 * Order Success Modal
 */
function showOrderSuccessModal(orderId, customer, items, total) {
  const modal = document.getElementById('orderSuccessModal');
  const titleEl = document.getElementById('orderSuccessTitle');
  const msgEl = document.getElementById('orderSuccessMessage');
  const idEl = document.getElementById('orderSuccessId');

  if (idEl) idEl.textContent = `#${orderId}`;

  if (titleEl) {
    titleEl.textContent = getSetting('order_success_title', 'تم انشاء طلبك', 'Your Order Has Been Created');
  }

  if (msgEl) {
    msgEl.textContent = getSetting('order_success_subtitle', 'سيتم التواصل معك لتأكيد طلبك و البدء بعملية التوصيل', 'We will contact you to confirm your order and begin the delivery process');
  }

  if (modal) modal.classList.add('open');
}

function closeSuccessModal() {
  const modal = document.getElementById('orderSuccessModal');
  if (modal) modal.classList.remove('open');
  window.location.hash = '#products';
}

/**
 * Footer Renderer
 */
function renderFooter() {
  const settings = state.storeData?.Settings || {};

  const phone = settings.phone?.value_ar || '+20 100 123 4567';
  const whatsapp = settings.whatsapp?.value_ar || '201001234567';
  const email = settings.email?.value_ar || 'info@qetafhoney.com';
  const address = state.lang === 'ar' ? (settings.address?.value_ar || 'جمهورية مصر العربية') : (settings.address?.value_en || 'Egypt');
  const fbUrl = settings.facebook_url?.value_ar || '#';
  const igUrl = settings.instagram_url?.value_ar || '#';

  const phoneEl = document.getElementById('footerPhone');
  const emailEl = document.getElementById('footerEmail');
  const addressEl = document.getElementById('footerAddress');
  const fbEl = document.getElementById('footerFb');
  const igEl = document.getElementById('footerIg');
  const waEl = document.getElementById('footerWa');

  if (phoneEl) phoneEl.textContent = phone;
  if (emailEl) emailEl.textContent = email;
  if (addressEl) addressEl.textContent = address;
  if (fbEl) fbEl.href = fbUrl;
  if (igEl) igEl.href = igUrl;
  if (waEl) waEl.href = `https://wa.me/${whatsapp}`;
}

/**
 * Routing & Navigation (Hash based for GitHub Pages compatibility)
 */
function setupRouting() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.toLowerCase().replace('#', '') || 'landing';

  // Available views: landing, products, about, checkout
  let targetView = 'landing';
  if (hash.includes('product')) targetView = 'products';
  else if (hash.includes('about')) targetView = 'about';
  else if (hash.includes('checkout')) {
    targetView = 'products';
    openCheckoutModal();
  }

  state.currentView = targetView;

  // Show active view
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSec = document.getElementById(`view-${targetView}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Update nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(targetView) || (targetView === 'landing' && href === '#landing')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleOfferLink(url) {
  if (url.startsWith('#')) {
    window.location.hash = url;
  } else {
    window.location.href = url;
  }
}

/**
 * Event Listeners Setup
 */
function setupEventListeners() {
  // Language Switcher
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = state.lang === 'ar' ? 'en' : 'ar';
      setupLanguage(nextLang, true);
    });
  }

  // Mobile Menu Drawer
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileClose = document.getElementById('mobileNavClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
  }
  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  }
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => mobileDrawer?.classList.remove('open'));
  });

  // Cart Drawer
  const cartBtn = document.getElementById('headerCartBtn');
  const cartClose = document.getElementById('cartDrawerClose');
  const cartOverlay = document.getElementById('cartDrawerOverlay');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCartDrawer();
    });
  }

  // Checkout Modal
  const checkoutBtn = document.getElementById('cartDrawerCheckoutBtn');
  const checkoutClose = document.getElementById('checkoutModalClose');
  const checkoutOverlay = document.getElementById('checkoutModal');
  const checkoutForm = document.getElementById('checkoutForm');

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckoutModal);
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) closeCheckoutModal();
    });
  }
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Product Modal
  const modalClose = document.getElementById('productModalClose');
  const productModalOverlay = document.getElementById('productModal');
  const modalPrev = document.getElementById('modalGalleryPrev');
  const modalNext = document.getElementById('modalGalleryNext');

  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  if (productModalOverlay) {
    productModalOverlay.addEventListener('click', (e) => {
      if (e.target === productModalOverlay) closeProductModal();
    });
  }
  if (modalPrev) modalPrev.addEventListener('click', prevModalImage);
  if (modalNext) modalNext.addEventListener('click', nextModalImage);

  // Modal Stepper
  const modalMinus = document.getElementById('modalQtyMinus');
  const modalPlus = document.getElementById('modalQtyPlus');
  const modalQtyInput = document.getElementById('modalQtyInput');
  const modalAddBtn = document.getElementById('modalAddToCartBtn');

  if (modalMinus && modalQtyInput) {
    modalMinus.addEventListener('click', () => {
      let val = parseInt(modalQtyInput.value) || 1;
      if (val > 1) modalQtyInput.value = val - 1;
    });
  }
  if (modalPlus && modalQtyInput) {
    modalPlus.addEventListener('click', () => {
      let val = parseInt(modalQtyInput.value) || 1;
      modalQtyInput.value = val + 1;
    });
  }
  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (state.modalProduct) {
        const qty = parseInt(modalQtyInput?.value) || 1;
        addToCart(state.modalProduct.id, qty);
        closeProductModal();
      }
    });
  }

  // Hero Slider Arrows & Touch Gestures
  const heroPrev = document.getElementById('heroPrevBtn');
  const heroNext = document.getElementById('heroNextBtn');
  if (heroPrev) heroPrev.addEventListener('click', () => { prevHeroSlide(); resetHeroAutoplay(); });
  if (heroNext) heroNext.addEventListener('click', () => { nextHeroSlide(); resetHeroAutoplay(); });

  // Touch Swipe on Hero Slider
  const sliderBox = document.getElementById('heroSliderBox');
  if (sliderBox) {
    let startX = 0;
    let endX = 0;

    sliderBox.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderBox.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        const isRTL = state.lang === 'ar';
        if (diff > 0) {
          // Swiped Right
          isRTL ? nextHeroSlide() : prevHeroSlide();
        } else {
          // Swiped Left
          isRTL ? prevHeroSlide() : nextHeroSlide();
        }
        resetHeroAutoplay();
      }
    }
  }

  // Search Input & Sort Select
  const searchInput = document.getElementById('productSearchInput');
  const sortSelect = document.getElementById('productSortSelect');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Announcement Banner Close
  const bannerClose = document.getElementById('announcementCloseBtn');
  if (bannerClose) {
    bannerClose.addEventListener('click', () => {
      document.getElementById('announcementBanner')?.classList.add('hidden');
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('active');
    });
  });

  // Success Modal Close
  const successClose = document.getElementById('orderSuccessCloseBtn');
  const successBack = document.getElementById('orderSuccessBackBtn');
  if (successClose) successClose.addEventListener('click', closeSuccessModal);
  if (successBack) successBack.addEventListener('click', closeSuccessModal);
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'normal') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `<span>🍯</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
