# 🍯 قطاف العسل | Qetaf Honey

A modern, fast, and fully responsive e-commerce web application for 100% pure raw honey and hive products. Designed specifically for hosting on **GitHub Pages** with **no backend database required**—all products, discounts, hero offers, announcement banners, and contact information are dynamically driven by an editable local Excel spreadsheet (`data/products.xlsx`).

---

## ✨ Key Features

- **Dynamic Excel Database (`data/products.xlsx`)**:
  Add, edit, or remove products, categories, tags, discounts, and banners directly in Microsoft Excel or Google Sheets. The website parses the spreadsheet on-the-fly via SheetJS.
- **Bilingual & Localized (Arabic & English)**:
  - **Arabic by default** with proper Right-to-Left (RTL) formatting and `Cairo` typography.
  - **English switchable** with Left-to-Right (LTR) and `Outfit` typography.
  - Language preference is cached in the browser's `localStorage`.
- **Top Announcement Banner**:
  Controlled from the Excel sheet. Hidden automatically if the cell is empty.
- **Top Middle Logo & Top Right Language Switcher**:
  Precisely matches branding and layout specifications.
- **Hero Swiping Offers Carousel**:
  Touch-swipeable and responsive banner cards highlighting current seasonal offers with auto-advance and indicators.
- **Landing Small Cards**:
  The first card is a dedicated action card leading to the products catalog; subsequent cards highlight special promotions.
- **Products Catalog with Real-Time Filtering**:
  - Filter by category tag (e.g. Sidr, Floral, Herbal, Hive Products, Gift Sets).
  - Search in real-time by Arabic/English keywords.
  - Sort by price, discount, or title.
  - Product cards featuring square images (1:1), stock badges (`In Stock` / `Out of Stock`), and prices with **red strikethrough lines on original prices** whenever a discount is active.
- **Product Gallery Modal (Multi-Image Flip)**:
  Clicking any product opens an interactive modal allowing customers to flip through all product images using arrows or thumbnail previews.
- **Persistent Shopping Cart & Smart Checkout**:
  - Cart persists across reloads and visits.
  - Customer details (Name, Phone, Governorate, City, Street, Building, Apt, Landmark, Notes, Email) are cached in `localStorage`.
  - **Upon checkout completion, the cart is cleared while customer details remain saved** for friction-free future orders.
  - Displays `"Order Complete, we will contact you soon"` (or Arabic equivalent) on completion.
  - Dispatches email alerts to both buyer and store owner via EmailJS + provides an instant one-click WhatsApp order confirmation option.
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
| **Hero Slider Banners** | `assets/images/landing/hero/` | **2.3 : 1** or **16 : 9** | **1600 × 700 px** (or 1920 × 800 px) | JPG / WebP (< 250 KB) |
| **Small Offer Cards** | `assets/images/landing/offers/` | **4 : 3** | **800 × 600 px** | JPG / WebP (< 180 KB) |
| **Product Images** | `assets/images/products/{product-slug}/` | **1 : 1 (Square)** | **800 × 800 px** (or 1000 × 1000 px) | JPG / WebP (< 200 KB) |

> 💡 **Image Flipping Tip**: Place multiple images inside each product folder (e.g., `1.jpg`, `2.jpg`, `3.jpg`). In `data/products.xlsx`, list their paths separated by commas:
> `assets/images/products/sidr-kashmiri/1.jpg, assets/images/products/sidr-kashmiri/2.jpg, assets/images/products/sidr-kashmiri/3.jpg`

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
│       ├── landing/
│       │   ├── hero/            # Hero carousel banner images
│       │   └── offers/          # Smaller offer card images
│       └── products/            # Individual folders per product
│           ├── sidr-kashmiri/   # 1.jpg, 2.jpg, 3.jpg
│           ├── black-seed/
│           ├── mountain-wild/
│           ├── citrus-blossom/
│           ├── clover-honey/
│           ├── propolis-honey/
│           ├── royal-jelly-blend/
│           └── gift-box-trio/
│
└── scripts/
    ├── generate_excel.py        # Generates clean sample Excel workbook
    ├── generate_placeholders.py # Generates placeholder honey visuals
    └── sync_data.py             # Verifies data integrity & image paths
```

---

## 🚀 Deployment to GitHub Pages

1. **Commit and Push to GitHub**:
   ```bash
   git add .
   git commit -m "Launch Qetaf Honey store"
   git push -u origin main
   ```
2. **Enable GitHub Pages**:
   - Navigate to your repository: `https://github.com/MohamedBarghush/qetafhoney`.
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Set the branch to `main` and directory to `/ (root)`.
   - Click **Save**.
3. **Your Site is Live**:
   Your website will be published at:
   `https://mohamedbarghush.github.io/qetafhoney/`

---

## 🛠️ Data Sync Helper Tool

To verify that all product images exist on disk and keep `data/products.json` updated with `data/products.xlsx`:
```bash
python scripts/sync_data.py
```

---

© Qetaf Honey — All Rights Reserved.
