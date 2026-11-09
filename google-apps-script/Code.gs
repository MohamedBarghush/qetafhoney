/**
 * ==============================================================================
 * عسل قطاف - كود استقبال الطلبات وتسجيلها وإرسال إشعار بريد إلكتروني
 * Qetaf Honey - Order Processing, Google Sheets Logging & Email Notifications
 * ==============================================================================
 * 
 * البريد الإلكتروني الذي يستقبل الإشعارات:
 * qetafhoneyeg@gmail.com
 */

// البريد الإلكتروني المخصص لاستقبال تفاصيل الطلبات
var NOTIFICATION_EMAIL = "qetafhoneyeg@gmail.com";

/**
 * دالة استقبال الطلب من الموقع عبر POST
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No data received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. تحليل بيانات الطلب المستلمة بصيغة JSON
    var data = JSON.parse(e.postData.contents);
    var cust = data.customer || {};
    var orderId = data.orderId || ("QETAF-" + Math.floor(100000 + Math.random() * 900000));
    var createdAt = data.createdAt || Utilities.formatDate(new Date(), "Africa/Cairo", "yyyy-MM-dd HH:mm:ss");
    var totalPrice = data.totalPrice || 0;
    var notes = cust.notes || "لا توجد ملاحظات";
    var phone = cust.phone ? String(cust.phone).trim() : "";

    // 2. الوصول لشيت الطلبات
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("الطلبات") || ss.getSheets()[0];

    // 3. تجهيز نص المنتجات لشيت الإكسيل والجدول للإيميل
    var itemsSummary = "";
    var itemsHtmlTable = "";

    if (data.items && data.items.length > 0) {
      data.items.forEach(function(item) {
        var line = item.name_ar + " × " + item.qty + " (" + item.total + " ج.م)";
        itemsSummary += (itemsSummary ? " | " : "") + line;

        itemsHtmlTable += "<tr>" +
          "<td style=\"padding: 10px 12px; border-bottom: 1px solid #f0e6d2; font-weight: 500;\">" + 
            item.name_ar + (item.name_en ? " <br><small style=\"color:#888;\">" + item.name_en + "</small>" : "") + 
          "</td>" +
          "<td style=\"padding: 10px 12px; border-bottom: 1px solid #f0e6d2; text-align: center;\">" + item.qty + "</td>" +
          "<td style=\"padding: 10px 12px; border-bottom: 1px solid #f0e6d2; text-align: center;\">" + item.price + " ج.م</td>" +
          "<td style=\"padding: 10px 12px; border-bottom: 1px solid #f0e6d2; text-align: center; font-weight: bold; color: #b45309;\">" + item.total + " ج.م</td>" +
        "</tr>";
      });
    } else {
      itemsSummary = "لا توجد منتجات مسجلة";
    }

    // 4. تسجيل الطلب في سطر جديد بشيت جوجل
    sheet.appendRow([
      orderId,
      createdAt,
      cust.name || "",
      "'" + phone, // علامة ' لحفظ الصفر على الشمال في أرقام الهواتف
      cust.city || "",
      cust.street || "",
      cust.building || "",
      cust.apartment || cust.apt || "",
      cust.landmark || "",
      itemsSummary,
      totalPrice,
      notes,
      "جديد"
    ]);

    // 5. تجهيز روابط الاتصال السريع والواتساب
    var cleanPhone = phone.replace(/\D/g, "");
    var waNumber = cleanPhone;
    if (waNumber.startsWith("0")) {
      waNumber = "20" + waNumber.substring(1);
    } else if (!waNumber.startsWith("20")) {
      waNumber = "20" + waNumber;
    }
    var waUrl = "https://wa.me/" + waNumber;
    var telUrl = "tel:" + cleanPhone;

    // العنوان الكامل
    var fullAddress = (cust.city || "") + "، شارع " + (cust.street || "") + "، مبنى " + (cust.building || "");
    if (cust.apartment || cust.apt) {
      fullAddress += "، شقة " + (cust.apartment || cust.apt);
    }
    if (cust.landmark) {
      fullAddress += " (أقرب معلم: " + cust.landmark + ")";
    }

    // 6. تجهيز البريد الإلكتروني بتنسيق HTML جذاب ومتوافق مع الموبايل
    var emailSubject = "🍯 طلب جديد #" + orderId + " - " + (cust.name || "عميل") + " (" + totalPrice + " ج.م)";

    var emailBody = "<!DOCTYPE html>" +
    "<html dir=\"rtl\" lang=\"ar\">" +
    "<head><meta charset=\"UTF-8\"></head>" +
    "<body style=\"font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #fcf9f2; margin: 0; padding: 20px; direction: rtl; text-align: right; color: #222;\">" +
      "<div style=\"max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #f1e2c3;\">" +
        
        "<!-- Header -->" +
        "<div style=\"background: linear-gradient(135deg, #FDD768 0%, #F5C330 100%); padding: 24px; text-align: center; color: #3d2b00;\">" +
          "<h1 style=\"margin: 0 0 6px 0; font-size: 26px; font-weight: 800;\">🍯 عسل قطاف | Qetaf Honey</h1>" +
          "<p style=\"margin: 0; font-size: 16px; font-weight: 600;\">إشعار استلام طلب جديد من المتجر الإلكتروني</p>" +
        "</div>" +

        "<!-- Order Summary Box -->" +
        "<div style=\"padding: 24px;\">" +
          "<div style=\"background: #fffdf5; border: 2px dashed #FDD768; border-radius: 10px; padding: 16px; margin-bottom: 22px; display: flex; justify-content: space-between;\">" +
            "<div><strong>رقم الطلب:</strong> <span style=\"color:#b45309; font-weight:bold;\">#" + orderId + "</span></div>" +
            "<div><strong>تاريخ الطلب:</strong> " + createdAt + "</div>" +
            "<div><strong>الإجمالي:</strong> <span style=\"color:#16a34a; font-weight:bold; font-size: 18px;\">" + totalPrice + " ج.م</span></div>" +
          "</div>" +

          "<!-- Customer Info -->" +
          "<h2 style=\"font-size: 18px; margin: 0 0 12px 0; border-bottom: 2px solid #FDD768; padding-bottom: 6px; color: #333;\">👤 بيانات العميل والتوصيل</h2>" +
          "<table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px;\">" +
            "<tr><td style=\"padding: 6px 0; width: 120px; color: #666;\"><strong>الاسم:</strong></td><td style=\"padding: 6px 0; font-size: 16px; font-weight: bold;\">" + (cust.name || "-") + "</td></tr>" +
            "<tr>" +
              "<td style=\"padding: 6px 0; color: #666;\"><strong>رقم الهاتف:</strong></td>" +
              "<td style=\"padding: 6px 0;\">" +
                "<span style=\"font-size: 16px; font-weight: bold; direction: ltr; display: inline-block;\">" + phone + "</span>" +
                "<div style=\"margin-top: 8px;\">" +
                  "<a href=\"" + telUrl + "\" style=\"display: inline-block; background: #2563eb; color: #fff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-left: 8px;\">📞 اتصال الآن</a>" +
                  "<a href=\"" + waUrl + "\" style=\"display: inline-block; background: #25D366; color: #fff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold;\">💬 محادثة واتساب لتأكيد الطلب</a>" +
                "</div>" +
              "</td>" +
            "</tr>" +
            "<tr><td style=\"padding: 6px 0; color: #666;\"><strong>عنوان التوصيل:</strong></td><td style=\"padding: 6px 0; font-weight: 500;\">" + fullAddress + "</td></tr>" +
            "<tr><td style=\"padding: 6px 0; color: #666;\"><strong>ملاحظات العميل:</strong></td><td style=\"padding: 6px 0; color: #555;\">" + notes + "</td></tr>" +
          "</table>" +

          "<!-- Products Table -->" +
          "<h2 style=\"font-size: 18px; margin: 0 0 12px 0; border-bottom: 2px solid #FDD768; padding-bottom: 6px; color: #333;\">📦 المنتجات المطلوبة</h2>" +
          "<table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px; background: #fff;\">" +
            "<thead>" +
              "<tr style=\"background: #faf3e0; color: #444; font-size: 14px;\">" +
                "<th style=\"padding: 10px; text-align: right; border-bottom: 2px solid #e5d5b5;\">المنتج</th>" +
                "<th style=\"padding: 10px; text-align: center; border-bottom: 2px solid #e5d5b5;\">الكمية</th>" +
                "<th style=\"padding: 10px; text-align: center; border-bottom: 2px solid #e5d5b5;\">السعر</th>" +
                "<th style=\"padding: 10px; text-align: center; border-bottom: 2px solid #e5d5b5;\">الإجمالي</th>" +
              "</tr>" +
            "</thead>" +
            "<tbody>" +
              itemsHtmlTable +
            "</tbody>" +
            "<tfoot>" +
              "<tr style=\"background: #fffdf5;\">" +
                "<td colspan=\"3\" style=\"padding: 12px; text-align: left; font-weight: bold; font-size: 15px;\">إجمالي الفاتورة المطلوب تحصيلها:</td>" +
                "<td style=\"padding: 12px; text-align: center; font-weight: 800; font-size: 18px; color: #16a34a;\">" + totalPrice + " ج.م</td>" +
              "</tr>" +
            "</tfoot>" +
          "</table>" +

          "<!-- Footer Note -->" +
          "<div style=\"background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 13px; color: #64748b; text-align: center;\">" +
            "✅ تم حفظ هذا الطلب تلقائياً في شيت إكسيل الطلبات (Google Sheets)." +
          "</div>" +

        "</div>" +
      "</div>" +
    "</body>" +
    "</html>";

    // 7. إرسال البريد الإلكتروني للمتجر
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: emailSubject,
      htmlBody: emailBody
    });

    // 8. إرجاع رسالة نجاح بصيغة JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      orderId: orderId,
      message: "Order successfully recorded and email sent."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error in doPost:", error);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * دالة GET لاختبار الرابط والتأكد من أنه يعمل بنجاح في المتصفح
 */
function doGet(e) {
  var html = "<!DOCTYPE html><html dir=\"rtl\"><head><meta charset=\"UTF-8\"><title>Qetaf Honey Order Endpoint</title></head>" +
    "<body style=\"font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #fffdf5;\">" +
    "<div style=\"display: inline-block; background: #fff; padding: 30px; border-radius: 12px; border: 2px solid #FDD768; box-shadow: 0 4px 10px rgba(0,0,0,0.05);\">" +
    "<h1 style=\"color: #b45309; margin: 0 0 10px 0;\">🍯 عسل قطاف - نقطة استقبال الطلبات</h1>" +
    "<p style=\"color: #16a34a; font-size: 18px; font-weight: bold;\">✓ الكود يعمل وجاهز لاستقبال الطلبات من موقع الويب بنجاح!</p>" +
    "<p style=\"color: #666; font-size: 14px;\">يتم إرسال إشعارات الطلبات إلى: <strong>" + NOTIFICATION_EMAIL + "</strong></p>" +
    "</div></body></html>";
    
  return ContentService.createTextOutput(html).setMimeType(ContentService.MimeType.HTML);
}
