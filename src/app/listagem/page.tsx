"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

type Atividade = {
  id: number;
  data: string;
  funcionario: string;
  area: string;
  atividade: string;
  observacao: string;
};

export default function Listagem() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [filtros, setFiltros] = useState({
    funcionario: "",
    area: "",
    dataInicial: "",
    dataFinal: "",
  });

  // 🛡️ Proteção de rota
  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      } else {
        setUserEmail(session.user.email || "");
        setLoading(false);
        buscarAtividades(); // Carrega os registros
      }
    };

    verificarSessao();
  }, [router]);

  // 🔍 Atualiza filtros
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // 📦 Busca registros com filtros
  const buscarAtividades = async () => {
    let query = supabase.from("atividades").select("*");

    if (filtros.funcionario) {
      query = query.eq("funcionario", filtros.funcionario);
    }
    if (filtros.area) {
      query = query.eq("area", filtros.area);
    }
    if (filtros.dataInicial) {
      query = query.gte("data", filtros.dataInicial);
    }
    if (filtros.dataFinal) {
      query = query.lte("data", filtros.dataFinal);
    }

    const { data, error } = await query.order("data", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setAtividades(data as Atividade[]);
    }
  };

  // 🔄 Resetar filtros
  const resetFiltros = () => {
    setFiltros({ funcionario: "", area: "", dataInicial: "", dataFinal: "" });
    buscarAtividades();
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
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Listagem de Atividades
      </h1>

      {/* Filtros */}
      <div className="bg-white shadow-md text-black rounded-2xl p-6 mb-6 flex flex-col md:flex-row gap-4">
        <select
          name="funcionario"
          value={filtros.funcionario}
          onChange={handleChange}
          className="border p-2 text-black rounded-lg"
        >
          <option value="">Todos os Funcionários</option>
          <option value="João Silva">João Silva</option>
          <option value="Maria Souza">Maria Souza</option>
          <option value="José Lima">José Lima</option>
          <option value="Ana Costa">Ana Costa</option>
        </select>

        <select
          name="area"
          value={filtros.area}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="">Todas as Áreas</option>
          <option value="Colheita">Colheita</option>
          <option value="Plantio">Plantio</option>
          <option value="Broca">Broca</option>
          <option value="Sphenophorus">Sphenophorus</option>
          <option value="Quebra-lombo">Quebra-lombo</option>
          <option value="Vinhaça">Vinhaça</option>
        </select>

        <input
          type="date"
          name="dataInicial"
          value={filtros.dataInicial}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          name="dataFinal"
          value={filtros.dataFinal}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={buscarAtividades}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg font-semibold"
        >
          Filtrar
        </button>

        <button
          onClick={resetFiltros}
          className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-lg font-semibold"
        >
          Resetar
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white shadow-md text-black rounded-2xl p-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Data</th>
              <th className="border p-2 text-left">Funcionário</th>
              <th className="border p-2 text-left">Área</th>
              <th className="border p-2 text-left">Atividade</th>
              <th className="border p-2 text-left">Observação</th>
            </tr>
          </thead>
          <tbody>
            {atividades.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
            {atividades.map((a) => (
              <tr key={a.id} className="hover:bg-gray-100">
                <td className="border p-2">{a.data}</td>
                <td className="border p-2">{a.funcionario}</td>
                <td className="border p-2">{a.area}</td>
                <td className="border p-2">{a.atividade}</td>
                <td className="border p-2">{a.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
