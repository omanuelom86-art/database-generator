import { useState } from 'react';
import {
  Database,
  Search,
  Download,
  Plus,
  Settings,
  Shield,
  Globe,
  Mail,
  Phone,
  Building2,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for initial UI verification
const MOCK_LEADS = [
  { id: 1, company: 'TechNova Solutions', industry: 'Software', email: 'contact@technova.com', phone: '+34 912 345 678', confidence: 98, status: 'verified' },
  { id: 2, company: 'GreenEdge Energy', industry: 'Renewables', email: 'sales@greenedge.es', phone: '+34 934 567 890', confidence: 92, status: 'verified' },
  { id: 3, company: 'SwiftLogistics', industry: 'Logistics', email: 'info@swiftlog.com', phone: '+34 956 789 123', confidence: 85, status: 'pending' },
];

const SUGGESTED_PLATFORMS = [
  { name: 'Google Maps', url: 'https://www.google.com/maps', icon: Globe },
  { name: 'Mercado Libre', url: 'https://www.mercadolibre.com', icon: Building2 },
  { name: 'Facebook', url: 'https://www.facebook.com', icon: Globe },
  { name: 'CR Autos', url: 'https://www.crautos.com', icon: Building2 },
];

function App() {
  const [activeMode, setActiveMode] = useState<'search' | 'direct'>('search');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [filters, setFilters] = useState({
    hasEmail: false,
    hasWhatsapp: false,
    allResults: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [leads, setLeads] = useState(MOCK_LEADS);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Future integration with n8n webhook
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const downloadCSV = () => {
    const headers = ['Company', 'Industry', 'Email', 'Phone', 'Confidence'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.company}"`,
        `"${lead.industry}"`,
        lead.email,
        `"${lead.phone}"`,
        lead.confidence
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeDuplicates = () => {
    const uniqueLeads = Array.from(new Map(leads.map(lead => [lead.email, lead])).values());
    setLeads(uniqueLeads);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Premium Header */}
      <header className="glass-header px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Database className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Generador de Base de Datos
            </h1>
            <p className="text-xs text-surface-500 font-medium tracking-wide flex items-center gap-1">
              <Shield className="w-3 h-3" /> PROTECCIÓN DE DATOS ACTIVA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="secondary-button !py-2 text-sm">
            <Globe className="w-4 h-4" /> Global API
          </button>
          <div className="w-10 h-10 rounded-full border border-surface-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-surface-400" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Search Configuration Panel */}
          <section className="lg:col-span-1 space-y-6">
            <div className="quantum-card p-2 flex gap-1 mb-0 rounded-2xl mx-8 bg-surface-100/50 border-none shadow-none">
              <button
                onClick={() => setActiveMode('search')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeMode === 'search' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'}`}
              >
                Búsqueda
              </button>
              <button
                onClick={() => setActiveMode('direct')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeMode === 'direct' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'}`}
              >
                Link Directo
              </button>
            </div>

            <div className="quantum-card p-8">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                {activeMode === 'search' ? (
                  <>
                    <Search className="w-5 h-5 text-primary-600" /> Configuración Pro
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5 text-primary-600" /> Scraping de URL
                  </>
                )}
              </h2>

              <div className="space-y-4">
                {activeMode === 'search' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">Categoría / Industria</label>
                      <input
                        type="text"
                        placeholder="Eje: Bienes Raíces, Repuestos..."
                        className="w-full px-5 py-3 rounded-2xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-2">Provincia</label>
                        <input
                          type="text"
                          placeholder="Eje: San José"
                          className="w-full px-4 py-3 rounded-2xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-2">Ubicación</label>
                        <input
                          type="text"
                          placeholder="+ Km"
                          className="w-full px-4 py-3 rounded-2xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Plataformas Sugeridas</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {SUGGESTED_PLATFORMS.map((plat) => (
                        <button
                          key={plat.name}
                          onClick={() => setTargetUrl(plat.url)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 ${targetUrl === plat.url ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-surface-600 border-surface-200 hover:border-primary-300'}`}
                        >
                          <plat.icon className="w-3 h-3" /> {plat.name}
                        </button>
                      ))}
                    </div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">URL del Sitio</label>
                    <input
                      type="url"
                      placeholder="https://www.ejemplo.com"
                      className="w-full px-5 py-3 rounded-2xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                    />
                  </div>
                )}

                <div className="py-4 space-y-3 border-t border-surface-100 mt-4">
                  <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest">Requisitos de Contacto</label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={filters.hasEmail}
                        onChange={(e) => setFilters({ ...filters, hasEmail: e.target.checked, allResults: false })}
                      />
                      <div className="w-10 h-6 bg-surface-200 rounded-full peer peer-checked:bg-primary-600 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                    </div>
                    <span className="text-sm font-medium text-surface-600 group-hover:text-surface-900 transition-colors">Debe tener Email</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={filters.hasWhatsapp}
                        onChange={(e) => setFilters({ ...filters, hasWhatsapp: e.target.checked, allResults: false })}
                      />
                      <div className="w-10 h-6 bg-surface-200 rounded-full peer peer-checked:bg-primary-600 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                    </div>
                    <span className="text-sm font-medium text-surface-600 group-hover:text-surface-900 transition-colors">Debe tener WhatsApp</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group pt-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                      checked={filters.allResults}
                      onChange={(e) => setFilters({ ...filters, allResults: e.target.checked, hasEmail: !e.target.checked && filters.hasEmail, hasWhatsapp: !e.target.checked && filters.hasWhatsapp })}
                    />
                    <span className="text-sm font-medium text-surface-600 group-hover:text-surface-900 transition-colors">Traer todos los clientes hallados</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || (activeMode === 'search' ? !query : !targetUrl)}
                    className="primary-button w-full justify-center disabled:opacity-50 disabled:grayscale"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generando Leads...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Iniciar Extracción
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-100">
                <div className="flex items-center justify-between text-sm text-surface-500 mb-1">
                  <span>Capacidad del Motor</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 w-3/4 rounded-full" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl shadow-primary-500/20">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5" /> Modo Auditoría
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                El motor de n8n está configurado para evitar el bloqueo de IPs mediante rotación de User-Agent y pausas inteligentes.
              </p>
            </div>
          </section>

          {/* Results Display Panel */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-surface-800">Bases Generadas</h2>
              <div className="flex gap-2">
                <button
                  onClick={removeDuplicates}
                  className="secondary-button text-xs !py-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Borrar Duplicados
                </button>
                <button
                  onClick={downloadCSV}
                  className="secondary-button text-xs !py-1.5 bg-primary-50 border-primary-100 text-primary-700"
                >
                  <Download className="w-3.5 h-3.5" /> Exportar CSV
                </button>
              </div>
            </div>

            <div className="quantum-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-100/50">
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Empresa</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Industria</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Contacto</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Filtro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    <AnimatePresence>
                      {leads.map((lead) => (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-primary-50/50 transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="font-bold text-surface-900 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-surface-400" />
                              {lead.company}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-surface-100 text-surface-600 text-xs font-bold rounded-full border border-surface-200 uppercase">
                              {lead.industry}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-surface-600 flex items-center gap-2">
                                <Mail className="w-3 h-3" /> {lead.email}
                              </div>
                              <div className="text-xs font-medium text-surface-400 flex items-center gap-2">
                                <Phone className="w-3 h-3" /> {lead.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold mb-1 ${lead.confidence > 90 ? 'text-primary-600' : 'text-surface-400'}`}>
                                {lead.confidence}% MATCH
                              </span>
                              {lead.status === 'verified' ? (
                                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-surface-300" />
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty state simulation */}
            {isGenerating && leads.length === 0 && (
              <div className="quantum-card p-20 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold">Rastreando la Web...</h3>
                <p className="text-surface-500 mt-2 max-w-xs mx-auto">
                  Estamos utilizando nodos de scraping autónomos para encontrar los mejores leads que coincidan con tus criterios.
                </p>
              </div>
            )}
          </section>
        </motion.div>
      </main>

      <footer className="mt-20 border-t border-surface-200 py-10 text-center">
        <p className="text-surface-400 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          POWERED BY JAZM.IO <ChevronRight className="w-3 h-3" /> N8N BACKEND
        </p>
      </footer>
    </div>
  );
}

export default App;
