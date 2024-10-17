

// function seed(i) {
// 	const x = i / Math.PI;
//   return x - Math.floor(x);
// }

// function pseudorandom(i, volatilityMultiplier = 0) {
//     const seedValue = seed(i);
//     const pseudoVal = (seedValue + (seedValue * volatilityMultiplier)) / 2;
//     // console.log(pseudoVal, seedValue, volatilityMultiplier, seedValue / 2)
//     return pseudoVal;
// }

// const start = 1729133842510;
// const end = start + (10 * 24 * 60 * 60 * 1000);
// const step = 60 * 60 * 1000;

// const data = [];

// for (let i = start; i < end; i += step) {
// 	data.push(pseudorandom(i));
// }

// console.log(data);

// var chart = new Highcharts.Chart({
//     chart: {
//         renderTo: 'container',
//         animation: false,
//         zoomType: 'x'
//     },
//     tooltip: {
//         yDecimals: 2
//     },
//     series: [{
//         data: data
//     }]
// });


// http://jsfiddle.net/8spemyab/45/


/**
 * Seeded Pseudorandom Number Generator (Linear Congruential Generator)
 * Reference: https://en.wikipedia.org/wiki/Linear_congruential_generator
 */
class SeededRandom {
    constructor(seed) {
      // Parameters for LCG (example values)
      this.m = 0x80000000; // 2^31
      this.a = 1103515245;
      this.c = 12345;
      this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }
  
    nextInt() {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state;
    }
  
    // Returns a float between 0 (inclusive) and 1 (exclusive)
    nextFloat() {
      return this.nextInt() / (this.m - 1);
    }
  
    // Returns a float between -0.5 and 0.5
    nextSignedFloat() {
      return this.nextFloat() - 0.5;
    }
  }
  
  /**
   * Function to generate fake stock time series data deterministically based on a seed.
   * 
   * @param {Object} options - Configuration options
   * @param {number} options.startDate - Start date in milliseconds since epoch
   * @param {number} options.endDate - End date in milliseconds since epoch
   * @param {number} options.stepSize - Step size in milliseconds
   * @param {number} options.seed - Seed value for deterministic generation
   * @param {number} [options.initialPrice=100] - Starting stock price
   * @param {number} [options.volatility=2] - Percentage volatility
   * @param {Object} [options.volumeRange={ min: 100000, max: 500000 }] - Range for trading volumes
   * 
   * @returns {Array<Object>} Array of stock data points
   */
  function generateFakeStockData({
    startDate,
    endDate,
    stepSize,
    seed,
    initialPrice = 100,
    volatility = 2, // Percentage volatility
    volumeRange = { min: 100000, max: 500000 },
  }) {
    if (endDate <= startDate) {
      throw new Error("endDate must be greater than startDate.");
    }
    if (stepSize <= 0) {
      throw new Error("stepSize must be a positive number.");
    }
    if (!volumeRange.min || !volumeRange.max || volumeRange.min > volumeRange.max) {
      throw new Error("Invalid volumeRange. Ensure min <= max.");
    }
  
    const data = [];
    let currentPrice = initialPrice;
  
    // Initialize seeded random number generator
    const rng = new SeededRandom(seed);
  
    // Helper function to format date as YYYY-MM-DD HH:mm:ss
    function formatDate(date) {
      const pad = (n) => n.toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      const month = pad(date.getUTCMonth() + 1);
      const day = pad(date.getUTCDate());
      const hours = pad(date.getUTCHours());
      const minutes = pad(date.getUTCMinutes());
      const seconds = pad(date.getUTCSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  
    // Iterate from startDate to endDate in steps of stepSize
    for (let timestamp = startDate; timestamp <= endDate; timestamp += stepSize) {
      const currentDate = new Date(timestamp);
  
      // Simulate daily (or step) return
      const dailyReturn = rng.nextSignedFloat() * (volatility / 100);
      const openPrice = currentPrice;
      const closePrice = openPrice * (1 + dailyReturn);
  
      // Simulate high and low
      const highPrice = Math.max(openPrice, closePrice) * (1 + rng.nextFloat() * (volatility / 100));
      const lowPrice = Math.min(openPrice, closePrice) * (1 - rng.nextFloat() * (volatility / 100));
  
      // Simulate volume
      const volume =
        Math.floor(
          rng.nextFloat() * (volumeRange.max - volumeRange.min + 1) + volumeRange.min
        );
  
      data.push({
        date: formatDate(currentDate),
        open: parseFloat(openPrice.toFixed(2)),
        high: parseFloat(highPrice.toFixed(2)),
        low: parseFloat(lowPrice.toFixed(2)),
        close: parseFloat(closePrice.toFixed(2)),
        volume: volume,
      });
  
      // Update currentPrice for next step
      currentPrice = closePrice;
    }
  
    return data;
  }
  