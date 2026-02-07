import { api } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post('/api/v1/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      setSuccess(true);
      // Optional: redirect after a few seconds
      setTimeout(() => navigate('/login'), 5000);
    } catch (e: any) {
      setError(e.message || 'Falha ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card variant="elevated" className="w-full max-w-md text-center p-8">
            <h1 className="text-xl font-bold text-red-600 mb-2">Link Inválido</h1>
            <p className="text-gray-600 mb-6">O link de redefinição de senha está incompleto ou inválido.</p>
            <Link to="/forgot-password">
                <Button variant="outline">Solicitar novo link</Button>
            </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card variant="elevated" className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {success ? <CheckCircle className="w-6 h-6 text-green-600" /> : <Lock className="w-6 h-6 text-blue-600" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {success ? 'Senha Alterada!' : 'Nova Senha'}
          </h1>
          {!success && (
            <p className="text-gray-600 mt-2">
                Defina sua nova senha de acesso.
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              <p className="font-medium">Sua senha foi atualizada com sucesso.</p>
              <p className="mt-1">Você será redirecionado para o login em instantes.</p>
            </div>
            <Link to="/login" className="block w-full">
              <Button fullWidth size="lg">
                Ir para Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              fullWidth
              required
            />
            
            <Input
              label="Confirmar Nova Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none hover:text-blue-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              fullWidth
              required
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
