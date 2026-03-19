import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMedicalMutations } from "@/hooks/use-medical-mutations";
import { MedicalRecord } from "@workspace/api-client-react";
import { X, Loader2 } from "lucide-react";

const recordSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  doctor: z.string().optional().nullable(),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional().nullable(),
});

type RecordFormData = z.infer<typeof recordSchema>;

interface RecordFormProps {
  record?: MedicalRecord;
  onClose: () => void;
}

export function RecordForm({ record, onClose }: RecordFormProps) {
  const { createRecord, updateRecord } = useMedicalMutations();
  const isEditing = !!record;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      type: "visit",
      title: "",
      description: "",
      doctor: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        type: record.type,
        title: record.title,
        description: record.description || "",
        doctor: record.doctor || "",
        date: record.date.split("T")[0],
        notes: record.notes || "",
      });
    }
  }, [record, reset]);

  const onSubmit = async (data: RecordFormData) => {
    if (isEditing) {
      await updateRecord.mutateAsync({ id: record.id, data });
    } else {
      await createRecord.mutateAsync({ data });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-border">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-secondary/30">
          <h2 className="font-display text-xl font-semibold text-foreground">
            {isEditing ? "Edit Medical Record" : "Add Medical Record"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="record-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Record Type</label>
                <select
                  {...register("type")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                >
                  <option value="visit">Clinical Visit</option>
                  <option value="diagnosis">Diagnosis</option>
                  <option value="procedure">Procedure</option>
                  <option value="lab">Lab Result</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="other">Other</option>
                </select>
                {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title / Reason for visit</label>
              <input
                type="text"
                placeholder="e.g. Annual Checkup, Blood Work"
                {...register("title")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Doctor / Facility</label>
              <input
                type="text"
                placeholder="Dr. Smith / City Hospital"
                {...register("doctor")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description & Findings</label>
              <textarea
                rows={3}
                placeholder="Brief description of the visit or results..."
                {...register("description")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Additional Notes</label>
              <textarea
                rows={2}
                placeholder="Any personal notes..."
                {...register("notes")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-background flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            form="record-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Save Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
