#!/usr/bin/env python3
"""
Qetaf Honey - Data Sync & Validation Tool
Usage:
    python scripts/sync_data.py
Validates the data/products.xlsx file, checks that all image paths exist on disk,
and updates data/products.json as an offline/preview backup.
"""

import os
import sys
import json

# Ensure UTF-8 output on Windows
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

try:
    import openpyxl
except ImportError:
    print("Error: openpyxl is required. Run: pip install openpyxl")
    sys.exit(1)

EXCEL_PATH = os.path.join("data", "products.xlsx")
JSON_PATH = os.path.join("data", "products.json")

def sheet_to_dicts(ws):
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []
    headers = [str(h).strip() for h in rows[0] if h is not None]
    data = []
    for row in rows[1:]:
        if all(c is None for c in row):
            continue
        entry = {}
        for h, v in zip(headers, row):
            entry[h] = "" if v is None else v
        data.append(entry)
    return data

def main():
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: {EXCEL_PATH} not found!")
        sys.exit(1)

    print(f"Loading {EXCEL_PATH}...")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    
    output = {}
    missing_images = []
    
    # 1. Products
    if "Products" in wb.sheetnames:
        products = sheet_to_dicts(wb["Products"])
        output["Products"] = products
        print(f"✓ Found {len(products)} products")
        
        for p in products:
            img_paths = str(p.get("image_paths", "")).split(",")
            for img in img_paths:
                clean_img = img.strip()
                if clean_img and not os.path.exists(clean_img):
                    missing_images.append((p.get("name_ar", p.get("id")), clean_img))

    # 2. Hero Offers
    if "HeroOffers" in wb.sheetnames:
        hero = sheet_to_dicts(wb["HeroOffers"])
        output["HeroOffers"] = hero
        print(f"✓ Found {len(hero)} hero slider offers")

    # 3. Small Offers
    if "SmallOffers" in wb.sheetnames:
        small = sheet_to_dicts(wb["SmallOffers"])
        output["SmallOffers"] = small
        print(f"✓ Found {len(small)} small offer cards")

    # 4. Settings
    if "Settings" in wb.sheetnames:
        settings_rows = sheet_to_dicts(wb["Settings"])
        settings_dict = {}
        for r in settings_rows:
            key = r.get("key")
            if key:
                settings_dict[key] = {
                    "value_ar": str(r.get("value_ar", "")),
                    "value_en": str(r.get("value_en", "")),
                    "description": str(r.get("description", ""))
                }
        output["Settings"] = settings_dict
        print(f"✓ Found {len(settings_dict)} configuration settings")

    # Write backup JSON
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"✓ Successfully synced to {JSON_PATH}")

    if missing_images:
        print("\n[WARNING] The following image files are referenced in the Excel sheet but not found on disk:")
        for item, img in missing_images:
            print(f"  - [{item}]: {img}")
    else:
        print("✓ All referenced image files exist on disk!")

if __name__ == "__main__":
    main()
