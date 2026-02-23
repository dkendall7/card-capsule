/**
 * Document scan service.
 * Uses react-native-document-scanner-plugin (ML Kit / VisionKit).
 * Requires development build — does not work in Expo Go.
 */

import type { ScanDocumentResponse } from './types';

/**
 * Launch the native document scanner.
 * Returns file paths to cropped, perspective-corrected images.
 * Uses dynamic import so the native module loads only when scanning.
 */
export async function launchDocumentScanner(): Promise<ScanDocumentResponse> {
  const { default: DocumentScanner } = await import(
    'react-native-document-scanner-plugin'
  );
  return DocumentScanner.scanDocument({});
}
