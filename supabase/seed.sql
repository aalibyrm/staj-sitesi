insert into public.projects (
  id, slug, title, subtitle, summary, category, year, department, cover_image_url, github_url, status, published_at
)
values (
  '11111111-1111-4111-8111-111111111111',
  'iomt-network-attack-scenarios',
  'IoMT Ağlarında Saldırı Tespiti',
  'NS-3 simülasyonlarından dürüstçe doğrulanmış, saldırı şiddetine duyarlı bir ağ tabanlı tespit çalışması',
  'Tıbbi cihazlara dokunmadan, yalnızca ağ akışı ölçümlerinden saldırı varlığının ve türünün ne ölçüde anlaşılabildiğini araştıran; 285 koşuluk veri seti, yeni bir grey-hole senaryosu ve kontrol deneyleri içeren çalışma.',
  'IoMT Ağ Güvenliği ve Saldırı Tespiti',
  2026,
  'Bilgisayar Mühendisliği',
  'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/cover.png',
  'https://github.com/OkanKoca/IoMT-NetworkAttackScenarios18',
  'published',
  '2026-09-08T00:00:00+03:00'
)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  summary = excluded.summary,
  category = excluded.category,
  year = excluded.year,
  department = excluded.department,
  cover_image_url = excluded.cover_image_url,
  github_url = excluded.github_url,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.students (id, name, department, avatar_url, github_url)
values (
  '22222222-2222-4222-8222-222222222222',
  'Okan Koca',
  'Bilgisayar Mühendisliği',
  null,
  'https://github.com/OkanKoca'
)
on conflict (id) do update set
  name = excluded.name,
  department = excluded.department,
  avatar_url = excluded.avatar_url,
  github_url = excluded.github_url;

insert into public.project_students (project_id, student_id, role, display_order)
select projects.id, '22222222-2222-4222-8222-222222222222', 'Araştırmacı ve geliştirici', 1
from public.projects
where projects.slug = 'iomt-network-attack-scenarios'
on conflict (project_id, student_id) do update set
  role = excluded.role,
  display_order = excluded.display_order;

insert into public.technologies (id, name, category) values
  ('30000000-0000-4000-8000-000000000001', 'NS-3', 'Simülasyon'),
  ('30000000-0000-4000-8000-000000000002', 'C++', 'Programlama'),
  ('30000000-0000-4000-8000-000000000003', 'Python', 'Programlama'),
  ('30000000-0000-4000-8000-000000000004', 'FlowMonitor', 'Ağ ölçümü'),
  ('30000000-0000-4000-8000-000000000005', 'pandas', 'Veri analizi'),
  ('30000000-0000-4000-8000-000000000006', 'matplotlib', 'Görselleştirme'),
  ('30000000-0000-4000-8000-000000000007', 'scikit-learn', 'Makine öğrenmesi'),
  ('30000000-0000-4000-8000-000000000008', 'Jupyter', 'Deney ortamı')
on conflict (name) do update set category = excluded.category;

insert into public.project_technologies (project_id, technology_id, display_order)
select projects.id, technologies.id, technology_order.display_order
from public.projects
cross join (
  values
    ('NS-3', 1),
    ('C++', 2),
    ('Python', 3),
    ('FlowMonitor', 4),
    ('pandas', 5),
    ('scikit-learn', 6),
    ('Jupyter', 7),
    ('matplotlib', 8)
) as technology_order(name, display_order)
join public.technologies on technologies.name = technology_order.name
where projects.slug = 'iomt-network-attack-scenarios'
on conflict (project_id, technology_id) do update set
  display_order = excluded.display_order;

insert into public.project_media (
  id, project_id, type, url, alt_text, caption, display_order
)
select
  media_data.id::uuid,
  projects.id,
  media_data.type,
  media_data.url,
  media_data.alt_text,
  media_data.caption,
  media_data.display_order
