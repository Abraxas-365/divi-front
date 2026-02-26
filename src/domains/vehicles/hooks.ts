import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/domains";
import { toast } from "sonner";

// ─── Queries ────────────────────────────────────────────────────────────────

export function useVehicles(page = 1, pageSize = 10) {
  return useQuery(
    api.vehicles.list.$queryOptions({ query: { page, page_size: pageSize } }),
  );
}

export function useVehicle(id: string) {
  return useQuery({
    ...api.vehicles.get.$queryOptions({ path: { id } }),
    enabled: !!id,
  });
}

export function useVehiclePreview(id: string) {
  return useQuery({
    ...api.vehicles.preview.$queryOptions({ path: { id } }),
    enabled: !!id,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.create.$mutationFn(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.vehicles.list.$key({ query: {} }),
      });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.update.$mutationFn(),
    onSuccess: (_data, variables) => {
      const id = (variables as { path: { id: string } }).path.id;
      queryClient.invalidateQueries({
        queryKey: api.vehicles.get.$key({ path: { id } }),
      });
      queryClient.invalidateQueries({
        queryKey: api.vehicles.list.$key({ query: {} }),
      });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.delete.$mutationFn(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.vehicles.list.$key({ query: {} }),
      });
    },
  });
}

export function useUpdateSpecs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.updateSpecs.$mutationFn(),
    onSuccess: (_data, variables) => {
      const id = (variables as { path: { id: string } }).path.id;
      queryClient.invalidateQueries({
        queryKey: api.vehicles.preview.$key({ path: { id } }),
      });
    },
  });
}

export function useEnrichVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.enrich.$mutationFn(),
    onSuccess: (_data, variables) => {
      const id = (variables as { path: { id: string } }).path.id;
      toast.success("Vehicle enriched with AI-powered specs and equipment");
      queryClient.invalidateQueries({
        queryKey: api.vehicles.preview.$key({ path: { id } }),
      });
      queryClient.invalidateQueries({
        queryKey: api.vehicles.get.$key({ path: { id } }),
      });
    },
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.uploadPhoto.$mutationFn(),
    onSuccess: (_data, variables) => {
      const id = (variables as { path: { id: string } }).path.id;
      queryClient.invalidateQueries({
        queryKey: api.vehicles.preview.$key({ path: { id } }),
      });
    },
  });
}

export function useRunInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.inspect.$mutationFn(),
    onSuccess: (_data, variables) => {
      const id = (variables as { path: { id: string } }).path.id;
      toast.success("AI inspection completed");
      queryClient.invalidateQueries({
        queryKey: api.vehicles.preview.$key({ path: { id } }),
      });
    },
  });
}

export function useUpdateFinding() {
  return useMutation({
    mutationFn: api.vehicles.updateFinding.$mutationFn(),
  });
}

export function usePublishVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.vehicles.publish.$mutationFn(),
    onSuccess: (_data, variables) => {
      const id = (variables as { path: { id: string } }).path.id;
      toast.success("Vehicle published successfully");
      queryClient.invalidateQueries({
        queryKey: api.vehicles.get.$key({ path: { id } }),
      });
      queryClient.invalidateQueries({
        queryKey: api.vehicles.list.$key({ query: {} }),
      });
      queryClient.invalidateQueries({
        queryKey: api.vehicles.preview.$key({ path: { id } }),
      });
    },
  });
}

export function useDownloadReport(vehicleId: string) {
  return useQuery({
    ...api.vehicles.reportPdf.$queryOptions({ path: { id: vehicleId } }),
    enabled: false, // Only fetch on demand
  });
}
