begin;

insert into public.projects (
  id, slug, title, subtitle, summary, category, year, department,
  cover_image_url, github_url, repository_url, status, published_at
)
values (
  '81111111-1111-4111-8111-111111111111',
  'akilli-otopark',
  'Akıllı Otopark Sistemi',
  'İki park alanını mesafe sensörleriyle sınıflandıran, yerel uyarı ve ThingSpeak aktarımı sunan ESP32 uygulaması',
  'İki HC-SR04 sensörüyle park alanlarını boş, dolu, yabancı cisim veya arızalı olarak izleyen; OLED, durum LED’leri ve buzzer ile geri bildirim veren, bağlantı kesintilerinde veriyi geçici olarak kuyruklayan akıllı otopark projesi.',
  'IoT Akıllı Otopark',
  2026, 'Elektrik-Elektronik Mühendisliği',
  'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/akilli-otopark/cover.png',
  null, null, 'published', '2026-09-09T00:00:00+03:00'
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle, summary = excluded.summary,
  category = excluded.category, year = excluded.year, department = excluded.department,
  cover_image_url = excluded.cover_image_url, github_url = excluded.github_url,
  repository_url = excluded.repository_url, status = excluded.status,
  published_at = excluded.published_at, updated_at = now();

insert into public.students (id, name, department, avatar_url, github_url)
values ('82222222-2222-4222-8222-222222222222', 'Hatice Bozkurt', 'Elektrik-Elektronik Mühendisliği', null, null)
on conflict (id) do update set
  name = excluded.name, department = excluded.department,
  avatar_url = excluded.avatar_url, github_url = excluded.github_url;

insert into public.project_students (project_id, student_id, role, display_order)
select projects.id, '82222222-2222-4222-8222-222222222222', 'Geliştirici', 1
from public.projects where projects.slug = 'akilli-otopark'
on conflict (project_id, student_id) do update set
  role = excluded.role, display_order = excluded.display_order;

insert into public.technologies (name, category) values
  ('ESP32', 'Mikrodenetleyici'), ('Arduino', 'Gömülü yazılım'),
  ('HC-SR04', 'Ultrasonik mesafe sensörü'), ('SSD1306 OLED', 'Görüntüleme'),
  ('Durum LED’leri', 'Görsel uyarı'), ('Buzzer', 'Sesli uyarı'),
  ('ThingSpeak', 'Bulut platformu'), ('ArduinoJson', 'Veri serileştirme'),
  ('HTTPS', 'İletişim')
on conflict (name) do update set category = excluded.category;

insert into public.project_technologies (project_id, technology_id, display_order)
select projects.id, technologies.id, technology_order.display_order
from public.projects
cross join (values
  ('ESP32', 1), ('Arduino', 2), ('HC-SR04', 3), ('SSD1306 OLED', 4),
  ('Durum LED’leri', 5), ('Buzzer', 6), ('ThingSpeak', 7),
  ('ArduinoJson', 8), ('HTTPS', 9)
) as technology_order(name, display_order)
join public.technologies on technologies.name = technology_order.name
where projects.slug = 'akilli-otopark'
on conflict (project_id, technology_id) do update set display_order = excluded.display_order;

insert into public.project_sections (
  id, project_id, section_key, title, section_type, content, display_order, is_visible
)
select section_data.id::uuid, projects.id, section_data.section_key,
  section_data.title, section_data.section_type, section_data.content,
  section_data.display_order, true
from public.projects
cross join (values
  (
    '84000000-0000-4000-8000-000000000001', 'overview', 'Proje Özeti', 'text',
    $json${"paragraphs":["Proje, iki park alanını ayrı HC-SR04 sensörleriyle ölçer ve her alan için boş, dolu, yabancı cisim veya arızalı durumlarından birini üretir. Karar, ölçülen mesafenin kodda tanımlı kör nokta, araç ve tavan eşikleriyle karşılaştırılmasıyla verilir.","Anlık doluluk oranı ile boş alanlar OLED ekranda gösterilir. Durum değişiklikleri LED çıkışlarına, sesli uyarı desenlerine, seri porttaki JSON çıktısına ve ThingSpeak alanlarına yansıtılır."]}$json$::jsonb, 1
  ),
  (
    '84000000-0000-4000-8000-000000000002', 'system_architecture', 'Sistem Mimarisi ve Veri Akışı', 'architecture',
    $json${"nodes":[{"id":"sensor-a","label":"HC-SR04 A","subtitle":"Slot A mesafe ölçümü","kind":"device"},{"id":"sensor-b","label":"HC-SR04 B","subtitle":"Slot B mesafe ölçümü","kind":"device"},{"id":"esp32","label":"ESP32","subtitle":"Durum sınıflandırma ve filtreleme","kind":"device"},{"id":"oled","label":"128 x 64 OLED","subtitle":"Doluluk ve uyarılar","kind":"monitor"},{"id":"signals","label":"LED ve Buzzer","subtitle":"Yerel geri bildirim","kind":"device"},{"id":"wifi","label":"Wi-Fi / HTTPS","subtitle":"Bulut bağlantısı","kind":"network"},{"id":"thingspeak","label":"ThingSpeak","subtitle":"A, B ve doluluk alanları","kind":"server"}],"connections":[{"from":"sensor-a","to":"esp32","label":"Mesafe A"},{"from":"sensor-b","to":"esp32","label":"Mesafe B"},{"from":"esp32","to":"oled","label":"Durum ekranı"},{"from":"esp32","to":"signals","label":"Durum değişikliği"},{"from":"esp32","to":"wifi","label":"HTTPS POST"},{"from":"wifi","to":"thingspeak","label":"field1 / field2 / field3"}]}$json$::jsonb, 2
  ),
  (
    '84000000-0000-4000-8000-000000000003', 'slot_states', 'Park Alanı Durumları', 'metrics',
    $json${"metrics":[{"name":"Boş","description":"Mesafe 4 cm’nin altında veya 40 cm ve üzerindeyse alan boş kabul edilir."},{"name":"Dolu","description":"Mesafe 4 cm ile 25 cm arasındaysa araç bulunduğu kabul edilir."},{"name":"Yabancı Cisim","description":"Mesafe 25 cm ile 40 cm arasındaysa alan yabancı cisim durumuna geçer."},{"name":"Arızalı","description":"HC-SR04 echo darbesi 24.000 mikrosaniyelik sürede alınamazsa sensör ölçümü arızalı sayılır."}]}$json$::jsonb, 3
  ),
  (
    '84000000-0000-4000-8000-000000000004', 'state_filtering', 'Durum Doğrulama ve Geçişler', 'text',
    $json${"paragraphs":["Tek bir mesafe okuması normal durum değişikliği için yeterli değildir. Aynı ham sınıfın iki örnek boyunca görülmesi beklenir; ardından boş ve dolu geçişleri iki saniye, yabancı cisim geçişi yedi saniye korunursa yeni durum uygulanır.","Echo zaman aşımı arıza olarak doğrudan uygulanır. Arızadan çıkışta ise yeni ölçümün iki örnekle doğrulanması ve ilgili bekleme süresini tamamlaması gerekir. İki ultrasonik sensörün birbirini etkilemesini azaltmak için genel ping okumaları arasında en az 100 ms bırakılır."]}$json$::jsonb, 4
  ),
  (
    '84000000-0000-4000-8000-000000000005', 'local_feedback', 'OLED, LED ve Sesli Uyarılar', 'text',
    $json${"paragraphs":["OLED ekranda doluluk yüzdesi ve boş alanların A/B listesi yer alır. Bir veya iki sensör arızalıysa kullanım dışı uyarısı; yabancı cisim algılanırsa ilgili alanı belirten mesaj gösterilir.","Durum değişiminden sonra her alanın LED çıkışları güncellenir. Boş olmayan bir durumdan boşa geçişte buzzer 500 ms çalar; yabancı cisim durumuna ilk geçişte 100 ms adımlardan oluşan üç kısa ses darbesi uygulanır."]}$json$::jsonb, 5
  ),
  (
    '84000000-0000-4000-8000-000000000006', 'cloud_transfer', 'ThingSpeak ve Seri Veri Çıkışı', 'text',
    $json${"paragraphs":["Her durum değişikliğinde seri porta zaman damgası, doluluk oranı ve iki alanın metin durumlarını içeren JSON yazılır. ThingSpeak POST isteğinde field1 Slot A, field2 Slot B ve field3 doluluk yüzdesi için kullanılır.","Bulut değerlemesinde boş alan 0, dolu ve yabancı cisim 1, arızalı alan -1 olarak kodlanır. Doluluk yüzdesinde arızalı alanlar hesaba katılmaz; yabancı cisim durumundaki alanlar dolu sayılır."]}$json$::jsonb, 6
  ),
  (
    '84000000-0000-4000-8000-000000000007', 'resilience_and_timing', 'Bağlantı Dayanıklılığı ve Zamanlama', 'statistics',
    $json${"items":[{"value":"2","label":"Bağımsız park alanı"},{"value":"10","label":"Çevrimdışı paket kapasitesi"},{"value":"16 sn","label":"ThingSpeak gönderimleri arası alt sınır"},{"value":"5 sn","label":"Wi-Fi ve bulut erişim kontrolü"}],"description":"Wi-Fi bağlantısı beklenmeden sistem başlatılır. Gönderilemeyen paketler on elemanlı dairesel belleğe alınır; bellek dolduğunda en eski kayıt bırakılarak yeni kayıt tutulur. Bağlantı geri geldiğinde kuyruk, 16 saniyelik gönderim aralığı korunarak işlenir."}$json$::jsonb, 7
  ),
  (
    '84000000-0000-4000-8000-000000000008', 'thresholds', 'Mesafe ve Geçiş Eşikleri', 'statistics',
    $json${"items":[{"value":"4 cm","label":"Kör nokta sınırı"},{"value":"25 cm","label":"Araç sınıflandırma eşiği"},{"value":"40 cm","label":"Tavan / boş alan sınırı"},{"value":"250 ms","label":"Alan başına sensör okuma aralığı"}],"description":"Normal boş ve dolu geçişleri iki saniye, yabancı cisim geçişi yedi saniye kararlı kalmalıdır. HC-SR04 tetik darbesi 10 mikrosaniye, echo zaman aşımı 24.000 mikrosaniyedir."}$json$::jsonb, 8
  ),
  (
    '84000000-0000-4000-8000-000000000009', 'limitations', 'Koddan Görülen Sınırlar', 'text',
    $json${"paragraphs":["Araç ve yabancı cisim ayrımı yalnızca mesafe aralıklarına dayanır; kodda nesne türünü doğrulayan ek bir sensör veya görüntü işleme adımı bulunmaz. ThingSpeak verisinde dolu ile yabancı cisim aynı 1 değerine dönüştüğü için bu iki durum bulut alanından tek başına ayırt edilemez.","Bulut isteğinde kullanılan WiFiClientSecure istemcisinde sertifika doğrulaması setInsecure çağrısıyla kapatılmıştır. Çevrimdışı kuyruk RAM’de tutulur; kodda yeniden başlatma sonrasında kayıtları koruyan kalıcı depolama yoktur."]}$json$::jsonb, 9
  ),
  (
    '84000000-0000-4000-8000-000000000010', 'results', 'Sonuç', 'conclusion',
    $json${"paragraphs":["Proje, iki ultrasonik sensörün ham mesafe ölçümlerini zaman doğrulamalı park durumlarına çevirir; doluluk, arıza ve yabancı cisim bilgisini OLED, LED, buzzer ve seri JSON üzerinden sunar.","ThingSpeak aktarım aralığı koruması, Wi-Fi yeniden bağlanma denemeleri ve on paketlik çevrimdışı kuyruk, yerel izleme sürerken bulut bağlantısındaki geçici kesintilerin yönetilmesini sağlar."]}$json$::jsonb, 10
  ),
  (
    '84000000-0000-4000-8000-000000000011', 'research_context', 'Proje Bağlamı', 'text',
    $json${"paragraphs":[],"items":["İki alanlı akıllı otopark","HC-SR04 mesafe ölçümü","Zaman doğrulamalı durum makinesi","Yabancı cisim ve sensör arızası","OLED, LED ve buzzer geri bildirimi","Çevrimdışı kuyruklu ThingSpeak aktarımı"]}$json$::jsonb, 11
  )
) as section_data(id, section_key, title, section_type, content, display_order)
where projects.slug = 'akilli-otopark'
on conflict (project_id, section_key) do update set
  title = excluded.title, section_type = excluded.section_type,
  content = excluded.content, display_order = excluded.display_order,
  is_visible = excluded.is_visible;

commit;
