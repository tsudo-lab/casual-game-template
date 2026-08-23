import { useWindowDimensions } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ResponsiveLayoutInput {
  width: number;
  height: number;
  insets: EdgeInsets;
}

export interface ResponsiveLayout {
  isTablet: boolean;
  isCompact: boolean;
  shellWidth: number;
  shellPadding: number;
  contentMaxWidth: number;
  modalMaxWidth: number;
  illustrationScale: number;
}

/**
 * Shared responsive decisions for the common screens.
 *
 * Base these on the actual window and safe area, never on a device name. An
 * iPad in Split View intentionally falls back to the phone layout when its
 * usable width becomes narrow.
 */
export function getResponsiveLayout({ width, height, insets }: ResponsiveLayoutInput): ResponsiveLayout {
  const usableWidth = Math.max(0, width - insets.left - insets.right);
  const usableHeight = Math.max(0, height - insets.top - insets.bottom);
  const isTablet = usableWidth >= 600;
  const isCompact = usableHeight < 700 || usableWidth < 390;

  return {
    isTablet,
    isCompact,
    shellWidth: Math.min(usableWidth, isTablet ? 820 : 430),
    shellPadding: isTablet ? 24 : 12,
    contentMaxWidth: isTablet ? 480 : 360,
    modalMaxWidth: isTablet ? 460 : 340,
    illustrationScale: isTablet ? 1.15 : isCompact ? 0.86 : 1,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return getResponsiveLayout({ width, height, insets });
}
