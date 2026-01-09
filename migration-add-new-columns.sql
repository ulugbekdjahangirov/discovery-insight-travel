-- =====================================================
-- MIGRATION: Add new columns for FAQ, SEO, pricing, and more
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Add main image alt text
ALTER TABLE tours ADD COLUMN IF NOT EXISTS main_image_alt TEXT DEFAULT '';

-- Add route images (for itinerary maps/routes)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS route_images JSONB DEFAULT '[]';

-- Add pricing toggle options
ALTER TABLE tours ADD COLUMN IF NOT EXISTS enable_private_tour BOOLEAN DEFAULT true;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS enable_group_tour BOOLEAN DEFAULT false;

-- Add pricing tables (JSONB for flexible pricing structures)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS private_tour_prices JSONB DEFAULT '[]';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_tour_prices JSONB DEFAULT '[]';

-- Add highlights (multilingual)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS highlights_en TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS highlights_de TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS highlights_ru TEXT DEFAULT '';

-- Add FAQ (JSONB array)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]';

-- Add SEO fields (multilingual meta titles)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_meta_title_en TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_meta_title_de TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_meta_title_ru TEXT DEFAULT '';

-- Add SEO fields (multilingual meta descriptions)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_meta_description_en TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_meta_description_de TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_meta_description_ru TEXT DEFAULT '';

-- Add SEO fields (multilingual keywords)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_keywords_en TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_keywords_de TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_keywords_ru TEXT DEFAULT '';

-- Add SEO fields (OG image and canonical URL)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_og_image TEXT DEFAULT '';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seo_canonical_url TEXT DEFAULT '';

-- Update gallery_images column type if needed (from TEXT[] to JSONB for alt text support)
-- First check if it exists and what type it is
DO $$
BEGIN
    -- Check if gallery_images is TEXT[] and convert to JSONB
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tours'
        AND column_name = 'gallery_images'
        AND data_type = 'ARRAY'
    ) THEN
        -- Create temporary column
        ALTER TABLE tours ADD COLUMN gallery_images_new JSONB DEFAULT '[]';

        -- Migrate data (convert string array to JSONB with url/alt structure)
        UPDATE tours SET gallery_images_new = (
            SELECT COALESCE(
                jsonb_agg(jsonb_build_object('url', elem, 'alt', '')),
                '[]'::jsonb
            )
            FROM unnest(gallery_images) AS elem
        ) WHERE gallery_images IS NOT NULL AND array_length(gallery_images, 1) > 0;

        -- Drop old column and rename new one
        ALTER TABLE tours DROP COLUMN gallery_images;
        ALTER TABLE tours RENAME COLUMN gallery_images_new TO gallery_images;
    END IF;
END $$;

-- Add image column to itineraries table
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';

-- =====================================================
-- Verify the changes
-- =====================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'tours'
ORDER BY ordinal_position;
