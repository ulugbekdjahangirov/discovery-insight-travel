-- =====================================================
-- MIGRATION: Tour Categories
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Create tour_categories table
CREATE TABLE IF NOT EXISTS tour_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,

    -- Multilingual names
    name_en VARCHAR(255) NOT NULL,
    name_de VARCHAR(255) DEFAULT '',
    name_ru VARCHAR(255) DEFAULT '',

    -- Multilingual descriptions
    description_en TEXT DEFAULT '',
    description_de TEXT DEFAULT '',
    description_ru TEXT DEFAULT '',

    -- Icon (Lucide icon name)
    icon VARCHAR(50) DEFAULT 'map',

    -- Display order
    display_order INTEGER DEFAULT 0,

    -- Show in menu
    show_in_menu BOOLEAN DEFAULT TRUE,

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

    -- Image
    image VARCHAR(500) DEFAULT '',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add category_id to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES tour_categories(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tours_category_id ON tours(category_id);
CREATE INDEX IF NOT EXISTS idx_tour_categories_status ON tour_categories(status);
CREATE INDEX IF NOT EXISTS idx_tour_categories_show_in_menu ON tour_categories(show_in_menu);

-- Enable RLS
ALTER TABLE tour_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tour categories are viewable by everyone" ON tour_categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for tour_categories" ON tour_categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for tour_categories" ON tour_categories
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for tour_categories" ON tour_categories
    FOR DELETE USING (true);

-- Insert default categories
INSERT INTO tour_categories (slug, name_en, name_de, name_ru, icon, display_order, show_in_menu) VALUES
('homestays-hiking', 'Homestays & Hiking', 'Gastfamilien & Wandern', 'Проживание и Походы', 'home', 1, true),
('trekking', 'Trekking', 'Trekking', 'Треккинг', 'mountain', 2, true),
('horse-riding', 'Horse Riding', 'Reiten', 'Конные туры', 'accessibility', 3, true),
('adventure-tours', 'Adventure Tours', 'Abenteuerreisen', 'Приключенческие туры', 'compass', 4, true),
('cultural-tours', 'Cultural Tours', 'Kulturreisen', 'Культурные туры', 'landmark', 5, true),
('day-trips', 'Day Trips', 'Tagesausflüge', 'Однодневные туры', 'sun', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_tour_categories_updated_at ON tour_categories;
CREATE TRIGGER update_tour_categories_updated_at
    BEFORE UPDATE ON tour_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify
SELECT * FROM tour_categories ORDER BY display_order;
