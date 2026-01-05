'use client';

import { ActiveCallsProvider } from '@/contexts/ActiveCallsContext';
import { ActiveCallsPanel } from '@/components/calls/ActiveCallsPanel';

export default function ActiveCallsPageClient({ clientId }: { clientId: string }) {
    return (
        <ActiveCallsProvider clientId={clientId}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Live Calls</h1>
                        <p className="text-white/60">
                            Monitor active calls in real-time. Updates automatically as calls start, progress, and end.
                        </p>
                    </div>

                    {/* Active Calls Panel */}
                    <ActiveCallsPanel />
                </div>
            </div>
        </ActiveCallsProvider>
    );
}
