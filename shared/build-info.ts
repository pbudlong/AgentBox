export interface BuildInfo {
  commit: string;
  commitShort: string;
  buildTimeIso: string;
  buildLabel: string;
  environment: 'development' | 'production';
}
