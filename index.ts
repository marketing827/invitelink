// Todo o aplicativo está neste único arquivo para máxima simplicidade.
// Não há necessidade de build, Vite, ou configurações complexas.
// FIX: Add imports for React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// --- DEFINIÇÃO DE TIPOS ---
interface ZapispClient {
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_hash: string;
  client_invite_clicks: string;
  created_at: string;
}

interface ZapispSuccessResponse {
  success: {
    cliente: ZapispClient;
    convidados: unknown[];
    convite: string;
  };
}

interface ZapispErrorResponse {
  error: string;
}


// --- COMPONENTES DE ÍCONE ---
const WhatsAppIcon = ({ className }) => (
  <svg className={`w-5 h-5 ${className || ''}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.74.44 3.37 1.25 4.81L2 22l5.33-1.38c1.37.76 2.92 1.18 4.54 1.18h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.53 8.5c.21-.24.46-.38.72-.38.21 0 .39.06.53.18l.12.1.28.33.15.24.06.18c.04.1.06.22.06.34 0 .18-.04.36-.12.53l-.12.24-.26.42-.39.57c-.15.22-.29.43-.43.64s-.26.4-.36.59a.86.86 0 0 0-.16.57c.01.14.06.27.14.39.09.12.2.22.33.31.14.1.29.18.45.25.2.09.4.15.6.2.21.05.42.07.61.07.24 0 .48-.04.7-.12s.43-.19.6-.33l.24-.24c.08-.1.17-.16.29-.16.11 0 .21.04.29.12l1.6 1.55c.18.18.27.39.27.64 0 .14-.04.29-.12.43s-.18.27-.3.39c-.19.18-.41.33-.66.45-.29.13-.6.23-.92.3-1 0-1.87-.35-2.61-1.04-.4-.35-.74-.77-1.02-1.25s-.49-1.02-.63-1.6c-.14-.59-.21-1.2-.21-1.83 0-.49.07-.98.2-1.46.14-.49.34-.93.6-1.32z"></path>
  </svg>
);

const ClipboardIcon = ({ className }) => (
    <svg className={`w-5 h-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={`w-5 h-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);


// --- COMPONENTE DE LOADING ---
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FF9000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


// --- COMPONENTE DO FORMULÁRIO ---
const InvitationForm = ({ cpf, phone, onCpfChange, onPhoneChange, onSubmit, isLoading, error }) => {
  const handleCpfMask = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    onCpfChange({ ...e, target: { ...e.target, value } });
  };
  
  const handlePhoneMask = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formattedValue = rawValue;
    if (rawValue.length > 2) {
      formattedValue = `(${rawValue.substring(0, 2)}) ${rawValue.substring(2)}`;
      if (rawValue.length > 10) {
        formattedValue = `(${rawValue.substring(0, 2)}) ${rawValue.substring(2, 7)}-${rawValue.substring(7)}`;
      } else if (rawValue.length > 6) {
         formattedValue = `(${rawValue.substring(0, 2)}) ${rawValue.substring(2, 6)}-${rawValue.substring(6)}`;
      }
    } else if (rawValue.length > 0) {
      formattedValue = `(${rawValue}`;
    }
    onPhoneChange({ ...e, target: { ...e.target, value: formattedValue } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#5A189A]">Gerar link meu de indicação</h1>
        <p className="mt-2 text-sm text-slate-600">Insira seus dados abaixo para encontrar seu link de convite exclusivo.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-sm text-red-700 p-3 rounded-lg" role="alert">
          <p className="font-medium">Erro:</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
          <input type="text" id="cpf" name="cpf" value={cpf} onChange={handleCpfMask} placeholder="000.000.000-00" maxLength={14} className="w-full px-4 py-2 bg-[#F3E6FF] text-[#9D4EDD] border border-[#9D4EDD]/50 rounded-md placeholder:text-[#9D4EDD]/70 transition hover:border-[#9D4EDD] focus:outline-none focus:border-[#5A189A] focus:ring-1 focus:ring-[#5A189A]" required />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Número de Telefone</label>
          <input type="tel" id="phone" name="phone" value={phone} onChange={handlePhoneMask} placeholder="(22) 91234-5678" maxLength={15} className="w-full px-4 py-2 bg-[#F3E6FF] text-[#9D4EDD] border border-[#9D4EDD]/50 rounded-md placeholder:text-[#9D4EDD]/70 transition hover:border-[#9D4EDD] focus:outline-none focus:border-[#5A189A] focus:ring-1 focus:ring-[#5A189A]" required />
          <p className="mt-1 text-xs text-slate-500">Inclua o DDD. Ex: 22912345678.</p>
        </div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A189A] hover:bg-[#4d1482] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A189A] disabled:bg-[#5A189A]/50 disabled:cursor-not-allowed transition-colors">
          {isLoading ? <LoadingSpinner /> : (error ? 'Tentar Novamente' : 'Gerar Link')}
        </button>
      </form>
    </div>
  );
};


// --- COMPONENTE DE RESULTADO ---
const InvitationResult = ({ name, link, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [link]);

  const shareText = `Olá! Aqui está o meu link de convite: ${link}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-[#FF9000]/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[#FF9000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#5A189A]">Sucesso!</h1>
        <p className="mt-2 text-sm text-slate-600">Olá {name}, encontramos seu link de convite.</p>
      </div>
      <div className="bg-[#F3E6FF] p-4 rounded-lg border border-[#5A189A]/20">
        <p className="text-sm font-mono break-all text-[#9D4EDD]">{link}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleCopy} className="w-full flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A189A] hover:bg-[#4d1482] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A189A] transition-colors">
          {copied ? <CheckIcon className="text-[#FF9000]" /> : <ClipboardIcon className="text-[#FF9000]" />}
          {copied ? 'Copiado!' : 'Copiar Link'}
        </button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9D4EDD] hover:bg-[#8b3dcf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9D4EDD] transition-colors">
          <WhatsAppIcon className="text-[#FF9000]" />
          Compartilhar no WhatsApp
        </a>
      </div>
      <button onClick={onReset} className="text-sm text-slate-600 hover:text-slate-800 hover:underline">
        Consultar outro número
      </button>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DO APP ---
const App = () => {
  const [cpf, setCpf] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [invitationData, setInvitationData] = React.useState(null);

  const handleReset = React.useCallback(() => {
    setCpf('');
    setPhone('');
    setError(null);
    setInvitationData(null);
    setIsLoading(false);
  }, []);
  
  const isValidCpf = (cpf) => {
    if (!cpf) return false;
    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11 || /^(\d)\1{10}$/.test(cpfDigits)) return false;
    let sum = 0;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpfDigits.substring(i - 1, i)) * (11 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfDigits.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpfDigits.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfDigits.substring(10, 11))) return false;
    return true;
  };

  const handleSubmit = React.useCallback(async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setInvitationData(null);

    if (!isValidCpf(cpf)) {
        setError('Por favor, insira um CPF válido.');
        setIsLoading(false);
        return;
    }

    const formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length < 10 || formattedPhone.length > 11) {
        setError('Por favor, insira um número de telefone válido com DDD (10 ou 11 dígitos).');
        setIsLoading(false);
        return;
    }

    const phoneForApi = `55${formattedPhone}`;

    try {
      const response = await fetch(`/api/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneForApi, cpf: cpf.replace(/\D/g, '') }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro de comunicação. Status: ${response.status}`);
      }
      
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        setInvitationData(data);
      } else {
        setError('Recebemos uma resposta inesperada do servidor.');
      }
    } catch (e) {
      console.error("API request failed:", e);
      setError(e.message || 'Ocorreu um erro de comunicação. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [cpf, phone]);

  return (
    <div className="bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {invitationData ? (
              <InvitationResult 
                name={invitationData.success.cliente.client_name}
                link={invitationData.success.convite}
                onReset={handleReset}
              />
            ) : (
              <InvitationForm 
                cpf={cpf}
                phone={phone}
                onCpfChange={(e) => setCpf(e.target.value)}
                onPhoneChange={(e) => setPhone(e.target.value)}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- RENDERIZA O APP NA PÁGINA ---
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);