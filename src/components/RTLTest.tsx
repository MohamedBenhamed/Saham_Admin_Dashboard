/**
 * RTL Test Component
 * Simple component to test RTL functionality
 */
import React from 'react';
import { useRTL } from '@/hooks/useRTL';
import { RTLWrapper } from '@/components/RTLWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RTLTest: React.FC = () => {
  const { isRTL, getMargin, getPadding, getTextAlign } = useRTL();

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>RTL Test Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">
              Current mode: <span className="font-bold">{isRTL ? 'RTL (Arabic)' : 'LTR (English)'}</span>
            </p>
            
            {/* Test 1: Basic margin and padding */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Test 1: Basic Spacing</h3>
              <div className={getMargin('ml-4', 'mr-2')}>
                <div className={getPadding('pl-4', 'pr-2')}>
                  <p className={getTextAlign('left')}>
                    This content has RTL-aware margin and padding
                  </p>
                </div>
              </div>
            </div>

            {/* Test 2: RTLWrapper */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Test 2: RTLWrapper</h3>
              <RTLWrapper
                margin={{ left: '4', right: '2' }}
                padding={{ left: '4', right: '2' }}
                textAlign="left"
                className="bg-gray-100 p-4 rounded"
              >
                <p>This content uses RTLWrapper component</p>
                <Button className="mt-2">RTL-aware Button</Button>
              </RTLWrapper>
            </div>

            {/* Test 3: Flex layout */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Test 3: Flex Layout</h3>
              <RTLWrapper
                flexDirection="row"
                justifyContent="between"
                className="items-center p-4 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <span>Left Item</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm">Edit</Button>
                  <Button size="sm" variant="outline">Delete</Button>
                </div>
              </RTLWrapper>
            </div>

            {/* Test 4: Text alignment comparison */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Test 4: Text Alignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">LTR Mode:</p>
                  <p className="text-left border p-2 rounded">Left aligned text</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">RTL Mode:</p>
                  <p className={getTextAlign('left') + ' border p-2 rounded'}>
                    Left aligned text (RTL-aware)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
