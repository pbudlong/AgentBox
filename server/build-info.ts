import { execSync } from 'child_process';
import type { BuildInfo } from '../shared/build-info';

let cachedBuildInfo: BuildInfo | null = null;

export function getBuildInfo(): BuildInfo {
  if (cachedBuildInfo) {
    return cachedBuildInfo;
  }

  let commit = 'unknown';
  let commitShort = 'unknown';
  let buildTimeIso = new Date().toISOString();

  // Try to get git commit hash from environment or git command
  try {
    // Check for injected environment variables first (from CI/CD)
    commit = process.env.BUILD_COMMIT || 
             process.env.REPLIT_DEPLOYMENT_ID || 
             execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    commitShort = commit.substring(0, 7);
  } catch (error) {
    // Git not available or not a git repo - use fallback
    console.warn('[BuildInfo] Git metadata unavailable, using fallback version');
  }

  // Try to get build timestamp from environment
  try {
    buildTimeIso = process.env.BUILD_TIMESTAMP || buildTimeIso;
  } catch (error) {
    // Use current time as fallback
  }

  // Create human-readable label
  const buildDate = new Date(buildTimeIso);
  const dateStr = buildDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = buildDate.toISOString().split('T')[1].substring(0, 5); // HH:MM
  const buildLabel = commitShort !== 'unknown' 
    ? `${commitShort}@${dateStr}` 
    : `build-${dateStr}-${timeStr}`;

  cachedBuildInfo = {
    commit,
    commitShort,
    buildTimeIso,
    buildLabel,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  };

  console.log('[BuildInfo] Version:', cachedBuildInfo.buildLabel);

  return cachedBuildInfo;
}
