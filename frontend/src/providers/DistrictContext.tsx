// DistrictContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export interface District {
    id: string;
    name: string;
    d: string;
    color: string;
}

export type DistrictContextType = {
  selectedDistrict: District | null;
  setSelectedDistrict: (district: District | null) => void;
};


const DistrictContext = createContext<DistrictContextType | undefined>(undefined);

export const DistrictProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  return (
    <DistrictContext.Provider value={{ selectedDistrict, setSelectedDistrict }}>
      {children}
    </DistrictContext.Provider>
  );
};

export const useDistrict = (): DistrictContextType => {
  const context = useContext(DistrictContext);
  if (!context) {
    throw new Error("useDistrict must be used within a DistrictProvider");
  }
  return context;
};