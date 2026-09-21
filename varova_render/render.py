import os, io, math, wave, random
from pathlib import Path
import requests
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

OUT = Path('render_out')
OUT.mkdir(exist_ok=True)
AS = OUT/'assets'; AS.mkdir(exist_ok=True)
W,H = 1080,1920
BG=(10,12,15); GOLD=(212,171,93); WHITE=(247,245,240); MUTED=(185,188,194)
UA={'User-Agent':'Mozilla/5.0 (VAROVA render)'}

products = [
('10.000mAh Manyetik Kablosuz Powerbank','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sd4399be9150146d4b0ce48c5b69054c51.webp?v=1789144798',1),
('16 Renk RGB Akıllı LED Ampul','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sea1b8f6023884c09a293e34b356d24a1C.webp?v=1789144800',1),
('1690 Parça Yeşil Yarış Arabası','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sef739690654247de8052134e00a7b4e4c_57d3c26f-3a98-4c56-95f2-7cebd0a905cc.webp?v=1788749186',1),
('3 Katlı Masaüstü Organizer','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S755aa4a5b35e4a1999f51d2ac58d3947K_fbba6512-eb07-46f2-a347-12268883e78e.webp?v=1788749178',1),
("3'ü 1 Arada Telefon Kamera Lensi",'https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S139041e14ab44fe189755ab5d2b6a7eaj_1412506c-89bf-4459-96a1-5fa1f0ccea70.webp?v=1788749176',1),
('8 Parça Makyaj Fırçası Seti','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S72293618177949f5ba546519de6734178_ddf155b2-558b-4001-a459-84bfdacf880e.webp?v=1788749176',1),
('Akıllı Saat','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sedb51be55bec4b74a6bafbcb501c4662P_a6e8f1fd-0761-44b8-b69f-00a92e88ec07.webp?v=1788749184',1),
('Bilek Direnç Bantları Seti','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S1e18cdd8c0c34e64a764964d6a0004a18_d32b6f29-4e31-457a-80ed-258c4c8d7dde.webp?v=1788749182',1),
('Doğal Pamuklu Sabun Torbası 3lü','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S887cb20cd63043b9b775250ae705c21cs.webp?v=1789144798',1),
('Elektrikli Otomatik Şarap Açacağı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S697c6824e58d4c2f8ed4b9178cc104b62_abbbbb70-0910-44e2-bd10-135ad3af18e1.webp?v=1788749183',1),
('Erkek Sakal Bakım Yağı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S33765229047f48ba9252db039b381233C.webp?v=1789144800',1),
('Evcil Hayvan Tüy Temizleme Fırçası','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S795471ee870e4949a0244b9b0987c1fea_2412f809-75d0-49c3-a8c4-9f8861c7fb23.webp?v=1788749182',1),
('Egzersiz Bantları Fitness Lastiği','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Scf8e953e24744877ba27a84667e3eb9c4_abb30d05-ca85-445c-8a71-d1af92bf9186.webp?v=1788749180',1),
('Kablosuz Araç Elektrik Süpürgesi','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S107e672bdaa54ca99116df51c42a9bc7U_80fc6b20-ebf5-4c54-a1e2-7145fcc23a95.webp?v=1788749185',1),
('Kozmetik & Seyahat Organizer Çantası','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S7c18e0266ecb4d758b0a36fdfab167c52_e6b87c87-0ef1-4d5a-93dc-c07bb53bea84.webp?v=1788749183',1),
('Kore Kolajen Yüz Maskesi','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S92432142999345098b375816c23db14fF.webp?v=1789146312',0),
('LED Aydınlatmalı Makyaj Aynası','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S5f42918fa1f0421c9d30ee47925b9f9dN_88913633-219c-4d12-922b-901c05556438.webp?v=1788749185',1),
('Mini Süt Köpürtücü','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S8c91cb6abb564934b997e8073b1d3d3ax.webp?v=1789144797',1),
('Otomatik Şarjlı Kedi Oyun Topu','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sa4972f8f41cb48098d5c4dbc007b56a6v.webp?v=1789144802',1),
('Pilates Yoga Matı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S2519edadb8104a8a914b2c6c1ff4151bZ_5f6f07b2-f3eb-472d-8971-e02d64ec4e63.webp?v=1788749186',1),
('Şarjlı Boyun Masaj Cihazı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Se6357c12c7fb44de9ecfa0259d4fcedbc_c87337a0-a965-4398-a05d-06dd9906293b.webp?v=1788749178',1),
('Sebze Doğrayıcı ve Rende','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sd9f83ca48e854b40a86c1d43e4948ab3X_7abe2a6c-201f-44f5-aa9f-00930159f4aa.webp?v=1788749177',1),
('Silikon Fırın & Hamur Açma Matı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sf9829ea58cae4fd1b4b6318e314002fcE_7544c3da-6e49-49f6-a8fd-06c2d6a23f2e.webp?v=1788749184',1),
('Su Geçirmez Şeffaf Telefon Kılıfı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S5b2b27690b524a3db3acf0b9403d818fe_45cfdbfa-5cdb-48d4-9f97-d8014f648fa1.webp?v=1788749180',1),
('Taşınabilir Mini Boyun Fanı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/Sdfd39cb079384032b4c6d9a224888f5aL_09220295-f1ec-4a29-b9f7-e988df39566c.webp?v=1788749183',1),
('Telefon LED Selfie Halka Işığı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S6da0d1927ec5440f949b707bc719db886_016b0030-72af-4d49-ac55-cb1f0dc8c58c.webp?v=1788749179',1),
('Yuvarlak Evcil Hayvan Yatağı','https://cdn.shopify.com/s/files/1/0848/1243/1608/files/S6eb082fa1c6f405c83fd15aa6169258dd.webp?v=1789147190',0),
]

