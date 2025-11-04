// Delete an old dev webhook and create production webhook
const PRODUCTION_URL = 'https://agentboxyc.replit.app/webhooks/agentmail';
const PROD_API_KEY = process.env.AGENTMAIL_API_KEY_PROD;

if (!PROD_API_KEY) {
  console.error('❌ AGENTMAIL_API_KEY_PROD not found');
  process.exit(1);
}

console.log('🔧 SETTING UP PRODUCTION WEBHOOK');
console.log(`📍 Target URL: ${PRODUCTION_URL}`);
console.log('🔑 Using: AGENTMAIL_API_KEY_PROD');
console.log('');

async function listWebhooks() {
  const response = await fetch("https://api.agentmail.to/v0/webhooks", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${PROD_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list webhooks: ${error}`);
  }

  return await response.json();
}

async function deleteWebhook(webhookId) {
  const response = await fetch(`https://api.agentmail.to/v0/webhooks/${webhookId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${PROD_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete webhook: ${error}`);
  }

  // DELETE might return 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  return await response.json();
}

async function createWebhook() {
  const response = await fetch("https://api.agentmail.to/v0/webhooks", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PROD_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: PRODUCTION_URL,
      event_types: ["message.received"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create webhook: ${error}`);
  }

  return await response.json();
}

try {
  // Step 1: Check if production webhook already exists
  const existing = await listWebhooks();
  
  const prodWebhook = existing.webhooks?.find(w => w.url === PRODUCTION_URL);
  if (prodWebhook) {
    console.log('✅ Production webhook already exists!');
    console.log(`   Webhook ID: ${prodWebhook.webhook_id}`);
    console.log(`   URL: ${prodWebhook.url}`);
    console.log(`   Enabled: ${prodWebhook.enabled}`);
    process.exit(0);
  }

  // Step 2: Find oldest dev webhook to delete
  const devWebhook = existing.webhooks?.find(w => w.url.includes('replit.dev'));
  
  if (!devWebhook) {
    console.log('ℹ️  No dev webhooks found, creating production webhook directly...');
  } else {
    console.log(`🗑️  Deleting old dev webhook: ${devWebhook.webhook_id}`);
    console.log(`   URL: ${devWebhook.url}`);
    
    await deleteWebhook(devWebhook.webhook_id);
    console.log('✅ Old webhook deleted');
    console.log('');
  }

  // Step 3: Create production webhook
  console.log('📝 Creating production webhook...');
  const result = await createWebhook();
  
  console.log('✅ PRODUCTION WEBHOOK CREATED SUCCESSFULLY!');
  console.log('📦 Response:');
  console.log(JSON.stringify(result, null, 2));
  console.log('');
  console.log('⚠️  IMPORTANT: Production webhook is now active!');
  console.log(`    Webhook ID: ${result.webhook_id}`);
  console.log(`    URL: ${result.url}`);
  
  process.exit(0);
} catch (error) {
  console.error('❌ Setup failed:');
  console.error(error.message);
  process.exit(1);
}
