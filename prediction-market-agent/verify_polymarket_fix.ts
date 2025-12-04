import { polymarket } from './src/services/polymarket';

async function verify() {
    console.log('Testing searchMarkets...');
    const markets = await polymarket.searchMarkets('fed');

    if (markets.length === 0) {
        console.error('❌ No markets found');
        return;
    }

    console.log(`✅ Found ${markets.length} markets`);

    const firstMarket = markets[0];
    console.log('First market:', JSON.stringify(firstMarket, null, 2));

    // Checks
    if (firstMarket.prices[0] === 0.5 && firstMarket.prices[1] === 0.5) {
        console.warn('⚠️ Prices look like default/mock values (0.5, 0.5)');
    } else {
        console.log('✅ Prices look real:', firstMarket.prices);
    }

    if (typeof firstMarket.outcomes === 'string') {
        console.error('❌ Outcomes is a string, expected array');
    } else {
        console.log('✅ Outcomes is an array:', firstMarket.outcomes);
    }

    if (!firstMarket.active) {
        console.error('❌ Market is not active');
    } else {
        console.log('✅ Market is active');
    }
}

verify().catch(console.error);
