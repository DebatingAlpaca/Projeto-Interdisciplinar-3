import React, { useState, useEffect } from "react";
import api from "../api/api";

export default function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [form, setForm] = useState({ titulo: "", descricao: "" });
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const id_admin = localStorage.getItem("id_usuario");

  useEffect(() => {
    buscarExercicios();
  }, []);

  async function buscarExercicios() {
    try {
      const res = await api.get("/exercicios");
      setExercicios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/exercicios/${editando}`, form);
      } else {
        await api.post("/exercicios", { ...form, id_admin, arquivos: [] });
      }
      setForm({ titulo: "", descricao: "" });
      setEditando(null);
      buscarExercicios();
    } catch (err) {
      alert("Erro ao salvar exercício");
    }
  }

  async function deletar(id) {
    if (!window.confirm("Deletar este exercício?")) return;
    try {
      await api.delete(`/exercicios/${id}`);
      setExercicios(exercicios.filter((e) => e.id_exercicio !== id));
    } catch (err) {
      alert("Erro ao deletar");
    }
  }

  function iniciarEdicao(ex) {
    setEditando(ex.id_exercicio);
    setForm({ titulo: ex.titulo, descricao: ex.descricao });
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>
        Banco de Exercícios
      </h2>

      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          {editando ? "Editar Exercício" : "Novo Exercício"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Título *</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>
          <div className="campo">
            <label>Descrição</label>
            <textarea
              value={form.descricao}
              rows={3}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" className="btn-primario">
              {editando ? "Salvar" : "Adicionar"}
            </button>
            {editando && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditando(null);
                  setForm({ titulo: "", descricao: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        {carregando ? (
          <p>Carregando...</p>
        ) : exercicios.length === 0 ? (
          <p style={{ color: "var(--texto-claro)" }}>
            Nenhum exercício cadastrado.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {exercicios.map((ex) => (
              <div
                key={ex.id_exercicio}
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
                  <p style={{ fontWeight: 600 }}>{ex.titulo}</p>
                  {ex.descricao && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--texto-claro)",
                        marginTop: "4px",
                      }}
                    >
                      {ex.descricao}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--primaria)",
                      marginTop: "4px",
                    }}
                  >
                    {ex.arquivos?.length || 0} arquivo(s)
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-ghost"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => iniciarEdicao(ex)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-perigo"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => deletar(ex.id_exercicio)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
