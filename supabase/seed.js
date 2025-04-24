import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample products
const products = [
  {
    name: 'Premium Electric Mixer',
    description: 'High-quality electric mixer with multiple speed settings and attachments. Perfect for all your kitchen needs. Energy-efficient design with a powerful motor that can handle even the toughest mixing tasks.',
    price: 249.99,
    image: '/placeholder.svg',
    category: 'kitchen-appliances',
    brand: 'ElectriCo',
    in_stock: true
  },
  {
    name: 'Smart LED Light Bulb',
    description: 'Energy-efficient smart LED bulb that can be controlled via app. Compatible with most smart home systems. Changes colors and brightness to match your mood.',
    price: 29.99,
    image: '/placeholder.svg',
    category: 'lighting',
    brand: 'LumiTech',
    in_stock: true
  },
  {
    name: 'Solar Garden Lights (Set of 4)',
    description: 'Sustainable solar-powered garden lights that charge during the day and illuminate your garden at night. Weather-resistant and easy to install.',
    price: 49.99,
    image: '/placeholder.svg',
    category: 'outdoor',
    brand: 'SolarGlow',
    in_stock: true
  },
  {
    name: 'Eco-Friendly Electric Lawn Mower',
    description: 'Powerful electric lawn mower with zero emissions. Features adjustable cutting height and a large grass collection bag.',
    price: 349.99,
    image: '/placeholder.svg',
    category: 'garden-tools',
    brand: 'GreenCut',
    in_stock: true
  },
  {
    name: 'Programmable WiFi Thermostat',
    description: 'Save energy with this smart thermostat that learns your preferences and can be controlled remotely. Compatible with most HVAC systems.',
    price: 179.99,
    image: '/placeholder.svg',
    category: 'home-automation',
    brand: 'TempSmart',
    in_stock: true
  }
];

// Product specifications
const specifications = [
  // For Electric Mixer
  { product_index: 0, name: 'Power', value: '800W' },
  { product_index: 0, name: 'Voltage', value: '220-240V' },
  { product_index: 0, name: 'Speed Settings', value: '10' },
  { product_index: 0, name: 'Warranty', value: '2 Years' },
  { product_index: 0, name: 'Weight', value: '5.2kg' },
  
  // For Smart LED Light Bulb
  { product_index: 1, name: 'Wattage', value: '9W' },
  { product_index: 1, name: 'Lumens', value: '800lm' },
  { product_index: 1, name: 'Color Range', value: 'RGB + White' },
  { product_index: 1, name: 'Connectivity', value: 'WiFi, Bluetooth' },
  { product_index: 1, name: 'Lifespan', value: '25,000 hours' },
  
  // For Solar Garden Lights
  { product_index: 2, name: 'Light Source', value: 'LED' },
  { product_index: 2, name: 'Charging Time', value: '6-8 hours' },
  { product_index: 2, name: 'Run Time', value: '8-10 hours' },
  { product_index: 2, name: 'Waterproof Rating', value: 'IP65' },
  { product_index: 2, name: 'Material', value: 'Stainless Steel, Plastic' },
  
  // For Electric Lawn Mower
  { product_index: 3, name: 'Power', value: '1500W' },
  { product_index: 3, name: 'Cutting Width', value: '38cm' },
  { product_index: 3, name: 'Grass Collection', value: '40L' },
  { product_index: 3, name: 'Cutting Heights', value: '6 positions' },
  { product_index: 3, name: 'Weight', value: '12kg' },
  
  // For WiFi Thermostat
  { product_index: 4, name: 'Connectivity', value: 'WiFi, Bluetooth' },
  { product_index: 4, name: 'App Support', value: 'iOS, Android' },
  { product_index: 4, name: 'Voice Control', value: 'Amazon Alexa, Google Assistant' },
  { product_index: 4, name: 'Display', value: 'Color Touchscreen' },
  { product_index: 4, name: 'Warranty', value: '3 Years' }
];

// Seed the database
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  // Insert products
  console.log('🏷️ Inserting products...');
  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert(products)
    .select();
  
  if (productError) {
    console.error('❌ Error inserting products:', productError);
    return;
  }
  
  console.log(`✅ Successfully inserted ${productData.length} products.`);
  
  // Insert specifications
  console.log('📋 Inserting product specifications...');
  const specsToInsert = specifications.map(spec => ({
    product_id: productData[spec.product_index].id,
    name: spec.name,
    value: spec.value
  }));
  
  const { data: specData, error: specError } = await supabase
    .from('product_specifications')
    .insert(specsToInsert);
  
  if (specError) {
    console.error('❌ Error inserting specifications:', specError);
    return;
  }
  
  console.log(`✅ Successfully inserted product specifications.`);
  console.log('🎉 Database seeding completed successfully!');
}

// Run the seed function
seedDatabase(); 