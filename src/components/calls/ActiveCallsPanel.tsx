'use client';

import React, { useEffect, useState } from 'react';
import { useActiveCalls, ActiveCall } from '@/contexts/ActiveCallsContext';
import { Phone, PhoneIncoming, PhoneForwarded, Clock, User, MessageSquare, RefreshCw } from 'lucide-react';

function formatDuration(startedAt: string): string {
    const start = new Date(startedAt);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'ringing': return 'bg-yellow-500';
        case 'in-progress': return 'bg-green-500';
        case 'forwarding': return 'bg-blue-500';
        case 'ended': return 'bg-gray-500';
        default: return 'bg-gray-400';
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'ringing': return <PhoneIncoming className="w-4 h-4" />;
        case 'forwarding': return <PhoneForwarded className="w-4 h-4" />;
        default: return <Phone className="w-4 h-4" />;
    }
}

function CallCard({ call }: { call: ActiveCall }) {
    const [duration, setDuration] = useState(formatDuration(call.started_at));

    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(formatDuration(call.started_at));
        }, 1000);
        return () => clearInterval(interval);
    }, [call.started_at]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(call.status)} animate-pulse`} />
                    <span className="text-sm font-medium capitalize">{call.status.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-1 text-white/60 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono">{duration}</span>
                </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-center gap-2 text-white/80">
                <User className="w-4 h-4 text-white/40" />
                <span className="font-medium">{call.customer_number || 'Unknown'}</span>
                <span className="text-xs text-white/40 ml-auto">
                    {call.type === 'inboundPhoneCall' ? 'Inbound' : 'Outbound'}
                </span>
            </div>

            {/* Live Transcript */}
            {call.transcript && (
                <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>Live Transcript</span>
                    </div>
                    <div className="text-sm text-white/70 max-h-24 overflow-y-auto bg-black/20 rounded-lg p-2">
                        {call.transcript.split('\n').slice(-5).map((line, i) => (
                            <p key={i} className="text-xs leading-relaxed">
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function ActiveCallsPanel() {
    const { activeCalls, isLoading, error, refreshCalls } = useActiveCalls();

    if (isLoading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-semibold">Active Calls</h2>
                </div>
                <div className="text-white/40 text-center py-8">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-red-400" />
                    <h2 className="text-lg font-semibold">Active Calls</h2>
                </div>
                <div className="text-red-400 text-center py-8">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-semibold">Active Calls</h2>
                    {activeCalls.length > 0 && (
                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            {activeCalls.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={refreshCalls}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4 text-white/40" />
                </button>
            </div>

            {/* Calls List */}
            {activeCalls.length === 0 ? (
                <div className="text-white/40 text-center py-8">
                    <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No active calls</p>
                    <p className="text-xs mt-1">Calls will appear here in real-time</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeCalls.map(call => (
                        <CallCard key={call.id} call={call} />
                    ))}
                </div>
            )}
        </div>
    );
}
