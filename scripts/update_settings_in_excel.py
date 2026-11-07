import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import json
import os
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

excel_path = 'data/products.xlsx'
wb = openpyxl.load_workbook(excel_path)
ws_settings = wb['Settings']

# Read existing settings into a dict to preserve user's edits
existing_settings = {}
for row in list(ws_settings.iter_rows(values_only=True))[1:]:
    if row and row[0]:
        key = str(row[0]).strip()
        val_ar = "" if len(row) < 2 or row[1] is None else str(row[1]).strip()
        val_en = "" if len(row) < 3 or row[2] is None else str(row[2]).strip()
        desc = "" if len(row) < 4 or row[3] is None else str(row[3]).strip()
        existing_settings[key] = (val_ar, val_en, desc)

print(f"Loaded {len(existing_settings)} existing settings keys.")

# Full list of settings with defaults
all_settings_specs = [
    # General / Branding
    ("announcement_text", "الحق عروض الجمعة البيضاء. خصم 25% على جميع المنتجات", "White Friday Sale. 25% off all products", "نص الشريط الإعلاني أعلى الموقع (اتركه فارغاً لإخفائه)"),
    ("store_name", "قطاف العسل | Qetaf Honey", "Qetaf Honey", "اسم المتجر"),
    ("tagline", "نقاء الطبيعة.. من المناحل إلى مائدتكم مباشرة", "Nature's Purest Harvest Straight to Your Table", "الشعار اللفظي تحت اللوجو"),
    ("phone", "+20 100 123 4567", "+20 100 123 4567", "رقم الهاتف للتواصل"),
    ("whatsapp", "201001234567", "201001234567", "رقم الواتساب للتواصل بدون + أو مسافات"),
    ("email", "info@qetafhoney.com", "info@qetafhoney.com", "بريد المتجر (يصل إليه إشعار الطلبات الجديدة)"),
    ("address", "جمهورية مصر العربية - القاهرة - مدينة الشروق", "Egypt - Cairo - El-Shorouk City", "عنوان ومقر المتجر"),
    ("working_hours", "يومياً من 10 صباحاً حتى 10 مساءً", "Daily from 10:00 AM to 10:00 PM", "مواعيد العمل"),
    ("facebook_url", "https://facebook.com/qetafhoney", "https://facebook.com/qetafhoney", "رابط صفحة فيسبوك"),
    ("instagram_url", "https://instagram.com/qetafhoney", "https://instagram.com/qetafhoney", "رابط صفحة انستجرام"),

    # Delivery & Checkout
    ("delivery_coverage_notice", "التوصيل حاليا متاح فقط في مدينة الشروق و مدينتي و بدر و المدن المحيطة", "Delivery is currently available only in El Shorouk, Madinaty, Badr, and surrounding areas", "تنبيه نطاق التوصيل في صفحة إتمام الطلب"),
    ("order_success_title", "تم انشاء طلبك", "Your Order Has Been Created", "العنوان الكبير لرسالة نجاح إتمام الطلب"),
    ("order_success_subtitle", "سيتم التواصل معك لتأكيد طلبك و البدء بعملية التوصيل", "We will contact you to confirm your order and begin the delivery process", "النص التوضيحي لرسالة نجاح إتمام الطلب"),

    # Landing Page Section Titles & Subtitles
    ("offers_section_title", "عروض وخصومات مميزة", "Exclusive Offers & Deals", "عنوان قسم العروض في الصفحة الرئيسية"),
    ("offers_section_subtitle", "تشكيلة من أفضل العروض الحصرية وباقات التوفير العائلية", "A curated selection of exclusive offers & family value bundles", "النص الوصفي تحت عنوان قسم العروض"),
    ("products_section_title", "المنتجات", "Our Products", "عنوان صفحة/قسم المنتجات"),
    ("products_section_subtitle", "استكشف باقتنا المتنوعة من الأعسال الطبيعية النادرة ومنتجات الخلية الملكية", "Explore our diverse range of rare raw honeys and royal hive treasures", "النص الوصفي تحت عنوان قسم المنتجات"),

    # About Us Page
    ("about_hero_title", "قصتنا في قطاف العسل", "Our Story at Qetaf Honey", "عنوان صفحة من نحن"),
    ("about_hero_subtitle", "رحلة من الشغف بنقاء الطبيعة، نعتني بالنحل لنمنحكم عسلاً كما أراده الخالق.", "A passionate journey to preserve nature's golden gift just as nature intended.", "الوصف التمهيدي لصفحة من نحن"),
    ("about_p1", "في «قطاف العسل»، بدأنا رحلتنا من إيمان راسخ بأن العسل الطبيعي ليس مجرد غذاء بل هو شفاء وطاقة حيوية نقية. نختار مواقع مناحلنا بعناية في البيئات الجبلية والوديان والبراري المفتوحة بعيداً عن التلوث والمبيدات.", "At Qetaf Honey, our passion was sparked by the understanding that pure raw honey is more than food—it is living wellness and holistic vitality. We locate our apiaries in untouched mountain valleys and wild botanical sanctuaries.", "الفقرة الأولى في قصة من نحن"),
    ("about_p2", "نلتزم بأعلى معايير فرز وتعبئة العسل دون تسخين أو فلترة مفرطة لنحافظ على كامل الإنزيمات الحية، الفيتامينات، وفوائد حبوب اللقاح الطبيعية، ليصلكم من المنحل إلى مائدتكم بكامل قيمته الغذائية.", "We adhere to uncompromised harvesting standards without excessive filtration or heat damage, preserving living enzymes, natural antioxidants, and precious flower pollens directly to your home.", "الفقرة الثانية في قصة من نحن"),

    # Values Section
    ("values_section_title", "قيمنا والتزامنا تجاهكم", "Our Values & Commitment", "عنوان قسم القيم والتعهدات"),
    ("values_section_subtitle", "المعايير التي نحرص عليها في كل قطرة عسل تصل إلى بيتك", "The standards we uphold in every drop of honey delivered to your home", "الوصف تحت عنوان قسم القيم"),
    ("val_1_title", "أمانة ومصداقية", "Authentic Purity", "عنوان القيمة 1"),
    ("val_1_desc", "نضمن نقاء كل قطرة عسل نقدمها، ونلتزم بالفحص الدوري بأدق المختبرات المتخصصة.", "Every single drop is certified pure, supported by comprehensive laboratory testing.", "وصف القيمة 1"),
    ("val_2_title", "إنتاج طبيعي مستدام", "Sustainable Beekeeping", "عنوان القيمة 2"),
    ("val_2_desc", "نتبع ممارسات تربية نحل رحيمة وصديقة للبيئة تضمن صحة النحل وتنوع المحاصيل.", "We practice ethical, bee-first apiculture ensuring healthy colonies and thriving biodiversity.", "وصف القيمة 2"),
    ("val_3_title", "تنوع وجودة استثنائية", "Rare & Diverse Selection", "عنوان القيمة 3"),
    ("val_3_desc", "نوفر لكم تشكيلة واسعة من أعسال السدر الجبلي والأعشاب الطبية ومنتجات الخلية الملكية.", "Offering world-class mountain Sidr, herbal honeys, propolis, and fresh royal jelly blends.", "وصف القيمة 3"),
    ("val_4_title", "ثقة ورضا عملائنا", "Customer Trust & Satisfaction", "عنوان القيمة 4"),
    ("val_4_desc", "آلاف العملاء يثقون في قطاف كمصدرهم المعتمد للعسل الطبيعي والمكملات الغذائية.", "Thousands of families cherish Qetaf as their trusted natural wellness partner.", "وصف القيمة 4"),

    # FAQ Section
    ("faq_section_title", "الأسئلة الشائعة", "Frequently Asked Questions", "عنوان قسم الأسئلة الشائعة"),
    ("faq_1_q", "كيف أتأكد من أن عسل قطاف طبيعي 100%؟", "How do I know Qetaf honey is 100% pure?", "السؤال الشائع 1"),
    ("faq_1_a", "جميع أعسالنا تخضع للفحص المخبري الدوري للتحقق من نسب السكروز والإنزيمات والنقاء التام. كما نقدم ضمان استرجاع كامل في حال ثبت عدم نقاء العسل.", "Our honey undergoes stringent third-party laboratory analysis verifying sucrose levels, moisture, and active pollen count. We provide a full money-back guarantee.", "إجابة السؤال 1"),
    ("faq_2_q", "هل العسل يتبلور؟ وهل التبلور دليل على الغش؟", "Does raw honey crystallize? Is crystallization bad?", "السؤال الشائع 2"),
    ("faq_2_a", "على العكس تماماً! التبلور (التجمد) هو خاصية فيزيائية طبيعية تحدث لبعض أنواع العسل الخام غير المبستر مثل عسل الموالح والبرسيم، وهو أكبر دليل على أن العسل طبيعي وحي ولم يتعرض لحرارة عالية تتلف فوائده.", "Not at all! Crystallization is a natural physical hallmark of unpasteurized, enzyme-rich raw honey. It confirms that the honey was never overheated or artificially processed.", "إجابة السؤال 2"),
    ("faq_3_q", "ما هي مدة التوصيل وتكلفة الشحن؟", "What are your delivery times and shipping costs?", "السؤال الشائع 3"),
    ("faq_3_a", "يستغرق التوصيل عادة من 24 إلى 48 ساعة داخل مدينة الشروق ومدينتي وبدر والمدن المحيطة. الشحن مجاني للطلبات التي تتجاوز 500 جنيه.", "Orders in El Shorouk, Madinaty, Badr, and surrounding areas arrive within 24-48 hours. Free delivery applies on orders above 500 EGP.", "إجابة السؤال 3"),

    # Footer Section
    ("footer_contact_heading", "معلومات التواصل", "Contact Info", "عنوان عمود التواصل في الفوتر"),
    ("footer_links_heading", "روابط سريعة", "Quick Links", "عنوان عمود الروابط السريعة في الفوتر"),
    ("footer_guarantee_title", "ضمان قطاف الذهبي", "Qetaf Golden Guarantee", "عنوان الضمان في الفوتر"),
    ("footer_guarantee_text", "نضمن لك نقاء منتجاتنا بنسبة 100%.. إن لم ينل العسل رضاك، يمكنك استرجاعه واسترداد قيمته كاملة.", "100% satisfaction guaranteed. If you are not delighted with your honey, return it for a complete hassle-free refund.", "نص الضمان في الفوتر"),
    ("copyright_text", "جميع الحقوق محفوظة © قطاف العسل", "All Rights Reserved © Qetaf Honey", "نص حقوق الملكية أسفل الموقع"),

    # EmailJS
    ("emailjs_service_id", "service_qetaf", "service_qetaf", "معرف خدمة EmailJS (اختياري)"),
    ("emailjs_template_seller", "template_seller_order", "template_seller_order", "معرف قالب إيميل المتجر في EmailJS"),
    ("emailjs_public_key", "YOUR_PUBLIC_KEY", "YOUR_PUBLIC_KEY", "المفتاح العام لـ EmailJS")
]

