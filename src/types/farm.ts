export interface Farm {
  id: string;
  name: string;
  location: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "worker" | "technician";
  status: "active" | "inactive";
  avatar?: string;
  dateAdded: string;
  permissions: string[];
  farmId?: string;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  size: number;
  cropType: string;
  status: "healthy" | "warning" | "critical";
  soilMoisture: number;
  sunlight: number;
  growthStage: string;
  plantingDate?: string;
  harvestDate?: string;
  fieldImage?: string;
  farmId?: string;
}
