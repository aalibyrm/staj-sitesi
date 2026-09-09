begin;

insert into public.projects (
  id, slug, title, subtitle, summary, category, year, department,
  cover_image_url, github_url, repository_url, status, published_at
)
values (
  '71111111-1111-4111-8111-111111111111',
  'environmental-monitoring',
  'Çevresel İzleme Sistemi',
  'Sıcaklık, nem ve ışık verilerini yerel ekranda ve ThingSpeak üzerinde izleyen ESP8266 uygulaması',
  'DHT22 ile sıcaklık ve nemi, LDR ile ışık düzeyini ölçen; yüksek sıcaklık veya nemde sesli uyarı veren, seri portta JSON üreten ve üç ölçümü ThingSpeak’e aktaran çevresel izleme projesi.',
  'IoT Çevresel İzleme',
  2026, 'Bilgisayar Mühendisliği',
  'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/environmental-monitoring/cover.png',
  null, null, 'published', '2026-09-09T00:00:00+03:00'
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle, summary = excluded.summary,
  category = excluded.category, year = excluded.year, department = excluded.department,
  cover_image_url = excluded.cover_image_url, github_url = excluded.github_url,
  repository_url = excluded.repository_url, status = excluded.status,
  published_at = excluded.published_at, updated_at = now();

insert into public.students (id, name, department, avatar_url, github_url)
values ('72222222-2222-4222-8222-222222222222', 'Emirhan Yücel', 'Bilgisayar Mühendisliği', null, null)
on conflict (id) do update set
  name = excluded.name, department = excluded.department,
  avatar_url = excluded.avatar_url, github_url = excluded.github_url;

insert into public.project_students (project_id, student_id, role, display_order)
select projects.id, '72222222-2222-4222-8222-222222222222', 'Geliştirici', 1
from public.projects where projects.slug = 'environmental-monitoring'
on conflict (project_id, student_id) do update set
  role = excluded.role, display_order = excluded.display_order;

insert into public.technologies (name, category) values
  ('ESP8266', 'Mikrodenetleyici'), ('Arduino', 'Gömülü yazılım'),
  ('DHT22', 'Sıcaklık ve nem sensörü'), ('LDR', 'Işık sensörü'),
  ('SSD1306 OLED', 'Görüntüleme'), ('Buzzer', 'Sesli uyarı'),
  ('ThingSpeak', 'Bulut platformu'), ('ArduinoJson', 'Veri serileştirme')
on conflict (name) do update set category = excluded.category;

insert into public.project_technologies (project_id, technology_id, display_order)
select projects.id, technologies.id, technology_order.display_order
from public.projects
cross join (values
  ('ESP8266', 1), ('Arduino', 2), ('DHT22', 3), ('LDR', 4),
  ('SSD1306 OLED', 5), ('Buzzer', 6), ('ThingSpeak', 7), ('ArduinoJson', 8)
) as technology_order(name, display_order)
join public.technologies on technologies.name = technology_order.name
where projects.slug = 'environmental-monitoring'
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
    '74000000-0000-4000-8000-000000000001', 'overview', 'Proje Özeti', 'text',
    $json${"paragraphs":["Proje, ESP8266 üzerinde DHT22 ve LDR okumalarını bir araya getirerek ortamın sıcaklık, nem ve ışık düzeyini izler. Ölçümler OLED ekranda bağlantı durumu ve çalışma süresiyle birlikte gösterilir; seri porta JSON olarak yazılır.","Sıcaklık 30 °C’yi veya nem yüzde 70’i aştığında alarm durumu oluşur ve buzzer kısa bir uyarı verir. Sıcaklık, nem ve ışık değerleri 15 saniyede bir ThingSpeak kanalına gönderilir."]}$json$::jsonb, 1
  ),
  (
    '74000000-0000-4000-8000-000000000002', 'system_architecture', 'Sistem Mimarisi ve Veri Akışı', 'architecture',
    $json${"nodes":[{"id":"dht22","label":"DHT22","subtitle":"Sıcaklık ve nem","kind":"device"},{"id":"ldr","label":"LDR","subtitle":"A0 analog ışık okuması","kind":"device"},{"id":"esp8266","label":"ESP8266","subtitle":"Ölçüm ve eşik denetimi","kind":"device"},{"id":"oled","label":"128 x 64 OLED","subtitle":"Ölçüm ve bağlantı ekranı","kind":"monitor"},{"id":"buzzer","label":"Buzzer","subtitle":"100 ms alarm darbesi","kind":"device"},{"id":"thingspeak","label":"ThingSpeak","subtitle":"Üç ölçüm alanı","kind":"server"}],"connections":[{"from":"dht22","to":"esp8266","label":"Sıcaklık / nem"},{"from":"ldr","to":"esp8266","label":"Analog ışık"},{"from":"esp8266","to":"oled","label":"Yerel gösterim"},{"from":"esp8266","to":"buzzer","label":"Eşik alarmı"},{"from":"esp8266","to":"thingspeak","label":"Wi-Fi ile 15 sn aralıklı aktarım"}]}$json$::jsonb, 2
  ),
  (
    '74000000-0000-4000-8000-000000000003', 'measurements', 'İzlenen Çevresel Veriler', 'metrics',
    $json${"metrics":[{"name":"Sıcaklık","description":"DHT22’den santigrat derece cinsinden okunur; 30 °C üzeri alarm üretir."},{"name":"Bağıl Nem","description":"DHT22’den yüzde olarak okunur; yüzde 70 üzeri, sıcaklık alarmı yoksa nem alarmı üretir."},{"name":"Işık Düzeyi","description":"LDR’nin A0 pinindeki ham analog okumasıdır; ekranda, seri JSON’da ve ThingSpeak’te kullanılır."},{"name":"Alarm Durumu","description":"Yüksek sıcaklık veya yüksek nem koşulunu 1, normal durumu 0 olarak seri JSON’a ekler."}]}$json$::jsonb, 3
  ),
  (
    '74000000-0000-4000-8000-000000000004', 'alarm_logic', 'Eşik ve Alarm Mantığı', 'text',
    $json${"paragraphs":["Kod önce sıcaklığın 30 °C’den büyük olup olmadığını denetler. Bu koşul sağlanmıyorsa nemin yüzde 70’ten büyük olup olmadığına bakar; dolayısıyla iki eşik birlikte aşıldığında ekranda yüksek sıcaklık mesajı önceliklidir.","Alarm varken buzzer 100 milisaniye etkinleştirilip kapatılır. Işık değeri izlenmesine rağmen kodda ışığa bağlı bir alarm eşiği veya buzzer davranışı bulunmaz."]}$json$::jsonb, 4
  ),
  (
    '74000000-0000-4000-8000-000000000005', 'outputs_and_cloud', 'Ekran, Seri Çıktı ve ThingSpeak', 'text',
    $json${"paragraphs":["OLED ekranın üst satırı alarm mesajını veya sistemin normal olduğunu gösterir. Alt bölümde Wi-Fi durumu, sıcaklık, nem, ışık okuması ve açılıştan beri geçen saniye yer alır.","Her döngüde seri porta timestamp_sec, temperature, humidity, light ve alarm_status alanlarını içeren JSON yazılır. ThingSpeak aktarımında ise field1 sıcaklık, field2 nem ve field3 ışık için kullanılır; alarm durumu ve zaman damgası ThingSpeak alanlarına gönderilmez."]}$json$::jsonb, 5
  ),
  (
    '74000000-0000-4000-8000-000000000006', 'timing', 'Kodda Tanımlı Çalışma Değerleri', 'statistics',
    $json${"items":[{"value":"30 °C","label":"Yüksek sıcaklık eşiği"},{"value":"%70","label":"Yüksek nem eşiği"},{"value":"15 sn","label":"ThingSpeak gönderim aralığı"},{"value":"1 sn","label":"Ana döngü gecikmesi"}],"description":"Wi-Fi bağlantı denemesi her kontrolde en fazla 20 kez, 500 ms aralıkla yapılır. DHT22 okuma hatasında döngü bir saniye bekleyerek yeniden başlar."}$json$::jsonb, 6
  ),
  (
    '74000000-0000-4000-8000-000000000007', 'limitations', 'Koddan Görülen Sınırlar', 'text',
    $json${"paragraphs":["Alarm yalnızca üst sıcaklık ve üst nem eşiklerini denetler. Alt sıcaklık/nem sınırı, ışık alarmı, eşik histerezisi veya kalıcı alarm kaydı kodda bulunmaz.","Wi-Fi bağlantısı yokken ölçüm ve ekran akışı devam edebilir; ancak ThingSpeak için çevrimdışı veri kuyruğu tanımlanmamıştır. DHT22 sıcaklık veya nem okuması geçersiz olduğunda o döngüde ekran, seri JSON ve bulut gönderimi yapılmadan fonksiyondan dönülür."]}$json$::jsonb, 7
  ),
  (
    '74000000-0000-4000-8000-000000000008', 'results', 'Sonuç', 'conclusion',
    $json${"paragraphs":["Proje; sıcaklık, nem ve ışık verilerini tek bir ESP8266 uygulamasında toplar, yerel OLED ekranda görünür kılar ve ThingSpeak’e periyodik olarak aktarır.","Kodun alarm çıktısı, yüksek sıcaklık ve yüksek nem için ekrandaki mesaj ile kısa buzzer uyarısından oluşur; seri JSON çıktısı da ölçümlerle birlikte alarm durumunu taşır."]}$json$::jsonb, 8
  ),
  (
    '74000000-0000-4000-8000-000000000009', 'research_context', 'Proje Bağlamı', 'text',
    $json${"paragraphs":[],"items":["IoT çevresel izleme","DHT22 sıcaklık ve nem ölçümü","LDR analog ışık okuması","Eşik tabanlı sesli alarm","Seri portta JSON çıktı","ThingSpeak bulut aktarımı"]}$json$::jsonb, 9
  )
) as section_data(id, section_key, title, section_type, content, display_order)
where projects.slug = 'environmental-monitoring'
on conflict (project_id, section_key) do update set
  title = excluded.title, section_type = excluded.section_type,
  content = excluded.content, display_order = excluded.display_order,
  is_visible = excluded.is_visible;

commit;
