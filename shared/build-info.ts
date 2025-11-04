export interface BuildInfo {
  version: number;
  commit: string;
  commitShort: string;
  buildTimeIso: string;
  buildLabel: string;
  environment: 'development' | 'production';
}