from public.projects
cross join (
  values
    (
      '50000000-0000-4000-8000-000000000001',
      'diagram',
      'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/figures/topology.png',
      'Dokuz Wi-Fi istasyonu, erişim noktası, EKG kaynağı, hasta monitörü ve saldırgan relay düğümünü gösteren IoMT ağ topolojisi',
      'Deney topolojisi ve trafik akışları. Mavi yol ölçülen EKG akışını, turuncu kesikli yol saldırgan relay düğümünü gösterir.',
      1
    ),
    (
      '50000000-0000-4000-8000-000000000002',
      'chart',
      'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/figures/baseline-calibration.png',
      'Kalibrasyon öncesi ve sonrası normal koşul teslim oranı ile akış sayısı dağılımı',
      'Taban kalibrasyonu: belirlenimci 1,0 teslim oranı ve sabit akış sayısı yerine koşular arasında gerçekçi değişkenlik oluşturuldu.',
      2
    ),
    (
      '50000000-0000-4000-8000-000000000003',
      'chart',
      'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/figures/confusion-matrix.png',
      'Normal, DoS, DDoS, grey-hole ve blackhole sınıfları için dürüst grup bazlı karışıklık matrisi',
      'Beş sınıflı karışıklık matrisi. Paket düşüren saldırılar güçlü ayrışırken DoS ile DDoS çift yönlü karışır.',
      3
    ),
    (
      '50000000-0000-4000-8000-000000000004',
      'chart',
      'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/figures/detection-vs-intensity.png',
      'Grey-hole düşürme olasılığı, DoS paket hızı ve DDoS saldırgan sayısına göre tespit oranları',
      'Tespit–şiddet eğrisi. DoS 2–5 paket/saniyede yanlış-alarm tabanına iner; grey-hole ve güçlü saldırılar tavanda kalır.',
      4
    ),
    (
      '50000000-0000-4000-8000-000000000005',
      'chart',
      'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/figures/relay-baseline.png',
      'Zararsız relay düğümünün tespit oranına ve teslim oranına etkisini gösteren kontrol deneyi',
      'Relay tabanı: hiçbir paket düşürmeyen aracı düğüm tek başına 40 koşunun 39’unda saldırı alarmı üretir.',
      5
    ),
    (
      '50000000-0000-4000-8000-000000000006',
      'chart',
      'https://nznvqfjwwvwrxiiwufgg.supabase.co/storage/v1/object/public/project-media/iomt-network-attack-scenarios/figures/benign-relay-separation.png',
      'Grey-hole saldırısının zararsız relay tabanından ayrıştığı p eşik değerini gösteren grafik',
      'Zararsız relay karşısında saldırının gerçek katkısı p = 0,10 civarında belirginleşir; bu eşik iki relay konumunda da korunur.',
      6
    )
) as media_data(id, type, url, alt_text, caption, display_order)
where projects.slug = 'iomt-network-attack-scenarios'
on conflict (id) do update set
  project_id = excluded.project_id,
  type = excluded.type,
  url = excluded.url,
  alt_text = excluded.alt_text,
  caption = excluded.caption,
  display_order = excluded.display_order;

insert into public.project_sections (
  id, project_id, section_key, title, section_type, content, display_order, is_visible
)
select
  section_data.id::uuid,
  projects.id,
  section_data.section_key,
  section_data.title,
  section_data.section_type,
  section_data.content::jsonb,
  section_data.display_order,
  true
