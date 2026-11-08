"use client";

import { useState } from "react";

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

  // El código se comprueba en el servidor (ALLEGIANT_ADMIN_CODE); aquí solo se guarda mientras la página está abierta.
  const [adminCode, setAdminCode] = useState("");

  const fetchLeads = async (codeToUse: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("/api/allegiant/admin/leads", {
        headers: { "x-admin-code": codeToUse },
        cache: "no-store",
      });
      if (res.status === 401) {
        alert("Código incorrecto");
        return false;
      }
      if (res.status === 503) {
        alert("El panel no está configurado en Vercel (ALLEGIANT_ADMIN_CODE o SUPABASE_SERVICE_ROLE_KEY).");
        return false;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { leads: Lead[] };
      setLeads(data.leads);
      return true;
    } catch (err) {
      console.error("Error fetching leads:", err);
      alert("No se pudieron cargar las solicitudes. Prueba de nuevo.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = code.trim();
    if (!entered) return;
    if (await fetchLeads(entered)) {
      setAdminCode(entered);
      setAuthenticated(true);
      setCode("");
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const lead = leads.find((l) => l.id === leadId) ?? selectedLead;
    try {
      // Primero se guarda el estado: un fallo del SMS no debe bloquear la aprobación.
      const res = await fetch("/api/allegiant/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("Error al actualizar");
      return;
    }

    if (newStatus !== "confirmed" || !lead) return;

    // Solo se escribe por SMS a quien marcó la casilla opcional del formulario.
    if (!lead.message?.startsWith("[SMS OK]")) {
      alert(`Lead aprobado. ${lead.name} no aceptó mensajes de texto: llámalo al ${lead.phone}.`);
      return;
    }

    setSendingSms(true);
    try {
      const smsResponse = await fetch("/api/allegiant/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {/* Lista de solicitudes */}
        <div>
          <h2>Pendientes de aprobación</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : leads.length === 0 ? (
            <p style={{ color: "#666" }}>No hay solicitudes pendientes</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {leads.map((lead) => {
                const fromPhone = lead.message?.startsWith("[PHONE AGENT]");
                const note = (lead.message ?? "").replace(/^\[(PHONE AGENT|SMS OK)\]\s*/, "");
                const device = [lead.appliance, lead.brand].filter((v) => v && v !== "not given").join(" · ");
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    style={{
                      padding: "14px",
                      border: selectedLead?.id === lead.id ? "2px solid #f97316" : "1px solid #ddd",
                      borderRadius: "6px",
                      cursor: "pointer",
                      backgroundColor: selectedLead?.id === lead.id ? "#fff8f3" : "white",
                      color: "#1f2937",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: "17px", color: "#1c2f58" }}>{lead.name}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: fromPhone ? "#e0e7ff" : "#fef3c7",
                          color: fromPhone ? "#1e3a8a" : "#92400e",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fromPhone ? "Llamada (Jessica)" : "Formulario web"}
                      </span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>
                      {lead.phone} · {new Date(lead.created_at).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                    </div>
                    {device && (
                      <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "6px", textTransform: "capitalize" }}>{device}</div>
                    )}
                    {note && <div style={{ fontSize: "14px", lineHeight: 1.5, marginTop: "4px" }}>{note}</div>}
                  </div>
                );
              })}
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
