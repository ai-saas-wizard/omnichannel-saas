'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key for realtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface ActiveCall {
    id: string;
    client_id: string;
    vapi_call_id: string;
    assistant_id: string | null;
    customer_number: string | null;
    status: string;
    started_at: string;
    last_active_at: string;
    transcript: string | null;
    summary: string | null;
    cost: number;
    type: string;
}

interface ActiveCallsContextType {
    activeCalls: ActiveCall[];
    isLoading: boolean;
    error: string | null;
    refreshCalls: () => Promise<void>;
}

const ActiveCallsContext = createContext<ActiveCallsContextType | undefined>(undefined);

export function ActiveCallsProvider({
    children,
    clientId
}: {
    children: React.ReactNode;
    clientId: string;
}) {
    const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActiveCalls = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabaseClient
                .from('active_calls')
                .select('*')
                .eq('client_id', clientId)
                .order('started_at', { ascending: false });

            if (fetchError) throw fetchError;
            setActiveCalls(data || []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching active calls:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        // Initial fetch
        fetchActiveCalls();

        // Subscribe to realtime changes
        const channel: RealtimeChannel = supabaseClient
            .channel(`active_calls:${clientId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'active_calls',
                    filter: `client_id=eq.${clientId}`
                },
                (payload) => {
                    console.log('Realtime update:', payload);

                    if (payload.eventType === 'INSERT') {
                        setActiveCalls(prev => [payload.new as ActiveCall, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setActiveCalls(prev =>
                            prev.map(call =>
                                call.id === (payload.new as ActiveCall).id
                                    ? payload.new as ActiveCall
                                    : call
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setActiveCalls(prev =>
                            prev.filter(call => call.id !== (payload.old as ActiveCall).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [clientId, fetchActiveCalls]);

    return (
        <ActiveCallsContext.Provider value={{
            activeCalls,
            isLoading,
            error,
            refreshCalls: fetchActiveCalls
        }}>
            {children}
        </ActiveCallsContext.Provider>
    );
}

export function useActiveCalls() {
    const context = useContext(ActiveCallsContext);
    if (context === undefined) {
        throw new Error('useActiveCalls must be used within an ActiveCallsProvider');
    }
    return context;
}
