import { useState } from "react";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import ErrorPopup from "../components/ErrorPopup";
import { Glasses } from "lucide-react";
import { handleLogin } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <ErrorPopup message={error} onClose={() => setError(null)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await handleLogin({ email, password, rememberMe });
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("E-mail ou senha incorretos.");
      } else {
        setError("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-16">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Glasses className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Vitreo</span>
        </div>

        <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-3">Seja bem-vindo!</h1>
            <p className="text-slate-400">
              Faça login com seu email e senha para acessar sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Email
              </label>
              <InputField
                type="email"
                placeholder="seuemail@email.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Password
              </label>
              <InputField
                type="password"
                placeholder="••••••••"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-slate-500">Lembrar de mim</span>
              </label>
              <a
                href=""
                className="text-blue-600 font-semibold hover:underline"
              >
                Esqueceu sua senha?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full text-white py-3  font-semibold transition-all"
            >
              Entrar
            </Button>
          </form>
        </div>

        <div className="mt-auto pt-8 flex text-xs text-slate-400">
          <p>
            Todos os direitos reservados © {new Date().getFullYear()} Otavio
            Costa
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 p-6 bg-white">
        <div className="w-full h-full bg-[#3b41f8] rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>

          <div className="z-10 mb-12 text-left">
            <h2 className="text-5xl font-bold mb-6">
              Gerencie sua ótica com facilidade e eficiência!
            </h2>
            <p className="text-blue-100 text-lg opacity-80">
              Faça login para acessar seu painel CRM e gerenciar suas vendas.
            </p>
          </div>

          <div className="flex justify-center z-10 w-full mt-4 transform hover:scale-105 transition-transform duration-500">
            <img
              src="/login-image.png"
              alt="Dashboard Preview"
              className="w-[90%] drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
