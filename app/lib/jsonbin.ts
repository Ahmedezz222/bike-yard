const JSONBIN_API_KEY = '$2a$10$fW..4YJWmJ38JaH84EVBXOj8I/SC9oR8PGuf.cukqD6pFqUeEfOFW';

// Bin IDs for different collections
const BIN_IDS = {
  products: '683666558960c979a5a1fa33', // Replace with your products bin ID
  orders: '6836667b8561e97a501c613d',   // Replace with your orders bin ID
};

const getBinUrl = (binId: string) => `https://api.jsonbin.io/v3/b/${binId}`;

export async function fetchFromJsonBin(collection: 'products' | 'orders') {
  try {
    const response = await fetch(getBinUrl(BIN_IDS[collection]), {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${collection} from JSONBin`);
    }

    const data = await response.json();
    return data.record;
  } catch (error) {
    console.error(`Error fetching ${collection} from JSONBin:`, error);
    throw error;
  }
}

export async function updateJsonBin(collection: 'products' | 'orders', data: unknown[]) {
  try {
    const response = await fetch(getBinUrl(BIN_IDS[collection]), {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${collection} in JSONBin`);
    }

    const result = await response.json();
    return result.record;
  } catch (error) {
    console.error(`Error updating ${collection} in JSONBin:`, error);
    throw error;
  }
} 