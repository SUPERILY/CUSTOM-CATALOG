import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { StockStatusModel } from '../types';

interface StockStatusContextType {
    statuses: StockStatusModel[];
    getStatusColor: (value: string) => string;
    getStatusLabel: (value: string) => string;
    loading: boolean;
}

const StockStatusContext = createContext<StockStatusContextType | undefined>(undefined);

export const StockStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [statuses, setStatuses] = useState<StockStatusModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await fetch('/api/stock-status');
                if (response.ok) {
                    const data = await response.json();
                    setStatuses(data);
                }
            } catch (error) {
                console.error('Failed to fetch stock statuses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatuses();
    }, []);

    const getStatusColor = (value: string) => {
        const status = statuses.find(s => s.value === value);
        return status ? status.color : 'gray';
    };

    const getStatusLabel = (value: string) => {
        const status = statuses.find(s => s.value === value);
        return status ? status.label : value;
    };

    return (
        <StockStatusContext.Provider value={{ statuses, getStatusColor, getStatusLabel, loading }}>
            {children}
        </StockStatusContext.Provider>
    );
};

export const useStockStatus = () => {
    const context = useContext(StockStatusContext);
    if (context === undefined) {
        throw new Error('useStockStatus must be used within a StockStatusProvider');
    }
    return context;
};
