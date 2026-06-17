/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckSquare, 
  Square, 
  Calendar, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Award, 
  SlidersHorizontal,
  FolderSync,
  X,
  CreditCard,
  Car,
  TrendingUp,
  Briefcase,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

// Client Model
interface Client {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  contractNumber: string;
  enrollmentMonth: string; // e.g. "Enero", "Febrero"
  enrollmentYear: string;
  planType: string; // e.g. "100%", "80/20", "70/30"
  vwModel: string; // e.g. "Polo Track", "Taos", "T-Cross", "Amarok", "Nivus"
  isGrouped: boolean; // checklist for formal grouping
  groupNumber?: string;
  orderNumber?: string;
  groupDate?: string; 
  
  // Follow-up reminders for installment 2 & 3 (Cuotas 2 y 3)
  installment2Status: 'Pendiente' | 'Recordado' | 'Cobrado' | 'No Corresponde';
  installment2Notes: string;
  installment2DueDate?: string;
  
  installment3Status: 'Pendiente' | 'Recordado' | 'Cobrado' | 'No Corresponde';
  installment3Notes: string;
  installment3DueDate?: string;

  generalNotes: string;
  createdAt: string;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const VW_MODELS = [
  'Polo', 'Tera Trend', 'Nivus Sense', 'Nivus 170TSI', 'T-cross Sense', 'T-Cross 170tsi', 'Taos Comfortline', 'Virtus Sense', 'Virtus', 'Amarok'
];

const PLAN_TYPES = [
  '100%', '90/10', '80/20', '70/30', '60/40'
];

const SEED_CLIENTS: Client[] = [
  {
    id: '1',
    fullName: 'Agustín Marcelo Gómez',
    phone: '+54 9 11 5489-3210',
    email: 'agustin.gomez@gmail.com',
    contractNumber: 'VW-98441-A',
    enrollmentMonth: 'Marzo',
    enrollmentYear: '2026',
    planType: '100%',
    vwModel: 'Polo',
    isGrouped: true,
    groupNumber: '4892',
    orderNumber: '085',
    groupDate: '2026-04-10',
    installment2Status: 'Cobrado',
    installment2Notes: 'Pagó por débito automático sin problemas el dador de cuenta.',
    installment2DueDate: '2026-05-15',
    installment3Status: 'Recordado',
    installment3Notes: 'Llamar antes del vencimiento el día 10. Recordó vencimiento por WhatsApp.',
    installment3DueDate: '2026-06-15',
    generalNotes: 'Cliente muy interesado en retirar rápido por licitación en cuota 5.',
    createdAt: '2026-03-05'
  },
  {
    id: '2',
    fullName: 'María Sol de la Vega',
    phone: '+54 9 341 689-5512',
    email: 'sol.delavega@hotmail.com',
    contractNumber: 'VW-99214-X',
    enrollmentMonth: 'Abril',
    enrollmentYear: '2026',
    planType: '80/20',
    vwModel: 'T-cross Sense',
    isGrouped: true,
    groupNumber: '5012',
    orderNumber: '114',
    groupDate: '2026-05-15',
    installment2Status: 'Cobrado',
    installment2Notes: 'Aceptó el cobro digital y ya coordinamos entrega de cuota 2.',
    installment2DueDate: '2026-06-10',
    installment3Status: 'Cobrado',
    installment3Notes: 'Canceló de forma anticipada. Todo excelente.',
    installment3DueDate: '2026-07-10',
    generalNotes: 'Fidelizada. Prima de un cliente antiguo de la sucursal.',
    createdAt: '2026-04-12'
  },
  {
    id: '3',
    fullName: 'Roberto Fabián Peralta',
    phone: '+54 9 261 411-9023',
    email: 'rober.peralta@yahoo.com.ar',
    contractNumber: 'VW-10024-C',
    enrollmentMonth: 'Mayo',
    enrollmentYear: '2026',
    planType: '100%',
    vwModel: 'Nivus Sense',
    isGrouped: false,
    installment2Status: 'Pendiente',
    installment2Notes: 'Falta agrupar formalmente para activar los recordatorios de cuota 2 de forma estricta.',
    installment3Status: 'Pendiente',
    installment3Notes: '',
    generalNotes: 'Espera agrupar este mes. Muy atento a la llamada de confirmación de VW.',
    createdAt: '2026-05-10'
  },
  {
    id: '4',
    fullName: 'Clara Estela Domínguez',
    phone: '+54 9 11 3290-7844',
    email: 'clara.dominguez@gmail.com',
    contractNumber: 'VW-10255-D',
    enrollmentMonth: 'Mayo',
    enrollmentYear: '2026',
    planType: '70/30',
    vwModel: 'Taos Comfortline',
    isGrouped: true,
    groupNumber: '5012',
    orderNumber: '023',
    groupDate: '2026-06-02',
    installment2Status: 'Recordado',
    installment2Notes: 'Enviado recordatorio el lunes. Respondió que pagará el jueves por PagoFácil.',
    installment2DueDate: '2026-07-10',
    installment3Status: 'Pendiente',
    installment3Notes: 'Esperar confirmación de acreditación cuota 2 antes de disparar cuota 3.',
    installment3DueDate: '2026-08-10',
    generalNotes: 'Entregará usado como parte de pago para integrar el 30% restante en cuota 4.',
    createdAt: '2026-05-18'
  },
  {
    id: '5',
    fullName: 'Juan Ignacio Bruno',
    phone: '+54 9 351 777-1290',
    email: 'juani.bruno@gmail.com',
    contractNumber: 'VW-10312-E',
    enrollmentMonth: 'Junio',
    enrollmentYear: '2026',
    planType: '100%',
    vwModel: 'Amarok',
    isGrouped: false,
    installment2Status: 'Pendiente',
    installment2Notes: '',
    installment3Status: 'Pendiente',
    installment3Notes: '',
    generalNotes: 'Inscripción muy reciente. Esperando proceso de validación de firma digital por terminal.',
    createdAt: '2026-06-03'
  }
];

export default function App() {
  // Persistence state
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('Todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Todos'); // 'Todos', 'Incompletos', 'Agrupados', 'Falta Agrupar', 'Pendientes Cuota 2/3'
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Create / Edit Form State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contractNumber, setContractNumber] = useState<string>('');
  const [enrollmentMonth, setEnrollmentMonth] = useState<string>('Junio');
  const [enrollmentYear, setEnrollmentYear] = useState<string>('2026');
  const [planType, setPlanType] = useState<string>('100%');
  const [vwModel, setVwModel] = useState<string>('Polo');
  const [isGrouped, setIsGrouped] = useState<boolean>(false);
  const [groupNumber, setGroupNumber] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [groupDate, setGroupDate] = useState<string>('');
  
