import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { BuildInfo } from '../shared/build-info';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cachedBuildInfo: BuildInfo | null = null;

export function getBuildInfo(): BuildInfo {
  if (cachedBuildInfo) {
    return cachedBuildInfo;
  }

  let commit = 'unknown';
  let commitShort = 'unknown';
  let version = 0;
  let buildTimeIso = new Date().toISOString();

  // In production, try to read from build metadata file first (generated at build time)
  if (process.env.NODE_ENV === 'production') {
    try {
      const metadataPath = join(__dirname, '../shared/build-metadata.json');
      const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
      commit = metadata.commit;
      commitShort = metadata.commitShort;
      version = metadata.version;
      buildTimeIso = metadata.buildTimeIso;
      console.log('[BuildInfo] Loaded from build metadata:', { version, commitShort });
    } catch (error) {
      console.warn('[BuildInfo] Build metadata file not found, falling back to runtime detection');
    }
  }

  // If not production or metadata file missing, try git commands (development)
  if (version === 0) {
    try {
      commit = execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      commitShort = commit.substring(0, 7);
      
      const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      version = parseInt(commitCount, 10) || 0;
    } catch (error) {
      console.warn('[BuildInfo] Git commands failed, using fallback version');
    }
  }

  // Create human-readable label with version number
  const buildDate = new Date(buildTimeIso);
  const dateStr = buildDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = buildDate.toISOString().split('T')[1].substring(0, 5); // HH:MM
  const buildLabel = commitShort !== 'unknown' 
    ? `V${version} (${commitShort}@${dateStr})` 
    : `V0 (build-${dateStr}-${timeStr})`;

  cachedBuildInfo = {
    version,
    commit,
    commitShort,
    buildTimeIso,
    buildLabel,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  };

  console.log('[BuildInfo] Version:', cachedBuildInfo.buildLabel);

  return cachedBuildInfo;
}
