import { endpoint, t } from "@/lib/api-client";
import type {
  VehicleDTO,
  VehicleListResponseDTO,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleSpecsDTO,
  UpdateSpecsRequest,
  EnrichResponse,
  PhotoDTO,
  InspectResponse,
  FindingDTO,
  UpdateFindingRequest,
  PreviewResponse,
} from "./types";

export const vehiclesSchema = {
  list: endpoint({
    method: "GET",
    path: "/api/v1/vehicles",
    request: {
      query: t<{ page?: number; page_size?: number }>(),
    },
    response: { ok: t<VehicleListResponseDTO>() },
  }),

  get: endpoint({
    method: "GET",
    path: "/api/v1/vehicles/:id",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<VehicleDTO>() },
  }),

  create: endpoint({
    method: "POST",
    path: "/api/v1/vehicles",
    request: {
      body: t<CreateVehicleRequest>(),
    },
    response: { ok: t<VehicleDTO>() },
  }),

  update: endpoint({
    method: "PATCH",
    path: "/api/v1/vehicles/:id",
    request: {
      path: t<{ id: string }>(),
      body: t<UpdateVehicleRequest>(),
    },
    response: { ok: t<VehicleDTO>() },
  }),

  updateSpecs: endpoint({
    method: "PATCH",
    path: "/api/v1/vehicles/:id/specs",
    request: {
      path: t<{ id: string }>(),
      body: t<UpdateSpecsRequest>(),
    },
    response: { ok: t<VehicleSpecsDTO>() },
  }),

  enrich: endpoint({
    method: "POST",
    path: "/api/v1/vehicles/:id/enrich",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<EnrichResponse>() },
  }),

  uploadPhoto: endpoint({
    method: "POST",
    path: "/api/v1/vehicles/:id/photos",
    request: {
      path: t<{ id: string }>(),
      body: t<FormData>(),
    },
    response: { ok: t<PhotoDTO>() },
  }),

  inspect: endpoint({
    method: "POST",
    path: "/api/v1/vehicles/:id/inspect",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<InspectResponse>() },
  }),

  updateFinding: endpoint({
    method: "PATCH",
    path: "/api/v1/findings/:id",
    request: {
      path: t<{ id: string }>(),
      body: t<UpdateFindingRequest>(),
    },
    response: { ok: t<FindingDTO>() },
  }),

  preview: endpoint({
    method: "GET",
    path: "/api/v1/vehicles/:id/preview",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<PreviewResponse>() },
  }),

  listingJson: endpoint({
    method: "GET",
    path: "/api/v1/vehicles/:id/listing.json",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<PreviewResponse>() },
  }),

  reportPdf: endpoint({
    method: "GET",
    path: "/api/v1/vehicles/:id/report.pdf",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<Blob>() },
    options: { parseAs: "blob" },
  }),

  publish: endpoint({
    method: "POST",
    path: "/api/v1/vehicles/:id/publish",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<VehicleDTO>() },
  }),

  delete: endpoint({
    method: "DELETE",
    path: "/api/v1/vehicles/:id",
    request: {
      path: t<{ id: string }>(),
    },
    response: { ok: t<void>() },
  }),
} as const;
