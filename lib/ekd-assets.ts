// EKD Digital Assets API Client
import { EKD_ASSETS_CONFIG } from "./constants";

export interface UploadAssetParams {
  file: File | Blob;
  assetType: "image" | "video" | "document" | "audio" | "3d" | "archive";
  tags?: string[];
}

export interface AssetResponse {
  id: string;
  name: string;
  asset_type: string;
  size: number;
  mime_type: string;
  download_url: string;
  created_at: string;
  tags?: string[];
}

class EKDAssetsClient {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private clientId: string;
  private projectName: string;

  constructor() {
    this.baseUrl = EKD_ASSETS_CONFIG.baseUrl;
    this.apiKey = EKD_ASSETS_CONFIG.apiKey;
    this.apiSecret = EKD_ASSETS_CONFIG.apiSecret;
    this.clientId = EKD_ASSETS_CONFIG.clientId;
    this.projectName = EKD_ASSETS_CONFIG.projectName;
  }

  private getHeaders(): HeadersInit {
    return {
      "X-API-Key": this.apiKey,
      "X-API-Secret": this.apiSecret,
    };
  }

  async uploadAsset({
    file,
    assetType,
    tags,
  }: UploadAssetParams): Promise<AssetResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("asset_type", assetType);
    formData.append("client_id", this.clientId);
    formData.append("project_name", this.projectName);

    if (tags && tags.length > 0) {
      formData.append("tags", tags.join(","));
    }

    const response = await fetch(`${this.baseUrl}/api/v1/assets/upload`, {
      method: "POST",
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`);
    }

    return response.json();
  }

  getAssetUrl(assetId: string): string {
    return `${this.baseUrl}/api/v1/assets/${assetId}/download`;
  }

  async listAssets(params?: {
    limit?: number;
    offset?: number;
    assetType?: string;
  }): Promise<AssetResponse[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.assetType) queryParams.append("asset_type", params.assetType);

    const response = await fetch(
      `${this.baseUrl}/api/v1/assets?${queryParams.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list assets: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteAsset(assetId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/assets/${assetId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete asset: ${response.statusText}`);
    }
  }
}

export const ekdAssets = new EKDAssetsClient();
