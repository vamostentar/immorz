import AdminLayout from '@/components/admin/AdminLayout';
import PropertiesManager from '@/components/shared/PropertiesManager';

export default function PropertiesManagement() {
  return (
    <AdminLayout>
      <PropertiesManager mode="admin" />
    </AdminLayout>
  );
}
