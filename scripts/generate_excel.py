import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import json
import os

wb = openpyxl.Workbook()
# Remove default sheet
wb.remove(wb.active)

# Styling helpers
header_fill = PatternFill(start_color="FDD768", end_color="FDD768", fill_type="solid")
header_font = Font(name="Segoe UI", size=11, bold=True, color="1A1A1A")
align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
thin_border = Border(
    left=Side(style='thin', color='E0E0E0'),
    right=Side(style='thin', color='E0E0E0'),
    top=Side(style='thin', color='E0E0E0'),
    bottom=Side(style='thin', color='E0E0E0')
)

# ----------------- SHEET 1: Products -----------------
ws_products = wb.create_sheet(title="Products")
product_headers = [
    "id", "name_ar", "name_en", "price", "discount_percent", 
    "stock_status", "image_paths", "category_ar", "category_en", 
    "tags", "description_ar", "description_en", "featured"
]
ws_products.append(product_headers)

products_data = [
    [
        "P001",
        "عسل سدر كشميري جبلي فاخر",
        "Premium Kashmiri Mountain Sidr Honey",
        450,
        20,
        "In Stock",
        "assets/images/products/sidr-kashmiri/1.jpg, assets/images/products/sidr-kashmiri/2.jpg, assets/images/products/sidr-kashmiri/3.jpg",
        "عسل سدر",
        "Sidr Honey",
        "سدر, جبلي, فاخر, مناعة",
        "عسل سدر كشميري نقي 100% مستخلص من زهور شجرة السدر البرية في الجبال العالية. يتميز بلونه الذهبي الداكن وقوامه الكثيف ونكهته العطرية المميزة. مثالي لتقوية جهاز المناعة وصحة الجهاز الهضمي.",
        "100% pure Kashmiri Sidr honey harvested from wild Sidr trees in high altitude mountains. Features a rich amber color, dense texture, and exquisite aromatic flavor. Exceptional for immune support and digestive vitality.",
        "Yes"
    ],
    [
        "P002",
        "عسل حبة البركة النقي",
        "Pure Black Seed Honey",
        320,
        15,
        "In Stock",
        "assets/images/products/black-seed/1.jpg, assets/images/products/black-seed/2.jpg, assets/images/products/black-seed/3.jpg",
        "عسل أعشاب",
        "Herbal Honey",
        "حبة البركة, تنفس, مناعة, طاقة",
        "عسل نحل طبيعي يتغذى نحله على رحيق زهور الحبة السوداء المباركة. ذو نكهة قوية وفوائد علاجية فائقة للصحة العامة والتنفس ومقاومة الإجهاد.",
        "Natural raw honey gathered from the delicate blossoms of the blessed Nigella Sativa (Black Seed) plant. Renowned for its bold earthy taste and remarkable wellness benefits.",
        "Yes"
    ],
    [
        "P003",
        "عسل الزهور الجبلية البرية",
        "Wild Mountain Floral Honey",
        280,
        0,
        "In Stock",
        "assets/images/products/mountain-wild/1.jpg, assets/images/products/mountain-wild/2.jpg, assets/images/products/mountain-wild/3.jpg",
        "عسل زهور",
        "Floral Honey",
        "زهور, جبلية, طبيعي, مائدة",
        "عسل بري متميز تم جنيه من رحيق أزهار برية متنوعة في الوديان والمناطق الجبلية النقية. خفيف المذاق وغني بالمعادن والفيتامينات الطبيعية ومثالي للإفطار والمشروبات.",
        "Delicate raw wildflower honey collected from diverse blossoms in untouched mountain valleys. Mild, naturally sweet, and loaded with essential floral enzymes.",
        "No"
    ],
    [
        "P004",
        "عسل زهور الموالح المنعش",
        "Fresh Citrus Blossom Honey",
        240,
        10,
        "In Stock",
        "assets/images/products/citrus-blossom/1.jpg, assets/images/products/citrus-blossom/2.jpg, assets/images/products/citrus-blossom/3.jpg",
        "عسل زهور",
        "Floral Honey",
        "موالح, برتقال, أطفال, فيتامين سي",
        "مستخلص من بساتين البرتقال والليمون العطرة. يتميز بلونه الذهبي الفاتح ونكهة الحمضيات المنعشة وغناه بفيتامين ج، محبوب جداً للأطفال وتهدئة الأعصاب.",
        "Harvested from fragrant orange and lemon groves. Features a light golden hue, refreshing delicate citrus notes, and natural Vitamin C. A favorite for breakfast and kids.",
        "Yes"
    ],
    [
        "P005",
        "عسل برسيم طبيعي بلدي",
        "Pure Natural Clover Honey",
        190,
        0,
        "In Stock",
        "assets/images/products/clover-honey/1.jpg, assets/images/products/clover-honey/2.jpg, assets/images/products/clover-honey/3.jpg",
        "عسل زهور",
        "Floral Honey",
        "برسيم, بلدي, يومي, اقتصادي",
        "عسل برسيم نقي من أراضي الدلتا الخصبة، عسل يومي ممتاز خفيف ولطيف على المعدة ومثالي كبديل صحي وطبيعي للسكر الأبيض في التحلية.",
        "Authentic pure Egyptian clover honey from fertile pastoral fields. Sweet, gentle on digestion, and an ideal natural daily alternative to refined sugar.",
        "No"
    ],
    [
        "P006",
        "معجون عسل العكبر الطبيعي (البروبوليس)",
        "Raw Propolis Honey Paste",
        390,
        25,
        "In Stock",
        "assets/images/products/propolis-honey/1.jpg, assets/images/products/propolis-honey/2.jpg, assets/images/products/propolis-honey/3.jpg",
        "منتجات الخلية",
        "Bee Products",
        "عكبر, بروبوليس, مضاد حيوي, حماية",
        "مزيج علاجي مركز يجمع بين عسل السدر الطبيعي وصمغ العكبر النقي (البروبوليس). يعد أقوى مضاد حيوي طبيعي لتعزيز المناعة ومحاربة الفيروسات والتهابات الحلق.",
        "A therapeutic superfood formulation blending pure raw honey with concentrated natural bee propolis. Acts as a potent natural defense against seasonal threats.",
        "Yes"
    ],
    [
        "P007",
        "خلطة الطاقة الملكية (غذاء ملكات + لقاح)",
        "Royal Energy Blend (Royal Jelly & Pollen)",
        480,
        0,
        "In Stock",
        "assets/images/products/royal-jelly-blend/1.jpg, assets/images/products/royal-jelly-blend/2.jpg, assets/images/products/royal-jelly-blend/3.jpg",
        "منتجات الخلية",
        "Bee Products",
        "غذاء ملكات, حبوب لقاح, نشاط, خصوبة",
        "إكسير الحيوية والنشاط! خلطة حصرية تتكون من عسل السدر الصافي مع غذاء الملكات الطازج وحبوب لقاح النحل وغبار الطلع. تمد الجسم بنشاط فوري وتزيد التركيز والقدرة البدنية.",
        "An exquisite tonic blend of raw honey, fresh royal jelly, multi-flower bee pollen, and propolis. Provides sustained mental clarity, vitality, and physical stamina.",
        "Yes"
    ],
    [
        "P008",
        "بوكس إهداء قطاف الفاخر (3 عبوات مختارة)",
        "Qetaf Luxury Trio Gift Box",
        750,
        15,
        "Out of Stock",
        "assets/images/products/gift-box-trio/1.jpg, assets/images/products/gift-box-trio/2.jpg, assets/images/products/gift-box-trio/3.jpg",
        "بكجات وهدايا",
        "Gift Bundles",
        "هدية, بوكس, ثلاثي, فخامة",
        "صندوق خشبي فاخر للإهداء يحتوي على 3 عبوات سعة 500 جرام (عسل سدر كشميري + عسل حبة البركة + عسل زهور برية) مع ملعقة عسل خشبية أصلية. هدية صحية راقية لمن تحب.",
        "An elegant handcrafted gift box containing three 500g premium honey jars (Kashmiri Sidr, Black Seed, and Wildflower) accompanied by a classic wooden honey dipper.",
        "No"
    ]
]

