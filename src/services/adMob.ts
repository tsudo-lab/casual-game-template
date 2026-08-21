const adMobService = {
  async initialize(): Promise<boolean> { return false; },
  async preloadInterstitial(): Promise<void> {},
  async showInterstitialIfReady(): Promise<boolean> { return false; },
  isPrivacyOptionsRequired(): boolean { return false; },
  async showPrivacyOptionsForm(): Promise<boolean> { return false; },
};

export default adMobService;
