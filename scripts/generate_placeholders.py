import os
import math
from PIL import Image, ImageDraw, ImageFont

def draw_honeycomb(draw, width, height, hex_radius=30, stroke_color=(255, 230, 150, 40)):
    dx = hex_radius * 1.5
    dy = hex_radius * math.sqrt(3)
    rows = int(height / dy) + 2
    cols = int(width / dx) + 2
    for r in range(rows):
        for c in range(cols):
            cx = c * dx
            cy = r * dy + (dx if c % 2 == 1 else 0) * (math.sqrt(3)/2)
            points = []
            for i in range(6):
                angle_deg = 60 * i - 30
                angle_rad = math.pi / 180 * angle_deg
                px = cx + hex_radius * math.cos(angle_rad)
                py = cy + hex_radius * math.sin(angle_rad)
                points.append((px, py))
            draw.polygon(points, outline=stroke_color)

def create_gradient(width, height, color1, color2):
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        ratio = y / height
        mask_data.extend([int(ratio * 255)] * width)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_honey_jar(draw, cx, cy, size=150, color=(240, 160, 20)):
    w, h = size * 0.8, size
    # Jar body
    draw.rounded_rectangle([cx - w/2, cy - h/2 + 20, cx + w/2, cy + h/2], radius=18, fill=color, outline=(180, 110, 10), width=4)
    # Honey level
    draw.rounded_rectangle([cx - w/2 + 6, cy - h/4, cx + w/2 - 6, cy + h/2 - 6], radius=14, fill=(253, 215, 104))
    # Label on jar
    draw.rounded_rectangle([cx - w/2 + 12, cy - 10, cx + w/2 - 12, cy + 30], radius=6, fill=(255, 255, 255), outline=(210, 160, 50), width=2)
    # Lid
    draw.rounded_rectangle([cx - w/2 - 6, cy - h/2 + 10, cx + w/2 + 6, cy - h/2 + 26], radius=4, fill=(139, 69, 19), outline=(90, 40, 10), width=3)
    # Honey dipper drop
    draw.ellipse([cx - 8, cy + h/2 + 10, cx + 8, cy + h/2 + 26], fill=(245, 175, 25))

def generate_banner(path, text, subtext, color1, color2, width=1376, height=768):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img = create_gradient(width, height, color1, color2)
    overlay = Image.new('RGBA', (width, height), (0,0,0,0))
    draw = ImageDraw.Draw(overlay)
    draw_honeycomb(draw, width, height, hex_radius=40, stroke_color=(255, 255, 255, 30))
    
    # Decorative honey jars
    draw_honey_jar(draw, width - 240, height // 2, size=240, color=(245, 170, 25))
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw2 = ImageDraw.Draw(img)
    draw2.rectangle([80, 80, 360, 125], fill=(253, 215, 104))
    draw2.rectangle([80, 80, 360, 125], outline=(30, 30, 30), width=2)
    
    img.save(path, quality=92)
    print(f'Created banner: {path}')

def generate_product_image(path, name, view_label, bg_color1, bg_color2, jar_color, width=800, height=800):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img = create_gradient(width, height, bg_color1, bg_color2)
    overlay = Image.new('RGBA', (width, height), (0,0,0,0))
    draw = ImageDraw.Draw(overlay)
    draw_honeycomb(draw, width, height, hex_radius=32, stroke_color=(255, 255, 255, 35))
    
    # Honey Jar center
    draw_honey_jar(draw, width // 2, height // 2 - 20, size=280, color=jar_color)
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw2 = ImageDraw.Draw(img)
    draw2.rounded_rectangle([width - 190, height - 70, width - 30, height - 25], radius=10, fill=(253, 215, 104), outline=(30, 30, 30), width=2)
    
    img.save(path, quality=92)
    print(f'Created product img: {path}')

def generate_logo(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w, h = 600, 200
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy, r = 80, 100, 50
    points = []
    for i in range(6):
        ang = math.pi / 180 * (60 * i - 30)
        points.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(points, fill=(253, 215, 104), outline=(180, 120, 10), width=4)
    draw.ellipse([cx - 15, cy - 8, cx + 15, cy + 28], fill=(230, 140, 10))
    draw.polygon([(cx, cy - 28), (cx - 15, cy - 5), (cx + 15, cy - 5)], fill=(230, 140, 10))
    
    img.save(path, 'PNG')
    print(f'Created logo: {path}')

if __name__ == '__main__':
    generate_logo('assets/images/logo/logo.png')
    generate_banner('assets/images/landing/hero/hero1.jpg', 'عسل طبيعي نقي 100%', 'من مناحلنا الطبيعية إلى مائدتك', (255, 248, 225), (254, 222, 114))
    generate_banner('assets/images/landing/hero/hero2.jpg', 'عروض الموسم الذهبية', 'خصومات تصل إلى 30% على الأعسال النادرة', (255, 243, 205), (253, 195, 70))
    generate_banner('assets/images/landing/hero/hero3.jpg', 'باقات الشفاء والمناعة', 'عكبر وغذاء ملكي وعسل السدر الفاخر', (254, 240, 215), (248, 177, 51))

    generate_banner('assets/images/landing/offers/offer1.jpg', 'عسل السدر الفاخر', 'خصم 20% لفترة محدودة', (255, 250, 235), (254, 222, 114), 800, 600)
    generate_banner('assets/images/landing/offers/offer2.jpg', 'الباقة الثلاثية الاقتصادية', 'وفّر حتى 70 جنيه', (255, 245, 215), (253, 205, 86), 800, 600)
    generate_banner('assets/images/landing/offers/offer3.jpg', 'حبوب لقاح وغذاء ملكي', 'طاقة ونشاط يومي متجدد', (255, 242, 210), (250, 185, 65), 800, 600)

    products = [
        ('sidr-kashmiri', 'عسل سدر كشميري جبلي', (245, 155, 20)),
        ('black-seed', 'عسل حبة البركة النقي', (180, 100, 20)),
        ('mountain-wild', 'عسل الزهور الجبلية البرية', (250, 175, 30)),
        ('citrus-blossom', 'عسل زهور الموالح المنعش', (253, 200, 50)),
        ('clover-honey', 'عسل برسيم طبيعي بلدي', (252, 210, 80)),
        ('propolis-honey', 'عسل معجون العكبر الطبيعي', (190, 120, 30)),
        ('royal-jelly-blend', 'خلطة الغذاء الملكي وحبوب اللقاح', (250, 160, 25)),
        ('gift-box-trio', 'بوكس إهداء قطاف الفاخر', (245, 145, 15)),
    ]

    for slug, pname, jcolor in products:
        pdir = f'assets/images/products/{slug}'
        generate_product_image(f'{pdir}/1.jpg', pname, 'الصورة 1', (255, 252, 242), (254, 235, 165), jcolor)
        generate_product_image(f'{pdir}/2.jpg', pname, 'الصورة 2 (عن قرب)', (255, 250, 238), (253, 220, 130), jcolor)
        generate_product_image(f'{pdir}/3.jpg', pname, 'الصورة 3 (التغليف)', (255, 248, 232), (252, 208, 105), jcolor)

    print('All placeholder images generated successfully!')