for row in products_data:
    ws_products.append(row)

# ----------------- SHEET 2: HeroOffers -----------------
ws_hero = wb.create_sheet(title="HeroOffers")
hero_headers = [
    "id", "title_ar", "title_en", "subtitle_ar", "subtitle_en", 
    "badge_ar", "badge_en", "button_text_ar", "button_text_en", 
    "link_url", "image_path", "active"
]
ws_hero.append(hero_headers)

hero_data = [
    [
        "HERO1",
        "أجود أنواع عسل النحل الطبيعي 100%",
        "100% Pure & Raw Natural Honey",
        "مستخلص من أفضل المناحل البرية النقية، مفحوص مخبرياً ومضمون بالجودة الذهبية",
        "Harvested from certified pristine apiaries, lab tested with a golden purity guarantee",
        "طبيعي 100%",
        "100% Pure",
        "تصفح المنتجات",
        "Shop Products",
        "#products",
        "assets/images/landing/hero/hero1.jpg",
        "Yes"
    ],
    [
        "HERO2",
        "عروض موسم جني العسل الحصرية",
        "Exclusive Harvest Season Deals",
        "وفر حتى 25% على باقات عسل السدر الكشميري والخلطات الملكية الخاصة",
        "Save up to 25% on premium Sidr honey and bespoke royal jelly collections",
        "خصم خاص",
        "Special Deal",
        "استكشف العروض",
        "Explore Offers",
        "#products",
        "assets/images/landing/hero/hero2.jpg",
        "Yes"
    ],
    [
        "HERO3",
        "باقة المناعة والوقاية اليومية",
        "Daily Immunity & Wellness Pack",
        "مزيج العكبر النقي والغذاء الملكي لتعزيز صحتك وصحة أسرتك في كل فصول السنة",
        "The ultimate synergy of royal jelly, propolis, and raw mountain honey",
        "الأكثر طلباً",
        "Best Seller",
        "اطلب باقتك الآن",
        "Order Now",
        "#products",
        "assets/images/landing/hero/hero3.jpg",
        "Yes"
    ]
]
for row in hero_data:
    ws_hero.append(row)

