import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMedicalMutations } from "@/hooks/use-medical-mutations";
import { Medication } from "@workspace/api-client-react";
import { X, Loader2 } from "lucide-react";

const medicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

type MedicationFormData = z.infer<typeof medicationSchema>;

interface MedicationFormProps {
  medication?: Medication;
  onClose: () => void;
}

export function MedicationForm({ medication, onClose }: MedicationFormProps) {
  const { createMedication, updateMedication } = useMedicalMutations();
  const isEditing = !!medication;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "daily",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
      notes: "",
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (medication) {
      reset({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate.split("T")[0],
        endDate: medication.endDate ? medication.endDate.split("T")[0] : "",
        isActive: medication.isActive,
        notes: medication.notes || "",
      });
    }
  }, [medication, reset]);

  const onSubmit = async (data: MedicationFormData) => {
    if (isEditing) {
      await updateMedication.mutateAsync({ id: medication.id, data });
    } else {
      await createMedication.mutateAsync({ data });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-border">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-secondary/30">
          <h2 className="font-display text-xl font-semibold text-foreground">
            {isEditing ? "Edit Medication" : "Add Medication"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="medication-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Medication Name</label>
              <input
                type="text"
                placeholder="e.g. Amoxicillin, Lisinopril"
                {...register("name")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 500mg, 2 puffs"
                  {...register("dosage")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.dosage && <p className="text-destructive text-sm">{errors.dosage.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Frequency</label>
                <input
                  type="text"
                  placeholder="e.g. Twice daily, As needed"
                  {...register("frequency")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.frequency && <p className="text-destructive text-sm">{errors.frequency.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
                {errors.startDate && <p className="text-destructive text-sm">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">End Date (Optional)</label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
              <div>
                <p className="font-medium text-foreground">Active Medication</p>
                <p className="text-sm text-muted-foreground">Are you currently taking this?</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isActive}
                  onChange={(e) => setValue("isActive", e.target.checked)}
                />
                <div className="w-11 h-6 bg-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Instructions / Notes</label>
              <textarea
                rows={3}
                placeholder="Take with food, avoid alcohol..."
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
            form="medication-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Add Medication"}
          </button>
        </div>
      </div>
    </div>
  );
}
