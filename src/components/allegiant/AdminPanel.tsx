"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Lead = {
  id: string;
  name: string;
  phone: string;
  appliance: string | null;
  brand: string | null;
  zip: string | null;
  time: string | null;
  message: string | null;
  status: string;
  lang: string;
  notes: string | null;
  created_at: string;
};

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sendingSms, setSendingSms] = useState(false);

  // Admin code (hardcoded for MVP, should be env var)
  const ADMIN_CODE = "1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setAuthenticated(true);
      setCode("");
      fetchLeads();
    } else {
      alert("Código incorrecto");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("status", "pending_approval")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const lead = leads.find((l) => l.id === leadId) ?? selectedLead;
    try {
      // Primero se guarda el estado: un fallo del SMS no debe bloquear la aprobación.
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("Error al actualizar");
      return;
    }

    if (newStatus !== "confirmed" || !lead) return;

    setSendingSms(true);
    try {
      const smsResponse = await fetch("/api/allegiant/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadName: lead.name,
          leadPhone: lead.phone,
          appliance: lead.appliance,
          brand: lead.brand,
          message: lead.message,
        }),
      });

      if (!smsResponse.ok) {
        const errorData = await smsResponse.json().catch(() => ({}));
        console.error("SMS Error:", errorData);
        alert(`Lead aprobado, pero no se pudo enviar el SMS (${errorData.error ?? smsResponse.status}). Llama a ${lead.name} al ${lead.phone}.`);
      }
    } catch (err) {
      console.error("SMS Error:", err);
      alert(`Lead aprobado, pero no se pudo enviar el SMS. Llama a ${lead.name} al ${lead.phone}.`);
    } finally {
      setSendingSms(false);
    }
  };

  if (!authenticated) {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <h2>Allegiant Admin</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Código de acceso"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Panel de Allegiant</h1>
      <p>
        Solicitudes pendientes: <strong>{leads.length}</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Lista de solicitudes */}
        <div>
          <h2>Pendientes de aprobación</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : leads.length === 0 ? (
            <p style={{ color: "#666" }}>No hay solicitudes pendientes</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  style={{
                    padding: "12px",
                    border: selectedLead?.id === lead.id ? "2px solid #f97316" : "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: selectedLead?.id === lead.id ? "#fff8f3" : "white",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{lead.name}</div>
                  <div style={{ fontSize: "14px", color: "#666" }}>{lead.phone}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {new Date(lead.created_at).toLocaleDateString("es-AR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles de solicitud seleccionada */}
        {selectedLead && (
          <div>
            <h2>Detalles</h2>
            <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <p>
                <strong>Nombre:</strong> {selectedLead.name}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedLead.phone}
              </p>
              <p>
                <strong>Aparato:</strong> {selectedLead.appliance || "-"}
              </p>
              {selectedLead.brand && (
                <p>
                  <strong>Marca:</strong> {selectedLead.brand}
                </p>
              )}
              {selectedLead.zip && (
                <p>
                  <strong>ZIP:</strong> {selectedLead.zip}
                </p>
              )}
              {selectedLead.time && (
                <p>
                  <strong>Horario solicitado:</strong> {selectedLead.time}
                </p>
              )}
              {selectedLead.message && (
                <p>
                  <strong>Notas:</strong> {selectedLead.message}
                </p>
              )}
              <p>
                <strong>Idioma:</strong> {selectedLead.lang === "es" ? "Español" : "Inglés"}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={() => updateLeadStatus(selectedLead.id, "confirmed")}
                  disabled={sendingSms}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: sendingSms ? "#999" : "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: sendingSms ? "not-allowed" : "pointer",
                    opacity: sendingSms ? 0.6 : 1,
                  }}
                >
                  {sendingSms ? "Enviando SMS..." : "Aprobar"}
                </button>
                <button
                  onClick={() => updateLeadStatus(selectedLead.id, "declined")}
                  disabled={sendingSms}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: sendingSms ? "not-allowed" : "pointer",
                    opacity: sendingSms ? 0.6 : 1,
                  }}
                >
                  Declinar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
