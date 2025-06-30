import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Sheet } from 'tamagui';

// Generic sheet state
type SheetState = {
  open: boolean;
  content?: ReactNode;
};

// Context type
type SheetContextType = {
  sheet: SheetState;
  data: any;
  setData: (data: any) => void;
  openSheet: (content: ReactNode) => void;
  closeSheet: () => void;
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetState>({ open: false });
  const [data, setData] = useState<any>(null);

  const openSheet = (content: ReactNode) => setSheet({ open: true, content });
  const closeSheet = () => setSheet({ open: false, content: undefined });

  return (
    <SheetContext.Provider value={{ sheet, data, setData, openSheet, closeSheet }}>
      {children}
      <Sheet
        open={sheet.open}
        onOpenChange={(open: boolean) => {
          if (!open) closeSheet();
        }}
        snapPoints={[80]}
        dismissOnSnapToBottom
        modal={false}
      >
        <Sheet.Handle backgroundColor="#fff" borderWidth={1} borderColor="$color6" />
        <Sheet.Frame padding="$4" backgroundColor="#fff" borderWidth={1} borderColor="$color6" borderTopLeftRadius="$4" borderTopRightRadius="$4">
          {sheet.content}
        </Sheet.Frame>
      </Sheet>
    </SheetContext.Provider>
  );
} 