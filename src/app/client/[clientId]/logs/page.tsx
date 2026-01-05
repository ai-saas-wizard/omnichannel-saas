import { listCalls, listAgents, listPhoneNumbers } from "@/lib/vapi";
import { LogsPageClient } from "@/components/logs/logs-page-client";
import { supabase } from "@/lib/supabase";

export default async function LogsPage({
    params,
    searchParams,
}: {
    params: Promise<{ clientId: string }>;
    searchParams: Promise<{ assistantId?: string }>;
}) {
    const { clientId } = await params;
    const { assistantId } = await searchParams;

    let vapiKey: string | undefined = undefined;

    if (clientId) {
        const { data } = await supabase.from('clients').select('vapi_key').eq('id', clientId).single();
        if (data) {
            vapiKey = data.vapi_key;
        }
    }

    // Fetch calls, agents, and phone numbers
    const [calls, agents, phoneNumbers] = await Promise.all([
        listCalls(vapiKey, assistantId),
        listAgents(vapiKey),
        listPhoneNumbers(vapiKey)
    ]);

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden">
            <LogsPageClient
                calls={calls}
                agents={agents}
                phoneNumbers={phoneNumbers}
                clientId={clientId}
            />
        </div>
    );
}

