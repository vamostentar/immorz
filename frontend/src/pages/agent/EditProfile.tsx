import { Camera, Eye, EyeOff, Loader, Shield } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMyProfile } from '../../api/agent-queries';
import { uploadMediaImage } from '../../api/queries';
import AgentLayout from '../../components/layouts/AgentLayout';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';

const SPECIALTIES_OPTIONS = [
    'Apartamentos',
    'Moradias',
    'Terrenos',
    'Comercial',
    'Arrendamento',
    'Investimento',
    'Luxo',
    'Reabilitação'
];

export default function EditAgentProfile() {
    const { user, enable2FA, disable2FA } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        avatar: (user as any)?.avatar || '',
        bio: (user as any)?.bio || '',
        specialties: (user as any)?.specialties || [],
        experience: (user as any)?.experience || 0,
        linkedin: (user as any)?.linkedin || '',
        facebook: (user as any)?.facebook || '',
        instagram: (user as any)?.instagram || '',
        isProfilePublic: (user as any)?.isProfilePublic || false
    });

    // 2FA State
    const [disablePassword, setDisablePassword] = useState('');
    const [showDisableForm, setShowDisableForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(formData.avatar);
    
    // Dialog States
    const [showEnableConfirm, setShowEnableConfirm] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [isProcessing2FA, setIsProcessing2FA] = useState(false);

    const handleStart2FASetup = () => {
        setShowEnableConfirm(true);
    };

    const confirmEnable2FA = async () => {
        try {
            setIsProcessing2FA(true);
            await enable2FA();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            setShowEnableConfirm(false);
        } catch (error) {
            setError('Erro ao ativar 2FA');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const handleConfirmDisable2FA = () => {
        if (!disablePassword) {
            setError('A palavra-passe é obrigatória para desativar 2FA');
            return;
        }
        setShowDisableConfirm(true);
    };

    const confirmDisable2FA = async () => {
        try {
            setError(null);
            setIsProcessing2FA(true);
            await disable2FA(disablePassword);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            setShowDisableForm(false);
            setDisablePassword('');
            setShowDisableConfirm(false);
        } catch (err: any) {
            console.error('[2FA] Error confirming disable:', err);
            setError(err.message || 'Falha ao desativar 2FA');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecione uma imagem válida');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('A imagem não pode exceder 5MB');
            return;
        }

        try {
            setIsUploadingAvatar(true);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to media service
            const result = await uploadMediaImage(file, {
                onProgress: (progress) => {
                    console.log(`Avatar upload progress: ${progress}%`);
                }
            });

            // Update form data with uploaded URL
            if (result && typeof result === 'string') {
                setFormData(prev => ({ ...prev, avatar: result }));
            } else if (result && typeof result === 'object' && 'url' in result) {
                setFormData(prev => ({ ...prev, avatar: (result as any).url }));
            }
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setError('Erro ao fazer upload da foto. Tente novamente.');
            setAvatarPreview(formData.avatar); // Revert to previous avatar
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSpecialtyToggle = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter((s: string) => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await updateMyProfile(formData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Erro ao atualizar perfil:', err);
            setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AgentLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Editar Perfil Profissional</h2>
                    <p className="text-gray-600">
                        Configure o seu perfil público para que os clientes possam conhecê-lo melhor
                    </p>
                </div>

                {/* Success Message */}
                {saveSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Perfil atualizado com sucesso!</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Foto de Perfil
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Camera className="w-12 h-12" />
                                        </div>
                                    )}
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <Loader className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    disabled={isUploadingAvatar}
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-1">
                                    Tamanho recomendado: 500x500px
                                </p>
                                <p className="text-sm text-gray-500">
                                    Formatos aceites: JPG, PNG (máx. 5MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nome"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apelido
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Apelido"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone Profissional
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+351 912 345 678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Anos de Experiência
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Biografia Profissional
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={6}
                            maxLength={1000}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Descreva a sua experiência, especialidades, conquistas e o que o torna único no mercado imobiliário..."
                        />
                        <div className="mt-2 text-sm text-gray-500 text-right">
                            {formData.bio.length}/1000 caracteres
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Especialidades
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {SPECIALTIES_OPTIONS.map(specialty => (
                                <button
                                    key={specialty}
                                    type="button"
                                    onClick={() => handleSpecialtyToggle(specialty)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.specialties.includes(specialty)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {specialty}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Selecione as suas áreas de especialidade
                        </p>
                    </div>

                    {/* Security / 2FA Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Segurança da Conta
                        </h3>
                        
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h4 className="font-medium text-gray-900">Autenticação em Duas Etapas (2FA)</h4>
                                <p className="text-sm text-gray-600 max-w-md">
                                    Aumente a segurança da sua conta exigindo um código de verificação enviado por email sempre que fizer login.
                                </p>
                                <div className="mt-2 flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user?.twoFactorEnabled 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                                    </span>
                                </div>
                            </div>
                            
                            {!user?.twoFactorEnabled ? (
                                <button
                                    type="button"
                                    onClick={handleStart2FASetup}
                                    className="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Ativar 2FA
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowDisableForm(!showDisableForm)}
                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                        showDisableForm 
                                        ? 'border-gray-200 text-gray-700 hover:bg-gray-50' 
                                        : 'border-red-200 text-red-700 hover:bg-red-50'
                                    }`}
                                >
                                    {showDisableForm ? 'Cancelar' : 'Desativar 2FA'}
                                </button>
                            )}
                        </div>


                        {/* 2FA Disable Form */}
                        {showDisableForm && user?.twoFactorEnabled && (
                            <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-100 space-y-4">
                                <h4 className="font-semibold text-red-900">Desativar Autenticação em Duas Etapas</h4>
                                <p className="text-sm text-red-700">Por segurança, introduza a sua palavra-passe para confirmar a desativação do 2FA.</p>
                                
                                <div className="max-w-md">
                                    <label className="block text-sm font-medium text-red-900 mb-1">
                                        Palavra-passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={disablePassword}
                                            onChange={(e) => setDisablePassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                                            placeholder="Introduza a sua password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleConfirmDisable2FA}
                                        className="px-4 py-2 border border-red-600 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        Confirmar Desativação
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDisableForm(false)}
                                        className="px-4 py-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociais Profissionais</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/seu-perfil"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={formData.facebook}
                                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                    placeholder="https://facebook.com/seu-perfil"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.070-4.85.070-3.204 0-3.584-.012-4.849-.070-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                    placeholder="https://instagram.com/seu-perfil"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Public Profile Toggle */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Perfil Público</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Torne o seu perfil visível para os clientes. Requer aprovação do administrador.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isProfilePublic: !formData.isProfilePublic })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isProfilePublic ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isProfilePublic ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        {formData.isProfilePublic && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                                <strong>Nota:</strong> O seu perfil será revisado e aprovado por um administrador antes de se tornar público.
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploadingAvatar}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader className="w-5 h-5 animate-spin" />}
                            {isSubmitting ? 'Guardando...' : 'Guardar Alterações'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/agent/dashboard')}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Dialogs */}
            <ConfirmDialog
                open={showEnableConfirm}
                title="Ativar Autenticação em Duas Etapas?"
                message="Garanta que tenha acesso ao email que utilizou no registo da plataforma. Após a ativação, será exigido um código enviado para o seu email sempre que iniciar sessão."
                confirmLabel="Sim, Ativar"
                onConfirm={confirmEnable2FA}
                onCancel={() => setShowEnableConfirm(false)}
                isLoading={isProcessing2FA}
            />

            <ConfirmDialog
                open={showDisableConfirm}
                title="Desativar 2FA?"
                message="Tem a certeza que deseja desativar a autenticação em duas etapas? A sua conta ficará menos protegida."
                confirmLabel="Sim, Desativar"
                variant="danger"
                onConfirm={confirmDisable2FA}
                onCancel={() => setShowDisableConfirm(false)}
                isLoading={isProcessing2FA}
            />
        </AgentLayout>
    );
}
