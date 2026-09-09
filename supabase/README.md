# Supabase kurulumu

1. migrations/202609080001_create_project_archive.sql dosyasını Supabase SQL Editor veya Supabase CLI ile uygulayın.
2. Ardından seed.sql dosyasını çalıştırın. Dosya tekrar çalıştırılabilir ve yalnızca IoMT örnek projesini yayımlar.
3. .env.example dosyasını .env.local olarak kopyalayıp proje URL'si ile publishable/anon anahtarını girin.
4. Dağıtım ortamında aynı iki değişkeni Site secret/runtime value olarak tanımlayın.

Frontend'de service-role anahtarı kullanmayın. Proje görsellerini project-media/<project-slug>/ yoluna yükleyip public URL'lerini project_media tablosuna ekleyin. Medya satırı bulunmadığında arayüz ilgili görsel alanını göstermez.
