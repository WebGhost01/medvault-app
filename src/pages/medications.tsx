import { useListMedications } from "@workspace/api-client-react";
import { useMedicalMutations } from "@/hooks/use-medical-mutations";
import { format } from "date-fns";
import { useState } from "react";
import { MedicationForm } from "@/components/medication-form";
import { Medication } from "@workspace/api-client-react";
import { Plus, Pill, Edit2, Trash2, CalendarClock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Medications() {
  const { data: medications, isLoading } = useListMedications();
  const { deleteRecord, deleteMedication } = useMedicalMutations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | undefined>();
  const [filter, setFilter] = useState<"active" | "past">("active");

  const filteredMeds = medications?.filter(m => filter === "active" ? m.isActive : !m.isActive)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) || [];

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      await deleteMedication.mutateAsync({ id });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground mt-1">Track your active prescriptions and history.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Medication
        </button>
      </div>

      <div className="flex bg-card border rounded-xl p-1 w-full max-w-sm">
        <button
          onClick={() => setFilter("active")}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
            filter === "active" ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("past")}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
            filter === "past" ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Past History
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredMeds.length === 0 ? (
        <div className="bg-card border border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Pill className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No {filter} medications</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You don't have any {filter} medications in your list right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeds.map(med => (
            <div key={med.id} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col relative overflow-hidden">
              {med.isActive && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-4 -right-6 w-24 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold py-1 text-center rotate-45 transform">
                    ACTIVE
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Pill className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingMed(med)}
                    className="p-2 bg-secondary/80 hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(med.id)}
                    className="p-2 bg-secondary/80 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors text-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{med.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-secondary text-foreground text-xs font-semibold rounded-md">
                      {med.dosage}
                    </span>
                    <span className="px-2.5 py-1 bg-secondary text-foreground text-xs font-semibold rounded-md">
                      {med.frequency}
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 border-t flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="w-4 h-4 shrink-0" />
                    <span>Started: {format(new Date(med.startDate), 'MMM d, yyyy')}</span>
                  </div>
                  {med.endDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarClock className="w-4 h-4 shrink-0" />
                      <span>Ended: {format(new Date(med.endDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {med.notes && (
                    <div className="flex items-start gap-2 text-sm text-foreground/80 mt-1 bg-secondary/50 p-2.5 rounded-lg">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                      <p className="line-clamp-2">{med.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingMed) && (
        <MedicationForm 
          medication={editingMed} 
          onClose={() => {
            setShowForm(false);
            setEditingMed(undefined);
          }} 
        />
      )}
    </div>
  );
}
