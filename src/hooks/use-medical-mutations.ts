import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateMedicalRecord,
  useUpdateMedicalRecord,
  useDeleteMedicalRecord,
  useCreateMedication,
  useUpdateMedication,
  useDeleteMedication,
  getListMedicalRecordsQueryKey,
  getListMedicationsQueryKey,
} from "@workspace/api-client-react";

export function useMedicalMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSuccess = (message: string, keys: readonly unknown[][]) => {
    toast({ title: "Success", description: message });
    keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  };

  const handleError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred.",
      variant: "destructive",
    });
  };

  const createRecord = useCreateMedicalRecord({
    mutation: {
      onSuccess: () => handleSuccess("Medical record created successfully.", [getListMedicalRecordsQueryKey()]),
      onError: handleError,
    }
  });

  const updateRecord = useUpdateMedicalRecord({
    mutation: {
      onSuccess: () => handleSuccess("Medical record updated successfully.", [getListMedicalRecordsQueryKey()]),
      onError: handleError,
    }
  });

  const deleteRecord = useDeleteMedicalRecord({
    mutation: {
      onSuccess: () => handleSuccess("Medical record deleted.", [getListMedicalRecordsQueryKey()]),
      onError: handleError,
    }
  });

  const createMedication = useCreateMedication({
    mutation: {
      onSuccess: () => handleSuccess("Medication added successfully.", [getListMedicationsQueryKey()]),
      onError: handleError,
    }
  });

  const updateMedication = useUpdateMedication({
    mutation: {
      onSuccess: () => handleSuccess("Medication updated successfully.", [getListMedicationsQueryKey()]),
      onError: handleError,
    }
  });

  const deleteMedication = useDeleteMedication({
    mutation: {
      onSuccess: () => handleSuccess("Medication removed.", [getListMedicationsQueryKey()]),
      onError: handleError,
    }
  });

  return {
    createRecord,
    updateRecord,
    deleteRecord,
    createMedication,
    updateMedication,
    deleteMedication,
  };
}
