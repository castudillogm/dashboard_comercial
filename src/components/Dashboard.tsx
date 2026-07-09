import React, { useState, useEffect, useMemo, useRef } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  Filter,
  Calendar,
  Users,
  Briefcase,
  RefreshCw,
  TrendingUp,
  Award,
  ChevronDown,
  Info,
  CheckCircle,
  XCircle,
  BarChart3,
  ListFilter,
  Check,
  Search,
  Share2,
  Printer
} from "lucide-react";
import Logo from "./Logo";
import { AttentionRecord, DashboardFilters } from "../types";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  allLabel: string;
  icon?: React.ReactNode;
  searchPlaceholder?: string;
  id?: string;
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  allLabel,
  icon,
  searchPlaceholder,
  id
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search when opening/closing
  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt =>
      opt.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleToggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    onChange([...options]);
  };

  const handleClear = () => {
    onChange([]);
  };

  const getButtonText = () => {
    if (selected.length === 0) {
      return allLabel;
    }
    if (selected.length === options.length) {
      return allLabel;
    }
    if (selected.length <= 2) {
      return selected.join(", ");
    }
    return `${selected.length} seleccionados`;
  };

  const isAllSelected = selected.length === 0 || selected.length === options.length;

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={dropdownRef}>
      <label className="text-[11px] font-bold uppercase tracking-wider text-[#091197] opacity-60 ml-2 flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          id={id}
          className={`w-full h-12 px-4 bg-white border-0 ring-1 ring-black/5 rounded-[8px] shadow-sm text-sm focus:ring-2 focus:ring-[#03A9EC] outline-none appearance-none cursor-pointer flex items-center justify-between text-gray-700 transition-all duration-200 hover:ring-black/10 ${
            !isAllSelected ? "font-semibold text-[#091197]" : ""
          }`}
        >
          <span className="truncate pr-4">{getButtonText()}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2.5 flex flex-col max-h-80 min-w-[260px] animate-fade-in">
            {searchPlaceholder && (
              <div className="px-3 pb-2 pt-0.5 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-9 pl-8 pr-3 text-xs bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03A9EC]/50 focus:bg-white transition-all text-gray-800"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-[#091197] border-b border-gray-50 shrink-0">
              <button
                type="button"
                onClick={handleSelectAll}
                className="hover:text-[#03A9EC] cursor-pointer transition-colors"
              >
                Seleccionar Todos
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
              >
                Limpiar
              </button>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-48 divide-y divide-gray-50 flex-1 scrollbar-thin">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400 text-center italic">
                  No se encontraron resultados
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isChecked = selected.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleToggleOption(option)}
                      className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-2.5 text-left text-xs text-gray-700 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 ${
                          isChecked
                            ? "bg-[#091197] border-[#091197]"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                        )}
                      </div>
                      <span className={`truncate ${isChecked ? "font-semibold text-[#091197]" : ""}`}>
                        {option}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<AttentionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Filter States initialized from URL query parameters if present
  const [filters, setFilters] = useState<DashboardFilters>(() => {
    if (typeof window === "undefined") {
      return { meses: [], delegaciones: [], comerciales: [], tiposAtencion: [] };
    }
    const params = new URLSearchParams(window.location.search);
    const m = params.get("meses");
    const d = params.get("delegaciones");
    const c = params.get("comerciales");
    const t = params.get("tipos");

    return {
      meses: m ? m.split(",").filter(Boolean) : [],
      delegaciones: d ? d.split(",").filter(Boolean) : [],
      comerciales: c ? c.split(",").filter(Boolean) : [],
      tiposAtencion: t ? t.split(",").filter(Boolean) : [],
    };
  });

  const [copied, setCopied] = useState<boolean>(false);

  // Synchronize filters to URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.meses.length > 0) params.set("meses", filters.meses.join(","));
    if (filters.delegaciones.length > 0) params.set("delegaciones", filters.delegaciones.join(","));
    if (filters.comerciales.length > 0) params.set("comerciales", filters.comerciales.join(","));
    if (filters.tiposAtencion.length > 0) params.set("tipos", filters.tiposAtencion.join(","));

    const newSearch = params.toString();
    const currentSearch = window.location.search.replace(/^\?/, "");
    if (newSearch !== currentSearch) {
      const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [filters]);

  // Helper for parsing dates in CSV
  const getSpanishMonth = (fechaStr: string): { mes: string; mesNum: number } => {
    if (!fechaStr) return { mes: "Desconocido", mesNum: 99 };
    const datePart = fechaStr.split(" ")[0];
    const parts = datePart.split("-");
    if (parts.length < 2) return { mes: "Desconocido", mesNum: 99 };
    const monthNum = parseInt(parts[1], 10);
    let mes = "Desconocido";
    switch (monthNum) {
      case 1: mes = "Enero"; break;
      case 2: mes = "Febrero"; break;
      case 3: mes = "Marzo"; break;
      case 4: mes = "Abril"; break;
      case 5: mes = "Mayo"; break;
      case 6: mes = "Junio"; break;
      case 7: mes = "Julio"; break;
      case 8: mes = "Agosto"; break;
      case 9: mes = "Septiembre"; break;
      case 10: mes = "Octubre"; break;
      case 11: mes = "Noviembre"; break;
      case 12: mes = "Diciembre"; break;
    }
    return { mes, mesNum: monthNum };
  };

  // Fetch data on component mount
  const loadData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1Z8RU_552YnOh7qC_56khVK_1wWHYtpFfCc3aVlsNKqE/export?format=csv&gid=0";
      // Add a timestamp cache buster if force refresh is requested to avoid browser cache
      const url = forceRefresh ? `${SPREADSHEET_URL}&cb=${Date.now()}` : SPREADSHEET_URL;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      const parseResult = Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parseResult.errors && parseResult.errors.length > 0) {
        console.warn("PapaParse encountered errors:", parseResult.errors.slice(0, 5));
      }

      const records: AttentionRecord[] = parseResult.data
        .filter(row => row.Comercial && row.Fecha)
        .map(row => {
          const { mes, mesNum } = getSpanishMonth(row.Fecha);
          return {
            comercial: (row.Comercial || "Sin Nombre").trim(),
            fecha: row.Fecha,
            mes,
            mesNum,
            delegacion: (row.GrupoNombre || row.Delegación || "Sin Cartera").trim(),
            tipoAtencion: (row.TipoAtencion || "General").trim(),
          };
        });

      setData(records);
      setLastUpdated(new Date().toISOString());
    } catch (err: any) {
      console.error("Error fetching attentions:", err);
      setError(err.message || "No se pudo establecer conexión con el origen de datos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. EXTRACT UNIQUE OPTIONS FOR THE FILTER BAR
  // Unique Months (sorted chronologically using mesNum)
  const uniqueMonths = useMemo(() => {
    const monthsMap = new Map<number, string>();
    data.forEach(item => {
      if (item.mes && item.mesNum && item.mes !== "Desconocido") {
        monthsMap.set(item.mesNum, item.mes);
      }
    });
    // Sort by key (month number)
    return Array.from(monthsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(entry => entry[1]);
  }, [data]);

  // Unique Delegations (GrupoNombre)
  const uniqueDelegations = useMemo(() => {
    const set = new Set<string>();
    data.forEach(item => {
      if (item.delegacion) set.add(item.delegacion);
    });
    return Array.from(set).sort();
  }, [data]);

  // Unique Comerciales *Filtered dynamically by currently selected Delegations* (Cascaded dropdown!)
  const uniqueComerciales = useMemo(() => {
    const set = new Set<string>();
    data.forEach(item => {
      if (filters.delegaciones.length === 0 || filters.delegaciones.includes(item.delegacion)) {
        if (item.comercial) set.add(item.comercial);
      }
    });
    return Array.from(set).sort();
  }, [data, filters.delegaciones]);

  // Unique tipos de atención (for the drop-down filter selection itself)
  const uniqueTiposAtencionFilter = useMemo(() => {
    const set = new Set<string>();
    data.forEach(item => {
      if (item.tipoAtencion) set.add(item.tipoAtencion);
    });
    return Array.from(set).sort();
  }, [data]);

  // 2. CASCADING FILTER SAFETY RESET
  // If some selected commercials are no longer valid for the selected delegations, remove them
  useEffect(() => {
    if (filters.comerciales.length > 0) {
      const validComerciales = filters.comerciales.filter(com => uniqueComerciales.includes(com));
      if (validComerciales.length !== filters.comerciales.length) {
        setFilters(prev => ({ ...prev, comerciales: validComerciales }));
      }
    }
  }, [filters.delegaciones, uniqueComerciales]);

  // 3. APPLY FILTERS TO DATASET
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchMes = filters.meses.length === 0 || filters.meses.includes(item.mes);
      const matchDelegacion = filters.delegaciones.length === 0 || filters.delegaciones.includes(item.delegacion);
      const matchComercial = filters.comerciales.length === 0 || filters.comerciales.includes(item.comercial);
      const matchTipoAtencion = filters.tiposAtencion.length === 0 || filters.tiposAtencion.includes(item.tipoAtencion);
      return matchMes && matchDelegacion && matchComercial && matchTipoAtencion;
    });
  }, [data, filters]);

  // 4. CALCULATE KPI METRICS
  const kpis = useMemo(() => {
    const totalAtenciones = filteredData.length;

    // Comerciales uniques represented in the *current filtered dataset*
    const currentComercialesSet = new Set<string>();
    const currentMonthsSet = new Set<string>();

    filteredData.forEach(item => {
      if (item.comercial) currentComercialesSet.add(item.comercial);
      if (item.mes) currentMonthsSet.add(item.mes);
    });

    const activeComercialesCount = currentComercialesSet.size || 1;
    
    // Number of months: 1 if exactly 1 month selected, or count of unique months in filtered dataset if multiple/all selected
    const numMonths = filters.meses.length === 1 ? 1 : (currentMonthsSet.size || 6);

    // Formula: (Total Atenciones / Nº de Comerciales únicos) / Nº de meses seleccionados
    const mediaPorComercial = (totalAtenciones / activeComercialesCount) / numMonths;

    return {
      totalAtenciones,
      activeComercialesCount,
      numMonths,
      mediaPorComercial
    };
  }, [filteredData, filters.meses]);

  // 5. COLOR PALETTE DEFINED BY MANUAL DE MARCA
  // Azul Oscuro (#091197), Azul Claro (#03A9EC), Naranja (#F75600)
  // Plus beautiful, professional corporate extensions
  const COLORS = ["#091197", "#03A9EC", "#F75600", "#1D26C4", "#38BDF8", "#F59E0B", "#475569"];

  // Unique types of attention in filtered dataset for dynamic charting series
  const uniqueTipoAtenciones = useMemo(() => {
    const set = new Set<string>();
    filteredData.forEach(item => {
      if (item.tipoAtencion) set.add(item.tipoAtencion);
    });
    return Array.from(set);
  }, [filteredData]);

  // 6. GENERATE CHART DATA
  const chartData = useMemo(() => {
    const isMultiMonthView = filters.meses.length !== 1;

    if (isMultiMonthView) {
      // BARCHART APILADO FOR MULTI-MONTH OR ALL-MONTHS VIEW
      const monthsMap = new Map<string, { name: string; mesNum: number; [key: string]: any }>();
      
      // Initialize months to ensure they always show up in chronological order, even if empty
      const order = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      
      // We only prepopulate months that exist in the raw dataset AND match the selected months
      const presentMonthNumbers: number[] = Array.from(new Set<number>(data.map(d => d.mesNum))).sort((a: number, b: number) => a - b);
      presentMonthNumbers.forEach((mNum: number) => {
        const mName = order[mNum - 1];
        if (mName && (filters.meses.length === 0 || filters.meses.includes(mName))) {
          monthsMap.set(mName, { name: mName, mesNum: mNum });
        }
      });

      // Aggregate filtered data
      filteredData.forEach(item => {
        if (!item.mes || item.mes === "Desconocido") return;
        const monthObj = monthsMap.get(item.mes);
        if (monthObj) {
          monthObj[item.tipoAtencion] = (monthObj[item.tipoAtencion] || 0) + 1;
        }
      });

      // Sort chronologically and return
      return Array.from(monthsMap.values())
        .sort((a, b) => a.mesNum - b.mesNum);
    } else {
      // BAR CHART: Group by Comercial for single-month view
      const agentsMap = new Map<string, { name: string; [key: string]: any; total: number }>();

      filteredData.forEach(item => {
        if (!item.comercial) return;
        let agentObj = agentsMap.get(item.comercial);
        if (!agentObj) {
          agentObj = { name: item.comercial, total: 0 };
          agentsMap.set(item.comercial, agentObj);
        }
        agentObj[item.tipoAtencion] = (agentObj[item.tipoAtencion] || 0) + 1;
        agentObj.total += 1;
      });

      // Convert to array and sort by total attentions descending (highly professional leaderboard format!)
      return Array.from(agentsMap.values())
        .sort((a, b) => b.total - a.total);
    }
  }, [filteredData, filters.meses, data]);

  // Helper to format large numbers to Spanish locale format (e.g. 11041 -> "11.041")
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(num);
  };

  const formatAverage = (num: number) => {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(num);
  };

  const handleCopyLink = () => {
    // Asegurar que el enlace copiado sea el de producción/compartido (ais-pre) y no el privado de desarrollo (ais-dev)
    const url = window.location.href.replace('ais-dev', 'ais-pre');
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("No se pudo copiar el enlace:", err);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetFilters = () => {
    setFilters({
      meses: [],
      delegaciones: [],
      comerciales: [],
      tiposAtencion: [],
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#091197] flex flex-col antialiased">
      {/* 1. CORPORATE HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm relative z-10">
        <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Logo size="md" />

          {/* Sync status and Refresh Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto print:hidden">
            <div className="hidden sm:flex flex-col text-right mr-2">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 leading-none mb-1">
                Última Sincronización
              </p>
              {lastUpdated ? (
                <p className="text-xs font-semibold text-gray-700">
                  {new Date(lastUpdated).toLocaleDateString("es-ES")} - {new Date(lastUpdated).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}
                </p>
              ) : (
                <p className="text-xs font-semibold text-gray-400">Conectando...</p>
              )}
            </div>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              type="button"
              title="Guardar PDF / Imprimir"
              className="h-10 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-[32px] ring-1 ring-black/5 hover:ring-black/10 shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-1.5 text-xs shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Share link Button */}
            <button
              onClick={handleCopyLink}
              type="button"
              title="Copiar enlace con filtros"
              className={`h-10 px-4 font-semibold rounded-[32px] shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
                copied
                  ? "bg-green-600 text-white shadow-green-600/10 hover:bg-green-700"
                  : "bg-white hover:bg-gray-50 text-gray-700 ring-1 ring-black/5 hover:ring-black/10"
              }`}
            >
              <Share2 className={`w-3.5 h-3.5 ${copied ? "text-white animate-pulse" : "text-gray-400"}`} />
              <span>{copied ? "¡Copiado!" : "Compartir"}</span>
            </button>

            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              id="refresh-btn"
              className="h-10 px-5 bg-[#F75600] text-white font-bold rounded-[32px] shadow-lg shadow-[#F75600]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2 disabled:opacity-50 text-xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Sincronizando..." : "Sincronizar"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-xs animate-fade-in">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-red-900">Error de Conexión</h3>
              <p className="text-xs text-red-800 mt-1">{error}</p>
              <button
                onClick={() => loadData(false)}
                className="mt-2 text-xs font-bold text-red-900 underline hover:text-red-950 flex items-center gap-1"
              >
                Reintentar conexión
              </button>
            </div>
          </div>
        )}

        {/* 2. FILTER BAR: FILTERS (NAV) */}
        <nav className="bg-white p-6 rounded-[32px] shadow-sm border border-white flex flex-col xl:flex-row items-end gap-4 w-full relative z-30 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
            {/* Filter 1: Mes */}
            <MultiSelectDropdown
              label="Mes de Atención"
              options={uniqueMonths}
              selected={filters.meses}
              onChange={(selectedMonths) => setFilters(prev => ({ ...prev, meses: selectedMonths }))}
              allLabel="Semestre Completo"
              icon={<Calendar className="w-3.5 h-3.5 text-[#03A9EC]" />}
              id="filter-mes"
            />

            {/* Filter 2: Delegación */}
            <MultiSelectDropdown
              label="Delegación / Cartera"
              options={uniqueDelegations}
              selected={filters.delegaciones}
              onChange={(selectedDelegations) => setFilters(prev => ({ ...prev, delegaciones: selectedDelegations }))}
              allLabel="Todas las Carteras"
              icon={<Briefcase className="w-3.5 h-3.5 text-[#03A9EC]" />}
              searchPlaceholder="Buscar delegación..."
              id="filter-delegacion"
            />

            {/* Filter 3: Agente Comercial */}
            <MultiSelectDropdown
              label="Agente Comercial"
              options={uniqueComerciales}
              selected={filters.comerciales}
              onChange={(selectedComerciales) => setFilters(prev => ({ ...prev, comerciales: selectedComerciales }))}
              allLabel="Todo el Equipo"
              icon={<Users className="w-3.5 h-3.5 text-[#03A9EC]" />}
              searchPlaceholder="Buscar comercial..."
              id="filter-comercial"
            />

            {/* Filter 4: Tipo de Atención */}
            <MultiSelectDropdown
              label="Tipo de Atención"
              options={uniqueTiposAtencionFilter}
              selected={filters.tiposAtencion}
              onChange={(selectedTipos) => setFilters(prev => ({ ...prev, tiposAtencion: selectedTipos }))}
              allLabel="Todas las Categorías"
              icon={<Filter className="w-3.5 h-3.5 text-[#03A9EC]" />}
              id="filter-tipo"
            />
          </div>

          {/* Quick reset inside filter bar */}
          {(filters.meses.length > 0 ||
            filters.delegaciones.length > 0 ||
            filters.comerciales.length > 0 ||
            filters.tiposAtencion.length > 0) && (
            <div className="h-12 flex items-center justify-end w-full xl:w-auto shrink-0">
              <button
                onClick={handleResetFilters}
                id="reset-filters-btn"
                className="h-12 px-6 bg-gray-100 hover:bg-gray-200 text-[#091197] font-bold rounded-[32px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <XCircle className="w-4 h-4 text-[#F75600]" />
                <span>Limpiar Filtros</span>
              </button>
            </div>
          )}
        </nav>

        {/* 3. KPIS (TARJETAS NUMÉRICAS) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          {/* KPI Card 1: Total Atenciones */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-white flex justify-between items-center group hover:scale-[1.01] transition-transform duration-300">
            <div>
              <p className="text-sm font-bold opacity-60 mb-1 text-gray-500">Total Atenciones Registradas</p>
              {loading ? (
                <div className="h-12 w-28 bg-gray-100 rounded-md animate-pulse my-1" />
              ) : (
                <h2 className="text-5xl font-black text-[#091197]">
                  {formatNumber(kpis.totalAtenciones)}
                </h2>
              )}
            </div>
            <div className="w-14 h-14 bg-[#03A9EC]/10 rounded-[16px] flex items-center justify-center text-[#03A9EC] shrink-0">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          {/* KPI Card 2: Media por Comercial */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-white flex justify-between items-center group hover:scale-[1.01] transition-transform duration-300">
            <div>
              <div className="text-sm font-bold opacity-60 mb-1 text-gray-500 flex items-center gap-1.5">
                Media por Comercial
                <div className="group/info relative inline-block cursor-help">
                  <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  <div className="invisible group-hover/info:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-[10px] font-normal leading-relaxed p-3 rounded-lg shadow-xl z-50">
                    Fórmula: (Atenciones / Comerciales activos) / Meses activos.
                    <div className="font-bold mt-1 text-[#03A9EC]">
                      ({formatNumber(kpis.totalAtenciones)} atenciones / {kpis.activeComercialesCount} comerciales) / {kpis.numMonths} mes(es)
                    </div>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="h-12 w-28 bg-gray-100 rounded-md animate-pulse my-1" />
              ) : (
                <h2 className="text-5xl font-black text-[#091197]">
                  {formatAverage(kpis.mediaPorComercial)}
                </h2>
              )}
            </div>
            <div className="w-14 h-14 bg-[#F75600]/10 rounded-[16px] flex items-center justify-center text-[#F75600] shrink-0">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* 4. MAIN VISUALIZATION CARD */}
        <section className="bg-white rounded-[32px] shadow-sm p-8 flex flex-col border border-white w-full">
          {/* Visualization Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-black text-[#091197] tracking-tight">
              {filters.meses.length !== 1
                ? `Evolución de Atenciones Comercial - Semestre I (${filters.delegaciones.length > 0 ? (filters.delegaciones.length <= 2 ? filters.delegaciones.join(", ") : `${filters.delegaciones.length} Carteras`) : "Todas las Carteras"})`
                : `Atenciones en ${filters.meses[0]} por Comercial (${filters.delegaciones.length > 0 ? (filters.delegaciones.length <= 2 ? filters.delegaciones.join(", ") : `${filters.delegaciones.length} Carteras`) : "Todas las Carteras"})`}
            </h3>

            {/* Custom high-contrast Legend Markers built to match style exactly */}
            <div className="flex flex-wrap gap-4">
              {uniqueTipoAtenciones.slice(0, 3).map((type, idx) => (
                <div key={type} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-xs font-bold text-gray-600">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LOADING & EMPTY STATES */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-10 h-10 text-[#03A9EC] animate-spin" />
              <p className="text-sm font-semibold text-gray-400">Analizando registros y preparando gráficos corporativos...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                <ListFilter className="w-12 h-12" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-700">Sin Datos para este Filtro</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                  Ninguna atención comercial coincide con la combinación de filtros seleccionada en este momento.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-[#091197] hover:bg-blue-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-all duration-200"
                >
                  Restablecer Filtros
                </button>
              </div>
            </div>
          ) : (
            /* RENDERING REAL RECHARTS VISUALS */
            <div className="w-full flex flex-col gap-6">
              <div className="w-full h-[400px] sm:h-[500px]">
                {filters.meses.length !== 1 ? (
                  /* BARCHART APILADO FOR SEMESTER VIEW */
                  <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="'Basier Square', sans-serif"
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="'Basier Square', sans-serif"
                        tickLine={false}
                        axisLine={false}
                        dx={-5}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          fontFamily: "'Basier Square', sans-serif"
                        }}
                        labelClassName="font-extrabold text-[#091197] border-b border-gray-100 pb-1 mb-1.5"
                      />
                      {uniqueTipoAtenciones.map((type, idx) => (
                        <Bar
                          key={type}
                          dataKey={type}
                          fill={COLORS[idx % COLORS.length]}
                          radius={[4, 4, 0, 0]}
                          name={type}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                ) : (
                  /* STACKED BAR CHART FOR MONTH SPECIFIC VIEW */
                  <div className="w-full h-full overflow-x-auto select-none scrollbar-thin">
                    {/* Make the chart responsive but wide enough if there are many Comerciales */}
                    <div style={{ minWidth: chartData.length > 10 ? `${chartData.length * 60}px` : "100%", height: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis
                            dataKey="name"
                            stroke="#9CA3AF"
                            fontSize={10}
                            fontFamily="'Basier Square', sans-serif"
                            tickLine={false}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                          />
                          <YAxis
                            stroke="#9CA3AF"
                            fontSize={11}
                            fontFamily="'Basier Square', sans-serif"
                            tickLine={false}
                            axisLine={false}
                            dx={-5}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#FFFFFF",
                              border: "1px solid #E5E7EB",
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                              fontFamily: "'Basier Square', sans-serif"
                            }}
                            labelClassName="font-extrabold text-[#091197] border-b border-gray-100 pb-1 mb-1.5"
                          />
                          {uniqueTipoAtenciones.map((type, idx) => (
                            <Bar
                              key={type}
                              dataKey={type}
                              fill={COLORS[idx % COLORS.length]}
                              name={type}
                              radius={[4, 4, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Summary & Notes Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400 font-medium">
                <span>
                  Visualizando <strong>{formatNumber(filteredData.length)}</strong> registros de atenciones comerciales de GrupaMar.
                </span>
                <span className="flex items-center gap-1.5 text-[#03A9EC] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Múltiplos de redondeo de 4px y tipografía Basier Square aplicados.
                </span>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* BRANDING FOOTER */}
      <footer className="px-8 py-4 flex flex-col sm:flex-row justify-between items-center bg-white border-t border-gray-100 mt-6">
        <p className="text-[10px] font-bold opacity-30 text-slate-600 tracking-widest uppercase">
          GRUPOAMAR CORPORATE SYSTEM &copy; 2026
        </p>
        <div className="flex gap-6 mt-2 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500">API Sheets Conectado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span className="text-[10px] font-bold text-slate-500">v2.4.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
