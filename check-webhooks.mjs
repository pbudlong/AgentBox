// Check existing webhooks for production key
const PROD_API_KEY = process.env.AGENTMAIL_API_KEY_PROD;

if (!PROD_API_KEY) {
  console.error('❌ AGENTMAIL_API_KEY_PROD not found');
  process.exit(1);
}

console.log('🔍 CHECKING EXISTING WEBHOOKS');
console.log('🔑 Using: AGENTMAIL_API_KEY_PROD');
console.log('');

try {
  const response = await fetch("https://api.agentmail.to/v0/webhooks", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${PROD_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to list webhooks:', error);
    process.exit(1);
  }

  const result = await response.json();
  console.log('📦 Existing webhooks:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.webhooks && result.webhooks.length > 0) {
    console.log('');
    console.log('✅ Found', result.webhooks.length, 'existing webhook(s)');
    result.webhooks.forEach((webhook, i) => {
      console.log(`  ${i + 1}. URL: ${webhook.url}`);
      console.log(`     Events: ${webhook.event_types?.join(', ')}`);
    });
  } else {
    console.log('');
    console.log('ℹ️  No webhooks registered yet');
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
