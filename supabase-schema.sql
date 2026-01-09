-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR TRAVEL BLISS
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TOURS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Multilingual titles
    title_en VARCHAR(255) NOT NULL,
    title_de VARCHAR(255) DEFAULT '',
    title_ru VARCHAR(255) DEFAULT '',

    -- Multilingual descriptions
    description_en TEXT DEFAULT '',
    description_de TEXT DEFAULT '',
    description_ru TEXT DEFAULT '',

    -- Basic info
    destination VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,

    -- Images
    main_image VARCHAR(500) DEFAULT '',
    main_image_alt TEXT DEFAULT '',
    gallery_images JSONB DEFAULT '[]',
    route_images JSONB DEFAULT '[]',

    -- Ratings
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews INTEGER DEFAULT 0,

    -- Type and status
    tour_type VARCHAR(50) DEFAULT 'cultural' CHECK (tour_type IN ('cultural', 'adventure', 'historical', 'group', 'private')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    is_bestseller BOOLEAN DEFAULT FALSE,

    -- Pricing options
    enable_private_tour BOOLEAN DEFAULT TRUE,
    enable_group_tour BOOLEAN DEFAULT FALSE,
    private_tour_prices JSONB DEFAULT '[]',
    group_tour_prices JSONB DEFAULT '[]',

    -- Multilingual highlights
    highlights_en TEXT DEFAULT '',
    highlights_de TEXT DEFAULT '',
    highlights_ru TEXT DEFAULT '',

    -- Multilingual included items
    included_en TEXT[] DEFAULT '{}',
    included_de TEXT[] DEFAULT '{}',
    included_ru TEXT[] DEFAULT '{}',

    -- Multilingual not included items
    not_included_en TEXT[] DEFAULT '{}',
    not_included_de TEXT[] DEFAULT '{}',
    not_included_ru TEXT[] DEFAULT '{}',

    -- Group size
    group_size VARCHAR(50) DEFAULT '2-10',

    -- FAQ (JSONB array with multilingual questions/answers)
    faq JSONB DEFAULT '[]',

    -- SEO fields (multilingual)
    seo_meta_title_en TEXT DEFAULT '',
    seo_meta_title_de TEXT DEFAULT '',
    seo_meta_title_ru TEXT DEFAULT '',
    seo_meta_description_en TEXT DEFAULT '',
    seo_meta_description_de TEXT DEFAULT '',
    seo_meta_description_ru TEXT DEFAULT '',
    seo_keywords_en TEXT DEFAULT '',
    seo_keywords_de TEXT DEFAULT '',
    seo_keywords_ru TEXT DEFAULT '',
    seo_og_image TEXT DEFAULT '',
    seo_canonical_url TEXT DEFAULT '',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DESTINATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Multilingual names
    name_en VARCHAR(255) NOT NULL,
    name_de VARCHAR(255) DEFAULT '',
    name_ru VARCHAR(255) DEFAULT '',

    -- Multilingual descriptions
    description_en TEXT DEFAULT '',
    description_de TEXT DEFAULT '',
    description_ru TEXT DEFAULT '',

    -- Image
    image VARCHAR(500) DEFAULT '',

    -- Location info
    country VARCHAR(100) DEFAULT '',
    region VARCHAR(100) DEFAULT '',

    -- Status and features
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    featured BOOLEAN DEFAULT FALSE,
    tours_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ITINERARIES TABLE (Day by day tour plan)
-- =====================================================
CREATE TABLE IF NOT EXISTS itineraries (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,

    -- Multilingual titles
    title_en VARCHAR(255) DEFAULT '',
    title_de VARCHAR(255) DEFAULT '',
    title_ru VARCHAR(255) DEFAULT '',

    -- Multilingual descriptions
    description_en TEXT DEFAULT '',
    description_de TEXT DEFAULT '',
    description_ru TEXT DEFAULT '',

    -- Day image
    image TEXT DEFAULT '',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    tour_id INTEGER REFERENCES tours(id) ON DELETE SET NULL,

    -- Customer info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    country VARCHAR(100) DEFAULT '',

    -- Booking details
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    special_requests TEXT DEFAULT '',
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT '',
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MENUS TABLE (Hierarchical navigation menus)
-- =====================================================
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,

    -- Multilingual names
    name_en VARCHAR(255) NOT NULL,
    name_de VARCHAR(255) DEFAULT '',
    name_ru VARCHAR(255) DEFAULT '',

    -- URL/Link
    url VARCHAR(500) DEFAULT '',

    -- Hierarchy (null = top-level menu item)
    parent_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,

    -- Menu location (header, footer, etc.)
    location VARCHAR(50) DEFAULT 'header' CHECK (location IN ('header', 'footer', 'sidebar')),

    -- Order/sorting
    order_index INTEGER DEFAULT 0,

    -- Options
    open_in_new_tab BOOLEAN DEFAULT FALSE,
    icon VARCHAR(100) DEFAULT '',

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(status);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);
CREATE INDEX IF NOT EXISTS idx_itineraries_tour_id ON itineraries(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_menus_location ON menus(location);
CREATE INDEX IF NOT EXISTS idx_menus_parent_id ON menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_menus_status ON menus(status);

-- =====================================================
-- FUNCTION TO AUTO-UPDATE updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_tours_updated_at ON tours;
CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON tours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_destinations_updated_at ON destinations;
CREATE TRIGGER update_destinations_updated_at
    BEFORE UPDATE ON destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
    BEFORE UPDATE ON menus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Public read access for tours
CREATE POLICY "Tours are viewable by everyone" ON tours
    FOR SELECT USING (true);

-- Public read access for destinations
CREATE POLICY "Destinations are viewable by everyone" ON destinations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for destinations" ON destinations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for destinations" ON destinations
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for destinations" ON destinations
    FOR DELETE USING (true);

-- Public read access for itineraries
CREATE POLICY "Itineraries are viewable by everyone" ON itineraries
    FOR SELECT USING (true);

-- Allow insert for all (for admin operations via API)
CREATE POLICY "Enable insert for all" ON tours
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all" ON tours
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all" ON tours
    FOR DELETE USING (true);

CREATE POLICY "Enable insert for itineraries" ON itineraries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for itineraries" ON itineraries
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for itineraries" ON itineraries
    FOR DELETE USING (true);

CREATE POLICY "Enable all for bookings" ON bookings
    FOR ALL USING (true);

CREATE POLICY "Enable all for contact_messages" ON contact_messages
    FOR ALL USING (true);

CREATE POLICY "Enable all for newsletter" ON newsletter_subscribers
    FOR ALL USING (true);

-- Menus policies
CREATE POLICY "Menus are viewable by everyone" ON menus
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for menus" ON menus
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for menus" ON menus
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for menus" ON menus
    FOR DELETE USING (true);

-- =====================================================
-- SAMPLE DATA (Optional - run separately if needed)
-- =====================================================
-- INSERT INTO tours (slug, title_en, title_de, title_ru, description_en, destination, duration, price, tour_type, status, is_bestseller, group_size)
-- VALUES
-- ('classic-uzbekistan', 'Classic Uzbekistan Tour', 'Klassische Usbekistan Tour', 'Классический тур по Узбекистану', 'Experience the best of Uzbekistan', 'Uzbekistan', 8, 1299, 'cultural', 'active', true, '2-12'),
-- ('silk-road-adventure', 'Silk Road Adventure', 'Seidenstraße Abenteuer', 'Приключение на Шелковом пути', 'Follow the ancient Silk Road', 'Central Asia', 14, 2499, 'adventure', 'active', false, '4-10');

-- =====================================================
-- DONE! Your database is ready.
-- =====================================================