  const [installment2Status, setInstallment2Status] = useState<Client['installment2Status']>('Pendiente');
  const [installment2Notes, setInstallment2Notes] = useState<string>('');
  const [installment2DueDate, setInstallment2DueDate] = useState<string>('');
  
  const [installment3Status, setInstallment3Status] = useState<Client['installment3Status']>('Pendiente');
  const [installment3Notes, setInstallment3Notes] = useState<string>('');
  const [installment3DueDate, setInstallment3DueDate] = useState<string>('');
  
  const [generalNotes, setGeneralNotes] = useState<string>('');

  // Report Modal state
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [quoteOfReport, setQuoteOfReport] = useState<string>('La excelencia y el seguimiento es el puente hacia la entrega de la unidad.');
  const [reportTitle, setReportTitle] = useState<string>('Reporte de Clientes Fidelizados');

  // Load clients
  useEffect(() => {
    const saved = localStorage.getItem('vw_autoplan_clients');
    if (saved) {
      try {
        setClients(JSON.parse(saved));
      } catch (e) {
        setClients(SEED_CLIENTS);
      }
    } else {
      setClients(SEED_CLIENTS);
      localStorage.setItem('vw_autoplan_clients', JSON.stringify(SEED_CLIENTS));
    }
  }, []);

  // Save clients helper
  const saveToLocalStorage = (updated: Client[]) => {
    setClients(updated);
    localStorage.setItem('vw_autoplan_clients', JSON.stringify(updated));
  };

