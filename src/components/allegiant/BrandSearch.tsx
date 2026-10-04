"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { brandDatabase, type Lang } from "@/data/allegiant";

export function BrandSearch({ lang }: { lang: Lang }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = typeof window !== "undefined" && (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "es" ? "es-ES" : "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setSearch(transcript.trim());
          setSelected(null);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSearch("");
      setSelected(null);
      recognitionRef.current.start();
    }
  };

  const filteredBrands = useMemo(() => {
    if (!search) return [];
    const query = search.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
    return Object.values(brandDatabase)
      .filter((b) => b.name.toLowerCase().replace(/\s+/g, "").replace(/-/g, "").includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search]);

  const selectedBrand = selected ? brandDatabase[selected] : null;

  const categoryLabel = {
    luxury: lang === "es" ? "Lujo & Profesional" : "Luxury & Professional",
    home: lang === "es" ? "Favoritas del Hogar" : "Home Favorites",
    professional: lang === "es" ? "Profesional" : "Professional",
    compact: lang === "es" ? "Compacto" : "Compact",
  };

  const priceLabel = {
    budget: lang === "es" ? "Económica" : "Budget",
    mid: lang === "es" ? "Media" : "Mid-range",
    premium: lang === "es" ? "Premium" : "Premium",
    luxury: lang === "es" ? "Lujo" : "Luxury",
  };

  const labels = {
    en: {
      title: "Browse brands we repair",
      placeholder: "Search by brand name...",
      founded: "Founded",
      country: "Country",
      category: "Category",
      price: "Price range",
      specialties: "Specialties",
      commonIssues: "Common issues we fix",
      noResults: "No brands found",
    },
    es: {
      title: "Explora las marcas que reparamos",
      placeholder: "Busca por nombre de marca...",
      founded: "Fundada",
      country: "País",
      category: "Categoría",
      price: "Rango de precio",
      specialties: "Especialidades",
      commonIssues: "Problemas comunes que reparamos",
      noResults: "No se encontraron marcas",
    },
  };

  const t = labels[lang];

  return (
    <section className="al-brand-search" style={{ padding: "60px 20px" }}>
      <div className="al-grid12">
        <h2 className="al-h2" style={{ gridColumn: "1 / span 12", marginBottom: 48 }}>
          {t.title}
        </h2>

        {/* Search input with voice button */}
        <div style={{ gridColumn: "1 / span 12", marginBottom: 40, display: "flex", gap: 12, alignItems: "stretch" }}>
          <input
            type="text"
            placeholder={t.placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelected(null);
            }}
            style={{
              flex: 1,
              padding: "16px 20px",
              fontSize: 18,
              border: "2px solid var(--al-line-3)",
              borderRadius: 8,
              fontFamily: "inherit",
              backgroundColor: "var(--al-bg)",
              color: "var(--al-text)",
            }}
            aria-label={t.placeholder}
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleVoiceSearch}
              style={{
                padding: "0 20px",
                borderRadius: 8,
                border: "2px solid var(--al-line-3)",
                backgroundColor: isListening ? "var(--al-accent)" : "var(--al-bg)",
                color: isListening ? "var(--al-bg)" : "var(--al-text)",
                cursor: "pointer",
                fontSize: 20,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 56,
              }}
              title={isListening ? "Escuchando..." : "Buscar por voz"}
              aria-label="Voice search"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                {isListening ? (
                  <>
                    <path d="M12 2c-3.3 0-6 2.7-6 6v7c0 3.3 2.7 6 6 6s6-2.7 6-6V8c0-3.3-2.7-6-6-6z" />
                    <path d="M4 10h16" />
                    <circle cx="12" cy="21" r="1" fill="currentColor" />
                    <path d="M12 18v3" />
                  </>
                ) : (
                  <path d="M12 2c-3.3 0-6 2.7-6 6v7c0 3.3 2.7 6 6 6s6-2.7 6-6V8c0-3.3-2.7-6-6-6zm0 16c-2.2 0-4-1.8-4-4v-7c0-2.2 1.8-4 4-4s4 1.8 4 4v7c0 2.2-1.8 4-4 4z" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Results list or detail view */}
        {search && filteredBrands.length > 0 ? (
          <>
            {/* Brands list on left, details on right */}
            <div
              style={{
                gridColumn: "1 / span 5",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                maxHeight: 600,
                overflowY: "auto",
              }}
            >
              {filteredBrands.map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => setSelected(brand.name)}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    border: "1px solid var(--al-line-3)",
                    borderRadius: 6,
                    backgroundColor:
                      selected === brand.name ? "var(--al-bg-2)" : "var(--al-bg)",
                    color: selected === brand.name ? "var(--al-accent)" : "var(--al-text)",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: selected === brand.name ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--al-bg-2)";
                  }}
                  onMouseLeave={(e) => {
                    if (selected !== brand.name) {
                      e.currentTarget.style.backgroundColor = "var(--al-bg)";
                    }
                  }}
                >
                  {brand.name}
                </button>
              ))}
            </div>

            {/* Brand details on right */}
            {selectedBrand && (
              <div style={{ gridColumn: "8 / span 5" }}>
                <div style={{ paddingLeft: 20 }}>
                  <h3 style={{ fontSize: 28, margin: "0 0 24px", color: "var(--al-accent)" }}>
                    {selectedBrand.name}
                  </h3>

                  <p style={{ margin: "0 0 24px", fontSize: 16, lineHeight: 1.6, color: "var(--al-muted)" }}>
                    {typeof selectedBrand.description === "string" ? selectedBrand.description : selectedBrand.description[lang]}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--al-faint)", textTransform: "uppercase" }}>
                        {t.founded}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                        {selectedBrand.founded}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--al-faint)", textTransform: "uppercase" }}>
                        {t.country}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                        {selectedBrand.country}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--al-faint)", textTransform: "uppercase" }}>
                        {t.category}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                        {categoryLabel[selectedBrand.category]}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--al-faint)", textTransform: "uppercase" }}>
                        {t.price}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                        {priceLabel[selectedBrand.priceRange]}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 12, color: "var(--al-faint)", textTransform: "uppercase", margin: "0 0 8px" }}>
                      {t.specialties}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {(typeof selectedBrand.specialties === "string" ? [] : Array.isArray(selectedBrand.specialties) ? selectedBrand.specialties : selectedBrand.specialties[lang]).map((spec) => (
                        <li key={spec} style={{ fontSize: 14, lineHeight: 1.6 }}>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: 12, color: "var(--al-faint)", textTransform: "uppercase", margin: "0 0 8px" }}>
                      {t.commonIssues}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {(typeof selectedBrand.commonIssues === "string" ? [] : Array.isArray(selectedBrand.commonIssues) ? selectedBrand.commonIssues : selectedBrand.commonIssues[lang]).map((issue) => (
                        <li key={issue} style={{ fontSize: 14, lineHeight: 1.6 }}>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : search ? (
          <div style={{ gridColumn: "1 / span 12", textAlign: "center", padding: "40px 20px", color: "var(--al-faint)" }}>
            {t.noResults}
          </div>
        ) : null}
      </div>
    </section>
  );
}
