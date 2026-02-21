/**
 * Capture / document scan types.
 */

export type ScanStatus = 'success' | 'cancel';

export interface ScanResult {
  scannedImages: string[];
  status: ScanStatus;
}
