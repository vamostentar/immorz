import AgentLayout from '@/components/layouts/AgentLayout';
import PropertiesManager from '@/components/shared/PropertiesManager';

export default function AgentProperties() {
    return (
        <AgentLayout>
            <PropertiesManager mode="agent" />
        </AgentLayout>
    );
}
