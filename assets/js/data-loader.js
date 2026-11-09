/**
 * Qetaf Honey - Data Loader Engine
 * Reads data/products.xlsx using SheetJS (XLSX) in the browser.
 * Falls back to data/products.json or embedded data when running under file:// CORS restrictions.
 */

const DataLoader = (() => {
  // Embedded fallback data in case of offline/CORS issues
  const fallbackStoreData = {
    Products: [
      {
        id: "P001",
        name_ar: "عسل سدر كشميري جبلي فاخر",
        name_en: "Premium Kashmiri Mountain Sidr Honey",
        price: 450,
        discount_percent: 20,
        stock_status: "In Stock",
        image_paths: "assets/images/products/sidr-kashmiri/1.jpg, assets/images/products/sidr-kashmiri/2.jpg, assets/images/products/sidr-kashmiri/3.jpg",
        category_ar: "عسل سدر",
        category_en: "Sidr Honey",
        tags: "سدر, جبلي, فاخر, مناعة",
        description_ar: "عسل سدر كشميري نقي 100% مستخلص من زهور شجرة السدر البرية في الجبال العالية. يتميز بلونه الذهبي الداكن وقوامه الكثيف ونكهته العطرية المميزة.",
        description_en: "100% pure Kashmiri Sidr honey harvested from wild Sidr trees in high altitude mountains. Features a rich amber color and dense texture.",
        featured: "Yes"
      },
      {
        id: "P002",
        name_ar: "عسل حبة البركة النقي",
        name_en: "Pure Black Seed Honey",
        price: 320,
        discount_percent: 15,
        stock_status: "In Stock",
        image_paths: "assets/images/products/black-seed/1.jpg, assets/images/products/black-seed/2.jpg, assets/images/products/black-seed/3.jpg",
        category_ar: "عسل أعشاب",
        category_en: "Herbal Honey",
        tags: "حبة البركة, تنفس, مناعة, طاقة",
        description_ar: "عسل نحل طبيعي يتغذى نحله على رحيق زهور الحبة السوداء المباركة. ذو نكهة قوية وفوائد علاجية فائقة للصحة العامة والتنفس.",
        description_en: "Natural raw honey gathered from blossoms of the blessed Nigella Sativa plant. Renowned for its bold earthy taste and wellness benefits.",
        featured: "Yes"
      },
      {
        id: "P003",
        name_ar: "عسل الزهور الجبلية البرية",
        name_en: "Wild Mountain Floral Honey",
        price: 280,
        discount_percent: 0,
        stock_status: "In Stock",
        image_paths: "assets/images/products/mountain-wild/1.jpg, assets/images/products/mountain-wild/2.jpg, assets/images/products/mountain-wild/3.jpg",
        category_ar: "عسل زهور",
        category_en: "Floral Honey",
        tags: "زهور, جبلية, طبيعي, مائدة",
        description_ar: "عسل بري متميز تم جنيه من رحيق أزهار برية متنوعة في الوديان الجبلية النقية. خفيف المذاق وغني بالمعادن والفيتامينات.",
        description_en: "Delicate raw wildflower honey collected from diverse blossoms in untouched mountain valleys. Mild and loaded with enzymes.",
        featured: "No"
      },
      {
        id: "P004",
        name_ar: "عسل زهور الموالح المنعش",
        name_en: "Fresh Citrus Blossom Honey",
        price: 240,
        discount_percent: 10,
        stock_status: "In Stock",
        image_paths: "assets/images/products/citrus-blossom/1.jpg, assets/images/products/citrus-blossom/2.jpg, assets/images/products/citrus-blossom/3.jpg",
        category_ar: "عسل زهور",
        category_en: "Floral Honey",
        tags: "موالح, برتقال, أطفال, فيتامين سي",
        description_ar: "مستخلص من بساتين البرتقال والليمون العطرة. يتميز بلونه الذهبي الفاتح ونكهة الحمضيات المنعشة وغناه بفيتامين ج.",
        description_en: "Harvested from fragrant orange and lemon groves. Features a light golden hue, refreshing delicate citrus notes, and natural Vitamin C.",
        featured: "Yes"
      },
      {
        id: "P005",
        name_ar: "عسل برسيم طبيعي بلدي",
        name_en: "Pure Natural Clover Honey",
        price: 190,
        discount_percent: 0,
        stock_status: "In Stock",
        image_paths: "assets/images/products/clover-honey/1.jpg, assets/images/products/clover-honey/2.jpg, assets/images/products/clover-honey/3.jpg",
        category_ar: "عسل زهور",
        category_en: "Floral Honey",
        tags: "برسيم, بلدي, يومي, اقتصادي",
        description_ar: "عسل برسيم نقي من أراضي الدلتا الخصبة، عسل يومي ممتاز خفيف ولطيف على المعدة ومثالي كبديل صحي وطبيعي للسكر الأبيض.",
        description_en: "Authentic pure Egyptian clover honey from fertile pastoral fields. Sweet, gentle on digestion, and an ideal natural daily sweetener.",
        featured: "No"
      },
      {
        id: "P006",
        name_ar: "معجون عسل العكبر الطبيعي (البروبوليس)",
        name_en: "Raw Propolis Honey Paste",
        price: 390,
        discount_percent: 25,
        stock_status: "In Stock",
        image_paths: "assets/images/products/propolis-honey/1.jpg, assets/images/products/propolis-honey/2.jpg, assets/images/products/propolis-honey/3.jpg",
        category_ar: "منتجات الخلية",
        category_en: "Bee Products",
        tags: "عكبر, بروبوليس, مضاد حيوي, حماية",
        description_ar: "مزيج علاجي مركز يجمع بين عسل السدر الطبيعي وصمغ العكبر النقي (البروبوليس). يعد أقوى مضاد حيوي طبيعي لتعزيز المناعة.",
        description_en: "A therapeutic formulation blending pure raw honey with concentrated natural bee propolis. Acts as a potent natural defense.",
        featured: "Yes"
      },
      {
        id: "P007",
        name_ar: "خلطة الطاقة الملكية (غذاء ملكات + لقاح)",
        name_en: "Royal Energy Blend (Royal Jelly & Pollen)",
        price: 480,
        discount_percent: 0,
        stock_status: "In Stock",
        image_paths: "assets/images/products/royal-jelly-blend/1.jpg, assets/images/products/royal-jelly-blend/2.jpg, assets/images/products/royal-jelly-blend/3.jpg",
        category_ar: "منتجات الخلية",
        category_en: "Bee Products",
        tags: "غذاء ملكات, حبوب لقاح, نشاط, خصوبة",
        description_ar: "إكسير الحيوية والنشاط! خلطة حصرية تتكون من عسل السدر الصافي مع غذاء الملكات الطازج وحبوب لقاح النحل. تمد الجسم بنشاط فوري.",
        description_en: "An exquisite tonic blend of raw honey, fresh royal jelly, multi-flower bee pollen, and propolis. Provides sustained mental clarity and stamina.",
        featured: "Yes"
      },
      {
        id: "P008",
        name_ar: "بوكس إهداء قطاف الفاخر (3 عبوات مختارة)",
        name_en: "Qetaf Luxury Trio Gift Box",
        price: 750,
        discount_percent: 15,
        stock_status: "Out of Stock",
        image_paths: "assets/images/products/gift-box-trio/1.jpg, assets/images/products/gift-box-trio/2.jpg, assets/images/products/gift-box-trio/3.jpg",
        category_ar: "بكجات وهدايا",
        category_en: "Gift Bundles",
        tags: "هدية, بوكس, ثلاثي, فخامة",
        description_ar: "صندوق خشبي فاخر للإهداء يحتوي على 3 عبوات سعة 500 جرام (عسل سدر كشميري + عسل حبة البركة + عسل زهور برية) مع ملعقة عسل خشبية أصلية.",
        description_en: "An elegant handcrafted gift box containing three 500g premium honey jars accompanied by a classic wooden honey dipper.",
        featured: "No"
      }
    ],
    HeroOffers: [
      {
        id: "HERO1",
        title_ar: "أجود أنواع عسل النحل الطبيعي 100%",
        title_en: "100% Pure & Raw Natural Honey",
        subtitle_ar: "مستخلص من أفضل المناحل البرية النقية، مفحوص مخبرياً ومضمون بالجودة الذهبية",
        subtitle_en: "Harvested from certified pristine apiaries, lab tested with a golden purity guarantee",
        badge_ar: "طبيعي 100%",
        badge_en: "100% Pure",
        button_text_ar: "تصفح المنتجات",
        button_text_en: "Shop Products",
        link_url: "#products",
        image_path: "assets/images/landing/hero/hero1.jpg",
        active: "Yes"
      },
      {
        id: "HERO2",
        title_ar: "عروض موسم جني العسل الحصرية",
        title_en: "Exclusive Harvest Season Deals",
        subtitle_ar: "وفر حتى 25% على باقات عسل السدر الكشميري والخلطات الملكية الخاصة",
        subtitle_en: "Save up to 25% on premium Sidr honey and bespoke royal jelly collections",
        badge_ar: "خصم خاص",
        badge_en: "Special Deal",
        button_text_ar: "استكشف العروض",
        button_text_en: "Explore Offers",
        link_url: "#products",
        image_path: "assets/images/landing/hero/hero2.jpg",
        active: "Yes"
      },
      {
        id: "HERO3",
        title_ar: "باقة المناعة والوقاية اليومية",
        title_en: "Daily Immunity & Wellness Pack",
        subtitle_ar: "مزيج العكبر النقي والغذاء الملكي لتعزيز صحتك وصحة أسرتك في كل فصول السنة",
        subtitle_en: "The ultimate synergy of royal jelly, propolis, and raw mountain honey",
        badge_ar: "الأكثر طلباً",
        badge_en: "Best Seller",
        button_text_ar: "اطلب باقتك الآن",
        button_text_en: "Order Now",
        link_url: "#products",
        image_path: "assets/images/landing/hero/hero3.jpg",
        active: "Yes"
      }
    ],
    SmallOffers: [
      {
        id: "CARD_ALL",
        is_all_products_btn: "Yes",
        title_ar: "جميع المنتجات والتشكيلات",
        title_en: "All Products & Collections",
        subtitle_ar: "تصفح تشكيلة قطاف الكاملة من العسل الطبيعي ومنتجات الخلية الفاخرة",
        subtitle_en: "Explore our complete range of raw honeys and hive treasures",
        badge_ar: "تسوّق الآن",
        badge_en: "Shop Now",
        button_text_ar: "عرض كل المنتجات",
        button_text_en: "View All Products",
        image_path: "assets/images/landing/offers/offer1.jpg",
        link_url: "#products",
        active: "Yes"
      },
      {
        id: "OFFER_SIDR",
        is_all_products_btn: "No",
        title_ar: "عرض عسل السدر الكشميري",
        title_en: "Kashmiri Sidr Special",
        subtitle_ar: "خصم 20% لفترة محدودة على الكيلو والنصف كيلو",
        subtitle_en: "20% discount on 1kg and 500g jars for a limited time",
        badge_ar: "خصم 20%",
        badge_en: "20% Off",
        button_text_ar: "اطلب السدر الآن",
        button_text_en: "Get Deal",
        image_path: "assets/images/landing/offers/offer1.jpg",
        link_url: "#products",
        active: "Yes"
      },
      {
        id: "OFFER_TRIO",
        is_all_products_btn: "No",
        title_ar: "باقة التوفير الثلاثية",
        title_en: "Trio Value Honey Bundle",
        subtitle_ar: "ثلاث عبوات مختلفة تلبي احتياجات الأسرة مع شحن مخفض",
        subtitle_en: "Three distinct jars suited for the whole family",
        badge_ar: "توفير عائلي",
        badge_en: "Family Saver",
        button_text_ar: "تفاصيل العرض",
        button_text_en: "View Bundle",
        image_path: "assets/images/landing/offers/offer2.jpg",
        link_url: "#products",
        active: "Yes"
      },
      {
        id: "OFFER_HEALTH",
        is_all_products_btn: "No",
        title_ar: "إطلاق منتجات العكبر والغذاء الملكي",
        title_en: "Propolis & Royal Jelly Launch",
        subtitle_ar: "منتجات جديدة نقية 100% غنية بالعناصر الحيوية والنشاط",
        subtitle_en: "New arrival of 100% pure royal hive extracts",
        badge_ar: "وصل حديثاً",
        badge_en: "New Arrival",
        button_text_ar: "اكتشف المزيد",
        button_text_en: "Discover",
        image_path: "assets/images/landing/offers/offer3.jpg",
        link_url: "#products",
        active: "Yes"
      }
    ],
    Settings: {
      "announcement_text": {
            "value_ar": "الحق عروض الجمعة البيضاء. خصومات على جميع المنتجات تصل الى 25%",
            "value_en": "White Friday Sale. 25% off all products",
            "description": "Banner text at top of site. Leave empty if you don't want to display it."
      },
      "store_name": {
            "value_ar": "عسل قطاف | Qetaf Honey",
            "value_en": "Qetaf Honey",
            "description": "Store brand name"
      },
      "tagline": {
            "value_ar": "نقاء الطبيعة.. من المناحل إلى مائدتكم مباشرة",
            "value_en": "Nature's Purest Harvest Straight to Your Table",
            "description": "Store tagline"
      },
      "phone": {
            "value_ar": "",
            "value_en": "",
            "description": "Contact phone number"
      },
      "whatsapp": {
            "value_ar": "",
            "value_en": "",
            "description": "WhatsApp number without + or spaces for direct chat/ordering"
      },
      "email": {
            "value_ar": "qetafhoneyeg@gmail.com",
            "value_en": "qetafhoneyeg@gmail.com",
            "description": "Store owner email address for orders and inquiries"
      },
      "address": {
            "value_ar": "جمهورية مصر العربية - القاهرة - مدينة الشروق",
            "value_en": "Egypt - Cairo - El-Shorouk City",
            "description": "Physical address or delivery coverage"
      },
      "working_hours": {
            "value_ar": "يومياً من 10 صباحاً حتى 10 مساءً",
            "value_en": "Daily from 10:00 AM to 10:00 PM",
            "description": "Working hours"
      },
      "facebook_url": {
            "value_ar": "https://facebook.com/qetaf.honey",
            "value_en": "https://facebook.com/qetaf.honey",
            "description": "Facebook page URL"
      },
      "instagram_url": {
            "value_ar": "",
            "value_en": "",
            "description": "Instagram page URL"
      },
      "delivery_coverage_notice": {
            "value_ar": "التوصيل حاليا متاح فقط في مدينة الشروق ومدينتي والرحاب وبدر والعبور والمدن المحيطة",
            "value_en": "Delivery is currently available only in El Shorouk, Madinaty, Rehab CIty, Badr, Obour city, and surrounding areas",
            "description": "تنبيه نطاق التوصيل في صفحة إتمام الطلب"
      },
      "order_success_title": {
            "value_ar": "تم انشاء طلبك",
            "value_en": "Your Order Has Been Created",
            "description": "العنوان الكبير لرسالة نجاح إتمام الطلب"
      },
      "order_success_subtitle": {
            "value_ar": "سيتم التواصل معك لتأكيد طلبك و البدء بعملية التوصيل",
            "value_en": "We will contact you to confirm your order and begin the delivery process",
            "description": "النص التوضيحي لرسالة نجاح إتمام الطلب"
      },
      "offers_section_title": {
            "value_ar": "عروض وخصومات مميزة",
            "value_en": "Exclusive Offers & Deals",
            "description": "عنوان قسم العروض في الصفحة الرئيسية"
      },
      "offers_section_subtitle": {
            "value_ar": "تشكيلة من أفضل العروض الحصرية",
            "value_en": "A curated selection of exclusive offers",
            "description": "النص الوصفي تحت عنوان قسم العروض"
      },
      "products_section_title": {
            "value_ar": "المنتجات",
            "value_en": "Our Products",
            "description": "عنوان صفحة/قسم المنتجات"
      },
      "products_section_subtitle": {
            "value_ar": "استكشف باقتنا المتنوعة من الأعسال الطبيعية النادرة ومنتجات الخلية الملكية",
            "value_en": "Explore our diverse range of raw honeys and royal hive treasures",
            "description": "النص الوصفي تحت عنوان قسم المنتجات"
      },
      "about_hero_title": {
            "value_ar": "قصتنا في عسل قطاف",
            "value_en": "Our Story at Qetaf Honey",
            "description": "عنوان صفحة من نحن"
      },
      "about_hero_subtitle": {
            "value_ar": "رحلة من الشغف بنقاء الطبيعة.",
            "value_en": "A passionate journey to preserve nature's golden gift.",
            "description": "الوصف التمهيدي لصفحة من نحن"
      },
      "about_p1": {
            "value_ar": "في قطاف، بدأنا رحلتنا من إيمان راسخ بأن العسل الطبيعي ليس مجرد غذاء بل هو شفاء وطاقة حيوية نقية.",
            "value_en": "At Qetaf Honey, our passion was sparked by the understanding that pure raw honey is more than food—it is living wellness and holistic vitality.",
            "description": "الفقرة الأولى في قصة من نحن"
      },
      "about_p2": {
            "value_ar": "نلتزم بأعلى معايير فرز وتعبئة العسل دون تسخين أو فلترة مفرطة لنحافظ على كامل الإنزيمات الحية، الفيتامينات، وفوائد حبوب اللقاح الطبيعية، ليصلكم من المنحل إلى مائدتكم بكامل قيمته الغذائية.",
            "value_en": "We adhere to uncompromised harvesting standards without excessive filtration or heat damage, preserving living enzymes, natural antioxidants, and precious flower pollens directly to your home.",
            "description": "الفقرة الثانية في قصة من نحن"
      },
      "values_section_title": {
            "value_ar": "قيمنا والتزامنا تجاهكم",
            "value_en": "Our Values & Commitment",
            "description": "عنوان قسم القيم والتعهدات"
      },
      "values_section_subtitle": {
            "value_ar": "المعايير التي نحرص عليها في كل قطرة عسل تصل إلى بيتك",
            "value_en": "The standards we uphold in every drop of honey delivered to your home",
            "description": "الوصف تحت عنوان قسم القيم"
      },
      "val_1_title": {
            "value_ar": "أمانة ومصداقية",
            "value_en": "Authentic Purity",
            "description": "عنوان القيمة 1"
      },
      "val_1_desc": {
            "value_ar": "نضمن نقاء كل قطرة عسل نقدمها.",
            "value_en": "Every single drop is certified pure.",
            "description": "وصف القيمة 1"
      },
      "val_2_title": {
            "value_ar": "إنتاج طبيعي مستدام",
            "value_en": "Sustainable Beekeeping",
            "description": "عنوان القيمة 2"
      },
      "val_2_desc": {
            "value_ar": "نتبع ممارسات تربية نحل رحيمة وصديقة للبيئة تضمن صحة النحل وتنوع المحاصيل.",
            "value_en": "We practice ethical, bee-first apiculture ensuring healthy colonies and thriving biodiversity.",
            "description": "وصف القيمة 2"
      },
      "val_3_title": {
            "value_ar": "تنوع وجودة استثنائية",
            "value_en": "Rare & Diverse Selection",
            "description": "عنوان القيمة 3"
      },
      "val_3_desc": {
            "value_ar": "نوفر لكم تشكيلة واسعة من الأعسال ومنتجات الخلية الملكية.",
            "value_en": "We offer a wide selection of premium honey and royal bee products.",
            "description": "وصف القيمة 3"
      },
      "val_4_title": {
            "value_ar": "ثقة ورضا عملائنا",
            "value_en": "Customer Trust & Satisfaction",
            "description": "عنوان القيمة 4"
      },
      "val_4_desc": {
            "value_ar": "مئات العملاء يثقون في قطاف كمصدرهم المعتمد للعسل الطبيعي.",
            "value_en": "Hundreds of families cherish Qetaf as their trusted natural wellness partner.",
            "description": "وصف القيمة 4"
      },
      "faq_section_title": {
            "value_ar": "الأسئلة الشائعة",
            "value_en": "Frequently Asked Questions",
            "description": "عنوان قسم الأسئلة الشائعة"
      },
      "faq_1_q": {
            "value_ar": "ما هو ضمان قطاف الذهبي؟",
            "value_en": "What is Qetaf Golden Guarantee?",
            "description": "السؤال الشائع 1"
      },
      "faq_1_a": {
            "value_ar": "ضمان قطاف الذهبي يضمن لك جودة و نقاء العسل المقدم اليك. في حالة عدم رضاك عن العسل نقوم بإسترجاعه و ارجاع كامل المبلغ لك.",
            "value_en": "Qitaf Golden Guarantee promises you 100% pure and premium quality honey. Not satisfied? Return it and get your money back in full.",
            "description": "إجابة السؤال 1"
      },
      "faq_2_q": {
            "value_ar": "هل العسل يتبلور؟ وهل التبلور دليل على الغش؟",
            "value_en": "Does raw honey crystallize? Is crystallization bad?",
            "description": "السؤال الشائع 2"
      },
      "faq_2_a": {
            "value_ar": "على العكس تماماً! التبلور (التجمد) هو خاصية فيزيائية طبيعية تحدث لبعض أنواع العسل الخام غير المبستر مثل عسل الموالح والبرسيم، وهو أكبر دليل على أن العسل طبيعي وحي ولم يتعرض لحرارة عالية تتلف فوائده.",
            "value_en": "Not at all! Crystallization is a natural physical hallmark of unpasteurized, enzyme-rich raw honey. It confirms that the honey was never overheated or artificially processed.",
            "description": "إجابة السؤال 2"
      },
      "faq_3_q": {
            "value_ar": "ما هي مدة التوصيل وتكلفة الشحن؟",
            "value_en": "What are your delivery times and shipping costs?",
            "description": "السؤال الشائع 3"
      },
      "faq_3_a": {
            "value_ar": "يستغرق التوصيل عادة من 48 إلى 72 ساعة داخل مدينة الشروق ومدينتي والرحاب وبدر ومدينة العبور والمدن المحيطة. و يتم حساب تكلفة الشحن حسب الموقع او يكون التوصيل مجاناً في بعض العروض.",
            "value_en": "Orders in El Shorouk, Madinaty, Rehab City, Badr, Obour City, and surrounding areas arrive within 48-72 hours. Shipping cost is calculated based on location or you get free shipping offers if available.",
            "description": "إجابة السؤال 3"
      },
      "footer_contact_heading": {
            "value_ar": "معلومات التواصل",
            "value_en": "Contact Info",
            "description": "عنوان عمود التواصل في الفوتر"
      },
      "footer_links_heading": {
            "value_ar": "روابط سريعة",
            "value_en": "Quick Links",
            "description": "عنوان عمود الروابط السريعة في الفوتر"
      },
      "footer_guarantee_title": {
            "value_ar": "ضمان قطاف الذهبي",
            "value_en": "Qetaf Golden Guarantee",
            "description": "عنوان الضمان في الفوتر"
      },
      "footer_guarantee_text": {
            "value_ar": "نضمن لك نقاء منتجاتنا بنسبة 100%.. إن لم ينل العسل رضاك، يمكنك استرجاعه واسترداد قيمته كاملة.",
            "value_en": "100% satisfaction guaranteed. If you are not delighted with your honey, return it for a complete hassle-free refund.",
            "description": "نص الضمان في الفوتر"
      },
      "copyright_text": {
            "value_ar": "جميع الحقوق محفوظة © عسل قطاف",
            "value_en": "All Rights Reserved © Qetaf Honey",
            "description": "نص حقوق الملكية أسفل الموقع"
      },
      "google_script_url": {
            "value_ar": "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
            "value_en": "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
            "description": "Google Apps Script Web App URL for orders logging and email notification"
      },
      "about_image_path": {
            "value_ar": "assets/images/about/about.jpg",
            "value_en": "assets/images/about/about.jpg",
            "description": "مسار صورة صفحة من نحن (مثال: assets/images/about/about.jpg)"
      },
      "footer_connect_heading": {
            "value_ar": "تواصل معنا",
            "value_en": "Connect With Us",
            "description": "عنوان قسم التواصل وروابط التواصل في الفوتر"
      }
    }
  };

  /**
   * Helper to parse sheet rows into array of objects using headers row
   */
  function sheetToObjects(sheet) {
    if (!sheet) return [];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return rows.filter(r => {
      const id = String(r.id || '').trim();
      const title = String(r.title_ar || r.name_ar || '').trim();
      const key = String(r.key || '').trim();
      return id.length > 0 || title.length > 0 || key.length > 0;
    });
  }

  /**
   * Helper to parse Settings sheet into key-value map
   */
  function parseSettingsSheet(sheet) {
    if (!sheet) return {};
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    const settings = {};
    rows.forEach(r => {
      const k = String(r.key || '').trim();
      if (k.length > 0) {
        settings[k] = {
          value_ar: String(r.value_ar !== undefined ? r.value_ar : "").trim(),
          value_en: String(r.value_en !== undefined ? r.value_en : "").trim(),
          description: String(r.description || "").trim()
        };
      }
    });
    return settings;
  }

  /**
   * Loads and parses products.xlsx via fetch & SheetJS
   */
  async function loadStoreData() {
    try {
      // Add a timestamp cache-buster so newly committed Excel sheets load immediately
      const excelUrl = `data/products.xlsx?t=${new Date().getTime()}`;
      const response = await fetch(excelUrl);
      if (!response.ok) {
        throw new Error(`HTTP error loading Excel: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      
      if (typeof XLSX === 'undefined') {
        throw new Error('SheetJS library (XLSX) is not loaded.');
      }

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const productsSheet = workbook.Sheets["Products"];
      const heroSheet = workbook.Sheets["HeroOffers"];
      const smallSheet = workbook.Sheets["SmallOffers"];
      const settingsSheet = workbook.Sheets["Settings"];

      const products = sheetToObjects(productsSheet);
      const heroOffers = sheetToObjects(heroSheet);
      const smallOffers = sheetToObjects(smallSheet);
      const settings = parseSettingsSheet(settingsSheet);

      // Clean & normalize products
      const normalizedProducts = products.map((p, idx) => {
        const rawPrice = parseFloat(p.price) || 0;
        const discountVal = parseFloat(p.discount_percent) || 0;
        const finalPrice = discountVal > 0 ? Math.round(rawPrice * (1 - discountVal / 100)) : rawPrice;
        
        let images = [];
        if (p.image_paths) {
          images = String(p.image_paths)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        }
        if (images.length === 0) {
          images = ['assets/images/landing/offers/offer1.jpg'];
        }

        return {
          id: p.id || `P${idx + 1}`,
          name_ar: p.name_ar || "",
          name_en: p.name_en || p.name_ar || "",
          price: rawPrice,
          discount_percent: discountVal,
          final_price: finalPrice,
          stock_status: (p.stock_status || "In Stock").trim(),
          image_paths: images,
          category_ar: p.category_ar || "عسل طبيعي",
          category_en: p.category_en || "Natural Honey",
          tags: p.tags ? String(p.tags).split(',').map(t => t.trim()).filter(Boolean) : [],
          description_ar: p.description_ar || "",
          description_en: p.description_en || p.description_ar || "",
          featured: String(p.featured || "").toLowerCase() === "yes"
        };
      });

      console.log('Successfully loaded store data from Excel sheet (data/products.xlsx)!');
      return {
        Products: normalizedProducts,
        HeroOffers: heroOffers,
        SmallOffers: smallOffers,
        Settings: settings,
        source: 'excel'
      };

    } catch (err) {
      console.warn('Could not load directly from data/products.xlsx (normal in local file:// view or before first commit). Falling back to JSON or embedded data.', err);
      
      // Try JSON mirror
      try {
        const jsonRes = await fetch(`data/products.json?t=${new Date().getTime()}`);
        if (jsonRes.ok) {
          const jsonData = await jsonRes.json();
          // Normalize products from JSON
          jsonData.Products = jsonData.Products.map((p, idx) => {
            const rawPrice = parseFloat(p.price) || 0;
            const discountVal = parseFloat(p.discount_percent) || 0;
            const finalPrice = discountVal > 0 ? Math.round(rawPrice * (1 - discountVal / 100)) : rawPrice;
            const images = p.image_paths ? String(p.image_paths).split(',').map(s => s.trim()).filter(Boolean) : ['assets/images/landing/offers/offer1.jpg'];
            return {
              ...p,
              price: rawPrice,
              discount_percent: discountVal,
              final_price: finalPrice,
              image_paths: images,
              tags: p.tags ? String(p.tags).split(',').map(t => t.trim()).filter(Boolean) : []
            };
          });
          jsonData.source = 'json';
          return jsonData;
        }
      } catch (jsonErr) {
        console.warn('JSON fallback also unavailable, using embedded store data.', jsonErr);
      }

      // Return default embedded fallback
      const embeddedProducts = fallbackStoreData.Products.map(p => {
        const rawPrice = p.price;
        const discountVal = p.discount_percent;
        const finalPrice = discountVal > 0 ? Math.round(rawPrice * (1 - discountVal / 100)) : rawPrice;
        return {
          ...p,
          price: rawPrice,
          discount_percent: discountVal,
          final_price: finalPrice,
          image_paths: p.image_paths.split(',').map(s => s.trim()),
          tags: p.tags.split(',').map(t => t.trim())
        };
      });

      return {
        ...fallbackStoreData,
        Products: embeddedProducts,
        source: 'embedded'
      };
    }
  }

  return {
    loadStoreData
  };
})();
