import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import {
    User,
    Mail,
    Lock,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShieldCheck
} from "lucide-react";
import { Link } from "react-router";
import SEO from "../components/SEO";

export default function Account() {
    const { user, updateProfile, updatePassword, requestEmailChange, confirmEmailChange } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [username, setUsername] = useState(user?.username || "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const res = await updateProfile(name, username);
        if (res.success) {
            setMessage({ type: 'success', text: "Perfil atualizado com sucesso!" });
        } else {
            setMessage({ type: 'error', text: res.message || "Erro ao atualizar perfil." });
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const res = await updatePassword(currentPassword, newPassword);
        if (res.success) {
            setMessage({ type: 'success', text: "Senha atualizada com sucesso!" });
            setCurrentPassword("");
            setNewPassword("");
        } else {
            setMessage({ type: 'error', text: res.message || "Erro ao atualizar senha." });
        }
        setLoading(false);
    };

    const handleRequestEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const res = await requestEmailChange(newEmail);
        if (res.success) {
            setIsVerifyingEmail(true);
            setMessage({ type: 'success', text: "Código enviado para o novo email!" });
        } else {
            setMessage({ type: 'error', text: res.message || "Erro ao solicitar troca de email." });
        }
        setLoading(false);
    };

    const handleConfirmEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const res = await confirmEmailChange(newEmail, verificationCode);
        if (res.success) {
            setIsVerifyingEmail(false);
            setNewEmail("");
            setVerificationCode("");
            setMessage({ type: 'success', text: "Email atualizado com sucesso!" });
        } else {
            setMessage({ type: 'error', text: res.message || "Código inválido ou expirado." });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-(--accent-background) text-white p-6 md:p-12">
            <SEO title="Minha Conta | Starky" description="Gerencie suas informações de perfil e segurança." />

            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                    <Link to="/overview" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Voltar ao Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{user?.name}</p>
                            <p className="text-xs text-zinc-500 font-mono">@{user?.username}</p>
                        </div>
                    </div>
                </header>

                {message && (
                    <div className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Perfil */}
                    <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-6 h-6 text-accent" />
                            <h2 className="text-xl font-bold">Informações do Perfil</h2>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Nome Completo</label>
                                <input
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors font-mono"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Username (@)</label>
                                <input
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors font-mono"
                                    value={username}
                                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Salvar Alterações
                            </Button>
                        </form>
                    </section>

                    {/* Segurança */}
                    <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold">Segurança e Senha</h2>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Senha Atual</label>
                                <input
                                    type="password"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors font-mono"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Nova Senha</label>
                                <input
                                    type="password"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors font-mono"
                                    placeholder="Min. 8 caracteres, letras M/m e números"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Alterar Senha
                            </Button>
                        </form>
                    </section>

                    {/* Email */}
                    <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-6 h-6 text-emerald-500" />
                            <h2 className="text-xl font-bold">Endereço de Email</h2>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 mb-6">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            <div>
                                <p className="text-sm text-zinc-500">Email atual</p>
                                <p className="font-bold text-zinc-200">{user?.email}</p>
                            </div>
                        </div>

                        {!isVerifyingEmail ? (
                            <form onSubmit={handleRequestEmailChange} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Novo Endereço de Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
                                        placeholder="novo@email.com"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    Alterar Email
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleConfirmEmailChange} className="space-y-6 animate-slide-up">
                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm">
                                    Digitie o código de verificação enviado para <strong>{newEmail}</strong> para confirmar a alteração.
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Código de Verificação</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors text-center tracking-widest font-bold"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={verificationCode}
                                            onChange={e => setVerificationCode(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        Confirmar Troca
                                    </Button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsVerifyingEmail(false)}
                                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                                >
                                    Cancelar e voltar
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
