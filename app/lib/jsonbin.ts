// Get environment variables
const JSONBIN_API_KEY = process.env.NEXT_PUBLIC_JSONBIN_API_KEY || '$2a$10$fW..4YJWmJ38JaH84EVBXOj8I/SC9oR8PGuf.cukqD6pFqUeEfOFW';

// Bin IDs for different collections
const BIN_IDS = {
  products: process.env.NEXT_PUBLIC_JSONBIN_PRODUCTS_BIN_ID || '683666558960c979a5a1fa33',
  orders: process.env.NEXT_PUBLIC_JSONBIN_ORDERS_BIN_ID || '6836667b8561e97a501c613d',
};

const getBinUrl = (binId: string) => `https://api.jsonbin.io/v3/b/${binId}`;

export async function fetchFromJsonBin(collection: 'products' | 'orders') {
  try {
    console.log(`Fetching ${collection} from JSONBin...`);
    const response = await fetch(getBinUrl(BIN_IDS[collection]), {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`JSONBin API error:`, {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(
        `Failed to fetch ${collection} from JSONBin: ${response.status} ${response.statusText}${
          errorData.message ? ` - ${errorData.message}` : ''
        }`
      );
    }

    const data = await response.json();
    if (!data.record) {
      console.error(`Invalid JSONBin response format:`, data);
      throw new Error(`Invalid response format from JSONBin for ${collection}`);
    }

    console.log(`Successfully fetched ${collection} from JSONBin`);
    return data.record;
  } catch (error) {
    console.error(`Error fetching ${collection} from JSONBin:`, error);
    throw error;
  }
}

export async function updateJsonBin(collection: 'products' | 'orders', data: unknown[]) {
  try {
    console.log(`Updating ${collection} in JSONBin...`);
    const response = await fetch(getBinUrl(BIN_IDS[collection]), {
      method: 'PUT',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`JSONBin API error:`, {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(
        `Failed to update ${collection} in JSONBin: ${response.status} ${response.statusText}${
          errorData.message ? ` - ${errorData.message}` : ''
        }`
      );
    }

    const result = await response.json();
    if (!result.record) {
      console.error(`Invalid JSONBin response format:`, result);
      throw new Error(`Invalid response format from JSONBin for ${collection}`);
    }

    console.log(`Successfully updated ${collection} in JSONBin`);
    return result.record;
  } catch (error) {
    console.error(`Error updating ${collection} in JSONBin:`, error);
    throw error;
  }
} 