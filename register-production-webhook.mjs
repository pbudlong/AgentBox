const PRODUCTION_URL = 'https://agentboxyc.replit.app/webhooks/agentmail';

// Use production API key directly
const PROD_API_KEY = process.env.AGENTMAIL_API_KEY_PROD;

if (!PROD_API_KEY) {
  console.error('❌ AGENTMAIL_API_KEY_PROD not found');
  console.error('Please set the production AgentMail API key as AGENTMAIL_API_KEY_PROD');
  process.exit(1);
}

console.log('🔔 REGISTERING PRODUCTION WEBHOOK');
console.log(`📍 Webhook URL: ${PRODUCTION_URL}`);
console.log(`🔑 Using: AGENTMAIL_API_KEY_PROD`);
console.log('');

// Register webhook using production API key directly
async function registerProductionWebhook() {
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
    throw new Error(`Webhook registration failed: ${error}`);
  }

  return await response.json();
}

try {
  const result = await registerProductionWebhook();
  console.log('✅ PRODUCTION WEBHOOK REGISTERED SUCCESSFULLY!');
  console.log('📦 AgentMail API Response:');
  console.log(JSON.stringify(result, null, 2));
  console.log('');
  console.log('⚠️  IMPORTANT: Production webhooks are now configured!');
  process.exit(0);
} catch (error) {
  console.error('❌ Webhook registration failed:');
  console.error(error.message);
  console.error('');
  if (error.message.includes('already exists') || error.message.includes('AlreadyExistsError')) {
    console.log('✅ This is OK - webhook is already registered');
    process.exit(0);
  } else {
    console.error('Full error:', error);
    process.exit(1);
  }
}
