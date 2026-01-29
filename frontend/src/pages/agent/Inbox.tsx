import AgentLayout from '@/components/layouts/AgentLayout';
import SharedInbox from '@/components/shared/SharedInbox';

export default function AgentInbox() {
    return (
        <AgentLayout>
            <div className="p-6">
                <SharedInbox mode="agent" />
            </div>
        </AgentLayout>
    );
}