# ----------------- SHEET 3: SmallOffers -----------------
ws_small = wb.create_sheet(title="SmallOffers")
small_headers = [
    "id", "is_all_products_btn", "title_ar", "title_en", 
    "subtitle_ar", "subtitle_en", "badge_ar", "badge_en", 
    "button_text_ar", "button_text_en", "image_path", "link_url", "active"
]
ws_small.append(small_headers)

small_data = [
    [
        "CARD_ALL",
        "Yes",
        "جميع المنتجات والتشكيلات",
        "All Products & Collections",
        "تصفح تشكيلة قطاف الكاملة من العسل الطبيعي ومنتجات الخلية الفاخرة",
        "Explore our complete range of raw honeys and hive treasures",
        "تسوّق الآن",
        "Shop Now",
        "عرض كل المنتجات",
        "View All Products",
        "assets/images/landing/offers/offer1.jpg",
        "#products",
        "Yes"
    ],
    [
        "OFFER_SIDR",
        "No",
        "عرض عسل السدر الكشميري",
        "Kashmiri Sidr Special",
        "خصم 20% لفترة محدودة على الكيلو والنصف كيلو",
        "20% discount on 1kg and 500g jars for a limited time",
        "خصم 20%",
        "20% Off",
        "اطلب السدر الآن",
        "Get Deal",
        "assets/images/landing/offers/offer1.jpg",
        "#products",
        "Yes"
    ],
    [
        "OFFER_TRIO",
        "No",
        "باقة التوفير الثلاثية",
        "Trio Value Honey Bundle",
        "ثلاث عبوات مختلفة تلبي احتياجات الأسرة مع شحن مخفض",
        "Three distinct jars suited for the whole family",
        "توفير عائلي",
        "Family Saver",
        "تفاصيل العرض",
        "View Bundle",
        "assets/images/landing/offers/offer2.jpg",
        "#products",
        "Yes"
    ],
    [
        "OFFER_HEALTH",
        "No",
        "إطلاق منتجات العكبر والغذاء الملكي",
        "Propolis & Royal Jelly Launch",
        "منتجات جديدة نقية 100% غنية بالعناصر الحيوية والنشاط",
        "New arrival of 100% pure royal hive extracts",
        "وصل حديثاً",
        "New Arrival",
        "اكتشف المزيد",
        "Discover",
        "assets/images/landing/offers/offer3.jpg",
        "#products",
        "Yes"
    ]
]
for row in small_data:
    ws_small.append(row)

# ----------------- SHEET 4: Settings -----------------
ws_settings = wb.create_sheet(title="Settings")
settings_headers = ["key", "value_ar", "value_en", "description"]
ws_settings.append(settings_headers)

