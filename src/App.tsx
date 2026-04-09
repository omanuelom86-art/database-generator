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

const MOCK_LEADS = [
  { id: 1, company: 'TechNova Solutions', industry: 'Software', email: 'contact@technova.cr', phone: '+506 2222 3456', address: 'Paseo Colón, San José', socials: 'FB, LI', confidence: 98, status: 'verified' },
  { id: 2, company: 'GreenEdge CR', industry: 'Renewables', email: 'ventas@greenedge.cr', phone: '+506 8888 7777', address: 'Santa Ana, San José', socials: 'IG, FB', confidence: 92, status: 'verified' },
];

const COSTA_RICA_PROVINCES = [
  'San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'
];

const SUGGESTED_PLATFORMS = [
  { name: 'Google Maps', url: 'https://www.google.com/maps', icon: Globe },
  { name: 'Mercado Libre', url: 'https://www.mercadolibre.com.cr', icon: Building2 },
  { name: 'Facebook', url: 'https://www.facebook.com', icon: Globe },
  { name: 'CR Autos', url: 'https://www.crautos.com', icon: Building2 },
];

const PROFESSIONAL_COLLEGES = [
  { name: 'Colegio de Abogados', url: 'https://www.abogados.or.cr' },
  { name: 'Colegio de Médicos', url: 'https://www.medicos.cr' },
  { name: 'CFIA (Ingenieros)', url: 'https://www.cfia.or.cr' },
  { name: 'C. Económicas', url: 'https://cpcecr.com' },
];

