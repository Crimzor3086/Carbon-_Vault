// CVT Price Management Service
import { MarketplaceListing } from './marketplaceService';
import { Transaction } from './transactionHistory';

const PRICE_STORAGE_KEY = 'carbon_vault_cvt_price';
const PRICE_HISTORY_KEY = 'carbon_vault_price_history';
const MAX_HISTORY_POINTS = 1000; // Keep last 1000 price points for more data

// Contract deployment date: November 12, 2025, 20:00:52 UTC
export const CONTRACT_DEPLOYMENT_DATE = new Date('2025-11-12T20:00:52.409Z').getTime();

export interface PricePoint {
  timestamp: number;
  price: number;
  volume24h?: number;
  marketCap?: number;
  source?: 'listing' | 'transaction' | 'calculated' | 'manual';
}

export interface CVTPrice {
  current: number;
  change24h: number;
  change7d: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

// Default CVT price (can be overridden by admin)
const DEFAULT_PRICE: CVTPrice = {
  current: 1.0,
  change24h: 2.5,
  change7d: 8.3,
  high24h: 1.05,
  low24h: 0.95,
  volume24h: 45678.50,
  marketCap: 1000000,
  lastUpdated: Date.now(),
};

// Get current CVT price
export function getCVTPrice(): CVTPrice {
  try {
    const stored = localStorage.getItem(PRICE_STORAGE_KEY);
    if (stored) {
      const price = JSON.parse(stored);
      // If price is older than 1 hour, return default with warning
      if (Date.now() - price.lastUpdated > 3600000) {
        console.warn('CVT price data is stale, using default');
        return DEFAULT_PRICE;
      }
      return price;
    }
    return DEFAULT_PRICE;
  } catch (error) {
    console.error('Error reading CVT price:', error);
    return DEFAULT_PRICE;
  }
}

// Set CVT price (admin function)
export function setCVTPrice(price: Partial<CVTPrice>): void {
  try {
    const currentPrice = getCVTPrice();
    const newPrice: CVTPrice = {
      ...currentPrice,
      ...price,
      lastUpdated: Date.now(),
    };
    
    localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(newPrice));
    
    // Add to price history
    addPriceToHistory({
      timestamp: newPrice.lastUpdated,
      price: newPrice.current,
      volume24h: newPrice.volume24h,
      marketCap: newPrice.marketCap,
    });
  } catch (error) {
    console.error('Error setting CVT price:', error);
  }
}

// Get price history
export function getPriceHistory(limit?: number): PricePoint[] {
  try {
    const stored = localStorage.getItem(PRICE_HISTORY_KEY);
    if (!stored) {
      // Return empty history - will be populated from marketplace listings
      return [];
    }
    
    const history: PricePoint[] = JSON.parse(stored);
    return limit ? history.slice(-limit) : history;
  } catch (error) {
    console.error('Error reading price history:', error);
    return [];
  }
}

// Add price point to history
function addPriceToHistory(point: PricePoint): void {
  try {
    const history = getPriceHistory();
    history.push(point);
    
    // Keep only last MAX_HISTORY_POINTS
    const trimmed = history.slice(-MAX_HISTORY_POINTS);
    
    localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error adding to price history:', error);
  }
}

// Initialize price history from marketplace listings
// Uses real marketplace data instead of simulated data
function initializePriceHistoryFromListings(listings: MarketplaceListing[]): PricePoint[] {
  const history: PricePoint[] = [];
  const now = Date.now();
  
  // Get active listings and calculate weighted average price
  const activeListings = listings.filter(l => l.active && !l.isExpired);
  
  if (activeListings.length === 0) {
    // No listings yet, return empty history
    return [];
  }
  
  // Calculate weighted average price from listings
  let totalValue = 0;
  let totalAmount = 0;
  
  activeListings.forEach(listing => {
    const amount = parseFloat(listing.amount);
    const price = parseFloat(listing.pricePerToken);
    totalValue += amount * price;
    totalAmount += amount;
  });
  
  if (totalAmount > 0) {
    const avgPrice = totalValue / totalAmount;
    
    // Create a single price point from current listings
    history.push({
      timestamp: now,
      price: avgPrice,
      volume24h: totalValue,
      source: 'listing',
    });
  }
  
  // Save to localStorage
  localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
  
  return history;
}


// Format price for display
export function formatPrice(price: number, decimals: number = 2): string {
  return price.toFixed(decimals);
}

// Format price change
export function formatPriceChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

// Get price change color
export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-success';
  if (change < 0) return 'text-destructive';
  return 'text-muted-foreground';
}

// Calculate price statistics
export function calculatePriceStats(history: PricePoint[]): {
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  volatility: number;
} {
  if (history.length === 0) {
    return { avgPrice: 0, maxPrice: 0, minPrice: 0, volatility: 0 };
  }
  
  const prices = history.map(p => p.price);
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  
  // Calculate volatility (standard deviation)
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);
  
  return {
    avgPrice: parseFloat(avgPrice.toFixed(4)),
    maxPrice: parseFloat(maxPrice.toFixed(4)),
    minPrice: parseFloat(minPrice.toFixed(4)),
    volatility: parseFloat(volatility.toFixed(4)),
  };
}

