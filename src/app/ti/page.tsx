"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    data: "",
    servico: "",
    responsavel: "",
    descricao: "",
    solicitante: "",
    departamento: "",
    status: "",
  });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    verificarSessao();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("atividades_ti").insert([form]);

    if (error) {
      console.error(
        "Erro ao inserir no Supabase:",
        error.message,
        error.details,
        error.hint
      );
      setMensagem(`❌ Erro ao salvar: ${error.message}`);
    } else {
      setMensagem("✅ Dados salvos com sucesso!");
      setForm({
        data: "",
        servico: "",
        responsavel: "",
        descricao: "",
        solicitante: "",
        departamento: "",
        status: "",
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">
          Verificando acesso...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold text-black mb-6">
        Registro de Atividades TI
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg space-y-4"
      >
        {/* Data */}
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

        {/* Serviço */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Serviço
          </label>
          <select
            name="servico"
            value={form.servico}
            onChange={handleChange}
            className="border w-full p-2 text-black rounded-lg"
            required
          >
            <option value="">Selecione</option>
            <option value="Tarefa">Tarefa</option>
            <option value="Chamado">Chamado</option>
          </select>
        </div>

        {/* Responsável */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Responsável
          </label>
          <select
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            className="border w-full p-2 text-black rounded-lg"
            required
          >
            <option value="">Selecione</option>
            <option value="Guilherme">Guilherme</option>
            <option value="Lucas">Lucas</option>
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="border w-full text-black p-2 rounded-lg"
          />
        </div>

        {/* Solicitante */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Solicitante
          </label>
          <input
            name="solicitante"
            value={form.solicitante}
            onChange={handleChange}
            className="border w-full text-black p-2 rounded-lg"
          />
        </div>

        {/* Departamento */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Departamento
          </label>
          <select
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            className="border w-full p-2 text-black rounded-lg"
            required
          >
            <option value="">Selecione</option>
            <option value="ADM">ADM</option>
            <option value="AGR">AGR</option>
            <option value="AUT">AUT</option>
            <option value="IND">IND</option>
            <option value="RH">RH</option>
            <option value="TI">RH</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm text-black font-semibold mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border w-full p-2 text-black rounded-lg"
            required
          >
            <option value="">Selecione</option>
            <option value="EM ANDAMENTO">EM ANDAMENTO</option>
            <option value="FINALIZADO">FINALIZADO</option>
          </select>
        </div>

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
