import * as fs from 'fs';

function log(msg: string) {
    fs.appendFileSync('test_output.txt', msg + '\n');
}

async function testSearch(params: string) {
    const url = `https://gamma-api.polymarket.com/public-search?q=btc&limit=5&${params}`;
    log(`Testing: ${params}`);
    try {
        const res = await fetch(url);
        const data = await res.json() as any;

        if (data.events) {
            const markets = data.events.flatMap((e: any) => e.markets || []);
            const closedCount = markets.filter((m: any) => m.closed).length;
            log(`[${params}] Total: ${markets.length}, Closed: ${closedCount}`);
        } else {
            log(`[${params}] No events`);
        }
    } catch (e) {
        log(`[${params}] Error: ${e}`);
    }
}

async function checkMarket(id: string) {
    log(`Checking market ID: ${id}`);
    try {
        const res = await fetch(`https://gamma-api.polymarket.com/markets/${id}`);
        if (res.ok) {
            const data = await res.json();
            log(`- Found: ${data.question} (Active: ${data.active}, Closed: ${data.closed})`);
        } else {
            log(`- Not found (Status: ${res.status})`);
        }
    } catch (e) {
        log(`- Error: ${e}`);
    }
}

async function run() {
    fs.writeFileSync('test_output.txt', '');
    await testSearch('closed=false');
    await testSearch('keep_closed_markets=false');
    await testSearch('events_status=active');
    await checkMarket('239676');
}

run();
