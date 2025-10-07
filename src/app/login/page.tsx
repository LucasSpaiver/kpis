"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMensagem("❌ Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
    } else {
      setMensagem("✅ Login realizado com sucesso!");
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
          Login - Sistema de Atividades
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block  text-black font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-full p-2 rounded-lg"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="border w-full p-2 rounded-lg"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white w-full p-3 rounded-lg font-semibold"
          >
            Entrar
          </button>
        </form>

        {mensagem && <p className="text-center mt-3">{mensagem}</p>}
      </div>
    </main>
  );
}
