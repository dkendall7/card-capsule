/**
 * Document scan service.
 * Uses react-native-document-scanner-plugin (ML Kit / VisionKit).
 * Requires development build — does not work in Expo Go.
 */

import DocumentScanner, {
  type ScanDocumentOptions,
  type ScanDocumentResponse,
  ResponseType,
} from 'react-native-document-scanner-plugin';

const DEFAULT_OPTIONS: ScanDocumentOptions = {
  responseType: ResponseType.ImageFilePath,
  croppedImageQuality: 90,
};

/**
 * Launch the native document scanner.
 * Returns file paths to cropped, perspective-corrected images.
 */
export async function launchDocumentScanner(
  options: Partial<ScanDocumentOptions> = {}
): Promise<ScanDocumentResponse> {
  return DocumentScanner.scanDocument({
    ...DEFAULT_OPTIONS,
    ...options,
  });
}
