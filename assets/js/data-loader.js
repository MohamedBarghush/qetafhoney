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
      announcement_text: {
        value_ar: "عروض حصرية لفترة محدودة: شحن مجاني للطلبات بقيمة 500 ج فأكثر! 🍯",
        value_en: "Limited Time Offer: Free shipping on orders over 500 EGP! 🍯"
      },
      store_name: {
        value_ar: "قطاف العسل | Qetaf Honey",
        value_en: "Qetaf Honey"
      },
      tagline: {
        value_ar: "نقاء الطبيعة.. من المناحل إلى مائدتكم مباشرة",
        value_en: "Nature's Purest Harvest Straight to Your Table"
      },
      phone: {
        value_ar: "+20 100 123 4567",
        value_en: "+20 100 123 4567"
      },
      whatsapp: {
        value_ar: "201001234567",
        value_en: "201001234567"
      },
      email: {
        value_ar: "info@qetafhoney.com",
        value_en: "info@qetafhoney.com"
      },
      address: {
        value_ar: "جمهورية مصر العربية - متاح التوصيل لكافة المحافظات",
        value_en: "Egypt - Delivery available to all governorates"
      },
      working_hours: {
        value_ar: "يومياً من 9 صباحاً حتى 10 مساءً",
        value_en: "Daily from 9:00 AM to 10:00 PM"
      },
      facebook_url: {
        value_ar: "https://facebook.com/qetafhoney",
        value_en: "https://facebook.com/qetafhoney"
      },
      instagram_url: {
        value_ar: "https://instagram.com/qetafhoney",
        value_en: "https://instagram.com/qetafhoney"
      },
      emailjs_service_id: {
        value_ar: "service_qetaf",
        value_en: "service_qetaf"
      },
      emailjs_template_buyer: {
        value_ar: "template_buyer_order",
        value_en: "template_buyer_order"
      },
      emailjs_template_seller: {
        value_ar: "template_seller_order",
        value_en: "template_seller_order"
      },
      emailjs_public_key: {
        value_ar: "YOUR_PUBLIC_KEY",
        value_en: "YOUR_PUBLIC_KEY"
      }
    }
  };

  /**
   * Helper to parse sheet rows into array of objects using headers row
   */
  function sheetToObjects(sheet) {
    if (!sheet) return [];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  /**
   * Helper to parse Settings sheet into key-value map
   */
  function parseSettingsSheet(sheet) {
    if (!sheet) return {};
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    const settings = {};
    rows.forEach(r => {
      if (r.key) {
        settings[r.key] = {
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
