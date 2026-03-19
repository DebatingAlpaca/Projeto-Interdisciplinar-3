import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Pacientes from "./pages/Pacientes";
import PacienteForm from "./pages/PacienteForm";
import Prontuario from "./pages/Prontuario";
import Exercicios from "./pages/Exercicios";
import Planos from "./pages/Planos";
import Navbar from "./components/Navbar";

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/pacientes"
          element={
            <RotaProtegida>
              <Layout>
                <Pacientes />
              </Layout>
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/novo"
          element={
            <RotaProtegida>
              <Layout>
                <PacienteForm />
              </Layout>
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/editar/:id"
          element={
            <RotaProtegida>
              <Layout>
                <PacienteForm />
              </Layout>
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/:id/prontuario"
          element={
            <RotaProtegida>
              <Layout>
                <Prontuario />
              </Layout>
            </RotaProtegida>
          }
        />

        <Route
          path="/exercicios"
          element={
            <RotaProtegida>
              <Layout>
                <Exercicios />
              </Layout>
            </RotaProtegida>
          }
        />

        <Route
          path="/planos"
          element={
            <RotaProtegida>
              <Layout>
                <Planos />
              </Layout>
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
