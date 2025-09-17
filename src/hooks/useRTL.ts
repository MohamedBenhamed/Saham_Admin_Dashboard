/**
 * useRTL Hook
 * Provides RTL-aware spacing and layout utilities
 */
import { useLanguage } from '@/contexts/LanguageContext';

export const useRTL = () => {
  const { isRTL } = useLanguage();

  /**
   * Get RTL-aware margin classes
   * @param left - Left margin class (e.g., 'ml-4')
   * @param right - Right margin class (e.g., 'mr-4')
   * @returns Combined margin classes
   */
  const getMargin = (left: string, right: string) => {
    if (isRTL) {
      return `${right} ${left}`;
    }
    return `${left} ${right}`;
  };

  /**
   * Get RTL-aware padding classes
   * @param left - Left padding class (e.g., 'pl-4')
   * @param right - Right padding class (e.g., 'pr-4')
   * @returns Combined padding classes
   */
  const getPadding = (left: string, right: string) => {
    if (isRTL) {
      return `${right} ${left}`;
    }
    return `${left} ${right}`;
  };

  /**
   * Get RTL-aware text alignment
   * @param align - Text alignment ('left' | 'right' | 'center')
   * @returns RTL-aware text alignment class
   */
  const getTextAlign = (align: 'left' | 'right' | 'center') => {
    if (align === 'center') return 'text-center';
    
    if (isRTL) {
      return align === 'left' ? 'text-right' : 'text-left';
    }
    
    return align === 'left' ? 'text-left' : 'text-right';
  };

  /**
   * Get RTL-aware flex direction
   * @param direction - Flex direction ('row' | 'row-reverse' | 'col' | 'col-reverse')
   * @returns RTL-aware flex direction class
   */
  const getFlexDirection = (direction: 'row' | 'row-reverse' | 'col' | 'col-reverse') => {
    if (direction === 'col' || direction === 'col-reverse') {
      return `flex-${direction}`;
    }
    
    if (isRTL) {
      return direction === 'row' ? 'flex-row-reverse' : 'flex-row';
    }
    
    return `flex-${direction}`;
  };

  /**
   * Get RTL-aware justify content
   * @param justify - Justify content ('start' | 'end' | 'center' | 'between' | 'around' | 'evenly')
   * @returns RTL-aware justify content class
   */
  const getJustifyContent = (justify: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly') => {
    if (justify === 'center' || justify === 'between' || justify === 'around' || justify === 'evenly') {
      return `justify-${justify}`;
    }
    
    if (isRTL) {
      return justify === 'start' ? 'justify-end' : 'justify-start';
    }
    
    return `justify-${justify}`;
  };

  /**
   * Get RTL-aware positioning
   * @param position - Position ('left' | 'right')
   * @param value - Position value (e.g., '0', '4', 'auto')
   * @returns RTL-aware positioning class
   */
  const getPosition = (position: 'left' | 'right', value: string) => {
    if (isRTL) {
      const oppositePosition = position === 'left' ? 'right' : 'left';
      return `${oppositePosition}-${value}`;
    }
    
    return `${position}-${value}`;
  };

  /**
   * Get RTL-aware border radius
   * @param side - Border radius side ('l' | 'r' | 't' | 'b' | 'tl' | 'tr' | 'bl' | 'br')
   * @param size - Border radius size ('sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full')
   * @returns RTL-aware border radius class
   */
  const getBorderRadius = (side: 'l' | 'r' | 't' | 'b' | 'tl' | 'tr' | 'bl' | 'br', size: string) => {
    if (side === 't' || side === 'b' || side === 'tl' || side === 'tr' || side === 'bl' || side === 'br') {
      return `rounded-${side}-${size}`;
    }
    
    if (isRTL) {
      const oppositeSide = side === 'l' ? 'r' : 'l';
      return `rounded-${oppositeSide}-${size}`;
    }
    
    return `rounded-${side}-${size}`;
  };

  /**
   * Get RTL-aware space between classes
   * @param direction - Space direction ('x' | 'y')
   * @param size - Space size ('1' | '2' | '3' | '4' | '6' | '8')
   * @returns RTL-aware space class
   */
  const getSpace = (direction: 'x' | 'y', size: string) => {
    if (direction === 'y') {
      return `space-y-${size}`;
    }
    
    // For horizontal spacing, RTL is handled by CSS
    return `space-x-${size}`;
  };

  /**
   * Get RTL-aware gap class
   * @param size - Gap size ('1' | '2' | '3' | '4' | '6' | '8')
   * @returns Gap class (gap is direction-agnostic)
   */
  const getGap = (size: string) => {
    return `gap-${size}`;
  };

  return {
    isRTL,
    getMargin,
    getPadding,
    getTextAlign,
    getFlexDirection,
    getJustifyContent,
    getPosition,
    getBorderRadius,
    getSpace,
    getGap,
  };
};
