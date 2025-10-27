
// hardened feed aggregation with caching in DB and simple rate-limiting
const Parser = require('rss-parser');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prisma = require('./prisma-wrapper');
const parser = new Parser({ timeout: 10000 });
const FEED_CACHE_TTL = parseInt(process.env.FEED_CACHE_TTL_SECONDS || '300',
10); // 5min
const FEED_RATE_LIMIT = parseInt(process.env.FEED_RATE_LIMIT_SECONDS || '10',
10); // 10s between fetches per source
// sources list — add more entries here as needed
const SOURCES = [
{ name: 'Daily Monitor', url: 'https://www.monitor.co.ug', rss: 'https://
www.monitor.co.ug/uganda/news/rss.xml' },
{ name: 'MBU', url: 'https://mbu.ac.ug', rss: 'https://mbu.ac.ug/feed' },
{ name: 'BBC', url: 'https://www.bbc.com', rss: 'https://feeds.bbci.co.uk/
news/rss.xml' },
{ name: 'The Guardian', url: 'https://www.theguardian.com', rss: 'https://
www.theguardian.com/world/rss' }
];
// keep last fetch timestamp in memory to avoid hammering sources (also we store 
cache in DB)
const lastFetch = {};
async function tryFetchRSS(rssUrl) {
try {
const feed = await parser.parseURL(rssUrl);
return (feed.items || []).map(i => ({ ...i }));
} catch (e) {
return null;
}
}
async function scrapeListFromSite(siteUrl) {
try {
const res = await fetch(siteUrl);
const html = await res.text();
const $ = cheerio.load(html);
const items = [];
$('article a, .article a, .post a, h3 a, h2 a').each((i, el) => {
const a = $(el);
const href = a.attr('href');
const title = a.text().trim();
if (href && title && title.length > 10) {
items.push({ title, link: href.startsWith('http') ? href : new
URL(href, siteUrl).toString(), source: siteUrl });
}
});
if (items.length === 0) {
$('a').each((i, el) => {
const a = $(el); const title = a.text().trim(); const href =
a.attr('href');
if (href && title && title.length > 30) items.push({ title, link:
href.startsWith('http') ? href : new URL(href, siteUrl).toString(), source:
siteUrl });
});
}
return items.slice(0, 20);
} catch (err) {
console.warn('Scrape failed for', siteUrl, err && err.message);
return [];
}
}
async function getCachedFeed(source, url) {
const rec = await prisma.feedCache.findFirst({ where: { source, url } });
if (!rec) return null;
const age = (Date.now() - new Date(rec.fetchedAt).getTime())/1000;
if (age > FEED_CACHE_TTL) return null;
return rec.data;
}
async function setCachedFeed(source, url, data) {
const existing = await prisma.feedCache.findFirst({ where: { source, url } });
if (existing) {
return prisma.feedCache.update({ where: { id: existing.id }, data: { data,
fetchedAt: new Date() } });
}
return prisma.feedCache.create({ data: { source, url, data } });
}
async function fetchAggregatedFeeds() {
const all = [];
for (const src of SOURCES) {
const key = src.name;
const since = lastFetch[key] || 0;
if (Date.now() - since < FEED_RATE_LIMIT * 1000) {
// use DB cache if available
const cached = await getCachedFeed(src.name, src.rss || src.url);
if (cached) {
all.push(...cached);
continue;
}
}
let items = [];
if (src.rss) {
const rssItems = await tryFetchRSS(src.rss);
if (rssItems && rssItems.length) {
items = rssItems.map(it => ({ ...it, source: src.name }));
}
}
if (items.length === 0) {
const scraped = await scrapeListFromSite(src.url);
items = scraped.map(it => ({ ...it, source: src.name }));
}
// normalize and cache
const normalized = items.slice(0, 15).map(it => ({ title: it.title, link:
it.link || it.enclosure?.url || '', contentSnippet: it.contentSnippet ||
it.content || '', isoDate: it.isoDate || it.pubDate, source: src.name }));
await setCachedFeed(src.name, src.rss || src.url, normalized);
lastFetch[key] = Date.now();
all.push(...normalized);
}
all.sort((a,b) => {
const ta = a.isoDate ? new Date(a.isoDate).getTime() : 0;
const tb = b.isoDate ? new Date(b.isoDate).getTime() : 0;
return tb - ta;
});
return all.slice(0, 100);
}
module.exports = { fetchAggregatedFeeds };
exports.fetchAggregatedFeeds = fetchAggregatedFeeds;