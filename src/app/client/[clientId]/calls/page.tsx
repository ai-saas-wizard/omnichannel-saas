import ActiveCallsPageClient from './ActiveCallsPageClient';

export default async function ActiveCallsPage({
    params,
}: {
    params: Promise<{ clientId: string }>;
}) {
    const { clientId } = await params;

    return <ActiveCallsPageClient clientId={clientId} />;
}
