import { useListMedicalRecords, useListMedications } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Activity, Pill, Plus, ChevronRight, Stethoscope, Syringe, TestTube, FileText } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RecordForm } from "@/components/record-form";

export default function Dashboard() {
  const { data: records, isLoading: loadingRecords } = useListMedicalRecords();
  const { data: medications, isLoading: loadingMeds } = useListMedications();
  const [showRecordForm, setShowRecordForm] = useState(false);

  const activeMeds = medications?.filter(m => m.isActive) || [];
  const recentRecords = records?.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4) || [];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'visit': return <Stethoscope className="w-5 h-5" />;
      case 'vaccination': return <Syringe className="w-5 h-5" />;
      case 'lab': return <TestTube className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'visit': return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case 'vaccination': return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case 'lab': return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case 'procedure': return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (loadingRecords || loadingMeds) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Health Overview</h1>
          <p className="text-muted-foreground mt-1">Your medical history at a glance.</p>
        </div>
        <button 
          onClick={() => setShowRecordForm(true)}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Visit
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{records?.length || 0}</p>
            <p className="text-sm font-medium text-muted-foreground">Total Records</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Pill className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{activeMeds.length}</p>
            <p className="text-sm font-medium text-muted-foreground">Active Medications</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-foreground">Recent Activity</h2>
            <Link href="/records" className="text-sm font-medium text-primary hover:underline flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {recentRecords.length > 0 ? (
              <div className="divide-y divide-border">
                {recentRecords.map(record => (
                  <div key={record.id} className="p-5 hover:bg-secondary/30 transition-colors flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl mt-1", getTypeColor(record.type))}>
                      {getTypeIcon(record.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-foreground truncate">{record.title}</h3>
                        <span className="text-xs font-medium text-muted-foreground shrink-0">
                          {format(new Date(record.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 capitalize font-medium">{record.type}</p>
                      {record.doctor && (
                        <p className="text-sm text-foreground/80 mt-2 flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 opacity-50" /> {record.doctor}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <FileText className="w-12 h-12 opacity-20 mb-3" />
                <p>No medical records logged yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Medications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-foreground">Current Prescriptions</h2>
            <Link href="/medications" className="text-sm font-medium text-primary hover:underline flex items-center">
              Manage <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
             {activeMeds.length > 0 ? (
               <div className="divide-y divide-border">
                 {activeMeds.map(med => (
                   <div key={med.id} className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Pill className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{med.dosage} • {med.frequency}</p>
                        </div>
                     </div>
                     <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">Active</span>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Pill className="w-12 h-12 opacity-20 mb-3" />
                <p>No active medications.</p>
              </div>
             )}
          </div>
        </div>
      </div>

      {showRecordForm && <RecordForm onClose={() => setShowRecordForm(false)} />}
    </div>
  );
}