  // Switch form back or prepare brand new client
  const resetForm = () => {
    setIsEditing(false);
    setSelectedClientId(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setContractNumber('');
    setEnrollmentMonth('Junio');
    setEnrollmentYear('2026');
    setPlanType('100%');
    setVwModel('Polo');
    setIsGrouped(false);
    setGroupNumber('');
    setOrderNumber('');
    setGroupDate('');
    setInstallment2Status('Pendiente');
    setInstallment2Notes('');
    setInstallment2DueDate('');
    setInstallment3Status('Pendiente');
    setInstallment3Notes('');
    setInstallment3DueDate('');
    setGeneralNotes('');
  };

  // Populate form for editing
  const handleEditClick = (client: Client) => {
    setIsEditing(true);
    setSelectedClientId(client.id);
    setFullName(client.fullName);
    setPhone(client.phone);
    setEmail(client.email);
    setContractNumber(client.contractNumber);
    setEnrollmentMonth(client.enrollmentMonth);
    setEnrollmentYear(client.enrollmentYear || '2026');
    setPlanType(client.planType);
    setVwModel(client.vwModel);
    setIsGrouped(client.isGrouped);
    setGroupNumber(client.groupNumber || '');
    setOrderNumber(client.orderNumber || '');
    setGroupDate(client.groupDate || '');
    setInstallment2Status(client.installment2Status);
    setInstallment2Notes(client.installment2Notes || '');
    setInstallment2DueDate(client.installment2DueDate || '');
    setInstallment3Status(client.installment3Status);
    setInstallment3Notes(client.installment3Notes || '');
    setInstallment3DueDate(client.installment3DueDate || '');
    setGeneralNotes(client.generalNotes || '');
    
    // Scroll smoothly to form
    const element = document.getElementById('client-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle formal grouping directly from the card
  const toggleGroupedDirectly = (client: Client) => {
    const nextGrouped = !client.isGrouped;
    const updated = clients.map(c => {
      if (c.id === client.id) {
        return {
          ...c,
          isGrouped: nextGrouped,
          // Set template alerts/notes for Cuota 2 and 3 if just grouped
          installment2Status: nextGrouped ? ('Pendiente' as const) : c.installment2Status,
          generalNotes: nextGrouped 
            ? `${c.generalNotes}\n[Hito: Agrupado formalmente el ${new Date().toLocaleDateString('es-AR')}]` 
            : c.generalNotes
        };
      }
      return c;
    });
    saveToLocalStorage(updated);
  };

  // Handle Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Por favor ingresa el nombre completo del cliente.');
      return;
    }

    if (isEditing && selectedClientId) {
      // Edit mode
      const updated = clients.map(c => {
        if (c.id === selectedClientId) {
          return {
            ...c,
            fullName,
            phone,
            email,
            contractNumber: contractNumber || `VW-TEMP-${Math.floor(Math.random() * 9000 + 1000)}`,
            enrollmentMonth,
            enrollmentYear,
            planType,
            vwModel,
            isGrouped,
            groupNumber: isGrouped ? groupNumber : '',
            orderNumber: isGrouped ? orderNumber : '',
            groupDate: isGrouped ? groupDate : '',
            installment2Status,
            installment2Notes,
            installment2DueDate: isGrouped ? installment2DueDate : '',
            installment3Status,
            installment3Notes,
            installment3DueDate: isGrouped ? installment3DueDate : '',
            generalNotes
          };
        }
        return c;
      });
      saveToLocalStorage(updated);
      alert('✨ Datos del cliente actualizados correspondientemente.');
    } else {
      // Create mode
      const newClient: Client = {
        id: Date.now().toString(),
        fullName,
        phone,
        email,
        contractNumber: contractNumber || `VW-INS-${Math.floor(Math.random() * 90000 + 10000)}`,
        enrollmentMonth,
        enrollmentYear,
        planType,
        vwModel,
        isGrouped,
        groupNumber: isGrouped ? groupNumber : '',
        orderNumber: isGrouped ? orderNumber : '',
        groupDate: isGrouped ? groupDate : '',
        installment2Status,
        installment2Notes,
        installment2DueDate: isGrouped ? installment2DueDate : '',
        installment3Status,
        installment3Notes,
        installment3DueDate: isGrouped ? installment3DueDate : '',
        generalNotes,
        createdAt: new Date().toISOString().split('T')[0]
      };
      saveToLocalStorage([newClient, ...clients]);
      alert('✨ Nuevo cliente fidelizado agregado con éxito.');
    }
    resetForm();
  };

  // Delete Client
  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás segura de eliminar de tu agenda a ${name}?`)) {
      const filtered = clients.filter(c => c.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // Filter implementation
  const filteredClients = clients.filter(c => {
    // Month filter
    const matchMonth = selectedMonthFilter === 'Todos' || c.enrollmentMonth === selectedMonthFilter;
    
    // Status Filter
    let matchStatus = true;
    if (selectedStatusFilter === 'Agrupados') {
      matchStatus = c.isGrouped;
    } else if (selectedStatusFilter === 'Falta Agrupar') {
      matchStatus = !c.isGrouped;
    } else if (selectedStatusFilter === 'Alerta Cuota 2') {
      matchStatus = c.isGrouped && (c.installment2Status === 'Pendiente' || c.installment2Status === 'Recordado');
    } else if (selectedStatusFilter === 'Alerta Cuota 3') {
      matchStatus = c.isGrouped && (c.installment3Status === 'Pendiente' || c.installment3Status === 'Recordado');
    } else if (selectedStatusFilter === 'Cobrado Total') {
      matchStatus = c.installment2Status === 'Cobrado' && c.installment3Status === 'Cobrado';
    }

    // Search query match
    const text = `${c.fullName} ${c.contractNumber} ${c.phone} ${c.email} ${c.vwModel} ${c.groupNumber || ''}`.toLowerCase();
    const matchSearch = text.includes(searchQuery.toLowerCase());

    return matchMonth && matchStatus && matchSearch;
  });

  // Calculate stats for current filter view / overall
  const totalFidelizados = clients.length;
  const totalAgrupados = clients.filter(c => c.isGrouped).length;
  const totalSinAgrupar = totalFidelizados - totalAgrupados;
  const pendientesCuota2 = clients.filter(c => c.isGrouped && (c.installment2Status === 'Pendiente' || c.installment2Status === 'Recordado')).length;
  const pendientesCuota3 = clients.filter(c => c.isGrouped && (c.installment3Status === 'Pendiente' || c.installment3Status === 'Recordado')).length;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#4A3E3D] selection:bg-[#E2D4C9] selection:text-[#5C4D44] relative font-sans">
      
      {/* Dynamic PRINT Header of Report */}
      <div id="print-area" className="hidden print:block w-full text-black p-8 bg-white font-sans max-w-[800px] mx-auto">
        <style>
          {`
            @media print {
              body {
                background: white !important;
                color: #333 !important;
              }
              #root {
                display: none !important;
              }
              #print-area {
                display: block !important;
              }
              .no-print {
                display: none !important;
              }
              .border-print {
                border: 1px solid #C4B0A0 !important;
              }
            }
          `}
        </style>
        
        {/* Aesthetic Paper Frame */}
        <div className="border-2 border-[#8C6E5E] p-6 rounded-md">
          <div className="flex justify-between items-center border-b border-[#D7C4B7] pb-4 mb-4">
            <div>
              <span className="text-[10px] tracking-widest text-[#8C6E5E] uppercase block font-bold font-mono">Volkswagen Autoahorro</span>
              <h1 className="text-2xl font-serif font-bold text-[#5E4033] mt-1">{reportTitle}</h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 italic">Mes de reporte: <span className="font-bold text-[#8C6E5E]">{selectedMonthFilter}</span></p>
              <p className="text-[10px] text-neutral-400">Generado el {new Date().toLocaleDateString('es-AR')}</p>
            </div>
          </div>

          <p className="text-sm italic text-neutral-600 text-center py-2 mb-6 font-serif border-y border-dashed border-[#EFE6DD]">
            "{quoteOfReport}"
          </p>

          {/* Quick Metrics of the Printed report */}
          <div className="grid grid-cols-4 gap-4 mb-6 text-center text-xs">
            <div className="p-2.5 bg-[#FAF6F0] rounded-lg border border-[#D7C4B7]">
              <span className="text-stone-500 block uppercase text-[8px] font-bold">Total Clientes</span>
              <span className="text-base font-bold text-[#5E4033]">{filteredClients.length}</span>
            </div>
            <div className="p-2.5 bg-[#FAF6F0] rounded-lg border border-[#D7C4B7]">
              <span className="text-stone-500 block uppercase text-[8px] font-bold">Agrupados</span>
              <span className="text-base font-bold text-[#5E4033]">
                {filteredClients.filter(c => c.isGrouped).length}
              </span>
            </div>
            <div className="p-2.5 bg-[#FAF6F0] rounded-lg border border-[#D7C4B7]">
              <span className="text-stone-500 block uppercase text-[8px] font-bold">Pendientes Cuota 2</span>
              <span className="text-base font-bold text-[#5E4033]">
                {filteredClients.filter(c => c.isGrouped && c.installment2Status !== 'Cobrado').length}
              </span>
            </div>
            <div className="p-2.5 bg-[#FAF6F0] rounded-lg border border-[#D7C4B7]">
              <span className="text-stone-500 block uppercase text-[8px] font-bold">Pendientes Cuota 3</span>
              <span className="text-base font-bold text-[#5E4033]">
                {filteredClients.filter(c => c.isGrouped && c.installment3Status !== 'Cobrado').length}
              </span>
            </div>
          </div>

          {/* Detailed table of clients */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] border-collapse font-sans-professional">
              <thead>
                <tr className="border-b-2 border-[#8C6E5E] text-[#5E4033] uppercase tracking-wider text-[9px]">
                  <th className="py-2.5 px-2 text-left font-bold">Nombre Completo</th>
                  <th className="py-2.5 px-2 text-left font-bold">Teléfono</th>
                  <th className="py-2.5 px-2 text-left font-bold">Email</th>
                  <th className="py-2.5 px-2 text-left font-bold">Contrato / Plan</th>
                  <th className="py-2.5 px-2 text-left font-bold">Modelo VW</th>
                  <th className="py-2.5 px-1 text-center font-bold">Cuota 2 (Vto.)</th>
                  <th className="py-2.5 px-1 text-center font-bold">Cuota 3 (Vto.)</th>
                  <th className="py-2.5 px-2 text-left font-bold">Resumen / Notas</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c, idx) => (
                  <tr key={c.id} className="border-b border-[#EFE6DD] hover:bg-stone-50">
                    <td className="py-2.5 px-2 font-bold text-neutral-800 text-[11px] font-sans-professional">
                      {c.fullName}
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-neutral-700 whitespace-nowrap text-[10px] font-mono">
                      {c.phone || '—'}
                    </td>
                    <td className="py-2.5 px-2 text-[#8C6E5E] font-medium text-[10px] break-all max-w-[140px]">
                      {c.email || '—'}
                    </td>
                    <td className="py-2.5 px-2 text-[10px]">
                      <div className="font-mono font-bold text-neutral-700">{c.contractNumber}</div>
                      <div className="text-[9px] text-[#A68F81] font-semibold">{c.planType}</div>
                    </td>
                    <td className="py-2.5 px-2 text-stone-850 font-bold text-[10px]">
                      {c.vwModel}
                    </td>
                    <td className="py-2.5 px-1 text-center font-sans-professional">
                      <div className="flex flex-col items-center">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          c.installment2Status === 'Cobrado' ? 'bg-green-100 text-green-800' :
                          c.installment2Status === 'Recordado' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>{c.installment2Status}</span>
                        {c.isGrouped && c.installment2DueDate ? (
                          <span className="text-[9px] font-bold text-stone-600 font-mono mt-0.5">
                            {c.installment2DueDate.split('-').reverse().join('/')}
                          </span>
                        ) : (
                          <span className="text-[8px] text-neutral-400 italic mt-0.5">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-1 text-center font-sans-professional">
                      <div className="flex flex-col items-center">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          c.installment3Status === 'Cobrado' ? 'bg-green-100 text-green-800' :
                          c.installment3Status === 'Recordado' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>{c.installment3Status}</span>
                        {c.isGrouped && c.installment3DueDate ? (
                          <span className="text-[9px] font-bold text-stone-600 font-mono mt-0.5">
                            {c.installment3DueDate.split('-').reverse().join('/')}
                          </span>
                        ) : (
                          <span className="text-[8px] text-neutral-400 italic mt-0.5">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-neutral-600 italic text-[9px] leading-snug">
                      {c.isGrouped ? (
                        <span>G: {c.groupNumber || '—'} / O: {c.orderNumber || '—'}. </span>
                      ) : (
                        <span className="text-stone-400">Sin agrupar. </span>
                      )}
                      {c.generalNotes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed border-[#D7C4B7] text-center text-[10px] text-stone-400 italic">
            VW Autoahorro - Reporte de Fidelización Interno de la Asesora Comercial
          </div>
        </div>
      </div>

      {/* WEB VERSION CORE */}
      <div className="w-full min-h-screen flex flex-col">
        
        {/* Navigation & Header */}
        <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#EFE6DD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left Brand Area */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#8C6E5E] rounded-2xl flex items-center justify-center text-[#FDFAF7] shadow-md border border-[#755D4E] shrink-0">
                <Car size={24} className="stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-[#EFE6DD] text-[#5E4033] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Asesora Comercial</span>
                  <span className="text-[10px] text-[#A68F81] font-mono">v1.2</span>
                </div>
                <h1 className="text-xl font-bold text-[#4A3E3D] tracking-tight flex items-center gap-1.5 font-serif-aesthetic">
                  Agenda Autoplan <span className="font-normal italic">Volkswagen</span>
                </h1>
              </div>
            </div>

            {/* General Actions row */}
            <div className="flex items-center flex-wrap gap-2.5">
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 bg-[#8C6E5E] hover:bg-[#725A4B] text-white rounded-full text-xs font-bold font-serif-aesthetic italic flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Printer size={14} /> Exportar Mes Estético (PDF)
              </button>

              <button
                onClick={() => {
                  // Export JSON backup
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `vw-agenda-${selectedMonthFilter}-${new Date().toISOString().split('T')[0]}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-3.5 py-2 bg-white hover:bg-[#F2ECE5] text-[#5C4D44] border border-[#D7C4B7] rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                title="Descargar copia de resguardo"
              >
                <Download size={13} /> Resguardo JSON
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6 w-full">
          
          {/* Top Quick Metrics & Quote */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-[#FFFDFB] p-5 rounded-3xl border border-[#ECE0D1] shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-full bg-[#FAF5E6] text-amber-800 flex items-center justify-center shrink-0">
                <Briefcase size={20} className="stroke-[1.8]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Clientes Totales</span>
                <span className="text-2xl font-bold text-[#5E4033] font-serif-aesthetic">{totalFidelizados}</span>
                <span className="text-[10px] text-green-700 block font-semibold">Fidelizados activos</span>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#8C6E5E]/5 rounded-bl-full pointer-events-none"></div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#FFFDFB] p-5 rounded-3xl border border-[#ECE0D1] shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-800 flex items-center justify-center shrink-0">
                <FolderSync size={20} className="stroke-[1.8]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Agrupados Formales</span>
                <span className="text-2xl font-bold text-[#5E4033] font-serif-aesthetic">{totalAgrupados} / {totalFidelizados}</span>
                <span className="text-[10px] text-neutral-500 block">Restan agrupar: <strong className="text-amber-800">{totalSinAgrupar}</strong></span>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#8C6E5E]/5 rounded-bl-full pointer-events-none"></div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#FFFDFB] p-5 rounded-3xl border border-[#ECE0D1] shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center shrink-0">
                <CreditCard size={20} className="stroke-[1.8]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Alertas Cuota 2</span>
                <span className="text-2xl font-bold text-[#5E4033] font-serif-aesthetic">{pendientesCuota2}</span>
                <span className="text-[10px] text-[#A68F81] block">Gente agrupada por cobrar</span>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#8C6E5E]/5 rounded-bl-full pointer-events-none"></div>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#FFFDFB] p-5 rounded-3xl border border-[#ECE0D1] shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-full bg-[#F5EEF7] text-purple-800 flex items-center justify-center shrink-0">
                <CheckSquare size={20} className="stroke-[1.8]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Alertas Cuota 3</span>
                <span className="text-2xl font-bold text-[#5E4033] font-serif-aesthetic">{pendientesCuota3}</span>
                <span className="text-[10px] text-[#A68F81] block">Control de cuota definitiva</span>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#8C6E5E]/5 rounded-bl-full pointer-events-none"></div>
            </div>

          </section>

          {/* Quick Notice Banner */}
          <div className="bg-[#FFFDFB] border-l-4 border-[#8C6E5E] p-4 rounded-r-2xl border border-y border-stone-200 text-xs md:text-sm text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#8C6E5E] shrink-0" />
              <span>
                <strong>Tip de Venta VW:</strong> La agrupación formal es el instante clave. Es indispensable activar la agenda de recordatorio de las Cuotas 2 y 3 para evitar caídas y asegurar la facturación de tu comisión.
              </span>
            </div>
            <div className="text-[11px] font-serif italic text-[#8C6E5E] shrink-0">
              "Fidelizar es garantizar la entrega."
            </div>
          </div>

          {/* Core App Interaction Grid: Add Client Form (Left) & Directory table (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT / TOP PANEL: Form for adding/editing (4 columns) */}
            <section id="client-form" className="lg:col-span-5 bg-[#FFFDFB] border border-[#ECE0D1] rounded-[28px] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EFE6DD] pb-3 mb-4">
                <h3 className="font-serif-aesthetic text-xl font-bold italic text-[#5E4033] flex items-center gap-1.5">
                  {isEditing ? <Edit3 size={18} className="text-[#8C6E5E]" /> : <Plus size={18} className="text-[#8C6E5E]" />}
                  {isEditing ? 'Editar Cliente' : 'Nuevo Cliente Fidelizado'}
                </h3>
                {isEditing && (
                  <button 
                    onClick={resetForm}
                    className="p-1 px-2.5 bg-[#FAF6F0] hover:bg-[#EFE6DD] text-[#5C4D44] border border-[#D7C4B7] text-[10px] rounded-full font-bold transition-all cursor-pointer"
                  >
                    Nuevo vació
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                
                {/* Full name input */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-stone-400" />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Valentina Domínguez"
                      className="w-full bg-white border border-[#D7C4B7] rounded-xl pl-9 pr-3 py-2.5 text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E]"
                    />
                  </div>
                </div>

                {/* Contact Data Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Teléfono</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-3 text-stone-400" />
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. +54 9 11 5000..."
                        className="w-full bg-white border border-[#D7C4B7] rounded-xl pl-8 pr-2.5 py-2.5 text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">E-mail</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3 text-stone-400" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@mail.com"
                        className="w-full bg-white border border-[#D7C4B7] rounded-xl pl-8 pr-2.5 py-2.5 text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E]"
                      />
                    </div>
                  </div>
                </div>

                {/* Enrollment details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE4D8]">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Mes de Inscripción</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-3 text-stone-400" />
                      <select 
                        value={enrollmentMonth}
                        onChange={(e) => setEnrollmentMonth(e.target.value)}
                        className="w-full bg-white border border-[#D7C4B7] rounded-xl pl-8 pr-2.5 py-2 text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E]"
                      >
                        {MONTHS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Número de Contrato</label>
                    <div className="relative">
                      <FileText size={14} className="absolute left-3 top-3 text-stone-400" />
                      <input 
                        type="text" 
                        value={contractNumber}
                        onChange={(e) => setContractNumber(e.target.value)}
                        placeholder="Ej. VW-54891-B"
                        className="w-full bg-white border border-[#D7C4B7] rounded-xl pl-8 pr-2.5 py-2 text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E]"
                      />
                    </div>
                  </div>
                </div>

                {/* VW Model & Plan type details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Modelo VW</label>
                    <select 
                      value={vwModel}
                      onChange={(e) => setVwModel(e.target.value)}
                      className="w-full bg-white border border-[#D7C4B7] rounded-xl px-2.5 py-2 text-[#4A3E3D] focus:outline-none"
                    >
                      {VW_MODELS.map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Tipo de Plan</label>
                    <select 
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      className="w-full bg-white border border-[#D7C4B7] rounded-xl px-2.5 py-2 text-[#4A3E3D] focus:outline-none"
                    >
                      {PLAN_TYPES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* KEY CHECKPOINT: Grouping checklist (agrupamiento formal) */}
                <div className="bg-[#FFFDF6] p-3.5 rounded-2xl border border-amber-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider font-bold text-[#8C6E5E] flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-amber-700" /> 
                      <span>¿Agrupado Formalmente?</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsGrouped(!isGrouped)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${isGrouped ? 'bg-[#8F7466]' : 'bg-stone-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${isGrouped ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  {isGrouped ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-fadeIn">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Nro Grupo</label>
                        <input 
                          type="text" 
                          value={groupNumber}
                          onChange={(e) => setGroupNumber(e.target.value)}
                          placeholder="Ej. 4902"
                          className="w-full bg-white border border-[#D7C4B7] rounded-lg px-2 py-1 text-[#4A3E3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Nro Orden</label>
                        <input 
                          type="text" 
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          placeholder="Ej. 082"
                          className="w-full bg-white border border-[#D7C4B7] rounded-lg px-2 py-1 text-[#4A3E3D] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Fecha Agr.</label>
                        <input 
                          type="date" 
                          value={groupDate}
                          onChange={(e) => setGroupDate(e.target.value)}
                          className="w-full bg-white border border-[#D7C4B7] rounded-lg px-1 py-0.5 text-[#4A3E3D]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#A28779] italic">
                      Habilitará el control detallado de las Cuotas 2 y 3 una vez se active.
                    </p>
                  )}
                </div>

                {/* Sub-Section triggered from grouping checkpoint: Reminders 2 and 3 */}
                {isGrouped && (
                  <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#ECE0D1] flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#8C6E5E] block">Seguimiento de Cuotas Tempranas:</span>
                    
                    {/* Cuota 2 Status block */}
                    <div className="border-b border-[#EFE6DD] pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-[#5E4033] flex items-center gap-1.5">
                          <CreditCard size={12} className="text-[#8C6E5E]" /> Cuota 2
                        </span>
                        
                        <div className="flex gap-1">
                          {(['Pendiente', 'Recordado', 'Cobrado'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setInstallment2Status(st)}
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                installment2Status === st 
                                  ? 'bg-[#8F7466] text-white' 
                                  : 'bg-white border border-stone-200 text-stone-500'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="text-[8px] text-stone-500 uppercase block mb-0.5">Vencimiento</label>
                          <input 
                            type="date" 
                            value={installment2DueDate}
                            onChange={(e) => setInstallment2DueDate(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded p-1 text-stone-700"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-stone-500 uppercase block mb-0.5">Observación rápida</label>
                          <input 
                            type="text" 
                            value={installment2Notes}
                            onChange={(e) => setInstallment2Notes(e.target.value)}
                            placeholder="Ej. Prometió transferencia"
                            className="w-full bg-white border border-stone-200 rounded p-1 text-stone-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cuota 3 Status block */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-[#5E4033] flex items-center gap-1.5">
                          <CreditCard size={12} className="text-[#8C6E5E]" /> Cuota 3
                        </span>
                        
                        <div className="flex gap-1">
                          {(['Pendiente', 'Recordado', 'Cobrado'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setInstallment3Status(st)}
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                                installment3Status === st 
                                  ? 'bg-[#8F7466] text-white' 
                                  : 'bg-white border border-stone-200 text-stone-500'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="text-[8px] text-stone-500 uppercase block mb-0.5">Vencimiento</label>
                          <input 
                            type="date" 
                            value={installment3DueDate}
                            onChange={(e) => setInstallment3DueDate(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded p-1 text-stone-700"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-stone-500 uppercase block mb-0.5">Observación rápida</label>
                          <input 
                            type="text" 
                            value={installment3Notes}
                            onChange={(e) => setInstallment3Notes(e.target.value)}
                            placeholder="Ej. Debito rechazado, reintentar"
                            className="w-full bg-white border border-stone-200 rounded p-1 text-stone-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* General notes & reminders */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#8C6E5E] block mb-1">Notas Generales / Bitácora de Relación</label>
                  <textarea 
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    rows={3}
                    placeholder="Escribe comentarios de fidelización, visitas del cliente, si viene de recomendado, fechas tentativas de adjudicación..."
                    className="w-full bg-white border border-[#D7C4B7] rounded-xl px-3 py-2 text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E] resize-none"
                  ></textarea>
                </div>

                {/* Submits buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#8C6E5E] hover:bg-[#725A4B] text-[#FAF6F0] py-3 rounded-xl font-serif-aesthetic italic font-bold tracking-wide transition-all cursor-pointer text-center text-sm shadow-sm hover:scale-101"
                  >
                    {isEditing ? '✓ Guardar Cambios' : '＋ Crear Cliente'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 bg-white hover:bg-[#FAF6F0] text-stone-500 border border-stone-200 rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Limpiar
                  </button>
                </div>

              </form>
            </section>

            {/* RIGHT SIDEBAR PANEL: Directory List & Filters (7 columns) */}
            <section className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Dynamic Filter Strip component container */}
              <div className="bg-[#FFFDFB] border border-[#ECE0D1] rounded-[28px] p-5 shadow-sm flex flex-col gap-4">
                
                {/* Search Text Input */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar cliente por nombre, nro de contrato, modelo VW, nro grupo..."
                    className="w-full bg-[#FAF7F2] border border-[#E9E1D5] rounded-full pl-10 pr-4 py-3 text-xs text-[#4A3E3D] focus:outline-none focus:ring-1 focus:ring-[#8C6E5E] placeholder-stone-400 font-medium"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Filters Group Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#F5EDE2]">
                  
                  {/* Select Month enrollment */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Mes de Inscripción:</span>
                    <select
                      value={selectedMonthFilter}
                      onChange={(e) => setSelectedMonthFilter(e.target.value)}
                      className="bg-[#FAF7F2] border border-[#E9E1D5] rounded-full px-3 py-1.5 text-xs text-[#5E4033] font-semibold focus:outline-none"
                    >
                      <option value="Todos">🗓️ Todos los meses</option>
                      {MONTHS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Preset Status Dropdowns */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Filtrar por:</span>
                    <div className="flex gap-1 flex-wrap">
                      {[
                        { key: 'Todos', label: 'Todos' },
                        { key: 'Agrupados', label: 'Agrupados' },
                        { key: 'Falta Agrupar', label: 'Sin Agrupar' },
                        { key: 'Alerta Cuota 2', label: 'Cuota 2 ⚠️' },
                        { key: 'Alerta Cuota 3', label: 'Cuota 3 ⚠️' },
                        { key: 'Cobrado Total', label: 'Concluidos ✓' }
                      ].map((btn) => (
                        <button
                          key={btn.key}
                          onClick={() => setSelectedStatusFilter(btn.key)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                            selectedStatusFilter === btn.key
                              ? 'bg-[#8C6E5E] text-white shadow-xs'
                              : 'bg-[#FAF6F0] text-[#7A6052] border border-[#EFE6DD] hover:bg-[#EFE6DD]'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Client Listing cards */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-[#8C6E5E] font-semibold">
                    Mostrando <strong className="font-bold underline">{filteredClients.length}</strong> clientes de {clients.length} registrados
                  </span>
                  
                  {filteredClients.length > 0 && (
                    <span className="text-[10px] text-neutral-400 italic">
                      Resultados para {selectedMonthFilter} • {selectedStatusFilter}
                    </span>
                  )}
                </div>

                {filteredClients.length === 0 ? (
                  <div className="bg-[#FFFDFB] rounded-[28px] border border-[#ECE0D1] p-12 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-[#FAF5EF] rounded-full flex items-center justify-center text-stone-300">
                      <Search size={30} />
                    </div>
                    <h4 className="font-serif-aesthetic font-semibold text-lg text-[#5E4033] italic">No se hallaron clientes fidelizados</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Prueba a cambiar los filtros seleccionados, remueve la palabra de búsqueda, o agrega un nuevo cliente usando el formulario marrón a tu izquierda.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedMonthFilter('Todos');
                        setSelectedStatusFilter('Todos');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 mt-2 border border-[#D7C4B7] bg-[#FAF6F0] hover:bg-[#EFE6DD] text-[#5C4D44] text-xs font-bold rounded-full transition-all cursor-pointer"
                    >
                      Ver todos
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {filteredClients.map((client) => {
                      return (
                        <div 
                          key={client.id}
                          className="bg-[#FFFDFB] hover:bg-[#FFFDF8] rounded-[26px] border border-[#ECE0D1] hover:border-[#D7C4B7] p-5 sm:p-6 transition-all shadow-2xs flex flex-col gap-4 group relative"
                        >
                          {/* Top Row: General client Name and Action item */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex items-start gap-3">
                              
                              {/* Avatar circle with initials */}
                              <div className="w-11 h-11 rounded-full bg-[#FAF2E8] border border-[#E9DCCF] flex items-center justify-center text-[#8C6E5E] font-bold font-serif shadow-inner shrink-0 leading-none">
                                {client.fullName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-base text-[#4A3E3D] group-hover:text-[#5E4033] transition-colors">{client.fullName}</h4>
                                  <span className="text-[10px] bg-[#FAF5EF] border border-[#E9DEC3] px-2.5 py-0.5 rounded-full text-[#8C6E5E] font-medium block">
                                    Inscrito en {client.enrollmentMonth} {client.enrollmentYear || '2026'}
                                  </span>
                                </div>
                                
                                {/* VW Model & Plan detail subtitle */}
                                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                                  <Car size={13} className="text-[#8C6E5E]" />
                                  <span className="font-semibold text-[#8C6E5E]">{client.vwModel}</span>
                                  <span className="text-[#D7C4B7]">•</span>
                                  <span>{client.planType}</span>
                                </div>
                              </div>

                            </div>

                            {/* Client management actions */}
                            <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-full border border-[#EFE6DD]">
                              <button 
                                onClick={() => handleEditClick(client)}
                                title="Editar parámetros del cliente"
                                className="p-1.5 text-[#8C6E5E] hover:bg-[#EFE6DD] hover:text-[#5E4033] rounded-full transition-all cursor-pointer"
                              >
                                <Edit3 size={14} />
                              </button>
                              
                              <button 
                                onClick={() => handleDelete(client.id, client.fullName)}
                                title="Eliminar cliente de la agenda"
                                className="p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-700 rounded-full transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Contact quick links */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE4DA] text-xs">
                            <div className="flex items-center gap-2 text-stone-600 truncate">
                              <FileText size={13} className="text-stone-400 shrink-0" />
                              <span className="font-mono text-[10px] select-all font-bold">{client.contractNumber}</span>
                            </div>

                            <div className="flex items-center gap-2 text-stone-600 truncate">
                              <Phone size={13} className="text-stone-400 shrink-0" />
                              <a 
                                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline text-[#8C6E5E] font-semibold"
                                title="Enviar mensaje de WhatsApp"
                              >
                                {client.phone || 'S/N Teléfono'}
                              </a>
                            </div>

                            <div className="flex items-center gap-2 text-stone-600 truncate">
                              <Mail size={13} className="text-stone-400 shrink-0" />
                              <a href={`mailto:${client.email}`} className="hover:underline">{client.email || 'S/N Mail'}</a>
                            </div>
                          </div>

                          {/* Critical Checkpoint: Formal Group details & Installments alerts */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 border-t border-[#F2ECE5] pt-3.5 items-center">
                            
                            {/* Group checklist switch */}
                            <div className="md:col-span-5 flex items-center justify-between bg-[#FFFDF5] p-2 rounded-xl border border-amber-200">
                              <button 
                                onClick={() => toggleGroupedDirectly(client)}
                                className="flex items-center gap-2 text-xs font-bold text-[#8C6E5E] cursor-pointer text-left"
                              >
                                {client.isGrouped ? (
                                  <CheckSquare size={16} className="text-amber-700 shrink-0" />
                                ) : (
                                  <Square size={16} className="text-stone-300 shrink-0" />
                                )}
                                <div>
                                  <span>¿Agrupado en VW?</span>
                                  {client.isGrouped && (
                                    <span className="block text-[9px] text-[#A68F81] font-mono leading-none">
                                      Grupo: {client.groupNumber || '-'} | Ord: {client.orderNumber || '-'}
                                    </span>
                                  )}
                                </div>
                              </button>
                              
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                client.isGrouped 
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                                  : 'bg-stone-100 text-stone-400'
                              }`}>
                                {client.isGrouped ? 'SÍ, AGRUPADO' : 'PENDIENTE'}
                              </span>
                            </div>

                            {/* Early installments follow-ups (Cuota 2 y 3) visible if grouped */}
                            <div className="md:col-span-7 flex flex-wrap gap-2 items-center justify-end">
                              {client.isGrouped ? (
                                <div className="flex items-center gap-2 w-full justify-between sm:justify-end text-xs">
                                  
                                  {/* Installment 2 Check box button */}
                                  <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2.5 py-1.5 rounded-xl border border-[#EDE0D0]">
                                    <span className="text-[9px] uppercase tracking-wider text-[#A28779] block">Cuota 2:</span>
                                    <span className={`px-1.5 py-0.5 rounded font-bold text-[8px] uppercase ${
                                      client.installment2Status === 'Cobrado' ? 'bg-green-100 text-green-800' :
                                      client.installment2Status === 'Recordado' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {client.installment2Status}
                                    </span>
                                    {client.installment2DueDate && (
                                      <span className="text-[8px] font-mono font-bold text-neutral-400">V: {client.installment2DueDate.split('-').slice(1).reverse().join('/')}</span>
                                    )}
                                  </div>

                                  {/* Installment 3 Check box button */}
                                  <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2.5 py-1.5 rounded-xl border border-[#EDE0D0]">
                                    <span className="text-[9px] uppercase tracking-wider text-[#A28779] block">Cuota 3:</span>
                                    <span className={`px-1.5 py-0.5 rounded font-bold text-[8px] uppercase ${
                                      client.installment3Status === 'Cobrado' ? 'bg-green-100 text-green-800' :
                                      client.installment3Status === 'Recordado' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {client.installment3Status}
                                    </span>
                                    {client.installment3DueDate && (
                                      <span className="text-[8px] font-mono font-bold text-neutral-400">V: {client.installment3DueDate.split('-').slice(1).reverse().join('/')}</span>
                                    )}
                                  </div>

                                </div>
                              ) : (
                                <span className="text-[10px] text-stone-400 italic flex items-center gap-1">
                                  <Clock size={12} /> Se habilitará el control de Cuota 2 y 3 al agrupar
                                </span>
                              )}
                            </div>

                          </div>

                          {/* Quick Installment internal comments detail (if any exist) */}
                          {client.isGrouped && (client.installment2Notes || client.installment3Notes) && (
                            <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-dashed border-[#EDE0D1] text-[11px] text-stone-600 space-y-1">
                              {client.installment2Notes && (
                                <div><strong className="text-[#8C6E5E]">Obs C2:</strong> {client.installment2Notes}</div>
                              )}
                              {client.installment3Notes && (
                                <div><strong className="text-[#8C6E5E]">Obs C3:</strong> {client.installment3Notes}</div>
                              )}
                            </div>
                          )}

                          {/* General relationship history comments */}
                          {client.generalNotes && (
                            <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-[#EFE6DD]">
                              <strong className="text-[#8C6E5E]">Bitácora:</strong> <span className="italic">{client.generalNotes}</span>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </section>

          </div>

        </main>

        {/* Dedicated Aesthetic Footer */}
        <footer className="bg-[#FAF6F0] border-t border-[#EFE6DD] py-8 mt-12 text-center text-xs text-[#8C6E5E]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-serif-aesthetic italic font-semibold text-sm">
              Volkswagen Autoahorro de la mano de tu organización personal.
            </span>
            <div className="flex gap-4 text-[#A68F81] font-medium">
              <span>Fidelización de Clientes</span>
              <span>•</span>
              <span>Gestión de Cuotas 2 y 3</span>
              <span>•</span>
              <span>Impresión Estética</span>
            </div>
            <span>© 2026 Virtual Planner. Para uso profesional exclusivo.</span>
          </div>
        </footer>

      </div>

      {/* DEDICATED REPORT EXPORT MODAL PREVIEW */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#D7C4B7] max-h-[90vh] overflow-y-auto flex flex-col gap-6">
            
            {/* Close trigger button */}
            <button 
              onClick={() => setIsReportOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Heading header */}
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-aesthetic text-2xl font-bold italic text-[#5E4033] flex items-center gap-2">
                <Sparkles size={20} className="text-[#8C6E5E]" /> Vista de Impresión Estética
              </h3>
              <p className="text-xs text-neutral-500">
                Personaliza y previsualiza el diseño antes de imprimir o guardar como PDF.
              </p>
            </div>

            {/* Customizable options before print */}
            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EDE0D0] text-xs flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#8C6E5E] block mb-1">Título del Reporte</label>
                  <input 
                    type="text" 
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full bg-white border border-[#D7C4B7] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8C6E5E] text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6E5E] block mb-1">Frase Inspiracional del Pie</label>
                  <input 
                    type="text" 
                    value={quoteOfReport}
                    onChange={(e) => setQuoteOfReport(e.target.value)}
                    className="w-full bg-white border border-[#D7C4B7] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8C6E5E] text-stone-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="font-bold text-[#8C6E5E] mr-2">Mes Seleccionado para Imprimir:</span>
                <span className="px-3 py-1 bg-[#8C6E5E] text-white rounded-full font-bold uppercase tracking-wider text-[10px]">
                  {selectedMonthFilter === 'Todos' ? 'TODOS LOS MESES' : selectedMonthFilter.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Layout Paper preview mock */}
            <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 overflow-y-auto max-h-64">
              <span className="text-[10px] text-stone-400 block mb-2 uppercase text-center font-bold tracking-widest">— Mini-Previsualización de Reporte —</span>
              
              <div className="bg-white p-4 text-[10px] text-stone-700 font-sans border border-stone-300 rounded shadow-xs">
                <div className="text-center font-serif text-base font-bold text-stone-800">{reportTitle}</div>
                <div className="text-center text-[8px] text-stone-400 mt-0.5">Mes: {selectedMonthFilter}</div>
                
                <div className="w-8 h-[1px] bg-stone-300 mx-auto my-1.5"></div>
                <div className="text-[8px] italic text-stone-500 text-center mb-3">"{quoteOfReport}"</div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[8px] border-collapse font-sans-professional">
                    <thead>
                      <tr className="border-b border-stone-200 text-[#5E4033] uppercase text-[7px] font-bold">
                        <th className="py-1 px-1">Nombre</th>
                        <th className="py-1 px-1">Teléfono</th>
                        <th className="py-1 px-1">Email</th>
                        <th className="py-1 px-1">Plan / Modelo</th>
                        <th className="py-1 px-1 text-center">Cuota 2</th>
                        <th className="py-1 px-1 text-center">Cuota 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map(c => (
                        <tr key={c.id} className="border-b border-stone-100">
                          <td className="py-1 px-1 font-bold text-stone-800">{c.fullName}</td>
                          <td className="py-1 px-1 font-mono text-stone-600 whitespace-nowrap">{c.phone || '—'}</td>
                          <td className="py-1 px-1 text-stone-500 truncate max-w-[90px]">{c.email || '—'}</td>
                          <td className="py-1 px-1">
                            <div className="font-mono font-bold text-stone-750">{c.contractNumber}</div>
                            <div className="text-[7px] text-[#8C6E5E]">{c.vwModel}</div>
                          </td>
                          <td className="py-1 px-1 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold text-stone-700">{c.installment2Status}</span>
                              {c.isGrouped && c.installment2DueDate && (
                                <span className="text-[7px] text-stone-400 font-mono italic">{c.installment2DueDate.split('-').reverse().join('/')}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-1 px-1 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold text-stone-700">{c.installment3Status}</span>
                              {c.isGrouped && c.installment3DueDate && (
                                <span className="text-[7px] text-stone-400 font-mono italic">{c.installment3DueDate.split('-').reverse().join('/')}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Print Action Bottom button CTA */}
            <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsReportOpen(false)}
                className="px-4 py-2 hover:bg-stone-100 text-stone-500 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  setIsReportOpen(false);
                  setTimeout(() => {
                    window.print();
                  }, 400);
                }}
                className="px-6 py-2.5 bg-[#8C6E5E] hover:bg-[#725A4B] text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Printer size={14} /> Mandar a Imprimir o Guardar PDF
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
