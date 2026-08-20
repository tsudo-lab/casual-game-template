import Constants from 'expo-constants';
import { Platform } from 'react-native';

type Unsubscribe = () => void;

type InterstitialLike = {
  addAdEventListener: (event: string, listener: (error?: unknown) => void) => Unsubscribe;
  load: () => void;
  show: () => Promise<void>;
};

const isSupportedRuntime = Constants.appOwnership !== 'expo';
const forceTestAds = process.env.EXPO_PUBLIC_ADMOB_FORCE_TEST_ADS !== 'false';

class AdMobService {
  private interstitial: InterstitialLike | null = null;
  private loaded = false;
  private loading = false;
  private initialized = false;
  private privacyOptionsRequired = false;
  private listeners: Unsubscribe[] = [];

  async initialize(): Promise<boolean> {
    if (!isSupportedRuntime || this.initialized) return this.initialized;

    try {
      const { AdsConsent, AdsConsentPrivacyOptionsRequirementStatus, default: mobileAds } = await import('react-native-google-mobile-ads');
      const consentInfo = await AdsConsent.gatherConsent({ tagForUnderAgeOfConsent: false }).catch(() => AdsConsent.getConsentInfo().catch(() => null));

      this.privacyOptionsRequired = consentInfo?.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
      if (!consentInfo?.canRequestAds) return false;

      await mobileAds().initialize();
      this.initialized = true;
      void this.preloadInterstitial();
      return true;
    } catch {
      return false;
    }
  }

  async preloadInterstitial(): Promise<void> {
    if (!isSupportedRuntime || !this.initialized || this.loading || this.loaded) return;

    this.cleanup();
    this.loading = true;

    try {
      const { AdEventType, InterstitialAd, TestIds } = await import('react-native-google-mobile-ads');
      const productionId = Platform.select({
        android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID,
        ios: process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID,
      });
      const unitId = __DEV__ || forceTestAds || !productionId ? TestIds.INTERSTITIAL : productionId;
      const ad = InterstitialAd.createForAdRequest(unitId, { requestNonPersonalizedAdsOnly: true }) as InterstitialLike;

      this.interstitial = ad;
      this.listeners = [
        ad.addAdEventListener(AdEventType.LOADED, () => {
          this.loading = false;
          this.loaded = true;
        }),
        ad.addAdEventListener(AdEventType.ERROR, () => {
          this.loading = false;
          this.loaded = false;
        }),
      ];
      ad.load();
    } catch {
      this.loading = false;
      this.loaded = false;
    }
  }

  async showInterstitialIfReady(): Promise<boolean> {
    if (!isSupportedRuntime || !this.loaded || !this.interstitial) {
      void this.preloadInterstitial();
      return false;
    }

    const ad = this.interstitial;
    this.loaded = false;

    try {
      const { AdEventType } = await import('react-native-google-mobile-ads');
      return await new Promise<boolean>((resolve) => {
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | null = null;
        const finish = (shown: boolean) => {
          if (settled) return;
          settled = true;
          if (timer) clearTimeout(timer);
          closeListener();
          errorListener();
          this.cleanup();
          void this.preloadInterstitial();
          resolve(shown);
        };
        const closeListener = ad.addAdEventListener(AdEventType.CLOSED, () => finish(true));
        const errorListener = ad.addAdEventListener(AdEventType.ERROR, () => finish(false));
        timer = setTimeout(() => finish(false), 30_000);
        void ad.show().catch(() => finish(false));
      });
    } catch {
      this.cleanup();
      void this.preloadInterstitial();
      return false;
    }
  }

  isPrivacyOptionsRequired(): boolean {
    return this.privacyOptionsRequired;
  }

  async showPrivacyOptionsForm(): Promise<boolean> {
    if (!isSupportedRuntime || !this.privacyOptionsRequired) return false;
    try {
      const { AdsConsent, AdsConsentPrivacyOptionsRequirementStatus } = await import('react-native-google-mobile-ads');
      const consentInfo = await AdsConsent.showPrivacyOptionsForm();
      this.privacyOptionsRequired = consentInfo.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
      return true;
    } catch {
      return false;
    }
  }

  private cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners = [];
    this.interstitial = null;
    this.loading = false;
    this.loaded = false;
  }
}

export default new AdMobService();
