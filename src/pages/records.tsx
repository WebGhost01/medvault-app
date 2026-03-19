import { useListMedicalRecords } from "@workspace/api-client-react";
import { useMedicalMutations } from "@/hooks/use-medical-mutations";
import { format } from "date-fns";
import { useState } from "react";
import { RecordForm } from "@/components/record-form";
import { MedicalRecord } from "@workspace/api-client-react";
import { Plus, Filter, FileText, Search, Stethoscope, Syringe, TestTube, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Records() {
  const { data: records, isLoading } = useListMedicalRecords();
  const { deleteRecord } = useMedicalMutations();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | undefined>();
  
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredRecords = records?.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          (r.doctor?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

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

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await deleteRecord.mutateAsync({ id });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Medical Records</h1>
          <p className="text-muted-foreground mt-1">Manage and track your health history.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Record
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search records by title or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="relative shrink-0 w-full md:w-48">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium text-foreground cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="visit">Visits</option>
            <option value="diagnosis">Diagnoses</option>
            <option value="procedure">Procedures</option>
            <option value="lab">Lab Results</option>
            <option value="vaccination">Vaccinations</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-card border border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No records found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {search || typeFilter !== 'all' 
              ? "Try adjusting your filters to find what you're looking for." 
              : "Start building your medical history by adding your first record."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map(record => (
            <div key={record.id} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", getTypeColor(record.type))}>
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingRecord(record)}
                    className="p-2 bg-secondary/80 hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="p-2 bg-secondary/80 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors text-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                    {record.type}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {format(new Date(record.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight mb-2">{record.title}</h3>
                
                {record.doctor && (
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    {record.doctor}
                  </p>
                )}
                
                {record.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {record.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingRecord) && (
        <RecordForm 
          record={editingRecord} 
          onClose={() => {
            setShowForm(false);
            setEditingRecord(undefined);
          }} 
        />
      )}
    </div>
  );
}
