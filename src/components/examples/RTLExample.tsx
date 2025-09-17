/**
 * RTL Example Component
 * Demonstrates how to use RTL utilities in components
 */
import React from 'react';
import { useRTL } from '@/hooks/useRTL';
import { RTLWrapper, RTLMargin, RTLPadding, RTLText, RTLFlex } from '@/components/RTLWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RTLExample: React.FC = () => {
  const { isRTL, getMargin, getPadding, getTextAlign } = useRTL();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        RTL Example Component
      </h1>
      
      {/* Example 1: Using useRTL hook directly */}
      <Card>
        <CardHeader>
          <CardTitle>Using useRTL Hook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={getMargin('ml-4', 'mr-2')}>
            <p className={getTextAlign('left')}>
              This text is aligned {isRTL ? 'right' : 'left'} in RTL mode
            </p>
            <div className={getPadding('pl-4', 'pr-2')}>
              <p>This div has RTL-aware padding</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example 2: Using RTLWrapper component */}
      <Card>
        <CardHeader>
          <CardTitle>Using RTLWrapper Component</CardTitle>
        </CardHeader>
        <CardContent>
          <RTLWrapper
            margin={{ left: '4', right: '2' }}
            padding={{ left: '4', right: '2' }}
            textAlign="left"
            className="bg-gray-100 p-4 rounded"
          >
            <p>This content is wrapped with RTL-aware styling</p>
            <Button className="mt-2">RTL-aware Button</Button>
          </RTLWrapper>
        </CardContent>
      </Card>

      {/* Example 3: Using individual RTL components */}
      <Card>
        <CardHeader>
          <CardTitle>Using Individual RTL Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RTLMargin left="4" right="2">
            <p>This has RTL-aware margins</p>
          </RTLMargin>
          
          <RTLPadding left="4" right="2">
            <p>This has RTL-aware padding</p>
          </RTLPadding>
          
          <RTLText align="left">
            <p>This text is RTL-aware aligned</p>
          </RTLText>
          
          <RTLFlex direction="row" justify="start" className="gap-2">
            <Button size="sm">Button 1</Button>
            <Button size="sm">Button 2</Button>
            <Button size="sm">Button 3</Button>
          </RTLFlex>
        </CardContent>
      </Card>

      {/* Example 4: Complex layout with RTL support */}
      <Card>
        <CardHeader>
          <CardTitle>Complex RTL Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <RTLWrapper
            flexDirection="row"
            justifyContent="between"
            className="items-center p-4 border rounded"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span>Profile</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm">Edit</Button>
              <Button size="sm" variant="outline">Delete</Button>
            </div>
          </RTLWrapper>
        </CardContent>
      </Card>

      {/* Example 5: Form with RTL support */}
      <Card>
        <CardHeader>
          <CardTitle>RTL Form Example</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {isRTL ? 'الاسم' : 'Name'}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              />
            </div>
            
            <RTLFlex direction="row" justify="end" className="gap-2">
              <Button type="button" variant="outline">
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit">
                {isRTL ? 'حفظ' : 'Save'}
              </Button>
            </RTLFlex>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