settings_data = [
    [
        "announcement_text",
        "عروض حصرية لفترة محدودة: شحن مجاني للطلبات بقيمة 500 ج فأكثر! 🍯",
        "Limited Time Offer: Free shipping on orders over 500 EGP! 🍯",
        "Banner text at top of site. Leave empty if you don't want to display it."
    ],
    [
        "store_name",
        "قطاف العسل | Qetaf Honey",
        "Qetaf Honey",
        "Store brand name"
    ],
    [
        "tagline",
        "نقاء الطبيعة.. من المناحل إلى مائدتكم مباشرة",
        "Nature's Purest Harvest Straight to Your Table",
        "Store tagline"
    ],
    [
        "phone",
        "+20 100 123 4567",
        "+20 100 123 4567",
        "Contact phone number"
    ],
    [
        "whatsapp",
        "201001234567",
        "201001234567",
        "WhatsApp number without + or spaces for direct chat/ordering"
    ],
    [
        "email",
        "info@qetafhoney.com",
        "info@qetafhoney.com",
        "Store owner email address for orders and inquiries"
    ],
    [
        "delivery_coverage_notice",
        "التوصيل حاليا متاح فقط في مدينة الشروق و مدينتي و بدر و المدن المحيطة",
        "Delivery is currently available only in El Shorouk, Madinaty, Badr, and surrounding areas",
        "ملاحظة نطاق التوصيل في صفحة إتمام الشراء (Delivery coverage notice in checkout)"
    ],
    [
        "address",
        "مدينة الشروق، مدينتي، بدر والمدن المحيطة",
        "El Shorouk, Madinaty, Badr & surrounding areas",
        "Physical address or delivery coverage"
    ],
    [
        "working_hours",
        "يومياً من 9 صباحاً حتى 10 مساءً",
        "Daily from 9:00 AM to 10:00 PM",
        "Working hours"
    ],
    [
        "facebook_url",
        "https://facebook.com/qetafhoney",
        "https://facebook.com/qetafhoney",
        "Facebook page URL"
    ],
    [
        "instagram_url",
        "https://instagram.com/qetafhoney",
        "https://instagram.com/qetafhoney",
        "Instagram page URL"
    ],
    [
        "emailjs_service_id",
        "service_qetaf",
        "service_qetaf",
        "EmailJS Service ID (optional, see instructions)"
    ],
    [
        "emailjs_template_buyer",
        "template_buyer_order",
        "template_buyer_order",
        "EmailJS Buyer Confirmation Template ID"
    ],
    [
        "emailjs_template_seller",
        "template_seller_order",
        "template_seller_order",
        "EmailJS Store Owner Notification Template ID"
    ],
    [
        "emailjs_public_key",
        "YOUR_PUBLIC_KEY",
        "YOUR_PUBLIC_KEY",
        "EmailJS Public Key"
    ]
]
for row in settings_data:
    ws_settings.append(row)

# Style all sheets
for sheet in wb.worksheets:
    sheet.views.sheetView[0].showGridLines = True
    for col_idx in range(1, sheet.max_column + 1):
        cell = sheet.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center
        cell.border = thin_border
        
    for row_idx in range(2, sheet.max_row + 1):
        for col_idx in range(1, sheet.max_column + 1):
            cell = sheet.cell(row=row_idx, column=col_idx)
            cell.border = thin_border
            if sheet.title == "Products" and col_idx in [1, 4, 5, 6, 13]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

    # Auto-adjust column width
    for col in sheet.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val_str = str(cell.value or "")
            if len(val_str) > max_len:
                max_len = len(val_str)
        sheet.column_dimensions[col_letter].width = min(max(max_len + 3, 14), 50)

os.makedirs('data', exist_ok=True)
excel_path = 'data/products.xlsx'
wb.save(excel_path)
print(f"Generated Excel workbook: {excel_path}")

# Also export JSON for immediate zero-latency fallback / file:// preview support
data_json = {
    "Products": [dict(zip(product_headers, row)) for row in products_data],
    "HeroOffers": [dict(zip(hero_headers, row)) for row in hero_data],
    "SmallOffers": [dict(zip(small_headers, row)) for row in small_data],
    "Settings": {row[0]: {"value_ar": row[1], "value_en": row[2], "description": row[3]} for row in settings_data}
}
json_path = 'data/products.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data_json, f, ensure_ascii=False, indent=2)
print(f"Generated JSON mirror: {json_path}")
