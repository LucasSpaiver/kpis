"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado de carregamento da verificação
  const [userEmail, setUserEmail] = useState("");

  // 🛡️ Proteção de rota: só mostra o dashboard se estiver logado
  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login"); // Redireciona se não estiver logado
      } else {
        setUserEmail(session.user.email || ""); // Armazena email do usuário
        setLoading(false); // Libera acesso ao dashboard
      }
    };

    verificarSessao();
  }, [router]);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // Tela de carregamento enquanto verifica login
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">
          Verificando acesso...
        </p>
      </main>
    );
  }

  // 🔓 Conteúdo do dashboard (mostrado somente se estiver logado)
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          👋 Bem-vindo(a), {userEmail}
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/registro")}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold"
          >
            Registrar nova atividade
          </button>

          <button
            onClick={() => router.push("/ti")}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold"
          >
            TI
          </button>

          <button
            onClick={() => router.push("/listagem")}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold"
          >
            Lista de dados
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold"
          >
            Sair
          </button>
        </div>
      </div>
    </main>
  );
}
