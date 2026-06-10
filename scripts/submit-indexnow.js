const sitemapUrl = 'https://bigwow.space/sitemap.xml';
const indexNowApi = 'https://api.indexnow.org/indexnow';
const host = 'bigwow.space';
const key = '723ecfe1785640cda5ead85fbbd78e4f';
const keyLocation = `https://bigwow.space/${key}.txt`;

console.log('Fetching sitemap from:', sitemapUrl);
fetch(sitemapUrl)
  .then(res => {
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap: ${res.statusText}`);
    }
    return res.text();
  })
  .then(xml => {
    const urls = [];
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    for (const match of matches) {
      urls.push(match[1]);
    }
    console.log(`Extracted ${urls.length} URLs from sitemap.`);
    
    if (urls.length === 0) {
      console.log('No URLs found to submit.');
      return;
    }

    console.log(`Submitting ${urls.length} URLs to IndexNow...`);
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
  .then(res => {
    if (res) {
      console.log('IndexNow Submission Status:', res.status);
      if (res.status === 200) {
        console.log('Success! URLs submitted and key verified.');
      } else if (res.status === 202) {
        console.log('Accepted! URLs received, key verification pending.');
      } else if (res.status === 403) {
        console.log('Forbidden! Key is invalid or not yet live at keyLocation.');
      } else {
        console.log('Submission failed. Check parameters.');
      }
    }
  })
  .catch(err => {
    console.error('Error during IndexNow submission:', err.message);
  });
