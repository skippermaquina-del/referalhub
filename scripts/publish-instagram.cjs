// Publishes to Instagram via the native Instagram API
// (Instagram Business Login — graph.instagram.com, not graph.facebook.com).
//
// Usage:
//   Add IG_ACCESS_TOKEN and IG_USER_ID to .env.local, then either:
//
//   Single image post:
//     npm run publish:instagram -- <image_url> "<caption>"
//
//   Carousel post (2-10 images):
//     npm run publish:instagram -- --carousel "<caption>" <image_url_1> <image_url_2> ...
//
// IG_ACCESS_TOKEN: an "IGAA..." token generated via the app's
//   Customize use case > API setup with Instagram login > Generate access tokens.
//   Short-lived by default (~1 hour) — exchange for a long-lived token (60 days) via
//   GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=<IG_APP_SECRET>&access_token=<short_lived_token>
// IG_USER_ID: the native Instagram user ID (from graph.instagram.com/me), NOT the
//   Facebook-linked "Instagram Business Account" ID from the Page.
//
// Never commit real values for IG_ACCESS_TOKEN / IG_USER_ID — pass them as env vars only.

const GRAPH_VERSION = 'v21.0';
const GRAPH_HOST = 'https://graph.instagram.com';

function getAuth() {
  const token = process.env.IG_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;
  if (!token || !igUserId) {
    console.error('Missing IG_ACCESS_TOKEN or IG_USER_ID environment variables.');
    process.exit(1);
  }
  return { token, igUserId, base: `${GRAPH_HOST}/${GRAPH_VERSION}/${igUserId}` };
}

async function createMediaContainer(base, token, body) {
  const res = await fetch(`${base}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: token }),
  });
  const data = await res.json();
  if (!res.ok || !data.id) {
    console.error('Failed to create media container:', data);
    process.exit(1);
  }
  return data.id;
}

// Carousel containers (and sometimes single-image ones) can still be
// processing the images server-side right after creation. Publishing too
// early fails with "Media ID is not available" (code 9007 / 2207027), so
// poll status_code until Instagram reports FINISHED before publishing.
async function waitUntilReady(base, token, containerId, { attempts = 10, delayMs = 5000 } = {}) {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(`${base}/${containerId}?fields=status_code&access_token=${token}`);
    const data = await res.json();
    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR' || data.status_code === 'EXPIRED') {
      console.error('Container failed to process:', data);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  console.error(`Container ${containerId} never became ready after ${attempts} checks.`);
  process.exit(1);
}

async function publishContainer(base, token, creationId) {
  await waitUntilReady(base, token, creationId);

  const res = await fetch(`${base}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: creationId, access_token: token }),
  });
  const data = await res.json();
  if (!res.ok || !data.id) {
    console.error('Failed to publish media:', data);
    process.exit(1);
  }
  return data.id;
}

async function publishSingle(imageUrl, caption) {
  const { token, base } = getAuth();
  if (!imageUrl) {
    console.error('Usage: node scripts/publish-instagram.cjs <image_url> "<caption>"');
    process.exit(1);
  }

  const containerId = await createMediaContainer(base, token, { image_url: imageUrl, caption: caption || '' });
  console.log('Media container created:', containerId);

  const mediaId = await publishContainer(base, token, containerId);
  console.log('Published! Media ID:', mediaId);
}

async function publishCarousel(caption, imageUrls) {
  const { token, base } = getAuth();
  if (imageUrls.length < 2 || imageUrls.length > 10) {
    console.error(
      `Usage: node scripts/publish-instagram.cjs --carousel "<caption>" <image_url_1> <image_url_2> ... (2-10 images, got ${imageUrls.length})`
    );
    process.exit(1);
  }

  // Step 1: create one child container per image
  const childIds = [];
  for (const [i, imageUrl] of imageUrls.entries()) {
    const childId = await createMediaContainer(base, token, { image_url: imageUrl, is_carousel_item: true });
    console.log(`Carousel item ${i + 1}/${imageUrls.length} created:`, childId);
    childIds.push(childId);
  }

  // Step 2: create the parent carousel container
  const parentId = await createMediaContainer(base, token, {
    media_type: 'CAROUSEL',
    children: childIds,
    caption: caption || '',
  });
  console.log('Carousel container created:', parentId);

  // Step 3: publish it
  const mediaId = await publishContainer(base, token, parentId);
  console.log('Published! Media ID:', mediaId);
}

const args = process.argv.slice(2);
if (args[0] === '--carousel') {
  const [, caption, ...imageUrls] = args;
  publishCarousel(caption, imageUrls);
} else {
  const [imageUrl, caption] = args;
  publishSingle(imageUrl, caption);
}
