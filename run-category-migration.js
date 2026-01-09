// Run tour categories migration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ranpcphrncqgvjbbhfvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbnBjcGhybmNxZ3ZqYmJoZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTIwMzYsImV4cCI6MjA4MjcyODAzNn0.ob7RvM0Ez1cHCBTr_Sw1xtf-oi1rJvGfbXSL7O2KjzM';

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultCategories = [
  { slug: 'homestays-hiking', name_en: 'Homestays & Hiking', name_de: 'Gastfamilien & Wandern', name_ru: 'Проживание и Походы', icon: 'home', display_order: 1, show_in_menu: true, status: 'active' },
  { slug: 'trekking', name_en: 'Trekking', name_de: 'Trekking', name_ru: 'Треккинг', icon: 'mountain', display_order: 2, show_in_menu: true, status: 'active' },
  { slug: 'horse-riding', name_en: 'Horse Riding', name_de: 'Reiten', name_ru: 'Конные туры', icon: 'accessibility', display_order: 3, show_in_menu: true, status: 'active' },
  { slug: 'adventure-tours', name_en: 'Adventure Tours', name_de: 'Abenteuerreisen', name_ru: 'Приключенческие туры', icon: 'compass', display_order: 4, show_in_menu: true, status: 'active' },
  { slug: 'cultural-tours', name_en: 'Cultural Tours', name_de: 'Kulturreisen', name_ru: 'Культурные туры', icon: 'landmark', display_order: 5, show_in_menu: true, status: 'active' },
  { slug: 'day-trips', name_en: 'Day Trips', name_de: 'Tagesausflüge', name_ru: 'Однодневные туры', icon: 'sun', display_order: 6, show_in_menu: true, status: 'active' },
];

async function checkAndCreateTable() {
  console.log('Checking tour_categories table...');

  // Try to select from the table
  const { data, error } = await supabase
    .from('tour_categories')
    .select('id')
    .limit(1);

  if (error && error.code === '42P01') {
    console.log('Table does not exist. Please run the SQL migration in Supabase dashboard:');
    console.log('File: migration-tour-categories.sql');
    console.log('URL: https://supabase.com/dashboard/project/ranpcphrncqgvjbbhfvl/sql');
    return false;
  }

  if (error) {
    console.error('Error checking table:', error.message);
    return false;
  }

  console.log('Table exists!');
  return true;
}

async function insertCategories() {
  console.log('\nInserting default categories...');

  for (const category of defaultCategories) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('tour_categories')
      .select('id')
      .eq('slug', category.slug)
      .single();

    if (existing) {
      console.log(`  - ${category.name_en} already exists, skipping`);
      continue;
    }

    const { error } = await supabase
      .from('tour_categories')
      .insert(category);

    if (error) {
      console.error(`  - Error inserting ${category.name_en}:`, error.message);
    } else {
      console.log(`  - ${category.name_en} inserted`);
    }
  }
}

async function verifyCategories() {
  console.log('\nVerifying categories...');

  const { data, error } = await supabase
    .from('tour_categories')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`\nFound ${data.length} categories:`);
  data.forEach((cat, i) => {
    console.log(`  ${i + 1}. ${cat.name_en} (${cat.slug})`);
  });
}

async function main() {
  console.log('='.repeat(50));
  console.log('Tour Categories Migration');
  console.log('='.repeat(50));

  const tableExists = await checkAndCreateTable();

  if (tableExists) {
    await insertCategories();
    await verifyCategories();
    console.log('\n' + '='.repeat(50));
    console.log('Migration complete!');
    console.log('='.repeat(50));
  }
}

main().catch(console.error);