function App() {
  const [activeMode, setActiveMode] = useState<'search' | 'direct'>('search');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('San José');
  const [targetUrl, setTargetUrl] = useState('');
  const [showLegalWarning, setShowLegalWarning] = useState(false);
  const [filters, setFilters] = useState({
    hasEmail: false,
    hasWhatsapp: false,
    allResults: true,
    deepSearch: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [stats, setStats] = useState({ total: 2, withEmail: 2, withPhone: 2 });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newLead = {
        id: Date.now(),
        company: query || (targetUrl ? new URL(targetUrl).hostname : 'Empresa CR'),
        industry: query || 'Servicios',
        email: Math.random() > 0.3 ? `contacto@${(query || 'leads').toLowerCase().replace(/\s/g, '')}.com` : '',
        phone: Math.random() > 0.4 ? `+506 ${Math.floor(Math.random() * 80000000) + 10000000}` : '',
        address: `${province}, Costa Rica`,
        socials: 'FB, IG',
        confidence: Math.floor(Math.random() * 20) + 75,
        status: 'pending'
      };
      const updatedLeads = [newLead, ...leads];
      setLeads(updatedLeads);
      setStats({
        total: updatedLeads.length,
        withEmail: updatedLeads.filter(l => l.email).length,
        withPhone: updatedLeads.filter(l => l.phone).length
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleEnrich = (id?: number) => {
    const enrichLead = (lead: any) => {
      if (!lead.email || !lead.phone || !lead.address) {
        return {
          ...lead,
          email: lead.email || `encontrado@${lead.company.toLowerCase().replace(/\s/g, '')}.cr`,
          phone: lead.phone || `+506 ${Math.floor(Math.random() * 80000000) + 20000000}`,
          address: lead.address || `Central, ${province}`,
          socials: lead.socials || 'FB, IG, LI',
          status: 'verified',
          confidence: 99
        };
      }
      return lead;
    };

    const newLeads = id ? leads.map(l => l.id === id ? enrichLead(l) : l) : leads.map(enrichLead);
    setLeads(newLeads);
    setStats({
      total: newLeads.length,
      withEmail: newLeads.filter(l => l.email).length,
      withPhone: newLeads.filter(l => l.phone).length
    });
  };

  const downloadCSV = () => {
    const headers = ['#', 'Empresa', 'Industria', 'Email', 'Telefono', 'Direccion', 'Sociales', 'Match'];
    const csvContent = [
      headers.join(','),
      ...leads.map((lead, index) => [
        index + 1,
        `"${lead.company}"`,
        `"${lead.industry}"`,
        lead.email,
        `"${lead.phone}"`,
        `"${lead.address}"`,
        `"${lead.socials}"`,
        lead.confidence
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `base_datos_cr_${new Date().toISOString().split('T')[0]}.csv`);
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
      {/* Legal Overlay Modal */}
      <AnimatePresence>
        {showLegalWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[32px] p-10 max-w-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-surface-900 mb-4">Aviso de Cumplimiento Legal</h3>
              <div className="text-surface-600 text-sm leading-relaxed space-y-4 mb-8 text-left">
                <p>
                  Estás a punto de extraer datos de <span className="font-bold text-surface-900">Colegios Profesionales de Costa Rica</span>.
                  Según la <span className="font-bold">Ley No. 8968 (Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales)</span>:
                </p>
                <div className="pl-4 border-l-2 border-primary-100 italic">
                  "El uso de bases de datos de acceso público para fines distintos a la verificación profesional o informativa, como el envío masivo de publicidad no solicitada (Spam), puede ser sancionado por la PRODHAB."
                </div>
                <p>
                  Al continuar, confirmas que utilizarás esta información bajo los principios de <span className="font-bold text-green-600">Consentimiento y Finalidad</span>, respetando los derechos de los titulares.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLegalWarning(false)}
                  className="secondary-button flex-1 justify-center"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowLegalWarning(false);
                    handleGenerate();
                  }}
                  className="primary-button flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 shadow-red-500/20"
                >
                  Entiendo y Acepto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                        <select
                          className="w-full px-4 py-3 rounded-2xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm appearance-none cursor-pointer"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                        >
                          {COSTA_RICA_PROVINCES.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
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

                    <div className="pt-2">
                      <label className="block text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Colegios Profesionales</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PROFESSIONAL_COLLEGES.map(college => (
                          <button
                            key={college.name}
                            onClick={() => {
                              setQuery(college.name);
                              setTargetUrl(college.url);
                              setActiveMode('search');
                            }}
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all truncate text-left flex items-center gap-1.5 ${query === college.name ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-surface-100 text-surface-500 hover:border-surface-200'}`}
                          >
                            <Shield className="w-3 h-3 text-primary-400" /> {college.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Plataformas Sugeridas</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {SUGGESTED_PLATFORMS.map((plat) => {
                        const Icon = plat.icon;
                        return (
                          <button
                            key={plat.name}
                            onClick={() => setTargetUrl(plat.url)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 ${targetUrl === plat.url ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-surface-600 border-surface-200 hover:border-primary-300'}`}
                          >
                            <Icon className="w-3 h-3" /> {plat.name}
                          </button>
                        );
                      })}
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
                    <span className="text-sm font-medium text-surface-600 group-hover:text-surface-900 transition-colors">Traer todos los hallados</span>
                  </label>

                  <div className="pt-4 border-t border-surface-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={filters.deepSearch}
                          onChange={(e) => setFilters({ ...filters, deepSearch: e.target.checked })}
                        />
                        <div className="w-10 h-6 bg-primary-100 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-surface-700 block transition-colors">Búsqueda Profunda</span>
                        <span className="text-[10px] text-surface-400">Busca en todas las redes sociales</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (query.toLowerCase().includes('colegio')) {
                        setShowLegalWarning(true);
                      } else {
                        handleGenerate();
                      }
                    }}
                    disabled={isGenerating || (activeMode === 'search' ? !query : !targetUrl)}
                    className="primary-button w-full justify-center disabled:opacity-50 disabled:grayscale"
                    title="Iniciar proceso de extracción"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Extrayendo...
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

              {/* Progress Counters */}
              <div className="mt-8 grid grid-cols-3 gap-2 py-4 border-y border-surface-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-surface-800">{stats.total}</div>
                  <div className="text-[10px] text-surface-400 font-bold uppercase">Hallados</div>
                </div>
                <div className="text-center border-x border-surface-100">
                  <div className="text-lg font-bold text-primary-600">{stats.withEmail}</div>
                  <div className="text-[10px] text-surface-400 font-bold uppercase">Con Email</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{stats.withPhone}</div>
                  <div className="text-[10px] text-surface-400 font-bold uppercase">Con Tel</div>
                </div>
              </div>

              <div className="mt-6">
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
                El motor de n8n está configurado para evitar bloqueos mediante rotación de identidades y pausas inteligentes.
              </p>
            </div>
          </section>

          {/* Results Display Panel */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-surface-800">Bases de Datos CR</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEnrich()}
                  className="secondary-button text-xs !py-1.5 bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100"
                  title="Buscar datos faltantes en redes sociales"
                >
                  <Globe className="w-3.5 h-3.5" /> Enriquecer Base
                </button>
                <button
                  onClick={removeDuplicates}
                  className="secondary-button text-xs !py-1.5"
                  title="Eliminar leads duplicados"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Borrar Duplicados
                </button>
                <button
                  onClick={downloadCSV}
                  className="secondary-button text-xs !py-1.5 bg-primary-50 border-primary-100 text-primary-700"
                  title="Descargar base en formato CSV"
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
                      <th className="px-4 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">#</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Empresa / Cliente</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Industria</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Contacto</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider">Detalles Extras</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Precisión</th>
                      <th className="px-6 py-4 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    <AnimatePresence>
                      {leads.map((lead, index) => (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-primary-50/50 transition-colors group"
                        >
                          <td className="px-4 py-5 text-center font-bold text-surface-400 text-xs">
                            {index + 1}
                          </td>
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
                                <Mail className={`w-3 h-3 ${!lead.email && 'text-red-400'}`} />
                                {lead.email || <span className="text-red-400 italic">Falta email</span>}
                              </div>
                              <div className="text-xs font-medium text-surface-400 flex items-center gap-2">
                                <Phone className={`w-3 h-3 ${!lead.phone && 'text-red-400'}`} />
                                {lead.phone || <span className="text-red-400 italic">Falta teléfono</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-[10px] space-y-1">
                              <div className="text-surface-600 flex items-center gap-1.5 font-medium">
                                <Globe className="w-2.5 h-2.5" /> {lead.address}
                              </div>
                              <div className="text-primary-600/70 flex items-center gap-1.5 font-bold uppercase tracking-tighter">
                                <Plus className="w-2.5 h-2.5" /> {lead.socials}
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
                          <td className="px-6 py-5 text-center">
                            {(!lead.email || !lead.phone || !lead.address) && (
                              <button
                                onClick={() => handleEnrich(lead.id)}
                                className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-all"
                                title="Completar datos faltantes"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty state or loading feedback */}
            {isGenerating && leads.length === 0 && (
              <div className="quantum-card p-20 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold">Rastreando en Costa Rica...</h3>
                <p className="text-surface-500 mt-2 max-w-xs mx-auto">
                  Utilizando el buscador profundo para identificar leads en {province} y completar sus datos de contacto.
                </p>
              </div>
            )}
          </section>
        </motion.div>
      </main>

      <footer className="mt-20 border-t border-surface-200 py-10 text-center">
        <p className="text-surface-400 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          SISTEMA PROFESIONAL JAZM.IO <ChevronRight className="w-3 h-3" /> N8N AGENTIC ENGINE
        </p>
      </footer>
    </div>
  );
}

export default App;
