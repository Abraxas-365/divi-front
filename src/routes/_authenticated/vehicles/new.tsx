import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateVehicle } from "@/domains/vehicles/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VehicleForm, type VehicleFormValues } from "@/components/vehicles/vehicle-form";

export const Route = createFileRoute("/_authenticated/vehicles/new")({
  component: NewVehiclePage,
  staticData: { breadcrumb: "Nuevo Veh\u00edculo" },
});

function NewVehiclePage() {
  const navigate = useNavigate();
  const createVehicle = useCreateVehicle();

  function handleSubmit(data: VehicleFormValues) {
    createVehicle.mutate(
      { body: data },
      {
        onSuccess: (vehicle) => {
          void navigate({
            to: "/vehicles/$vehicleId",
            params: { vehicleId: vehicle.id },
          });
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Veh&iacute;culo</CardTitle>
          <CardDescription>
            Ingresa los datos del veh&iacute;culo para iniciar una inspecci&oacute;n.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleForm
            onSubmit={handleSubmit}
            isPending={createVehicle.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
