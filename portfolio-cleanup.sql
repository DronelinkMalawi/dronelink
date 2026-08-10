-- Cleanup Script: Remove Sample/Dummy Portfolio Data
-- Run this in the Supabase SQL Editor to delete all sample portfolio items
-- so you can add your real data through the admin panel

-- Delete all portfolio items (this removes the sample data we inserted)
DELETE FROM portfolio_items;

-- Verify the table is empty
SELECT COUNT(*) as remaining_items FROM portfolio_items;