backgrounds={
 'tech':'https://images.pexels.com/photos/4141077/pexels-photo-4141077.jpeg?auto=compress&cs=tinysrgb&w=1600',
 'kitchen':'https://images.pexels.com/photos/20555725/pexels-photo-20555725/free-photo-of-cooker-on-a-counter-top.jpeg?auto=compress&cs=tinysrgb&w=1600',
 'fitness':'https://images.pexels.com/photos/4587418/pexels-photo-4587418.jpeg?auto=compress&cs=tinysrgb&w=1600',
 'pets':'https://images.pexels.com/photos/27806129/pexels-photo-27806129/free-photo-of-a-cat-and-dog-are-on-the-floor-in-a-living-room.jpeg?auto=compress&cs=tinysrgb&w=1600',
}

def fetch_img(url, name):
    p=AS/name
    if p.exists(): return Image.open(p).convert('RGB')
    try:
        r=requests.get(url,headers=UA,timeout=30); r.raise_for_status()
        p.write_bytes(r.content)
        return Image.open(io.BytesIO(r.content)).convert('RGB')
    except Exception as e:
        print('download failed',url,e)
        return Image.new('RGB',(900,900),(34,36,42))

imgs=[fetch_img(url,f'p{i:02d}.webp') for i,(_,url,_) in enumerate(products)]
bgimgs={k:fetch_img(u,f'bg_{k}.jpg') for k,u in backgrounds.items()}
font_b='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font_r='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def font(size,bold=True): return ImageFont.truetype(font_b if bold else font_r,size)
def cover(im): return ImageOps.fit(im,(W,H),method=Image.Resampling.LANCZOS)
def dim_bg(im,strength=150):
    im=cover(im).convert('RGBA'); im.alpha_composite(Image.new('RGBA',(W,H),(4,7,10,strength))); return im.convert('RGB')
def rounded_mask(size,r):
    m=Image.new('L',size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,size[0]-1,size[1]-1),r,fill=255); return m
