/**
 * Capture / document scan types.
 */

export type ScanStatus = 'success' | 'cancel';

export interface ScanResult {
  scannedImages: string[];
  status: ScanStatus;
}

/** Response from react-native-document-scanner-plugin scanDocument */
export interface ScanDocumentResponse {
  scannedImages?: string[];
  status?: ScanStatus;
}
