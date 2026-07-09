import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Papa from "papaparse";

const app = express();
const PORT = 3000;

interface AttentionRecord {
  comercial: string;
  fecha: string;
  mes: string;
  mesNum: number;
  delegacion: string;
  tipoAtencion: string;
}

// In-memory cache for the parsed data
let cachedData: AttentionRecord[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1Z8RU_552YnOh7qC_56khVK_1wWHYtpFfCc3aVlsNKqE/export?format=csv&gid=0";

function getSpanishMonth(fechaStr: string): { mes: string; mesNum: number } {
  if (!fechaStr) return { mes: "Desconocido", mesNum: 99 };
  
  // Format is typically "YYYY-MM-DD HH:mm:ss"
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
}

async function fetchAndParseData(forceRefresh = false): Promise<AttentionRecord[]> {
  const now = Date.now();
  if (cachedData && !forceRefresh && (now - lastFetchTime < CACHE_DURATION)) {
    console.log("[SERVER] Returning cached data. Cache age:", Math.round((now - lastFetchTime) / 1000), "seconds");
    return cachedData;
  }

  console.log("[SERVER] Fetching fresh data from Google Sheets...");
  const response = await fetch(SPREADSHEET_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  console.log("[SERVER] CSV downloaded, parsing with PapaParse... Size:", csvText.length, "bytes");

  const parseResult = Papa.parse<any>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parseResult.errors && parseResult.errors.length > 0) {
    console.warn("[SERVER] PapaParse encountered some errors:", parseResult.errors.slice(0, 5));
  }

  const records: AttentionRecord[] = parseResult.data
    .filter(row => row.Comercial && row.Fecha) // Ensure vital fields are present
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

  console.log("[SERVER] Parsed successfully. Total clean records:", records.length);

  cachedData = records;
  lastFetchTime = now;
  return records;
}

// Pre-fetch on startup to warm up the cache
fetchAndParseData().catch(err => {
  console.error("[SERVER] Failed to warm cache on boot:", err.message);
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", cached: cachedData !== null, cacheAgeSeconds: cachedData ? Math.round((Date.now() - lastFetchTime) / 1000) : null });
});

app.get("/api/attentions", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  try {
    const data = await fetchAndParseData(forceRefresh);
    res.json({
      success: true,
      count: data.length,
      lastUpdated: new Date(lastFetchTime).toISOString(),
      data
    });
  } catch (error: any) {
    console.error("[SERVER] Error getting attentions data:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error loading spreadsheet data."
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();