def paste_card(canvas, im, box, title=None, stock=1, label=False):
    x,y,w,h=box
    shadow=Image.new('RGBA',(w+30,h+30),(0,0,0,0)); ImageDraw.Draw(shadow).rounded_rectangle((15,15,w+14,h+14),28,fill=(0,0,0,110)); canvas.alpha_composite(shadow,(x-15,y-5))
    card=Image.new('RGBA',(w,h),(247,247,245,255)); ih=h-74 if label else h
    thumb=ImageOps.contain(im,(w-24,ih-20),Image.Resampling.LANCZOS); card.alpha_composite(thumb.convert('RGBA'),((w-thumb.width)//2,10+(ih-thumb.height)//2))
    if label:
        cd=ImageDraw.Draw(card); cd.rectangle((0,h-74,w,h),fill=(17,20,25,245)); txt=title or ''; f=font(21,False)
        while cd.textbbox((0,0),txt,font=f)[2] > w-24 and len(txt)>6: txt=txt[:-2]+'…'
        cd.text((12,h-52),txt,font=f,fill=WHITE)
        if not stock:
            cd.rounded_rectangle((w-160,10,w-10,42),12,fill=(185,122,53,240)); cd.text((w-148,16),'STOK YENİLENİYOR',font=font(12,True),fill=WHITE)
    canvas.paste(card,(x,y),rounded_mask((w,h),30))
def header(canvas,kicker,title,sub=None):
    d=ImageDraw.Draw(canvas); d.rounded_rectangle((70,90,360,146),18,outline=GOLD,width=2,fill=(12,15,19,180)); d.text((92,103),kicker,font=font(25,False),fill=GOLD)
    d.text((70,190),title,font=font(74,True),fill=WHITE)
    if sub: d.text((72,285),sub,font=font(29,False),fill=(225,226,229))
    d.rounded_rectangle((70,350,380,360),5,fill=GOLD)
def save_scene(n,im): im.convert('RGB').save(OUT/f'scene{n}.png',quality=94)

s=dim_bg(bgimgs['tech'],185).convert('RGBA'); d=ImageDraw.Draw(s); header(s,'15 SANİYEDE','27 ÜRÜN.','TEK MAĞAZA • VAROVA')
selected=[0,1,6,17,13,18,19,11,25]; positions=[(70+c*315,470+r*355,280,315) for r in range(3) for c in range(3)]
for idx,box in zip(selected,positions): paste_card(s,imgs[idx],box)
d.text((70,1585),'TEKNOLOJİDEN EV YAŞAMINA',font=font(39),fill=WHITE); d.text((70,1645),'günlük hayat için seçilmiş ürünler',font=font(29,False),fill=MUTED); d.text((70,1770),'VAROVA',font=font(62),fill=GOLD); save_scene(1,s)

def cat_scene(n,bgkey,kicker,title,indices):
    s=dim_bg(bgimgs[bgkey],175).convert('RGBA'); header(s,kicker,title); xs=[70,580]; count=len(indices)
    for j,idx in enumerate(indices):
        r=j//2; c=j%2; cardh=320 if count>=7 else 380; y0=(400+r*350) if count>=7 else (430+r*410)
        paste_card(s,imgs[idx],(xs[c],y0,430,cardh),products[idx][0],products[idx][2],True)
    ImageDraw.Draw(s).text((70,1780),'VAROVA',font=font(48),fill=GOLD); save_scene(n,s)
cat_scene(2,'tech','SEÇKİ 01','TEKNOLOJİ',[0,1,4,6,25])
cat_scene(3,'kitchen','SEÇKİ 02','EV & MUTFAK',[3,8,9,17,21,22])
cat_scene(4,'fitness','SEÇKİ 03','FITNESS & BAKIM',[5,7,10,12,14,16,19,20])
cat_scene(5,'pets','SEÇKİ 04','EV • SEYAHAT • OTO',[11,13,18,23,24,26])

s=Image.new('RGBA',(W,H),BG+(255,)); d=ImageDraw.Draw(s)
for x in range(0,W,120): d.line((x,0,x,H),fill=(21,24,29,255),width=1)
for y in range(0,H,120): d.line((0,y,W,y),fill=(21,24,29,255),width=1)
header(s,'TÜM SEÇKİ','27 ÜRÜN','Tek bakışta VAROVA')
cols=5; margin=45; gap=14; cw=(W-2*margin-(cols-1)*gap)//cols; ch=210
for i,im in enumerate(imgs):
    r=i//cols; c=i%cols; x=margin+c*(cw+gap); y=420+r*(ch+16); paste_card(s,im,(x,y,cw,190 if y+ch>1690 else ch))
d.text((55,1745),'Gerçek mağaza ürün görselleri',font=font(28,False),fill=MUTED); d.text((55,1805),'VAROVA',font=font(54),fill=GOLD); save_scene(6,s)

s=Image.new('RGBA',(W,H),BG+(255,)); d=ImageDraw.Draw(s)
for r in [560,880,1200]: d.ellipse((W//2-r//2,H//2-r//2-100,W//2+r//2,H//2+r//2-100),outline=(57,48,31,255),width=2)
d.rounded_rectangle((75,150,365,165),8,fill=GOLD); d.rounded_rectangle((75,220,265,280),18,outline=GOLD,width=2); d.text((100,232),'VAROVA',font=font(30,False),fill=GOLD)
d.text((75,520),'HAYATI',font=font(96),fill=WHITE); d.text((75,645),'KOLAYLAŞTIRAN',font=font(63),fill=WHITE); d.text((75,740),'SEÇİMLER.',font=font(96),fill=WHITE)
d.text((78,930),'Teknoloji • Ev & yaşam • Fitness • Bakım',font=font(31,False),fill=MUTED); d.rounded_rectangle((75,1080,630,1190),30,outline=GOLD,width=2,fill=(18,22,28,255)); d.text((115,1110),'MAĞAZAYI KEŞFET',font=font(43),fill=GOLD)
d.text((75,1540),'VAROVA',font=font(70),fill=GOLD); d.line((75,1635,1005,1635),fill=GOLD,width=2); d.text((75,1680),'Güvencenin adresi.',font=font(38,False),fill=WHITE); save_scene(7,s)

sr=48000; N=int(sr*15); t=np.arange(N)/sr; rng=np.random.default_rng(7); a=np.zeros(N)
for f,amp in [(55,.045),(110,.018),(220,.010)]: a += amp*np.sin(2*np.pi*f*t)
for beat in np.arange(0,15,.5):
    st=int(beat*sr); L=min(int(.18*sr),N-st); tt=np.arange(L)/sr; env=np.exp(-tt*20); freq=75-30*(tt/.18); phase=2*np.pi*np.cumsum(freq)/sr; a[st:st+L]+=.22*np.sin(phase)*env
noise=rng.standard_normal(N)
for beat in np.arange(.5,15,1.0):
    st=int(beat*sr); L=min(int(.10*sr),N-st); tt=np.arange(L)/sr; a[st:st+L]+=.035*noise[st:st+L]*np.exp(-tt*35)
for beat in np.arange(.25,15,.25):
    st=int(beat*sr); L=min(int(.025*sr),N-st); tt=np.arange(L)/sr; a[st:st+L]+=.018*noise[st:st+L]*np.exp(-tt*90)
notes=[146.83,174.61,220,196,174.61,220,246.94,220]
for i,beat in enumerate(np.arange(.5,13,.5)):
    f=notes[i%len(notes)]; st=int(beat*sr); L=min(int(.38*sr),N-st); tt=np.arange(L)/sr; a[st:st+L]+=.035*np.sin(2*np.pi*f*tt)*np.exp(-tt*8)
env=np.ones(N); env[:int(.15*sr)]=np.linspace(0,1,int(.15*sr)); env[int(13*sr):]*=np.linspace(1,.28,N-int(13*sr)); a*=env; a=np.tanh(a*1.7)*.75
pcm=(np.clip(np.stack([a,a],1),-1,1)*32767).astype(np.int16)
with wave.open(str(OUT/'bed.wav'),'wb') as wf: wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr); wf.writeframes(pcm.tobytes())
