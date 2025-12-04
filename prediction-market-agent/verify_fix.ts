import { polymarket } from './src/services/polymarket';

async function verify() {
    console.log('Testing searchMarkets("btc")...');
    const markets = await polymarket.searchMarkets('btc');

    console.log(`Found ${markets.length} markets`);

    let allActive = true;
    markets.forEach(m => {
        // We don't have 'closed' property on Market interface explicitly, 
        // but 'active' should be true.
        // However, let's check if any look obviously closed (e.g. old dates).
        console.log(`- ${m.question} (Active: ${m.active})`);
        if (!m.active) allActive = false;
    });

    if (allActive && markets.length > 0) {
        console.log('✅ All returned markets are active');
    } else if (markets.length === 0) {
        console.log('⚠️ No markets found');
    } else {
        console.error('❌ Some returned markets are NOT active');
    }
}

verify().catch(console.error);
