-- Savora — SQL Server (T-SQL) sxemi + nümunə (seed) data
-- İstifadə (SSMS-də və ya sqlcmd ilə):
--   sqlcmd -S localhost -E -C -d savora -i schema.sql

USE savora;
GO

-- ============ CƏDVƏLLƏR ============

IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('reservations', 'U') IS NOT NULL DROP TABLE reservations;
IF OBJECT_ID('reviews', 'U') IS NOT NULL DROP TABLE reviews;
IF OBJECT_ID('contact_messages', 'U') IS NOT NULL DROP TABLE contact_messages;
IF OBJECT_ID('menu_items', 'U') IS NOT NULL DROP TABLE menu_items;
IF OBJECT_ID('site_settings', 'U') IS NOT NULL DROP TABLE site_settings;
IF OBJECT_ID('site_images', 'U') IS NOT NULL DROP TABLE site_images;
IF OBJECT_ID('admin_users', 'U') IS NOT NULL DROP TABLE admin_users;
GO

CREATE TABLE menu_items (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(120) NOT NULL,
    description NVARCHAR(MAX),
    price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url   NVARCHAR(MAX),
    category    NVARCHAR(60) NOT NULL,
    is_new      BIT NOT NULL DEFAULT 0,
    created_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE reservations (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    name         NVARCHAR(120) NOT NULL,
    phone        NVARCHAR(30) NOT NULL,
    email        NVARCHAR(150) NULL,
    [date]       DATE NOT NULL,
    [time]       TIME NOT NULL,
    guests       INT NOT NULL CHECK (guests > 0),
    table_number INT NULL,
    status       NVARCHAR(20) NOT NULL DEFAULT N'gözləyir'
                 CHECK (status IN (N'gözləyir', N'təsdiqləndi', N'ləğv edildi')),
    created_at   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE orders (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    table_number   INT NULL,
    customer_name  NVARCHAR(120) NOT NULL,
    phone          NVARCHAR(30) NOT NULL,
    status         NVARCHAR(20) NOT NULL DEFAULT N'qəbul edildi'
                   CHECK (status IN (N'qəbul edildi', N'hazırlanır', N'hazırdır', N'çatdırıldı', N'ləğv edildi')),
    total          DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    created_at     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE order_items (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    order_id       INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id   INT NULL FOREIGN KEY REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity       INT NOT NULL CHECK (quantity > 0),
    price_at_order DECIMAL(10, 2) NOT NULL CHECK (price_at_order >= 0)
);
GO

CREATE TABLE reviews (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(120) NOT NULL,
    rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     NVARCHAR(MAX) NOT NULL,
    is_approved BIT NOT NULL DEFAULT 0,
    created_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE contact_messages (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    name       NVARCHAR(120) NOT NULL,
    email      NVARCHAR(150) NOT NULL,
    message    NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- Admin panel üçün cədvəllər --

CREATE TABLE site_settings (
    id    INT IDENTITY(1,1) PRIMARY KEY,
    [key] NVARCHAR(80) NOT NULL UNIQUE,
    value NVARCHAR(MAX),
    type  NVARCHAR(20) NOT NULL DEFAULT N'text' -- 'text' | 'image' | 'url' | 'json'
);
GO

CREATE TABLE site_images (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    section_key  NVARCHAR(80) NOT NULL UNIQUE, -- məs. 'hero_background', 'about_image'
    image_url    NVARCHAR(MAX) NOT NULL,
    alt_text     NVARCHAR(200)
);
GO

CREATE TABLE admin_users (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    email         NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(MAX) NOT NULL,
    created_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ============ SEED DATA ============

INSERT INTO menu_items (name, description, price, image_url, category, is_new) VALUES
(N'Ət ilə pirinc',        N'Şəkərli soğan və otlarla yavaş bişirilmiş mal əti.',        18.00, N'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=450&fit=crop', N'əsas yemək', 0),
(N'Klassik marqarita',    N'Odun sobasında bişmiş, təzə fesleğənli pizza.',              14.00, N'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop', N'pizza',      0),
(N'Ədviyyəli spagetti',   N'Fərqli üç ədviyyə ilə hazırlanan zəngin sous.',              16.00, N'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=450&fit=crop', N'pasta',      0),
(N'Şokoladlı tort',       N'İçi əridilmiş şokoladla dolu, isti servis olunur.',           9.00, N'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop', N'desert',     0),
(N'Limonlu qril somon',   N'Təzə otlar və limon sousu ilə servis olunur.',               22.00, N'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop', N'əsas yemək', 1),
(N'Ədviyyəli toyuq',      N'Yerli ədviyyələrlə marinə edilmiş qril toyuq.',              17.00, N'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=450&fit=crop', N'əsas yemək', 1),
(N'Fəsil tərəvəz salatı', N'Mövsümün ən təzə tərəvəzləri ilə hazırlanıb.',               12.00, N'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=450&fit=crop', N'salat',      1);
GO

INSERT INTO reviews (name, rating, comment, is_approved) VALUES
(N'Elvin M.', 5, N'Ən dadlı steyki burada yedim. Xidmət də çox səmimi idi, hökmən yenə gələcəyəm.', 1),
(N'Aysel R.', 5, N'Atmosfer inanılmaz idi. Ailə yeməyi üçün mükəmməl seçim oldu.', 1),
(N'Tural S.', 5, N'Desertlərini xüsusilə tövsiyə edirəm — şokoladlı tort əla idi!', 1);
GO

INSERT INTO site_settings ([key], value, type) VALUES
(N'site_name',        N'Savora',                                   N'text'),
(N'logo_url',         N'',                                         N'image'),
(N'phone',            N'+994 12 345 67 89',                        N'text'),
(N'email',            N'hello@savora.az',                          N'text'),
(N'address',          N'Nizami küç. 45, Bakı',                     N'text'),
(N'is_saatlari',      N'Hər gün 11:00 – 23:00',                    N'text'),
(N'hero_title',       N'Kamilliyin dadını hiss edin',               N'text'),
(N'hero_description', N'Fəsilə uyğun seçilmiş inqrediyentlərlə hazırlanan yeməklərimiz hər tikədə düşünülmüş bir hekayə danışır — sadə, təzə və unudulmaz.', N'text'),
(N'instagram_link',   N'https://instagram.com',                    N'url'),
(N'facebook_link',    N'https://facebook.com',                     N'url');
GO

INSERT INTO site_images (section_key, image_url, alt_text) VALUES
(N'hero_background', N'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=700&h=700&fit=crop', N'Hero yeməyi'),
(N'about_image',     N'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1100&h=500&fit=crop',   N'Restoran hekayəsi');
GO
