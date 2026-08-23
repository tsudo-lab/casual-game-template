import { describe, expect, it } from '@jest/globals';

import { getResponsiveLayout } from '../layout';

const noInsets = { top: 0, right: 0, bottom: 0, left: 0 };

describe('responsive layout', () => {
  it('uses a compact phone layout for an iPhone SE-sized window', () => {
    const result = getResponsiveLayout({ width: 375, height: 667, insets: noInsets });

    expect(result.isTablet).toBe(false);
    expect(result.isCompact).toBe(true);
    expect(result.shellWidth).toBe(375);
  });

  it('centers a bounded tablet layout for an iPad-sized window', () => {
    const result = getResponsiveLayout({ width: 834, height: 1194, insets: noInsets });

    expect(result.isTablet).toBe(true);
    expect(result.shellWidth).toBe(820);
    expect(result.contentMaxWidth).toBe(480);
  });

  it('uses the phone layout in a narrow iPad Split View window', () => {
    const result = getResponsiveLayout({ width: 417, height: 1194, insets: noInsets });

    expect(result.isTablet).toBe(false);
    expect(result.shellWidth).toBe(417);
  });
});
