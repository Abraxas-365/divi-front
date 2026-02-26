// ─── Enums / Unions ─────────────────────────────────────────────────────────

export type VehicleStatus = "draft" | "published";

export type PhotoZone =
  | "front"
  | "rear"
  | "left"
  | "right"
  | "front_left"
  | "rear_right"
  | "interior_driver"
  | "interior_passenger"
  | "interior_rear"
  | "dashboard"
  | "infotainment"
  | "engine"
  | "trunk"
  | "closeup";

export type FindingType =
  | "scratch"
  | "dent"
  | "rust"
  | "paint_mismatch"
  | "wear"
  | "crack"
  | "stain"
  | "missing_part";

export type FindingSeverity = "minor" | "moderate" | "major";

export type FindingZone =
  | "front"
  | "rear"
  | "left"
  | "right"
  | "roof"
  | "interior_front"
  | "interior_rear"
  | "engine"
  | "trunk"
  | "tires";

// ─── Vehicle ────────────────────────────────────────────────────────────────

export interface VehicleDTO {
  id: string;
  plate: string;
  brand: string;
  model: string;
  version: string;
  trim: string;
  year: number;
  mileage_km: number;
  color_exterior: string;
  color_interior: string;
  price_usd: number;
  branch: string;
  origin: string;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

export interface VehicleListItemDTO {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage_km: number;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

export interface VehicleListResponseDTO {
  items: VehicleListItemDTO[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

export interface CreateVehicleRequest {
  brand: string;
  model: string;
  version?: string;
  trim?: string;
  year: number;
  mileage_km: number;
  plate?: string;
  color_exterior?: string;
  color_interior?: string;
  price_usd?: number;
  branch?: string;
  origin?: string;
}

export interface UpdateVehicleRequest {
  brand?: string;
  model?: string;
  version?: string;
  trim?: string;
  year?: number;
  mileage_km?: number;
  plate?: string;
  color_exterior?: string;
  color_interior?: string;
  price_usd?: number;
  branch?: string;
  origin?: string;
}

// ─── Specs ──────────────────────────────────────────────────────────────────

export interface VehicleSpecsDTO {
  id: string;
  vehicle_id: string;
  engine_type: string;
  engine_cc: number;
  engine_cylinders: number;
  power_hp: number;
  power_kw: number;
  torque_nm: number;
  fuel_type: string;
  transmission_type: string;
  transmission_gears: number;
  drivetrain: string;
  accel_0_100: number;
  top_speed_kmh: number;
  fuel_city_kml: number;
  fuel_highway_kml: number;
  fuel_combined_kml: number;
  fuel_tank_liters: number;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  wheelbase_mm: number;
  cargo_liters: number;
  curb_weight_kg: number;
  tire_size: string;
  specs_source?: string;
  specs_confidence?: number;
  enriched_at?: string;
}

export interface UpdateSpecsRequest {
  engine_type?: string;
  engine_cc?: number;
  engine_cylinders?: number;
  power_hp?: number;
  power_kw?: number;
  torque_nm?: number;
  fuel_type?: string;
  transmission_type?: string;
  transmission_gears?: number;
  drivetrain?: string;
  accel_0_100?: number;
  top_speed_kmh?: number;
  fuel_city_kml?: number;
  fuel_highway_kml?: number;
  fuel_combined_kml?: number;
  fuel_tank_liters?: number;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  wheelbase_mm?: number;
  cargo_liters?: number;
  curb_weight_kg?: number;
  tire_size?: string;
}

// ─── Equipment ──────────────────────────────────────────────────────────────

export interface EquipmentDTO {
  id: string;
  vehicle_id: string;
  category: string;
  feature_name: string;
  is_standard: boolean;
  is_confirmed: boolean;
  source: string;
}

// ─── Photos ─────────────────────────────────────────────────────────────────

export interface PhotoDTO {
  id: string;
  inspection_id: string;
  photo_url: string;
  zone: PhotoZone;
  sort_order: number;
  uploaded_at: string;
}

// ─── Inspection ─────────────────────────────────────────────────────────────

export interface InspectionDTO {
  id: string;
  vehicle_id: string;
  inspector_name: string;
  inspector_branch: string;
  score_overall: number;
  score_exterior: number;
  score_interior: number;
  score_mechanical: number;
  score_tires: number;
  photos_count: number;
  findings_count: number;
  status: string;
  inspected_at: string;
  created_at: string;
  updated_at: string;
}

export interface FindingDTO {
  id: string;
  inspection_id: string;
  zone: FindingZone;
  finding_type: FindingType;
  severity: FindingSeverity;
  description: string;
  ai_confidence: number;
  confirmed_by_human: boolean;
}

export interface UpdateFindingRequest {
  zone?: FindingZone;
  finding_type?: FindingType;
  severity?: FindingSeverity;
  description?: string;
  confirmed_by_human?: boolean;
}

// ─── Composite Responses ────────────────────────────────────────────────────

export interface EnrichResponse {
  vehicle: Pick<VehicleDTO, "id" | "brand" | "model" | "year" | "status">;
  specs: VehicleSpecsDTO;
  equipment: EquipmentDTO[];
  listing: unknown | null;
}

export interface InspectResponse {
  inspection: InspectionDTO;
  findings: FindingDTO[];
  photos: PhotoDTO[];
}

export interface PreviewResponse {
  vehicle: Pick<
    VehicleDTO,
    | "id"
    | "brand"
    | "model"
    | "version"
    | "year"
    | "mileage_km"
    | "status"
    | "created_at"
    | "updated_at"
  >;
  specs: Partial<VehicleSpecsDTO> | null;
  equipment: Pick<EquipmentDTO, "category" | "feature_name" | "is_standard" | "source">[];
  listing: unknown | null;
  inspection: {
    inspection: Pick<InspectionDTO, "id" | "score_overall" | "status"> | null;
    findings: FindingDTO[];
    photos: PhotoDTO[];
  } | null;
}
