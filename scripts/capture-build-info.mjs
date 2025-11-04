#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
  const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const commitShort = commit.substring(0, 7);
  const version = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim(), 10);
  const buildTime = new Date().toISOString();

  const buildInfo = {
    version,
    commit,
    commitShort,
    buildTimeIso: buildTime,
  };

  // Write to a JSON file that will be bundled
  writeFileSync('shared/build-metadata.json', JSON.stringify(buildInfo, null, 2));
  
  console.log(`✅ Captured build metadata: V${version} (${commitShort})`);
} catch (error) {
  console.error('❌ Failed to capture build metadata:', error);
  process.exit(1);
}
