import React, {createContext, ReactNode, useState} from "react";

export interface CachedResponse {
    body: any;
    status: number;
    headers: Record<string, string>;
    ok: boolean;
    statusText: string;
    text: string;
}

interface ScheduleResponseCacheContextType {
    getCachedResponse: () => CachedResponse | undefined;
    setCachedResponse: (response: CachedResponse) => void;
}

export const ScheduleResponseCacheContext = createContext<ScheduleResponseCacheContextType | undefined>(undefined);

export const ScheduleResponseCacheContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [cachedResponse, setCachedResponse] = useState<CachedResponse | undefined>(undefined);

    return (
        <ScheduleResponseCacheContext.Provider value={{
            getCachedResponse: () => cachedResponse,
            setCachedResponse: (response: CachedResponse) => setCachedResponse(response)
        }}>
            {children}
        </ScheduleResponseCacheContext.Provider>
    );
}

export const useScheduleResponseCache = () => {
    const context = React.useContext(ScheduleResponseCacheContext);
    if (!context) {
        throw new Error('useScheduleResponseCache must be used within a ScheduleResponseCacheContextProvider');
    }
    return context;
}
