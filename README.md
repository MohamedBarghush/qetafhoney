# 🍯 قطاف العسل | Qetaf Honey

A modern, fast, and fully responsive e-commerce web application for 100% pure raw honey and hive products. Designed specifically for hosting on **GitHub Pages** with **no backend database required**—all products, discounts, hero offers, announcement banners, section titles, about us story, brand values, FAQs, contact information, delivery coverage notice, and footer texts are dynamically driven by an editable local Excel spreadsheet (`data/products.xlsx`).

---

## ✨ Key Features

- **Comprehensive Dynamic Excel Database (`data/products.xlsx`)**:
  Add, edit, or remove products, categories, tags, discounts, banners, story paragraphs, brand values, FAQs, delivery coverage notice, and footer texts directly in Microsoft Excel or Google Sheets. The website parses the spreadsheet on-the-fly via SheetJS with instant cache-busting.
- **Bilingual & Localized (Arabic & English)**:
  - **Arabic by default** with proper Right-to-Left (RTL) formatting and `Cairo` typography.
  - **English switchable** with Left-to-Right (LTR) and `Outfit` typography.
  - All headings, subheadings, story text, values, and FAQs translate synchronously between Arabic and English or draw their translations from the `Settings` sheet in Excel.
  - Phone numbers are isolated in LTR direction so numbers and international dial codes display consistently without RTL digit inversion.
  - Language preference is cached in the browser's `localStorage`.
- **Top Announcement Banner**:
  Controlled from the Excel sheet. Hidden automatically if the cell is empty.
- **Top Middle Logo & Top Right Language Switcher**:
  Matches branding and layout specifications.
- **Hero Swiping Offers Carousel**:
  Touch-swipeable and responsive banner cards highlighting current seasonal offers with auto-advance and indicators.
- **Landing Small Cards**:
  The first card is a dedicated action card leading to the products catalog; subsequent cards highlight special promotions.
- **Products Catalog with Real-Time Filtering**:
  - Filter by category tag.
  - Search in real-time by Arabic/English keywords.
  - Sort by price, discount, or title.
  - Product cards featuring square images (1:1), stock badges (`In Stock` / `Out of Stock`), and prices with **red strikethrough lines on original prices** whenever a discount is active.
  - Interactive stepper buttons (`+` and `-`) right on the card button: customer can increase, decrease, or remove the product directly from the card.
- **Product Gallery Modal (Multi-Image Flip)**:
  Clicking any product opens an interactive modal allowing customers to flip through all product images using arrows or thumbnail previews.
- **Persistent Shopping Cart & Simplified Customer Checkout**:
  - Cart persists across reloads and visits.
  - Customer details (Name, Phone, City / Area, Street, Building, Apt, Landmark, Notes) are cached in `localStorage`.
  - Configurable delivery coverage notice (editable directly via Excel Settings sheet).
  - Automated Order Processing with Google Sheets & Apps Script: orders are immediately logged to Google Sheets and emailed to qetafhoneyeg@gmail.com with one-click WhatsApp/Call buttons. The store owner contacts the customer directly by phone.
  - **Upon checkout completion, the cart is cleared while customer details remain saved** for friction-free future orders.
  - Order success modal displays:
    - **"تم انشاء طلبك"** ("Your Order Has Been Created")
    - **"سيتم التواصل معك لتأكيد طلبك و البدء بعملية التوصيل"** ("We will contact you to confirm your order and begin the delivery process")
- **Warm & Bright Honey Theme**:
  - Primary Accent: `#FDD768` (golden honey yellow).
  - High-contrast amber and espresso headlines (`#533300`, `#7A4B00`).
  - Rectangular buttons with rounded edges.

---

## 📐 Image Specifications & Aspect Ratios

To ensure the website displays crisp visuals with fast load times, adhere to the following specifications:

| Image Type | Folder Path | Aspect Ratio | Recommended Resolution | Recommended Format & Size |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Logo** | `assets/images/logo/logo.png` | Flexible (Horizontal) | **600 × 200 px** (or SVG) | PNG with transparent background or SVG vector |
| **Hero Slider Banners** | `assets/images/landing/hero/` | **16 : 9 (Horizontal)** | **1376 × 768 px** | JPG / WebP (< 250 KB) |
| **Small Offer Cards** | `assets/images/landing/offers/` | **4 : 3** | **800 × 600 px** | JPG / WebP (< 180 KB) |
| **Product Images** | `assets/images/products/{product-slug}/` | **1 : 1 (Square)** | **800 × 800 px** (or 1000 × 1000 px) | JPG / WebP (< 200 KB) |
| **About Us Hero Image** | `assets/images/about/about.jpg` | **3 : 2** or **4 : 3** | **1200 × 800 px** | JPG / WebP (< 250 KB) |

---

## 📁 Organized Folder Structure

```text
qetafhoney/
├── index.html                   # Core single-page application & layouts
├── README.md                    # Project documentation & image guidelines
├── INSTRUCTIONS.md              # In-depth operation manual in Arabic & English
│
├── data/
│   ├── products.xlsx            # Primary Excel spreadsheet database
│   └── products.json            # Offline preview mirror
│
├── assets/
│   ├── css/
│   │   └── style.css            # Stylesheet, colors, typography & RTL/LTR
│   ├── js/
│   │   ├── app.js               # Application logic, cart, checkout, router
│   │   └── data-loader.js       # Live browser Excel loader using SheetJS
│   ├── vendor/
│   │   └── xlsx.full.min.js     # SheetJS distribution library
│   └── images/
│       ├── logo/                # Logo assets (logo.svg, logo.png)
│       ├── about/
│       │   └── about.jpg        # Independent About Us story image
│       ├── landing/
│       │   ├── hero/            # Hero carousel banner images
│       │   └── offers/          # Smaller offer card images
│       └── products/            # Individual folders per product
│           ├── clover-honey 950g/
│           ├── clover-honey 450g/
│           ├── citrus-blossom 950g/
│           ├── citrus-blossom 450g/
│           ├── black-seed 950g/
│           ├── black-seed 450g/
│           └── marjoram-honey 950g/
│
└── scripts/
    ├── sync_data.py             # Verifies data integrity & image paths
    └── update_settings_in_excel.py
```

---

## 🚀 How to Push Changes to GitHub

Whenever you edit `data/products.xlsx` or add new product pictures:

1. **Verify and sync data (Optional but recommended)**:
   ```bash
   python scripts/sync_data.py
   ```
2. **Stage all changes**:
   ```bash
   git add .
   ```
3. **Commit with a message**:
   ```bash
   git commit -m "Update products and settings in excel"
   ```
4. **Push to GitHub**:
   ```bash
   git push origin main
   ```

Your site at `https://mohamedbarghush.github.io/qetafhoney/` will update automatically in about 30 seconds!

---

© Qetaf Honey — All Rights Reserved.
