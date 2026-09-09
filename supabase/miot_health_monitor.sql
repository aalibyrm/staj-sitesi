begin;

insert into public.projects (
  id, slug, title, subtitle, summary, category, year, department,
  cover_image_url, github_url, repository_url, status, published_at
)
values (
  '61111111-1111-4111-8111-111111111111',
  'miot-health-monitor',
  'MIoT Sağlık Monitörü',
  'Nabız, tahmini SpO2 ve hareket verilerini izleyerek düşme tehlikesini bildiren ESP8266 tabanlı prototip',
  'Optik sensörden nabız ve SpO2 tahmini, MPU6050’den toplam ivme alan; verileri OLED ekranda gösteren ve dört alan halinde ThingSpeak’e gönderen bir sağlık izleme uygulaması.',
  'MIoT Sağlık İzleme',
  2026, 'Bilgisayar Mühendisliği',
  'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/miot-health-monitor/cover.png',
  null, null, 'published', '2026-09-09T00:00:00+03:00'
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle, summary = excluded.summary,
  category = excluded.category, year = excluded.year, department = excluded.department,
  cover_image_url = excluded.cover_image_url, github_url = excluded.github_url,
  repository_url = excluded.repository_url, status = excluded.status,
  published_at = excluded.published_at, updated_at = now();

insert into public.students (id, name, department, avatar_url, github_url)
values ('62222222-2222-4222-8222-222222222222', 'Emine Bölük', 'Bilgisayar Mühendisliği', null, null)
on conflict (id) do update set
  name = excluded.name, department = excluded.department,
  avatar_url = excluded.avatar_url, github_url = excluded.github_url;

insert into public.project_students (project_id, student_id, role, display_order)
select projects.id, '62222222-2222-4222-8222-222222222222', 'Geliştirici', 1
from public.projects where projects.slug = 'miot-health-monitor'
on conflict (project_id, student_id) do update set
  role = excluded.role, display_order = excluded.display_order;

insert into public.technologies (name, category) values
  ('ESP8266', 'Mikrodenetleyici'), ('Arduino', 'Gömülü yazılım'),
  ('MAX30102', 'Optik sensör'), ('MPU6050', 'Hareket sensörü'),
  ('SSD1306 OLED', 'Görüntüleme'), ('ThingSpeak', 'Bulut platformu'),
  ('ArduinoJson', 'Veri serileştirme'), ('HTTPS', 'İletişim')
on conflict (name) do update set category = excluded.category;

insert into public.project_technologies (project_id, technology_id, display_order)
select projects.id, technologies.id, technology_order.display_order
from public.projects
cross join (values
  ('ESP8266', 1), ('Arduino', 2), ('MAX30102', 3), ('MPU6050', 4),
  ('SSD1306 OLED', 5), ('ThingSpeak', 6), ('ArduinoJson', 7), ('HTTPS', 8)
) as technology_order(name, display_order)
join public.technologies on technologies.name = technology_order.name
where projects.slug = 'miot-health-monitor'
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
    '64000000-0000-4000-8000-000000000001', 'overview', 'Proje Özeti', 'text',
    $json${"paragraphs":["Proje, ESP8266 üzerinde optik nabız sensörü ile hareket sensörünü birlikte okuyarak temel sağlık ve hareket verilerini tek ekranda izler. Nabız, tahmini SpO2 ve toplam ivme değerleri yerel olarak gösterilir; aynı veriler belirli aralıklarla ThingSpeak’e aktarılır.","Toplam ivme belirlenen eşiği aştığında sistem düşme tehlikesi durumuna geçer. Normal ölçüm ekranı yerine beş saniye boyunca belirgin bir uyarı gösterilir ve buluta gönderilen alarm alanı 1 olur."]}$json$::jsonb, 1
  ),
  (
    '64000000-0000-4000-8000-000000000002', 'system_architecture', 'Sistem Mimarisi ve Veri Akışı', 'architecture',
    $json${"nodes":[{"id":"optical-sensor","label":"MAX30102","subtitle":"IR ve kırmızı ışık okumaları","kind":"device"},{"id":"motion-sensor","label":"MPU6050","subtitle":"Üç eksenli ivme verisi","kind":"device"},{"id":"esp8266","label":"ESP8266","subtitle":"Ölçüm ve alarm mantığı","kind":"device"},{"id":"oled","label":"128 x 64 OLED","subtitle":"Yerel durum ekranı","kind":"monitor"},{"id":"thingspeak","label":"ThingSpeak","subtitle":"Dört alanlı bulut kaydı","kind":"server"}],"connections":[{"from":"optical-sensor","to":"esp8266","label":"IR / kırmızı okuma"},{"from":"motion-sensor","to":"esp8266","label":"İvme"},{"from":"esp8266","to":"oled","label":"200 ms güncelleme"},{"from":"esp8266","to":"thingspeak","label":"Wi-Fi ile 15 sn aralıklı JSON POST"}]}$json$::jsonb, 2
  ),
  (
    '64000000-0000-4000-8000-000000000003', 'measurements', 'Ölçülen ve Hesaplanan Değerler', 'metrics',
    $json${"metrics":[{"name":"Nabız","shortName":"BPM","description":"IR sinyalindeki atımlar arasındaki süreden hesaplanır ve son dört geçerli ölçümün ortalaması alınır."},{"name":"Oksijen Doygunluğu Tahmini","shortName":"SpO2","description":"Kırmızı ışık değerinin IR değerine oranından basit bir formülle tahmin edilir ve üst sınırı yüzde 99 olarak tutulur."},{"name":"Toplam İvme","description":"MPU6050’nin x, y ve z ivme bileşenlerinden vektör büyüklüğü olarak hesaplanır."},{"name":"Düşme Durumu","description":"Toplam ivme 25,0 eşiğini aştığında etkinleşen ikili uyarı bilgisidir."}]}$json$::jsonb, 3
  ),
  (
    '64000000-0000-4000-8000-000000000004', 'measurement_logic', 'Ölçüm ve Uyarı Mantığı', 'text',
    $json${"paragraphs":["Parmak varlığı, IR okumasının 20.000’den büyük olmasıyla kabul edilir. Koşul sağlanmadığında BPM ve SpO2 sıfırlanır. Atım algılandığında iki atım arasındaki süre BPM’e çevrilir; yalnızca 20 ile 255 arasındaki değerler dört elemanlı ortalamaya alınır.","SpO2 aynı anda okunan kırmızı ve IR değerlerinin oranından hesaplanır. Düşme uyarısı ise MPU6050’nin üç ivme bileşeninden hesaplanan toplam değerin 25,0 eşiğini aşmasına dayanır."]}$json$::jsonb, 4
  ),
  (
    '64000000-0000-4000-8000-000000000005', 'display_and_cloud', 'Yerel Ekran ve Bulut Aktarımı', 'text',
    $json${"paragraphs":["Normal ekranda BPM ve SpO2 üst bölümde, toplam ivme alt bölümde gösterilir. Geçerli parmak okuması yoksa ‘Parmak Bekleniyor’ mesajı; düşme algılandığında ‘DÜŞME TEHLİKESİ’ uyarısı görüntülenir.","Wi-Fi bağlıyken HTTPS üzerinden JSON POST isteği gönderilir. Pakette API anahtarıyla birlikte field1 alanında BPM, field2 alanında SpO2, field3 alanında toplam ivme ve field4 alanında düşme durumu bulunur. Yanıt kodu veya bağlantı hatası seri porta yazılır."]}$json$::jsonb, 5
  ),
  (
    '64000000-0000-4000-8000-000000000006', 'timing', 'Kodda Tanımlı Çalışma Aralıkları', 'statistics',
    $json${"items":[{"value":"200 ms","label":"OLED güncelleme aralığı"},{"value":"15 sn","label":"Bulut gönderim aralığı"},{"value":"5 sn","label":"Düşme uyarısını koruma süresi"},{"value":"4","label":"BPM ortalama örneği"}],"description":"Sensör okuma fonksiyonları ana döngüde sürekli çalışır; ekran ve bulut işlemleri millis tabanlı ayrı aralıklarla yürütülür."}$json$::jsonb, 6
  ),
  (
    '64000000-0000-4000-8000-000000000007', 'limitations', 'Koddan Görülen Sınırlar', 'text',
    $json${"paragraphs":["SpO2 değeri kırmızı/IR oranına dayanan basit bir formülle hesaplanır; kodda sensör kalibrasyonu veya tıbbi doğrulama adımı bulunmaz. Düşme uyarısı da yalnızca toplam ivmenin tek bir eşiği aşmasına dayanır.","Verilen dosya Wi-Fi adı, parola, ThingSpeak uç noktası ve yazma anahtarı için isimler kullanır; ancak bu tanımlar dosyanın içinde yer almaz. Kodun derlenip buluta veri gönderebilmesi için bu bağlantı değerlerinin ayrıca tanımlanması gerekir."]}$json$::jsonb, 7
  ),
  (
    '64000000-0000-4000-8000-000000000008', 'results', 'Sonuç', 'conclusion',
    $json${"paragraphs":["Proje, nabız ve hareket sensörlerinden gelen verileri aynı ESP8266 uygulamasında birleştirir; yerel OLED arayüzü ile periyodik ThingSpeak aktarımını birlikte yürütür.","Kodun ürettiği çıktı; BPM, oran tabanlı SpO2 tahmini, toplam ivme ve eşik tabanlı düşme uyarısından oluşan bir MIoT izleme prototipidir."]}$json$::jsonb, 8
  ),
  (
    '64000000-0000-4000-8000-000000000009', 'research_context', 'Proje Bağlamı', 'text',
    $json${"paragraphs":[],"items":["MIoT sağlık izleme","Optik nabız ölçümü","Oran tabanlı SpO2 tahmini","Toplam ivme hesabı","Eşik tabanlı düşme uyarısı","ThingSpeak veri aktarımı"]}$json$::jsonb, 9
  )
) as section_data(id, section_key, title, section_type, content, display_order)
where projects.slug = 'miot-health-monitor'
on conflict (project_id, section_key) do update set
  title = excluded.title, section_type = excluded.section_type,
  content = excluded.content, display_order = excluded.display_order,
  is_visible = excluded.is_visible;

commit;
