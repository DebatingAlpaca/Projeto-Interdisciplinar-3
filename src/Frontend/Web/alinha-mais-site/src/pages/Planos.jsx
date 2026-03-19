import React, { useState, useEffect } from "react";
import api from "../api/api";

export default function Planos() {
  const [planos, setPlanos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [form, setForm] = useState({
    data_inicio: "",
    data_final: "",
    frequencia: "",
    repeticoes: "",
    series: "",
    observacoes: "",
    id_paciente: "",
    exercicios: [],
  });
  const [carregando, setCarregando] = useState(true);
  const id_admin = localStorage.getItem("id_usuario");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [plaRes, pacRes, exRes] = await Promise.all([
        api.get("/planos"),
        api.get("/pacientes"),
        api.get("/exercicios"),
      ]);
      setPlanos(plaRes.data);
      setPacientes(pacRes.data);
      setExercicios(exRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  function toggleExercicio(id) {
    setForm((prev) => ({
      ...prev,
      exercicios: prev.exercicios.includes(id)
        ? prev.exercicios.filter((e) => e !== id)
        : [...prev.exercicios, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.exercicios.length === 0) {
      alert("Selecione pelo menos um exercício!");
      return;
    }
    try {
      await api.post("/planos", { ...form, id_admin });
      setForm({
        data_inicio: "",
        data_final: "",
        frequencia: "",
        repeticoes: "",
        series: "",
        observacoes: "",
        id_paciente: "",
        exercicios: [],
      });
      carregarDados();
    } catch (err) {
      alert("Erro ao criar plano");
    }
  }

  async function deletar(id) {
    if (!window.confirm("Deletar este plano?")) return;
    try {
      await api.delete(`/planos/${id}`);
      setPlanos(planos.filter((p) => p.id_plano !== id));
    } catch (err) {
      alert("Erro ao deletar");
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>
        Planos de Exercícios
      </h2>

      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>Novo Plano</h3>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div className="campo">
              <label>Paciente *</label>
              <select
                value={form.id_paciente}
                onChange={(e) =>
                  setForm({ ...form, id_paciente: e.target.value })
                }
                required
              >
                <option value="">Selecione...</option>
                {pacientes.map((p) => (
                  <option key={p.id_usuario} value={p.id_usuario}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Frequência</label>
              <input
                value={form.frequencia}
                onChange={(e) =>
                  setForm({ ...form, frequencia: e.target.value })
                }
                placeholder="Ex: Diária, 3x semana"
              />
            </div>

            <div className="campo">
              <label>Data Início *</label>
              <input
                type="date"
                value={form.data_inicio}
                onChange={(e) =>
                  setForm({ ...form, data_inicio: e.target.value })
                }
                required
              />
            </div>

            <div className="campo">
              <label>Data Final *</label>
              <input
                type="date"
                value={form.data_final}
                onChange={(e) =>
                  setForm({ ...form, data_final: e.target.value })
                }
                required
              />
            </div>

            <div className="campo">
              <label>Repetições</label>
              <input
                type="number"
                min="1"
                value={form.repeticoes}
                onChange={(e) =>
                  setForm({ ...form, repeticoes: e.target.value })
                }
              />
            </div>

            <div className="campo">
              <label>Séries</label>
              <input
                type="number"
                min="1"
                value={form.series}
                onChange={(e) => setForm({ ...form, series: e.target.value })}
              />
            </div>

            <div className="campo" style={{ gridColumn: "1 / -1" }}>
              <label>Observações</label>
              <textarea
                value={form.observacoes}
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, observacoes: e.target.value })
                }
              />
            </div>

            <div className="campo" style={{ gridColumn: "1 / -1" }}>
              <label>Exercícios * (selecione um ou mais)</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {exercicios.map((ex) => (
                  <label
                    key={ex.id_exercicio}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      background: form.exercicios.includes(ex.id_exercicio)
                        ? "#e6f7f8"
                        : "var(--fundo)",
                      border: form.exercicios.includes(ex.id_exercicio)
                        ? "1px solid var(--primaria)"
                        : "1px solid var(--borda)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "normal",
                      color: "var(--texto)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.exercicios.includes(ex.id_exercicio)}
                      onChange={() => toggleExercicio(ex.id_exercicio)}
                    />
                    {ex.titulo}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primario"
            style={{ marginTop: "8px" }}
          >
            Criar Plano
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>Planos Cadastrados</h3>
        {carregando ? (
          <p>Carregando...</p>
        ) : planos.length === 0 ? (
          <p style={{ color: "var(--texto-claro)" }}>
            Nenhum plano cadastrado.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {planos.map((p) => (
              <div
                key={p.id_plano}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  background: "var(--fundo)",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600 }}>{p.paciente}</p>
                  <p style={{ fontSize: "13px", color: "var(--texto-claro)" }}>
                    {p.data_inicio?.split("T")[0]} até{" "}
                    {p.data_final?.split("T")[0]}
                    {p.frequencia && ` • ${p.frequencia}`}
                  </p>
                </div>
                <button
                  className="btn-perigo"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                  onClick={() => deletar(p.id_plano)}
                >
                  Deletar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