from public.projects
cross join (
  values
    (
      '40000000-0000-4000-8000-000000000001',
      'overview',
      'Araştırma Sorusu',
      'text',
      '{"paragraphs":["Hastanelerdeki infüzyon pompaları, hasta başı monitörleri ve giyilebilir sensörler klinik veriyi kablosuz ağ üzerinden taşır. Bu cihazların sınırlı donanımı ve sertifikasyon gereksinimleri, cihazın içine yeni güvenlik yazılımı eklemeyi zorlaştırır. Çalışma bu nedenle savunmayı ağ tarafına taşır: cihaza dokunmadan yalnızca trafik davranışından saldırı anlaşılabilir mi?","Proje, mevcut bir IoMT NS-3 çalışmasını doğrudan kabul etmek yerine önce yeniden üretip doğrulamış; çalışmayan saldırı senaryolarını yeniden yazmış, kalibre edilmiş bir normal ağ tabanı kurmuş ve saldırı varlığı ile türünü birlikte tahmin eden deneysel bir detektör geliştirmiştir."]}',
      1
    ),
    (
      '40000000-0000-4000-8000-000000000002',
      'experiment_design',
      'Deney Tasarımı',
      'architecture',
      '{"nodes":[{"id":"ekg","label":"EKG Kaynağı","subtitle":"128 kbps klinik telemetri","kind":"wearable"},{"id":"monitor","label":"Hasta Monitörü","subtitle":"Ölçülen hedef akış","kind":"monitor"},{"id":"access-point","label":"HealthNet_24G","subtitle":"802.11 erişim noktası","kind":"network"},{"id":"medical-devices","label":"Tıbbi Cihazlar","subtitle":"Pompa, ventilatör, oksimetre","kind":"device"},{"id":"imaging","label":"Görüntüleme Geçidi","subtitle":"Yaklaşık 19 Mbps arka plan yükü","kind":"server"},{"id":"attacker","label":"Saldırgan / Relay","subtitle":"Flood, grey-hole veya MITM","kind":"network"},{"id":"flow-monitor","label":"FlowMonitor","subtitle":"Koşu düzeyinde ağ ölçümü","kind":"monitor"}],"connections":[{"from":"ekg","to":"access-point","label":"UDP / 8080"},{"from":"access-point","to":"monitor","label":"EKG akışı"},{"from":"medical-devices","to":"access-point","label":"Arka plan trafiği"},{"from":"imaging","to":"access-point","label":"Tıkanıklık yükü"},{"from":"attacker","to":"monitor","label":"Saldırı yolu"},{"from":"access-point","to":"flow-monitor","label":"Ölçüm"}]}',
      2
    ),
    (
      '40000000-0000-4000-8000-000000000008',
      'topology',
      'Ağ Topolojisi ve Trafik Akışları',
      'chart',
      '{"mediaIds":["50000000-0000-4000-8000-000000000001"],"description":"Simülasyon; dokuz Wi-Fi istasyonu, bir erişim noktası ve bir giyilebilir sensörden oluşur. Ana klinik akış 128 baytlık paketlerle 128 kbps EKG telemetrisi taşırken diğer cihazlar ve görüntüleme geçidi gerçekçi arka plan yükü üretir."}',
      3
    ),
    (
      '40000000-0000-4000-8000-000000000009',
      'dataset_and_model',
      'Veri Seti ve Değerlendirme Tasarımı',
      'text',
      '{"paragraphs":["Her veri satırı tek bir ağ akışı değil, bir simülasyon koşusunun tamamıdır. Koşudaki akış sayısı, toplam ve en büyük akış throughput’u, teslim ve kayıp oranları, gecikme, PDV, akış yoğunlaşması ve başlangıç gecikmesi dahil 13 sayısal özellik tek bir vektörde özetlenir.","Beş sınıflı Random Forest modeli normal, DoS, DDoS, grey-hole ve blackhole koşullarını ayırır. Saldırı var mı sorusu ayrı bir model değildir; normal dışındaki her sınıf doğrudan alarm sayılır. Böylece saldırı varlığı ile saldırı türü kararları çelişmez.","Şiddet parametresi olan saldırılarda aynı konfigürasyondaki bütün koşular eğitim veya test tarafında birlikte tutulur. Beş katlı grup bazlı doğrulama sayesinde model testte daha önce görmediği saldırı şiddetleriyle karşılaşır; rastgele bölmenin üreteceği iyimser sızıntı önlenir."]}',
      4
    ),
    (
      '40000000-0000-4000-8000-000000000003',
      'attack_scenarios',
      'Sınanan Ağ Koşulları',
      'attack_list',
      '{"attacks":[{"name":"DoS UDP Flood","description":"Tek saldırganın paket hızını 1–1000 paket/saniye aralığında değiştirerek hedef yolu tıkadığı hacim saldırısı.","impact":"Düşük hızlarda meşru trafiğin doğal dalgalanması içinde kaybolabilir."},{"name":"DDoS UDP Flood","description":"Aynı hedefe 1, 2, 3, 5 veya 8 eşzamanlı saldırganın trafik gönderdiği dağıtık hacim saldırısı.","impact":"Model, saldırgan sayısından çok oluşan toplam hasarı öğrenmektedir."},{"name":"Grey-hole","description":"Ağ yoluna gerçekten yerleştirilen relay düğümü paketlerin p olasılıkla bir kısmını düşürür ve geri kalanını iletir.","impact":"p = 0,02–0,90 arasında kademeli, sessiz bir saldırı ekseni sağlar; p = 1 çalışan blackhole olur."},{"name":"Blackhole","description":"Yoldaki relay bütün kurban paketlerini düşürür; kaynak çalışmadaki etkisiz blackhole senaryosunun çalışan karşılığıdır.","impact":"Teslim oranı sıfıra iner ve sınıf güçlü biçimde ayrışır."},{"name":"MITM zamanlama varyantı","description":"Paketleri düşürmeden geciktiren saldırı, pasif akış ölçümlerinin körlüğünü sınamak için ayrı bir enstrümante varyantta ele alınır.","impact":"Uçtan uca güvenilir zaman damgası eklendiğinde MITM sınıfı F1 = 0,929 ile ayrışır."}]}',
      5
    ),
    (
      '40000000-0000-4000-8000-000000000004',
      'metrics',
      'Ölçülen Sinyaller',
      'metrics',
      '{"metrics":[{"name":"Teslim ve Kayıp","description":"Gönderilen paketlerin ne kadarının hedefe ulaştığı ve ağda kaybolduğu."},{"name":"Throughput","description":"Koşu boyunca toplam ve en baskın akışın taşıdığı veri miktarı."},{"name":"Gecikme ve PDV","description":"Paketlerin uçtan uca gecikmesi ile gecikmedeki değişkenlik."},{"name":"Akış Yapısı","description":"Akış sayısı, yoğunlaşma ve kurban akışının başlangıç gecikmesi gibi topolojik izler."}]}',
      6
    ),
    (
      '40000000-0000-4000-8000-000000000014',
      'baseline_calibration',
      'Gerçekçi Normal Ağ Tabanı',
      'chart',
      '{"mediaIds":["50000000-0000-4000-8000-000000000002"],"description":"Devralınan simülasyonda normal koşular neredeyse aynıydı: 40 koşunun 37’si tam 1,0 teslim oranı ve her koşu iki akış üretiyordu. Bu yapısal kısayollar kaldırılarak teslim oranı 0,970 ± 0,032 düzeyinde değişen, modelin ezberleyemeyeceği bir taban kuruldu."}',
      7
    ),
    (
      '40000000-0000-4000-8000-000000000005',
      'statistical_validation',
      'Deney Kapsamı',
      'statistics',
      '{"items":[{"value":"285","label":"Etiketli simülasyon koşusu"},{"value":"13","label":"Koşu başına ağ özelliği"},{"value":"5","label":"Sınıf ve çapraz doğrulama katı"}],"description":"Model 255 eğitim/değerlendirme koşusunda görülmemiş saldırı şiddetleriyle sınandı. Normal ve blackhole tek şiddetli oldukları için bu iki sınıfın skorları üst sınır olarak yorumlandı."}',
      8
    ),
    (
      '40000000-0000-4000-8000-000000000010',
      'model_results',
      'Model Sonuçları',
      'chart',
      '{"mediaIds":["50000000-0000-4000-8000-000000000003","50000000-0000-4000-8000-000000000004"],"description":"Grup bazlı dürüst değerlendirmede saldırı tespiti F1 = 0,960, beş sınıflı kat ortalaması makro-F1 = 0,788 ve grey-hole F1 = 0,958 ölçüldü. Ancak sonuçların güvenilir yorumu tek bir başarı skorundan değil, hataların şiddet boyunca nasıl değiştiğinden gelir."}',
      9
    ),
    (
      '40000000-0000-4000-8000-000000000011',
      'main_finding',
      'Asıl Bulgu: Model Neyi Öğreniyor?',
      'text',
      '{"paragraphs":["Grey-hole her şiddette kolay görünürken düşük hızlı DoS saldırısının kaybolması bir kontrol deneyini gerektirdi. Saldırı kapatıldı, fakat paketleri aynen ileten zararsız relay ağ yolunda bırakıldı. Model bu zararsız aracı düğümü 40 koşunun 39’unda saldırı olarak işaretledi; 36 koşuya özellikle grey-hole dedi.","Aynı yolun ortak tohumları karşılaştırıldığında teslim oranındaki düşüşün yaklaşık yüzde 91’i saldırıdan değil relay düğümünün salt varlığından kaynaklandı. Detektörün fiilen yanıtladığı soru bu aracı kötü niyetli mi değil, ağda beklenmedik bir aracı var mı sorusuydu.","Bu sonuç DoS ve DDoS ayrımında da tekrarlandı. Hasar eşitlendiğinde ikisini ayırma başarısı 0,475’e düşerek şans düzeyine indi. Akış düzeyindeki özetler saldırganın niyetini değil, ağda bıraktığı mekanik izi ve hasarı ölçüyordu."]}',
      10
    ),
    (
      '40000000-0000-4000-8000-000000000012',
      'control_experiments',
      'Kontrol Deneyleri',
      'chart',
      '{"mediaIds":["50000000-0000-4000-8000-000000000005","50000000-0000-4000-8000-000000000006"],"description":"Kontrol deneyleri saldırı etkisini relay topolojisinin kendi izinden ayırır. Zararsız relay tabanına göre grey-hole etkisi p = 0,10 civarında netleşir; yüzde 2 paket düşürme düzeyi ise görünmez kalır."}',
      11
    ),
    (
      '40000000-0000-4000-8000-000000000013',
      'limitations',
      'Sınırlılıklar ve Güvenli Yorum',
      'text',
      '{"paragraphs":["Bu çalışma üretime hazır bir saldırı tespit ürünü değil; simüle edilmiş bir IoMT ağında ölçüm yöntemlerinin neyi gerçekten gördüğünü sınayan tekrarlanabilir bir araştırmadır."],"items":["Grey-hole p < 0,10 düzeyinde zararsız relay tabanından güvenilir biçimde ayrılamaz.","DoS ile DDoS ayrımı hasar eşitlendiğinde güvenilir değildir.","Pasif akış ölçümleri zamanlama saldırılarını kaçırır; MITM için güvenilir uçtan uca zaman damgası gerekir.","Sonuçların mutlak eşikleri bu topolojiye özgüdür; taşınabilir olan deney ve kontrol yöntemidir.","Trafik ve saldırılar NS-3 içinde UDP ile modellenmiştir; gerçek IoMT dağıtımlarında MQTT/TCP ve fiziksel cihaz testleri ayrıca doğrulanmalıdır."]}',
      12
    ),
    (
      '40000000-0000-4000-8000-000000000006',
      'results',
      'Sonuç',
      'conclusion',
      '{"paragraphs":["Proje; doğrulanmış saldırı senaryolarından 285 koşuluk etiketli bir veri seti üretmiş, saldırı varlığını ve türünü tek modelle değerlendirmiş ve kaynak çalışmada bulunmayan kademeli grey-hole saldırısını gerçek ağ yolunda uygulamıştır.","En önemli katkı yüksek F1 skorları değil, bu skorların neyi ölçtüğünü ortaya çıkaran kontrol deneyleridir. Ağ tabanlı bir detektörün yapısal değişikliği saldırgan niyetiyle karıştırabileceği gösterilmiş; saldırı etkisini adil ölçmek için normal ağ yerine aynı topolojiye sahip zararsız relay tabanı önerilmiştir."]}',
      13
    ),
    (
      '40000000-0000-4000-8000-000000000007',
      'research_context',
      'Araştırma Bağlamı',
      'text',
      '{"paragraphs":[],"items":["IoMT ve hasta güvenliği","NS-3 ağ simülasyonu","Akış tabanlı saldırı tespiti","Grey-hole ve hacim saldırıları","Grup bazlı çapraz doğrulama","Kontrol deneyleri ve model yorumu"]}',
      14
    )
) as section_data(id, section_key, title, section_type, content, display_order)
where projects.slug = 'iomt-network-attack-scenarios'
on conflict (project_id, section_key) do update set
  title = excluded.title,
  section_type = excluded.section_type,
  content = excluded.content,
  display_order = excluded.display_order,
  is_visible = excluded.is_visible;