// Get price for specific time range
export function getPriceForRange(range: '5s' | '1m' | '5m' | '1h' | '24h' | '7d' | '30d' | 'all'): PricePoint[] {
  const history = getPriceHistory();
  const now = Date.now();
  
  let cutoff: number;
  switch (range) {
    case '5s':
      cutoff = now - (5 * 1000); // 5 seconds
      break;
    case '1m':
      cutoff = now - (60 * 1000); // 1 minute
      break;
    case '5m':
      cutoff = now - (5 * 60 * 1000); // 5 minutes
      break;
    case '1h':
      cutoff = now - (60 * 60 * 1000); // 1 hour
      break;
    case '24h':
      cutoff = now - (24 * 60 * 60 * 1000);
      break;
    case '7d':
      cutoff = now - (7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      cutoff = now - (30 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
      cutoff = CONTRACT_DEPLOYMENT_DATE; // From deployment
      break;
    default:
      cutoff = 0;
  }
  
  return history.filter(p => p.timestamp >= cutoff);
}

// Export price history as CSV
export function exportPriceHistoryCSV(): string {
  const history = getPriceHistory();
  
  const headers = ['Date', 'Price (USD)', 'Volume 24h', 'Market Cap'];
  const rows = history.map(point => [
    new Date(point.timestamp).toLocaleString(),
    point.price.toFixed(4),
    point.volume24h?.toFixed(2) || 'N/A',
    point.marketCap?.toFixed(2) || 'N/A',
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  return csv;
}

// Reset price to default
export function resetPriceToDefault(): void {
  localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(DEFAULT_PRICE));
}

// Clear price history
export function clearPriceHistory(): void {
  localStorage.removeItem(PRICE_HISTORY_KEY);
}

// Force reset price to default (useful for testing)
export function resetToDefaultPrice(): void {
  localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(DEFAULT_PRICE));
  clearPriceHistory();
}

// Update price from marketplace listings (extract real data)
export function updatePriceFromListings(listings: MarketplaceListing[]): void {
  if (!listings || listings.length === 0) return;

  // Calculate weighted average price from active listings
  const activeListings = listings.filter(l => l.active && !l.isExpired);
  if (activeListings.length === 0) return;

  let totalValue = 0;
  let totalAmount = 0;

  activeListings.forEach(listing => {
    const amount = parseFloat(listing.amount);
    const price = parseFloat(listing.pricePerToken);
    totalValue += amount * price;
    totalAmount += amount;
  });

  if (totalAmount > 0) {
    const weightedAvgPrice = totalValue / totalAmount;
    const currentPrice = getCVTPrice();

    // Only update if price changed significantly (>0.1%)
    if (Math.abs(weightedAvgPrice - currentPrice.current) / currentPrice.current > 0.001) {
      // Calculate 24h stats
      const prices = activeListings.map(l => parseFloat(l.pricePerToken));
      const high24h = Math.max(...prices);
      const low24h = Math.min(...prices);
      
      // Calculate volume (sum of all listing values)
      const volume24h = activeListings.reduce((sum, l) => {
        return sum + parseFloat(l.amount) * parseFloat(l.pricePerToken);
      }, 0);

      setCVTPrice({
        current: parseFloat(weightedAvgPrice.toFixed(4)),
        high24h: parseFloat(high24h.toFixed(4)),
        low24h: parseFloat(low24h.toFixed(4)),
        volume24h: parseFloat(volume24h.toFixed(2)),
      });

      // Add price point with 'listing' source
      addPriceToHistory({
        timestamp: Date.now(),
        price: parseFloat(weightedAvgPrice.toFixed(4)),
        volume24h: volume24h,
        source: 'listing',
      });
    }
  }
}

// Interpolate missing data points for continuous chart
export function interpolatePriceData(data: PricePoint[], targetPoints: number): PricePoint[] {
  if (data.length === 0) return [];
  if (data.length >= targetPoints) return data;

  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const result: PricePoint[] = [];
  
  const startTime = sortedData[0].timestamp;
  const endTime = sortedData[sortedData.length - 1].timestamp;
  const timeStep = (endTime - startTime) / (targetPoints - 1);

  for (let i = 0; i < targetPoints; i++) {
    const targetTime = startTime + i * timeStep;
    
    // Find surrounding data points
    let beforePoint: PricePoint | null = null;
    let afterPoint: PricePoint | null = null;

    for (let j = 0; j < sortedData.length - 1; j++) {
      if (sortedData[j].timestamp <= targetTime && sortedData[j + 1].timestamp >= targetTime) {
        beforePoint = sortedData[j];
        afterPoint = sortedData[j + 1];
        break;
      }
    }

    if (beforePoint && afterPoint) {
      // Linear interpolation
      const timeDiff = afterPoint.timestamp - beforePoint.timestamp;
      const ratio = (targetTime - beforePoint.timestamp) / timeDiff;
      const interpolatedPrice = beforePoint.price + (afterPoint.price - beforePoint.price) * ratio;

      result.push({
        timestamp: targetTime,
        price: interpolatedPrice,
        source: 'calculated',
      });
    } else if (i === 0) {
      result.push(sortedData[0]);
    } else if (i === targetPoints - 1) {
      result.push(sortedData[sortedData.length - 1]);
    }
  }

  return result;
}

// Get smoothed price data using moving average
export function getSmoothPriceData(data: PricePoint[], windowSize: number = 5): PricePoint[] {
  if (data.length < windowSize) return data;

  const result: PricePoint[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    
    const avgPrice = window.reduce((sum, p) => sum + p.price, 0) / window.length;
    
    result.push({
      ...data[i],
      price: avgPrice,
    });
  }

  return result;
}

