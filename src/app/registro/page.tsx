"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Controle de carregamento da verificação
  const [form, setForm] = useState({
    data: "",
    funcionario: "",
    area: "",
    atividade: "",
    observacao: "",
  });
  const [mensagem, setMensagem] = useState("");

  // 🛡️ Protege a página: redireciona para login se não houver sessão
  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login"); // Redireciona se não estiver logado
      } else {
        setLoading(false); // Libera o acesso
      }
    };

    verificarSessao();
  }, [router]);

  // 🧩 Atualiza estado quando usuário digita
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 Envia os dados para o Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("atividades").insert([form]);

    if (error) {
      console.error(error);
      setMensagem("❌ Erro ao salvar no Supabase.");
    } else {
      setMensagem("✅ Dados salvos com sucesso!");
      setForm({
        data: "",
        funcionario: "",
        area: "",
        atividade: "",
        observacao: "",
      });
    }
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

  // 🔓 Conteúdo da página (mostra o formulário normalmente)
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold text-black mb-6">
        Registro de Atividades (KPI)
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg space-y-4"
      >
        {/* Campo Data */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Data
          </label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className="border w-full p-2 rounded-lg text-black"
            required
          />
        </div>

        {/* Funcionário */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Funcionário
          </label>
          <select
            name="funcionario"
            value={form.funcionario}
            onChange={handleChange}
            className="border w-full p-2 text-black rounded-lg"
            required
          >
            <option value="">Selecione</option>
            <option value="João Silva">João Silva</option>
            <option value="Maria Souza">Maria Souza</option>
            <option value="José Lima">José Lima</option>
            <option value="Ana Costa">Ana Costa</option>
          </select>
        </div>

        {/* Área */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Área
          </label>
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="border w-full text-black p-2 rounded-lg"
            required
          >
            <option value="">Selecione</option>
            <option value="Colheita">Colheita</option>
            <option value="Plantio">Plantio</option>
            <option value="Broca">Broca</option>
            <option value="Sphenophorus">Sphenophorus</option>
            <option value="Quebra-lombo">Quebra-lombo</option>
            <option value="Vinhaça">Vinhaça</option>
          </select>
        </div>

        {/* Atividade */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Atividade
          </label>
          <input
            name="atividade"
            value={form.atividade}
            onChange={handleChange}
            className="border w-full text-black p-2 rounded-lg"
            placeholder="Ex: Pureza, Profundidade, Infestação..."
            required
          />
        </div>

        {/* Observação */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Observação
          </label>
          <textarea
            name="observacao"
            value={form.observacao}
            onChange={handleChange}
            className="border w-full text-black p-2 rounded-lg"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white w-full p-3 rounded-lg font-semibold"
        >
          Salvar
        </button>

        {mensagem && <p className="text-center mt-3">{mensagem}</p>}
      </form>
    </main>
  );
}
