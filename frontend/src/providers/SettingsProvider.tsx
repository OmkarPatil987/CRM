import { createContext, useState, ReactNode, useContext, useMemo } from 'react';

export type SettingsContextValue = {
    isDashboardDrawerOpened: boolean;
    setIsDashboardDrawerOpened: () => void;
};

export const SettingsContext = createContext<SettingsContextValue>({
    isDashboardDrawerOpened: true,
    setIsDashboardDrawerOpened: () => null,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [isDashboardDrawerOpened, setIsDashboardDrawerOpened] = useState<boolean>(window.innerWidth >= 1200);

    const toggleDashboardDrawer = () => setIsDashboardDrawerOpened(prev => !prev);

    const value = useMemo(
        () => ({
            isDashboardDrawerOpened,
            setIsDashboardDrawerOpened: toggleDashboardDrawer,
        }),
        [isDashboardDrawerOpened]
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const SettingsConsumer = SettingsContext.Consumer;

export const useSettings = (): SettingsContextValue => useContext(SettingsContext);
