import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const nome = localStorage.getItem("nome");

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  function ativo(path) {
    return location.pathname.startsWith(path)
      ? { borderBottom: "3px solid var(--primaria)", color: "var(--primaria)" }
      : {};
  }

  return (
    <nav
      style={{
        background: "white",
        boxShadow: "var(--sombra)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--primaria)",
          }}
        >
          Maya RPG
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "32px",
          height: "100%",
          alignItems: "center",
        }}
      >
        {[
          { path: "/pacientes", label: "Pacientes" },
          { path: "/exercicios", label: "Exercícios" },
          { path: "/planos", label: "Planos" },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              textDecoration: "none",
              color: "var(--texto)",
              fontWeight: 600,
              fontSize: "14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 4px",
              ...ativo(path),
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", color: "var(--texto-claro)" }}>
          Olá, {nome}
        </span>
        <button
          className="btn-ghost"
          onClick={logout}
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
