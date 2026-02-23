/**
 * Hook for document scanning.
 * Handles launch, loading, result, and Expo Go detection.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useCallback, useState } from 'react';

import { launchDocumentScanner } from './scanDocument';
import type { ScanResult } from './types';

export function useDocumentScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    Constants.appOwnership === 'expo';

  const startScan = useCallback(async () => {
    if (isExpoGo) {
      setError('Document scanner requires a development build. Run: npx expo run:ios');
      return;
    }

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await launchDocumentScanner();
      const scannedImages = response.scannedImages ?? [];
      const status = response.status ?? 'cancel';
      setResult({ scannedImages, status });
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      const message =
        raw.includes('-11800') || raw.includes('Unable to capture media')
          ? 'Camera unavailable. Try on a physical device — the simulator has no camera.'
          : raw;
      setError(message);
    } finally {
      setIsScanning(false);
    }
  }, [isExpoGo]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    startScan,
    clearResult,
    isScanning,
    result,
    error,
    isExpoGo,
  };
}
