import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await api.post("/auth/login-admin", { email, senha });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nome", res.data.usuario.nome);
      localStorage.setItem("id_usuario", res.data.usuario.id);
      navigate("/pacientes");
    } catch (err) {
      setErro("Email ou senha inválidos");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--fundo)",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ color: "var(--primaria)", fontSize: "28px" }}>
            Maya RPG
          </h1>
          <p style={{ color: "var(--texto-claro)", marginTop: "4px" }}>
            Painel Administrativo
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="campo">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
            />
          </div>

          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {erro && <p className="erro-msg">{erro}</p>}

          <button
            type="submit"
            className="btn-primario"
            disabled={carregando}
            style={{ width: "100%", marginTop: "8px", padding: "12px" }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
