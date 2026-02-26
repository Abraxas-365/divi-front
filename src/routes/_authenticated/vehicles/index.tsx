import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Car } from "lucide-react";
import { useVehicles } from "@/domains/vehicles/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/vehicles/")({
  component: VehiclesPage,
  staticData: { breadcrumb: "Veh\u00edculos" },
});

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
};

function VehiclesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const { data, isLoading } = useVehicles(page, pageSize);

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.page_size) : 1;

  const filtered = search
    ? items.filter(
        (v) =>
          v.brand.toLowerCase().includes(search.toLowerCase()) ||
          v.model.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Veh&iacute;culos</CardTitle>
          <CardAction>
            <Button asChild>
              <Link to="/vehicles/new">
                <Plus className="mr-2 size-4" />
                Nuevo Veh&iacute;culo
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por marca o modelo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Car className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-muted-foreground">
                  No se encontraron veh&iacute;culos
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Agrega tu primer veh&iacute;culo para comenzar.
                </p>
              </div>
              <Button asChild className="mt-2">
                <Link to="/vehicles/new">
                  <Plus className="mr-2 size-4" />
                  Crear veh&iacute;culo
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Veh&iacute;culo</TableHead>
                      <TableHead>A&ntilde;o</TableHead>
                      <TableHead>Kilometraje</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Creado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((vehicle) => (
                      <TableRow key={vehicle.id} className="cursor-pointer">
                        <TableCell>
                          <Link
                            to="/vehicles/$vehicleId"
                            params={{ vehicleId: vehicle.id }}
                            className="font-medium hover:underline"
                          >
                            {vehicle.brand} {vehicle.model}
                          </Link>
                        </TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell className="tabular-nums">
                          {vehicle.mileage_km.toLocaleString()} km
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vehicle.status === "published" ? "success" : "secondary"
                            }
                          >
                            {statusLabels[vehicle.status] ?? vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(vehicle.created_at).toLocaleDateString("es")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 md:hidden">
                {filtered.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    to="/vehicles/$vehicleId"
                    params={{ vehicleId: vehicle.id }}
                    className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">
                        {vehicle.brand} {vehicle.model}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {vehicle.year} &middot; {vehicle.mileage_km.toLocaleString()} km
                      </span>
                    </div>
                    <Badge
                      variant={
                        vehicle.status === "published" ? "success" : "secondary"
                      }
                    >
                      {statusLabels[vehicle.status] ?? vehicle.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            </>
          )}

          {pagination && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pagination.total} veh&iacute;culo{pagination.total !== 1 ? "s" : ""} en total
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
