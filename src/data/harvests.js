// Mock harvest data for the Farm2Retail demo.
// This file provides seed data and helper functions for in-memory state.
// No backend or database — everything lives in JavaScript arrays.
// Crop images use external URLs (may be subject to hotlink protection).

// Demo identity constant for consistent farmer ownership
export const DEMO_FARMER = 'You (Demo Farmer)';

export const cropCategories = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Spices',
  'Pulses',
];

// Sample harvest listings (seed data)
export const sampleHarvests = [
  {
    id: 1,
    crop: 'Tomatoes',
    category: 'Vegetables',
    image: 'https://www.cupitfood.com/wp-content/uploads/2018/08/tomato-farming-660x660.jpg',
    quantity: 500,
    unit: 'kg',
    pricePerKg: 35,
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-11-05',
    farmer: DEMO_FARMER,
    description: 'Fresh organic tomatoes grown without pesticides. Ideal for retail and restaurant supply.',
  },
  {
    id: 2,
    crop: 'Basmati Rice',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    quantity: 2000,
    unit: 'kg',
    pricePerKg: 85,
    location: 'Dehradun, Uttarakhand',
    harvestDate: '2026-11-15',
    farmer: DEMO_FARMER,
    description: 'Premium aged basmati rice with long grains. Naturally aromatic, perfect for retail shelves.',
  },
  {
    id: 3,
    crop: 'Alphonso Mangoes',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
    quantity: 800,
    unit: 'kg',
    pricePerKg: 120,
    location: 'Ratnagiri, Maharashtra',
    harvestDate: '2026-12-01',
    farmer: DEMO_FARMER,
    description: 'GI-tagged Alphonso mangoes from Ratnagiri. Sweet, juicy and export-grade quality.',
  },
  {
    id: 4,
    crop: 'Green Chillies',
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop',
    quantity: 300,
    unit: 'kg',
    pricePerKg: 45,
    location: 'Guntur, Andhra Pradesh',
    harvestDate: '2026-11-10',
    farmer: DEMO_FARMER,
    description: 'Spicy green chillies from Guntur. Consistent heat level, ideal for wholesale distribution.',
  },
  {
    id: 5,
    crop: 'Potatoes',
    category: 'Vegetables',
    image: 'https://img-cdn.publive.online/fit-in/1200x675/english-betterindia/media/media_files/2026/01/22/potato-farming-guide-2026-01-22-19-22-51.png',
    quantity: 3000,
    unit: 'kg',
    pricePerKg: 20,
    location: 'Agra, Uttar Pradesh',
    harvestDate: '2026-11-20',
    farmer: DEMO_FARMER,
    description: 'Fresh potatoes harvested from fertile Indo-Gangetic plains. Excellent shelf life.',
  },
  {
    id: 6,
    crop: 'Turmeric',
    category: 'Spices',
    image: 'https://adidevgroup.com/img/turmeric1.jpg',
    quantity: 400,
    unit: 'kg',
    pricePerKg: 95,
    location: 'Erode, Tamil Nadu',
    harvestDate: '2026-12-10',
    farmer: DEMO_FARMER,
    description: 'High-curcumin turmeric from Erode. Sun-dried and processed for maximum freshness.',
  },
];

// Generate a simple unique ID
let nextId = sampleHarvests.length + 1;
export function generateId() {
  return nextId++;
}
