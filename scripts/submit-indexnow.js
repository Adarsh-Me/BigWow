const sitemapUrl = 'https://bigwow.space/sitemap.xml';
const indexNowApi = 'https://api.indexnow.org/indexnow';
const host = 'www.bigwow.space';
const key = '7720d00c8e504f6d91526d6eb4f0299b';
const keyLocation = `https://www.bigwow.space/${key}.txt`;

fetch(sitemapUrl)
  .then(res => res.text())
  .then(xml => {
    const urls = [];
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    for (const match of matches) {
      let url = match[1];
      if (url.startsWith('https://bigwow.space')) {
        url = url.replace('https://bigwow.space', 'https://www.bigwow.space');
      }
      urls.push(url);
    }
    console.log(`Extracted and converted ${urls.length} URLs from sitemap.`);
    
    return fetch(indexNowApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls
      })
    });
  })
  .then(res => console.log('IndexNow Submission Status:', res.status))
  .catch(console.error);
