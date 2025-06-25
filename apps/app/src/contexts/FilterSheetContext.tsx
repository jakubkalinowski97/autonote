import React, { createContext, useContext, useState } from 'react';

const FilterSheetContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => { return; },
});

export const useFilterSheet = () => {
  const { open, setOpen } = useContext(FilterSheetContext);
  return [open, setOpen] as const;
};

export const FilterSheetProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <FilterSheetContext.Provider value={{ open, setOpen }}>
      {children}
    </FilterSheetContext.Provider>
  );
}; 