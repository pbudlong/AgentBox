import { registerWebhook } from './server/agentmail.js';

const PRODUCTION_URL = 'https://agentboxyc.replit.app/webhooks/agentmail';

// Use any inbox ID - webhooks are organization-level
const DUMMY_INBOX_ID = 'production@agentmail.to';

console.log('🔔 REGISTERING PRODUCTION WEBHOOK');
console.log(`📍 Webhook URL: ${PRODUCTION_URL}`);
console.log('');

try {
  const result = await registerWebhook(DUMMY_INBOX_ID, PRODUCTION_URL);
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
