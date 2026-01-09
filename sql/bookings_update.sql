-- Add new columns to bookings table for start_time, end_date, tour_title, how_did_you_hear

-- Add start_time column (default 09:00)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT '09:00';

-- Add end_date column
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add tour_title column (for when tour is deleted)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS tour_title TEXT DEFAULT '';

-- Add how_did_you_hear column
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS how_did_you_hear TEXT DEFAULT '';

-- Add pickup_location column
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS pickup_location TEXT DEFAULT '';

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name IN ('start_time', 'end_date', 'tour_title', 'how_did_you_hear', 'pickup_location');
