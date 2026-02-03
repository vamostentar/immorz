import {
    useRoles,
    useUsers
} from '@/api/admin-queries';
import { useUpdateUserProfileById, useUserProfile } from '@/api/user-service';
import AdminLayout from '@/components/admin/AdminLayout';
import UsersTable from '@/components/admin/users/UsersTable';
import Modal from '@/components/Modal';
import { Toast } from '@/components/Toast';
import { User } from '@/types/user-management.types';
import { Loader2, RefreshCw } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export default function AgentsManagementPage() {
    const { data: roles, isLoading: isLoadingRoles } = useRoles();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Find agent role ID
    const agentRoleId = useMemo(() => {
        if (!roles) return undefined;
        // Try to find by name 'agent' or similar
        const agentRole = roles.find((r: any) => r.name === 'agent' || r.displayName === 'Agente');
        return agentRole?.id;
    }, [roles]);

    // Fetch users with agent role
    const { data: usersData, isLoading: isLoadingUsers, refetch } = useUsers({
        // Only pass roleId if we found it, otherwise we might fetch all if undefined (depending on API)
        // If agentRoleId is undefined but roles loaded, it means no agent role?
        // Let's pass a dummy check or wait.
        ...(agentRoleId ? { roleId: agentRoleId } : {})
    });

    // const users = usersData?.data || [];
    
    // Filter client-side if API didn't filter (fallback) or if waiting for role
    const filteredUsers = useMemo(() => {
        const currentUsers = usersData?.data || [];
        if (!currentUsers) return [];
        if (agentRoleId && usersData?.data) {
           // If API respected roleId, great. Checking just in case.
           return currentUsers; 
        }
        // Fallback filter
        return currentUsers.filter((u: User) => {
             const r = u.role;
             return (typeof r === 'string' && r === 'agent') || (typeof r === 'object' && r.name === 'agent');
        });
    }, [usersData, agentRoleId]);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleSelectUser = (id: string) => {
         setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUsers(e.target.checked ? filteredUsers.map(u => u.id) : []);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gestão de Agentes
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie os perfis e informações dos agentes imobiliários
                        </p>
                    </div>
                     <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border
                         bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text
                         hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                        onClick={() => refetch()}
                        title="Atualizar lista"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                {isLoadingRoles || isLoadingUsers ? (
                    <div className="flex justify-center py-12">
                         <Loader2 className="animate-spin text-primary-600" size={32} />
                    </div>
                ) : (
                    <UsersTable
                        users={filteredUsers}
                        selectedUsers={selectedUsers}
                        isLoading={isLoadingUsers}
                        onEdit={handleEdit}
                        onDelete={(id) => console.log('Delete not implemented yet', id)} 
                        onViewDetails={handleEdit}
                        onSelectUser={handleSelectUser}
                        onSelectAll={handleSelectAll}
                    />
                )}

                <Modal
                    open={isEditModalOpen}
                    title={`Editar Agente: ${editingUser?.firstName || ''}`}
                    onClose={handleCloseModal}
                >
                    {editingUser && <AgentEditForm user={editingUser} onClose={handleCloseModal} />}
                </Modal>

                 <Toast
                    text={toast || ''}
                    show={!!toast}
                    onClose={() => setToast(null)}
                />
            </div>
        </AdminLayout>
    );
}

// Inner component for Agent specific editing
function AgentEditForm({ user, onClose }: { user: User, onClose: () => void }) {
    // Fetch extended profile
    const { data: userProfile, isLoading } = useUserProfile(user.id);
    const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateUserProfileById();
    
    const [formData, setFormData] = useState({
        bio: '',
        specialties: '',
        experience: 0,
        linkedin: '',
        facebook: '',
        instagram: '',
        isProfilePublic: false,
        isProfileApproved: false
    });

    // Load data when profile loads
    React.useEffect(() => {
        if (userProfile) {
            const profile = userProfile as any;
            const profileData = profile.profile || profile;
            setFormData({
                bio: profileData.bio || '',
                specialties: Array.isArray(profileData.specialties) ? profileData.specialties.join(', ') : '',
                experience: profileData.experience || 0,
                linkedin: profileData.linkedin || '',
                facebook: profileData.facebook || '',
                instagram: profileData.instagram || '',
                isProfilePublic: !!profileData.isProfilePublic,
                isProfileApproved: !!profileData.isProfileApproved
            });
        }
    }, [userProfile]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({
                userId: user.id,
                data: {
                    bio: formData.bio,
                    specialties: formData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean),
                    experience: formData.experience,
                    linkedin: formData.linkedin,
                    facebook: formData.facebook,
                    instagram: formData.instagram,
                    isProfilePublic: formData.isProfilePublic,
                    isProfileApproved: formData.isProfileApproved
                } as any
            });
            onClose();
        } catch (error) {
            console.error('Failed to update agent profile', error);
            alert('Erro ao atualizar perfil.');
        }
    };

    if (isLoading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                    className="mt-1 w-full p-2 border rounded-md dark:bg-dark-card dark:border-dark-border"
                    rows={4}
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Especialidades (separadas por vírgula)</label>
                <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded-md dark:bg-dark-card dark:border-dark-border"
                    value={formData.specialties}
                    onChange={e => setFormData({...formData, specialties: e.target.value})}
                    placeholder="Ex: Venda, Arrendamento, Luxo"
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Anos de Experiência</label>
                <input
                    type="number"
                    min="0"
                    className="mt-1 w-full p-2 border rounded-md dark:bg-dark-card dark:border-dark-border"
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
                    <input
                        type="url"
                        className="mt-1 w-full p-2 border rounded-md dark:bg-dark-card dark:border-dark-border"
                        value={formData.linkedin}
                        onChange={e => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="URL do LinkedIn"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</label>
                    <input
                        type="url"
                        className="mt-1 w-full p-2 border rounded-md dark:bg-dark-card dark:border-dark-border"
                        value={formData.facebook}
                        onChange={e => setFormData({...formData, facebook: e.target.value})}
                        placeholder="URL do Facebook"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</label>
                    <input
                        type="url"
                        className="mt-1 w-full p-2 border rounded-md dark:bg-dark-card dark:border-dark-border"
                        value={formData.instagram}
                        onChange={e => setFormData({...formData, instagram: e.target.value})}
                        placeholder="URL do Instagram"
                    />
                </div>
             </div>

             <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isProfilePublic}
                        onChange={e => setFormData({...formData, isProfilePublic: e.target.checked})}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Perfil Público</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isProfileApproved}
                        onChange={e => setFormData({...formData, isProfileApproved: e.target.checked})}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Perfil Aprovado</span>
                </label>
             </div>

             <div className="flex justify-end pt-4 gap-2">
                 <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
                    disabled={isSaving}
                 >
                    Cancelar
                 </button>
                 <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50"
                    disabled={isSaving}
                 >
                    {isSaving ? 'A guardar...' : 'Guardar'}
                 </button>
             </div>
        </form>
    );
}
