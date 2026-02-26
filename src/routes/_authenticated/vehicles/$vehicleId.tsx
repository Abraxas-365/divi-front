import { useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  ScanSearch,
  Download,
  Rocket,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
  useVehicle,
  useVehiclePreview,
  useEnrichVehicle,
  useRunInspection,
  usePublishVehicle,
  useDeleteVehicle,
  useUploadPhoto,
  useUpdateFinding,
  useUpdateSpecs,
} from "@/domains/vehicles/hooks";
import { api } from "@/domains";
import { env } from "@/lib/env";
import type { PhotoZone, UpdateFindingRequest } from "@/domains/vehicles/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { ScoreBreakdown } from "@/components/vehicles/score-gauge";
import { PhotoUpload } from "@/components/vehicles/photo-upload";
import { FindingsList } from "@/components/vehicles/findings-list";
import { EquipmentList } from "@/components/vehicles/equipment-list";
import { SpecsForm } from "@/components/vehicles/specs-form";
import { VehicleQRCode } from "@/components/vehicles/vehicle-qr-code";

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
};

export const Route = createFileRoute("/_authenticated/vehicles/$vehicleId")({
  component: VehicleDetailPage,
  staticData: { breadcrumb: "Detalle" },
});

function VehicleDetailPage() {
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId);
  const { data: preview, isLoading: previewLoading } =
    useVehiclePreview(vehicleId);

  const enrichVehicle = useEnrichVehicle();
  const runInspection = useRunInspection();
  const publishVehicle = usePublishVehicle();
  const deleteVehicle = useDeleteVehicle();
  const uploadPhoto = useUploadPhoto();
  const updateFinding = useUpdateFinding();
  const updateSpecs = useUpdateSpecs();

  const handleUploadPhoto = useCallback(
    (vid: string, zone: PhotoZone, file: File) => {
      const formData = new FormData();
      formData.append("zone", zone);
      formData.append("photo", file);
      uploadPhoto.mutate({ path: { id: vid }, body: formData });
    },
    [uploadPhoto],
  );

  const handleUpdateFinding = useCallback(
    (findingId: string, data: UpdateFindingRequest) => {
      updateFinding.mutate(
        { path: { id: findingId }, body: data },
        {
          onSuccess: () => toast.success("Hallazgo actualizado"),
        },
      );
    },
    [updateFinding],
  );

  const handleDownloadPdf = useCallback(async () => {
    try {
      const blob = await api.vehicles.reportPdf({ path: { id: vehicleId } });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_inspeccion_${vehicleId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Error al descargar el reporte");
    }
  }, [vehicleId]);

  if (vehicleLoading || previewLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-lg font-medium text-muted-foreground">
          Veh&iacute;culo no encontrado
        </p>
        <Button variant="outline" onClick={() => navigate({ to: "/vehicles" })}>
          <ArrowLeft className="mr-2 size-4" />
          Volver a Veh&iacute;culos
        </Button>
      </div>
    );
  }

  const inspection = preview?.inspection?.inspection;
  const findings = preview?.inspection?.findings ?? [];
  const photos = preview?.inspection?.photos ?? [];
  const equipment = preview?.equipment ?? [];
  const specs = preview?.specs ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: "/vehicles" })}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </h1>
              <Badge
                variant={
                  vehicle.status === "published" ? "success" : "secondary"
                }
              >
                {statusLabels[vehicle.status] ?? vehicle.status}
              </Badge>
            </div>
            {vehicle.plate && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                Placa: {vehicle.plate}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              enrichVehicle.mutate({ path: { id: vehicleId } })
            }
            disabled={enrichVehicle.isPending}
          >
            {enrichVehicle.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            {enrichVehicle.isPending ? "Enriqueciendo..." : "Enriquecer"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              runInspection.mutate({ path: { id: vehicleId } })
            }
            disabled={runInspection.isPending || photos.length === 0}
          >
            {runInspection.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ScanSearch className="mr-2 size-4" />
            )}
            {runInspection.isPending ? "Inspeccionando..." : "Inspeccionar"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="mr-2 size-4" />
            PDF
          </Button>
          {vehicle.status === "draft" && (
            <Button
              size="sm"
              onClick={() =>
                publishVehicle.mutate({ path: { id: vehicleId } })
              }
              disabled={publishVehicle.isPending}
            >
              {publishVehicle.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Rocket className="mr-2 size-4" />
              )}
              {publishVehicle.isPending ? "Publicando..." : "Publicar"}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 size-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  &iquest;Eliminar veh&iacute;culo?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acci&oacute;n eliminar&aacute; permanentemente{" "}
                  {vehicle.brand} {vehicle.model} y todos sus datos de
                  inspecci&oacute;n.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteVehicle.mutate(
                      { path: { id: vehicleId } },
                      {
                        onSuccess: () => {
                          toast.success("Veh\u00edculo eliminado");
                          void navigate({ to: "/vehicles" });
                        },
                      },
                    )
                  }
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Scores */}
      {inspection && inspection.score_overall != null && (
        <Card>
          <CardContent className="pt-6">
            <ScoreBreakdown
              overall={inspection.score_overall}
              exterior={(inspection as any).score_exterior ?? 0}
              interior={(inspection as any).score_interior ?? 0}
              mechanical={(inspection as any).score_mechanical ?? 0}
              tires={(inspection as any).score_tires ?? 0}
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="photos">
            Fotos
            {photos.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {photos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="equipment">
            Equipamiento
            {equipment.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {equipment.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informaci&oacute;n del Veh&iacute;culo</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <InfoRow label="Marca" value={vehicle.brand} />
                <InfoRow label="Modelo" value={vehicle.model} />
                <InfoRow label="Versi&oacute;n" value={vehicle.version} />
                <InfoRow label="Acabado" value={vehicle.trim} />
                <InfoRow label="A&ntilde;o" value={String(vehicle.year)} />
                <InfoRow
                  label="Kilometraje"
                  value={`${vehicle.mileage_km.toLocaleString()} km`}
                />
                <InfoRow label="Placa" value={vehicle.plate} />
                <InfoRow
                  label="Precio"
                  value={
                    vehicle.price_usd
                      ? `$${vehicle.price_usd.toLocaleString()}`
                      : ""
                  }
                />
                <InfoRow label="Color Ext." value={vehicle.color_exterior} />
                <InfoRow label="Color Int." value={vehicle.color_interior} />
                <InfoRow label="Sucursal" value={vehicle.branch} />
                <InfoRow label="Origen" value={vehicle.origin} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
              <CardDescription>
                {specs?.specs_source
                  ? `Fuente: ${specs.specs_source} (${Math.round((specs.specs_confidence ?? 0) * 100)}% confianza)`
                  : "Edita manualmente o haz clic en Enriquecer para autocompletar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpecsForm
                specs={specs}
                onSubmit={(data) =>
                  updateSpecs.mutate({ path: { id: vehicleId }, body: data })
                }
                isPending={updateSpecs.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos & Inspection Tab */}
        <TabsContent value="photos" className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
              <CardDescription>
                Sube fotos por zona. Se requiere al menos una foto antes de
                ejecutar una inspecci&oacute;n.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                vehicleId={vehicleId}
                photos={photos}
                onUpload={handleUploadPhoto}
                isUploading={uploadPhoto.isPending}
                backendUrl={env.BACKEND_URL}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hallazgos</CardTitle>
              <CardDescription>
                {findings.length} hallazgo{findings.length !== 1 ? "s" : ""}{" "}
                detectado{findings.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FindingsList
                findings={findings}
                onUpdate={handleUpdateFinding}
                isUpdating={updateFinding.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Equipamiento</CardTitle>
              <CardDescription>
                Caracter&iacute;sticas y equipamiento detectados mediante enriquecimiento con IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentList equipment={equipment} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Veh&iacute;culo</CardTitle>
              <CardDescription>
                Datos completos del veh&iacute;culo tal como aparecer&aacute;n en los listados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preview ? (
                <pre className="overflow-auto rounded-xl bg-muted p-4 text-xs">
                  {JSON.stringify(preview, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  A&uacute;n no hay datos de vista previa disponibles.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-4">
            <VehicleQRCode
              vehicleId={vehicleId}
              baseUrl={env.BACKEND_URL}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "\u2014"}</dd>
    </div>
  );
}
