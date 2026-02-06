import AdminLayout from '@/components/admin/AdminLayout';
import { SharedInbox } from '@/components/shared/inbox/SharedInbox';

export default function AdminInbox() {
    return (
        <AdminLayout>
            <SharedInbox mode="admin" />
        </AdminLayout>
    );
}
