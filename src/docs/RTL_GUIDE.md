# RTL (Right-to-Left) Support Guide

This guide explains how to implement proper RTL support in the Saham Admin Dashboard to ensure consistent margin and padding between LTR and RTL layouts.

## Overview

The RTL system provides:
- Automatic margin and padding reversal for RTL languages
- RTL-aware text alignment
- RTL-aware flexbox layouts
- RTL-aware positioning
- RTL-aware border radius
- Utility hooks and components for easy implementation

## Setup

### 1. Language Context

The `LanguageContext` automatically provides RTL support:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const { isRTL, language } = useLanguage();
```

### 2. CSS Classes

The system automatically applies RTL-aware classes when the `rtl` class is present:

```css
.rtl .ml-4 { margin-left: 0; margin-right: 1rem; }
.rtl .mr-4 { margin-right: 0; margin-left: 1rem; }
.rtl .pl-4 { padding-left: 0; padding-right: 1rem; }
.rtl .pr-4 { padding-right: 0; padding-left: 1rem; }
```

## Usage Methods

### Method 1: Using useRTL Hook

```typescript
import { useRTL } from '@/hooks/useRTL';

const MyComponent = () => {
  const { isRTL, getMargin, getPadding, getTextAlign } = useRTL();

  return (
    <div className={getMargin('ml-4', 'mr-2')}>
      <p className={getTextAlign('left')}>
        This text is RTL-aware
      </p>
      <div className={getPadding('pl-4', 'pr-2')}>
        Content with RTL-aware padding
      </div>
    </div>
  );
};
```

### Method 2: Using RTLWrapper Component

```typescript
import { RTLWrapper } from '@/components/RTLWrapper';

const MyComponent = () => {
  return (
    <RTLWrapper
      margin={{ left: '4', right: '2' }}
      padding={{ left: '4', right: '2' }}
      textAlign="left"
      flexDirection="row"
      justifyContent="between"
    >
      <p>RTL-aware content</p>
    </RTLWrapper>
  );
};
```

### Method 3: Using Individual RTL Components

```typescript
import { RTLMargin, RTLPadding, RTLText, RTLFlex } from '@/components/RTLWrapper';

const MyComponent = () => {
  return (
    <div>
      <RTLMargin left="4" right="2">
        <p>Content with RTL margins</p>
      </RTLMargin>
      
      <RTLPadding left="4" right="2">
        <p>Content with RTL padding</p>
      </RTLPadding>
      
      <RTLText align="left">
        <p>RTL-aware text alignment</p>
      </RTLText>
      
      <RTLFlex direction="row" justify="start">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </RTLFlex>
    </div>
  );
};
```

## Available Utilities

### useRTL Hook Methods

- `getMargin(left, right)` - RTL-aware margin classes
- `getPadding(left, right)` - RTL-aware padding classes
- `getTextAlign(align)` - RTL-aware text alignment
- `getFlexDirection(direction)` - RTL-aware flex direction
- `getJustifyContent(justify)` - RTL-aware justify content
- `getPosition(side, value)` - RTL-aware positioning
- `getBorderRadius(side, size)` - RTL-aware border radius
- `getSpace(direction, size)` - RTL-aware space between
- `getGap(size)` - RTL-aware gap

### RTLWrapper Props

- `margin` - Object with left/right margin values
- `padding` - Object with left/right padding values
- `textAlign` - Text alignment ('left' | 'right' | 'center')
- `flexDirection` - Flex direction
- `justifyContent` - Justify content
- `position` - Object with side and value
- `borderRadius` - Object with side and size
- `space` - Object with direction and size
- `gap` - Gap size

## Common Patterns

### 1. Card Layout with RTL Support

```typescript
const PropertyCard = () => {
  const { getMargin, getTextAlign } = useRTL();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className={getTextAlign('left')}>Property Title</h3>
          <Badge>Status</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={getMargin('ml-4', 'mr-2')}>
          <p>Property details</p>
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2. Form with RTL Support

```typescript
const MyForm = () => {
  const { isRTL, getTextAlign } = useRTL();

  return (
    <form>
      <div>
        <label className={getTextAlign('left')}>
          {isRTL ? 'الاسم' : 'Name'}
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
        />
      </div>
    </form>
  );
};
```

### 3. Navigation with RTL Support

```typescript
const Navigation = () => {
  const { getFlexDirection, getJustifyContent } = useRTL();

  return (
    <nav className={`flex ${getFlexDirection('row')} ${getJustifyContent('between')}`}>
      <div>Logo</div>
      <div>Menu Items</div>
    </nav>
  );
};
```

## Best Practices

### 1. Always Use RTL Utilities

❌ **Don't:**
```typescript
<div className="ml-4 mr-2 pl-4 pr-2">
  <p className="text-left">Content</p>
</div>
```

✅ **Do:**
```typescript
const { getMargin, getPadding, getTextAlign } = useRTL();

<div className={getMargin('ml-4', 'mr-2')}>
  <div className={getPadding('pl-4', 'pr-2')}>
    <p className={getTextAlign('left')}>Content</p>
  </div>
</div>
```

### 2. Use RTLWrapper for Complex Layouts

```typescript
<RTLWrapper
  margin={{ left: '4', right: '2' }}
  padding={{ left: '4', right: '2' }}
  textAlign="left"
  flexDirection="row"
  justifyContent="between"
>
  <div>Left content</div>
  <div>Right content</div>
</RTLWrapper>
```

### 3. Test Both Directions

Always test your components in both LTR and RTL modes to ensure proper spacing and alignment.

### 4. Use Semantic Spacing

Use consistent spacing values across your application:
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `3` = 0.75rem (12px)
- `4` = 1rem (16px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)

## Migration Guide

### Converting Existing Components

1. **Identify hardcoded spacing:**
   ```typescript
   // Before
   <div className="ml-4 mr-2 pl-4 pr-2">
   ```

2. **Replace with RTL utilities:**
   ```typescript
   // After
   const { getMargin, getPadding } = useRTL();
   <div className={getMargin('ml-4', 'mr-2')}>
     <div className={getPadding('pl-4', 'pr-2')}>
   ```

3. **Update text alignment:**
   ```typescript
   // Before
   <p className="text-left">
   
   // After
   const { getTextAlign } = useRTL();
   <p className={getTextAlign('left')}>
   ```

## Troubleshooting

### Common Issues

1. **Spacing not reversing:**
   - Ensure the `rtl` class is applied to the root element
   - Check that you're using the RTL utilities instead of hardcoded classes

2. **Text alignment issues:**
   - Use `getTextAlign()` instead of hardcoded `text-left` or `text-right`

3. **Flexbox layout problems:**
   - Use `getFlexDirection()` and `getJustifyContent()` for RTL-aware flex layouts

### Debug Mode

Add this to your component to debug RTL issues:

```typescript
const { isRTL } = useRTL();

console.log('RTL Mode:', isRTL);
console.log('Current language:', language);
```

## Examples

See `src/components/examples/RTLExample.tsx` for comprehensive examples of RTL usage patterns.