# Remove old Settings sheet and recreate cleanly
wb.remove(ws_settings)
ws_settings = wb.create_sheet(title='Settings')

headers = ["key", "value_ar", "value_en", "description"]
ws_settings.append(headers)

for key, def_ar, def_en, def_desc in all_settings_specs:
    if key in existing_settings:
        ex_ar, ex_en, ex_desc = existing_settings[key]
        val_ar = ex_ar if ex_ar != "" else def_ar
        val_en = ex_en if ex_en != "" else def_en
        desc = ex_desc if ex_desc != "" else def_desc
    else:
        val_ar = def_ar
        val_en = def_en
        desc = def_desc
    ws_settings.append([key, val_ar, val_en, desc])

# Styling
header_fill = PatternFill(start_color="FDD768", end_color="FDD768", fill_type="solid")
header_font = Font(name="Segoe UI", size=11, bold=True, color="1A1A1A")
thin_border = Border(
    left=Side(style='thin', color='E0E0E0'),
    right=Side(style='thin', color='E0E0E0'),
    top=Side(style='thin', color='E0E0E0'),
    bottom=Side(style='thin', color='E0E0E0')
)

for col_idx in range(1, 5):
    cell = ws_settings.cell(row=1, column=col_idx)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = thin_border

for row_idx in range(2, ws_settings.max_row + 1):
    for col_idx in range(1, 5):
        cell = ws_settings.cell(row=row_idx, column=col_idx)
        cell.border = thin_border
        if col_idx == 1:
            cell.font = Font(name="Consolas", size=10, bold=True, color="533300")
            cell.alignment = Alignment(horizontal="left", vertical="center")
        else:
            cell.font = Font(name="Segoe UI", size=10)
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)

# Adjust column widths
for col in ws_settings.columns:
    max_len = 0
    col_letter = get_column_letter(col[0].column)
    for cell in col:
        val_str = str(cell.value or "")
        if len(val_str) > max_len:
            max_len = len(val_str)
    ws_settings.column_dimensions[col_letter].width = min(max(max_len + 3, 16), 65)

ws_settings.views.sheetView[0].showGridLines = True

wb.save(excel_path)
print(f"Successfully updated {excel_path} with {ws_settings.max_row - 1} settings rows!")
