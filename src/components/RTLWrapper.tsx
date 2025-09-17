/**
 * RTLWrapper Component
 * Provides RTL-aware styling wrapper for components
 */
import React from 'react';
import { useRTL } from '@/hooks/useRTL';

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
  margin?: {
    left?: string;
    right?: string;
  };
  padding?: {
    left?: string;
    right?: string;
  };
  textAlign?: 'left' | 'right' | 'center';
  flexDirection?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  position?: {
    side: 'left' | 'right';
    value: string;
  };
  borderRadius?: {
    side: 'l' | 'r' | 't' | 'b' | 'tl' | 'tr' | 'bl' | 'br';
    size: string;
  };
  space?: {
    direction: 'x' | 'y';
    size: string;
  };
  gap?: string;
}

export const RTLWrapper: React.FC<RTLWrapperProps> = ({
  children,
  className = '',
  margin,
  padding,
  textAlign,
  flexDirection,
  justifyContent,
  position,
  borderRadius,
  space,
  gap,
}) => {
  const {
    getMargin,
    getPadding,
    getTextAlign,
    getFlexDirection,
    getJustifyContent,
    getPosition,
    getBorderRadius,
    getSpace,
    getGap,
  } = useRTL();

  // Build classes based on props
  const classes = [];

  if (margin) {
    const marginClass = getMargin(
      margin.left ? `ml-${margin.left}` : '',
      margin.right ? `mr-${margin.right}` : ''
    );
    if (marginClass.trim()) classes.push(marginClass);
  }

  if (padding) {
    const paddingClass = getPadding(
      padding.left ? `pl-${padding.left}` : '',
      padding.right ? `pr-${padding.right}` : ''
    );
    if (paddingClass.trim()) classes.push(paddingClass);
  }

  if (textAlign) {
    classes.push(getTextAlign(textAlign));
  }

  if (flexDirection) {
    classes.push(getFlexDirection(flexDirection));
  }

  if (justifyContent) {
    classes.push(getJustifyContent(justifyContent));
  }

  if (position) {
    classes.push(getPosition(position.side, position.value));
  }

  if (borderRadius) {
    classes.push(getBorderRadius(borderRadius.side, borderRadius.size));
  }

  if (space) {
    classes.push(getSpace(space.direction, space.size));
  }

  if (gap) {
    classes.push(getGap(gap));
  }

  // Combine all classes
  const combinedClassName = [className, ...classes].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};

/**
 * RTL-aware margin component
 */
export const RTLMargin: React.FC<{
  children: React.ReactNode;
  left?: string;
  right?: string;
  className?: string;
}> = ({ children, left, right, className = '' }) => {
  const { getMargin } = useRTL();
  
  const marginClass = getMargin(
    left ? `ml-${left}` : '',
    right ? `mr-${right}` : ''
  );
  
  return (
    <div className={`${marginClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * RTL-aware padding component
 */
export const RTLPadding: React.FC<{
  children: React.ReactNode;
  left?: string;
  right?: string;
  className?: string;
}> = ({ children, left, right, className = '' }) => {
  const { getPadding } = useRTL();
  
  const paddingClass = getPadding(
    left ? `pl-${left}` : '',
    right ? `pr-${right}` : ''
  );
  
  return (
    <div className={`${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * RTL-aware text alignment component
 */
export const RTLText: React.FC<{
  children: React.ReactNode;
  align: 'left' | 'right' | 'center';
  className?: string;
}> = ({ children, align, className = '' }) => {
  const { getTextAlign } = useRTL();
  
  return (
    <div className={`${getTextAlign(align)} ${className}`}>
      {children}
    </div>
  );
};

/**
 * RTL-aware flex container component
 */
export const RTLFlex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  className?: string;
}> = ({ children, direction = 'row', justify, className = '' }) => {
  const { getFlexDirection, getJustifyContent } = useRTL();
  
  const classes = [
    'flex',
    getFlexDirection(direction),
    justify ? getJustifyContent(justify) : '',
    className,
  ].filter(Boolean);
  
  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
};
