import { COMMON_COPY, GAME_META } from '../game';

describe('common game configuration', () => {
  it.each(['ja', 'en'] as const)('defines a usable tutorial for %s', (language) => {
    const slides = GAME_META.tutorialSlides[language];

    expect(slides.length).toBeGreaterThan(0);
    slides.forEach((slide) => {
      expect(slide.title.trim().length).toBeGreaterThan(0);
      expect(slide.body.trim().length).toBeGreaterThan(0);
    });
  });

  it.each(['ja', 'en'] as const)('defines the shared exit actions for %s', (language) => {
    const exit = COMMON_COPY[language].exit;

    expect(exit.home).toBeTruthy();
    expect(exit.restart).toBeTruthy();
    expect(exit.resume).toBeTruthy();
  });

  it('defines a share URL placeholder that new games must replace', () => {
    expect(GAME_META.shareUrl).toMatch(/^https:\/\//);
  });
});
