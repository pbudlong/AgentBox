// Update an existing webhook to point to production
const PRODUCTION_URL = 'https://agentboxyc.replit.app/webhooks/agentmail';
const PROD_API_KEY = process.env.AGENTMAIL_API_KEY_PROD;

if (!PROD_API_KEY) {
  console.error('❌ AGENTMAIL_API_KEY_PROD not found');
  process.exit(1);
}

console.log('🔄 UPDATING WEBHOOK TO PRODUCTION URL');
console.log(`📍 Target URL: ${PRODUCTION_URL}`);
console.log('🔑 Using: AGENTMAIL_API_KEY_PROD');
console.log('');

async function listWebhooks() {
  const response = await fetch("https://api.agentmail.to/v0/webhooks", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${PROD_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list webhooks: ${error}`);
  }

  return await response.json();
}

async function updateWebhook(webhookId) {
  const response = await fetch(`https://api.agentmail.to/v0/webhooks/${webhookId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${PROD_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: PRODUCTION_URL,
      event_types: ["message.received"],
      enabled: true
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update webhook: ${error}`);
  }

  return await response.json();
}

try {
  // Get list of existing webhooks
  const result = await listWebhooks();
  
  if (!result.webhooks || result.webhooks.length === 0) {
    console.error('❌ No webhooks found to update');
    process.exit(1);
  }

  // Find a webhook that's not already pointing to production
  let webhookToUpdate = result.webhooks.find(w => w.url !== PRODUCTION_URL);
  
  if (!webhookToUpdate) {
    console.log('✅ A webhook is already pointing to production URL!');
    webhookToUpdate = result.webhooks.find(w => w.url === PRODUCTION_URL);
    if (webhookToUpdate) {
      console.log(`   Webhook ID: ${webhookToUpdate.webhook_id}`);
      console.log(`   URL: ${webhookToUpdate.url}`);
    }
    process.exit(0);
  }

  console.log(`📝 Updating webhook: ${webhookToUpdate.webhook_id}`);
  console.log(`   Current URL: ${webhookToUpdate.url}`);
  console.log(`   New URL: ${PRODUCTION_URL}`);
  console.log('');

  const updated = await updateWebhook(webhookToUpdate.webhook_id);
  
  console.log('✅ WEBHOOK UPDATED SUCCESSFULLY!');
  console.log('📦 Response:');
  console.log(JSON.stringify(updated, null, 2));
  console.log('');
  console.log('⚠️  IMPORTANT: Production webhook is now active!');
  console.log(`    Webhook ID: ${updated.webhook_id}`);
  console.log(`    URL: ${updated.url}`);
  
  process.exit(0);
} catch (error) {
  console.error('❌ Update failed:');
  console.error(error.message);
  process.exit(1);
}
