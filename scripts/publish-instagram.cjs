// Publishes a single image post to Instagram via the Meta Graph API.
//
// Usage:
//   IG_ACCESS_TOKEN=xxx IG_USER_ID=xxx node scripts/publish-instagram.cjs <image_url> "<caption>"
//
// IG_ACCESS_TOKEN: long-lived access token with instagram_basic + instagram_content_publish
// IG_USER_ID: the Instagram Business Account ID (not the @handle)
//
// Never commit real values for IG_ACCESS_TOKEN / IG_USER_ID — pass them as env vars only.

const GRAPH_VERSION = 'v21.0';

async function publish(imageUrl, caption) {
  const token = process.env.IG_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;

  if (!token || !igUserId) {
    console.error('Missing IG_ACCESS_TOKEN or IG_USER_ID environment variables.');
    process.exit(1);
  }
  if (!imageUrl) {
    console.error('Usage: node scripts/publish-instagram.cjs <image_url> "<caption>"');
    process.exit(1);
  }

  const base = `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}`;

  // Step 1: create the media container
  const createRes = await fetch(`${base}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption || '',
      access_token: token,
    }),
  });
  const createData = await createRes.json();
  if (!createRes.ok || !createData.id) {
    console.error('Failed to create media container:', createData);
    process.exit(1);
  }
  console.log('Media container created:', createData.id);

  // Step 2: publish it
  const publishRes = await fetch(`${base}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: createData.id,
      access_token: token,
    }),
  });
  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    console.error('Failed to publish media:', publishData);
    process.exit(1);
  }
  console.log('Published! Media ID:', publishData.id);
}

const [, , imageUrl, caption] = process.argv;
publish(imageUrl, caption);
