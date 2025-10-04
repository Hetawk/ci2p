# EKD Digital Assets API - Developer Guide

Simple, powerful asset management API. Upload, store, and deliver assets with a few API calls.

## 🚀 **Quick Start**

### 1. Environment Setup

```env
EKD_DIGITAL_ASSETS_API_URL="https://www.assets.andgroupco.com"
EKD_DIGITAL_ASSETS_API_KEY="your-api-key"
EKD_DIGITAL_ASSETS_API_SECRET="your-api-secret"
EKD_DIGITAL_ASSETS_CLIENT_IDENTIFIER="your-client-id"
EKD_DIGITAL_ASSETS_PROJECT_NAME="your-project-name"
```

### 2. Authentication

All requests require API Key headers:

```javascript
const headers = {
  "X-API-Key": "your-api-key",
  "X-API-Secret": "your-api-secret",
};
```

## 📋 **Core API Endpoints**

### Upload Asset

```http
POST /api/v1/assets/upload
Content-Type: multipart/form-data
X-API-Key: your-api-key
X-API-Secret: your-api-secret

Form Data:
- file: (binary file)
- asset_type: "image" | "video" | "document" | "audio" | "3d" | "archive"
- client_id: "your-client-id"
- project_name: "your-project"
- tags: "tag1,tag2,tag3" (optional)
```

### Get Asset Info

```http
GET /api/v1/assets/{asset_id}
X-API-Key: your-api-key
X-API-Secret: your-api-secret
```

### Download Asset

```http
GET /api/v1/assets/{asset_id}/download
X-API-Key: your-api-key
X-API-Secret: your-api-secret
```

### List Assets

```http
GET /api/v1/assets?limit=20&offset=0&asset_type=image&tags=product
X-API-Key: your-api-key
X-API-Secret: your-api-secret
```

### Delete Asset

```http
DELETE /api/v1/assets/{asset_id}
X-API-Key: your-api-key
X-API-Secret: your-api-secret
```

## 📊 **Response Format**

### Upload Response

```json
{
  "id": "uuid-here",
  "name": "filename.jpg",
  "asset_type": "image",
  "size": 1024576,
  "mime_type": "image/jpeg",
  "download_url": "/api/v1/assets/{id}/download",
  "created_at": "2025-01-01T00:00:00Z",
  "tags": ["product", "marketplace"]
}
```

### List Response

```json
{
  "assets": [
    {
      "id": "uuid-here",
      "name": "filename.jpg",
      "asset_type": "image",
      "size": 1024576,
      "mime_type": "image/jpeg",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

## 💡 **Usage Examples**

### JavaScript/Node.js Upload

```javascript
const formData = new FormData();
formData.append("file", fileBlob);
formData.append("asset_type", "image");
formData.append("client_id", "my-app");
formData.append("project_name", "uploads");

const response = await fetch(
  "https://www.assets.andgroupco.com/api/v1/assets/upload",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "X-API-Secret": "your-api-secret",
    },
    body: formData,
  }
);

const asset = await response.json();
console.log("Asset ID:", asset.id);
```

### Python Upload

```python
import requests

files = {'file': open('image.jpg', 'rb')}
data = {
    'asset_type': 'image',
    'client_id': 'my-app',
    'project_name': 'uploads'
}
headers = {
    'X-API-Key': 'your-api-key',
    'X-API-Secret': 'your-api-secret'
}

response = requests.post(
    'https://www.assets.andgroupco.com/api/v1/assets/upload',
    files=files,
    data=data,
    headers=headers
)

asset = response.json()
print(f"Asset ID: {asset['id']}")
```

### cURL Upload

```bash
curl -X POST https://www.assets.andgroupco.com/api/v1/assets/upload \
  -H "X-API-Key: your-api-key" \
  -H "X-API-Secret: your-api-secret" \
  -F "file=@image.jpg" \
  -F "asset_type=image" \
  -F "client_id=my-app" \
  -F "project_name=uploads"
```

### Display Asset

```html
<!-- Direct image display -->
<img
  src="https://www.assets.andgroupco.com/api/v1/assets/{asset_id}/download"
  alt="Asset"
/>

<!-- With authentication headers (if needed) -->
<script>
  const img = document.createElement("img");
  fetch("https://www.assets.andgroupco.com/api/v1/assets/{asset_id}/download", {
    headers: {
      "X-API-Key": "your-api-key",
      "X-API-Secret": "your-api-secret",
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      img.src = URL.createObjectURL(blob);
    });
</script>
```

## ⚙️ **Required Fields**

### Upload Fields

| Field          | Type   | Required | Description                                      |
| -------------- | ------ | -------- | ------------------------------------------------ |
| `file`         | File   | ✅       | The file to upload                               |
| `asset_type`   | String | ✅       | Type: image, video, document, audio, 3d, archive |
| `client_id`    | String | ✅       | Your client identifier                           |
| `project_name` | String | ✅       | Project name for organization                    |
| `tags`         | String | ❌       | Comma-separated tags                             |

### Query Parameters (List)

| Parameter    | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| `limit`      | Number | Number of assets to return (default: 50) |
| `offset`     | Number | Number of assets to skip (default: 0)    |
| `asset_type` | String | Filter by asset type                     |
| `tags`       | String | Filter by tags                           |

## 🔧 **Error Handling**

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API keys)
- `404` - Asset not found
- `413` - File too large (max 100MB)
- `500` - Server error

### Error Response Format

```json
{
  "error": "Invalid asset type",
  "details": "Asset type must be one of: image, video, document, audio, 3d, archive"
}
```

## 🚀 **Ready to Use**

1. **Get API credentials** from EKD Digital Assets
2. **Set environment variables** or store credentials securely
3. **Upload assets** using the `/api/v1/assets/upload` endpoint
4. **Display assets** using the `/api/v1/assets/{id}/download` URL
5. **Manage assets** with list and delete endpoints

The EKD Digital Assets API works with any programming language that can make HTTP requests!

## 🚀 **Quick Start**

### 1. Environment Configuration

```env
# Required Environment Variables
EKD_DIGITAL_ASSETS_API_URL="https://www.assets.andgroupco.com"
EKD_DIGITAL_ASSETS_API_KEY="your-api-key"
EKD_DIGITAL_ASSETS_API_SECRET="your-api-secret"
EKD_DIGITAL_ASSETS_CLIENT_IDENTIFIER="your-client-id"
EKD_DIGITAL_ASSETS_PROJECT_NAME="your-project-name"
EKD_DIGITAL_ASSETS_DEFAULT_TAGS="tag1,tag2,tag3"
```

### 2. Upload Asset (Frontend)

```typescript
import { uploadAsset } from "@/lib/asset-utils";

const uploadFile = async (file: File) => {
  try {
    const asset = await uploadAsset({
      file,
      title: "My Asset",
      description: "Asset description",
      assetType: "image",
      tags: ["product", "marketplace"],
      isPublic: true,
    });

    console.log("Upload successful:", asset.publicUrl);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### 3. Display Asset

```tsx
import { AssetImage } from "@/components/assets/AssetComponents";
import { getEKDAssetService } from "@/lib/ekd-assets";

// Using pre-built component
<AssetImage asset={asset} width={300} height={200} alt="Asset" />;

// Manual URL generation
const ekdService = getEKDAssetService();
const assetUrl = ekdService.getPublicAssetUrl(asset);

<img src={assetUrl} alt="Asset" />;
```

### 4. List Assets

```typescript
import { listAssets } from "@/lib/asset-utils";

const loadAssets = async () => {
  const result = await listAssets({
    limit: 20,
    assetType: "image",
    tags: "product",
  });

  console.log(`Found ${result.total} assets`);
  return result.assets;
};
```

## 📋 **Core Architecture**

### API Endpoints (EKD Remote)

- **Upload**: `POST /api/v1/assets/upload`
- **Download**: `GET /api/v1/assets/{id}/download`
- **List**: `GET /api/v1/assets`
- **Delete**: `DELETE /api/v1/assets/{id}`
- **Metadata**: `GET /api/v1/assets/{id}`

### Internal Endpoints (Your App)

- **Upload Proxy**: `POST /api/assets/upload`
- **List Assets**: `GET /api/assets`
- **Asset Details**: `GET /api/assets/{id}`

## 🔧 **Core Service Architecture**

### Primary Service: `lib/ekd-assets.ts`

```typescript
import { getEKDAssetService } from "@/lib/ekd-assets";

const ekdService = getEKDAssetService();

// Upload asset
const asset = await ekdService.uploadAsset({
  filePath: "/path/to/file",
  fileName: "image.jpg",
  assetType: "image",
  tags: ["product", "user:123"],
  publicId: "unique-identifier",
});

// Get asset metadata
const assetData = await ekdService.getAsset(assetId);

// List assets with filtering
const result = await ekdService.listAssets({
  limit: 50,
  assetType: "image",
  projectName: "my-project",
  tags: "product",
});

// Delete asset
await ekdService.deleteAsset(assetId);

// Generate URLs
const downloadUrl = ekdService.getDownloadUrl(assetId);
const publicUrl = ekdService.getPublicAssetUrl(asset);

// Health check
const health = await ekdService.checkHealth();
console.log(`API Status: ${health.status}, Auth: ${health.authenticated}`);
```

### Authentication Methods

The service uses **API Key Authentication**:

```typescript
// Headers automatically included
{
  "X-API-Key": "your-api-key",
  "X-API-Secret": "your-api-secret"
}
```

## 🎯 **Frontend Integration**

### Upload Utilities: `lib/asset-utils.ts`

```typescript
import { uploadAsset, uploadImage, listAssets } from "@/lib/asset-utils";

// Upload with progress tracking
const handleUpload = async (file: File) => {
  const asset = await uploadAsset(
    {
      file,
      title: "Product Image",
      assetType: "image",
      tags: ["marketplace", "product"],
      isPublic: true,
    },
    (progress) => {
      console.log(`Upload: ${progress.percentage}%`);
    }
  );

  return asset;
};

// Simple image upload
const imageAsset = await uploadImage(file, "Profile Picture", [
  "profile",
  "user",
]);

// List user assets
const userAssets = await listAssets({
  limit: 20,
  assetType: "image",
});
```

### React Hooks: `lib/hooks/useAssets.ts`

```typescript
import { useAssetUrl, useAssetUrls } from "@/lib/hooks/useAssets";

function ProductImage({ asset }) {
  const { url, loading, error } = useAssetUrl(asset, {
    urlType: "public",
    useSignedUrl: false,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <img src={url} alt="Product" />;
}

function AssetGallery({ assets }) {
  const { urls, loading, error } = useAssetUrls(assets);

  return (
    <div className="grid grid-cols-3 gap-4">
      {assets.map((asset) => (
        <img key={asset.id} src={urls[asset.id]} alt={asset.name} />
      ))}
    </div>
  );
}
```

### Pre-built Components: `components/assets/AssetComponents.tsx`

```tsx
import {
  AssetImage,
  AssetGallery,
  AssetDownload,
  AssetInfo
} from "@/components/assets/AssetComponents";

// Single asset image with automatic loading states
<AssetImage
  asset={asset}
  width={400}
  height={300}
  useSignedUrl={false}
  urlType="public"
  onError={(error) => console.error(error)}
/>

// Asset gallery with multiple URL strategies
<AssetGallery
  assets={assets}
  columns={4}
  useSignedUrls={false}
  urlType="public"
/>

// Download component with multiple URL options
<AssetDownload
  asset={asset}
  showAllUrls={true}
/>

// Asset metadata display
<AssetInfo
  asset={asset}
  showUrls={true}
/>
```

## 🔒 **Authentication & Security**

### API Authentication

```typescript
// Service automatically handles authentication
const ekdService = getEKDAssetService();

// Health check includes auth verification
const health = await ekdService.checkHealth();
if (!health.authenticated) {
  throw new Error("EKD API authentication failed");
}
```

### User-Scoped Assets

```typescript
// Assets are automatically tagged with user information
const asset = await ekdService.uploadAsset({
  filePath: tempFilePath,
  fileName: file.name,
  assetType: "image",
  tags: [
    "user:user-123", // User identification
    "title:my-asset", // Searchable title
    "visibility:private", // Access control
  ],
});
```

## � **Advanced Usage Patterns**

### Server-Side Upload (Production)

```typescript
// In API route: app/api/assets/upload/route.ts
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  // Create temporary file (Vercel-compatible)
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempDir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "tmp");
  const tempFilePath = path.join(tempDir, `${randomUUID()}-${file.name}`);

  fs.writeFileSync(tempFilePath, buffer);

  try {
    const ekdService = getEKDAssetService();
    const result = await ekdService.uploadAsset({
      filePath: tempFilePath,
      fileName: file.name,
      assetType: assetType,
      tags: [`user:${session.user.id}`, ...customTags],
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    return NextResponse.json({ success: true, asset: result });
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    throw error;
  }
}
```

### Batch Operations

```typescript
// Upload multiple files
const uploadMultiple = async (files: File[]) => {
  const results = await Promise.allSettled(
    files.map((file) =>
      uploadAsset({
        file,
        title: file.name,
        assetType: "image",
      })
    )
  );

  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  return successful;
};

// Bulk delete
const deleteMultiple = async (assetIds: string[]) => {
  const ekdService = getEKDAssetService();
  await Promise.all(assetIds.map((id) => ekdService.deleteAsset(id)));
};
```

### URL Management Strategies

```typescript
import { ekdAssetService } from "@/lib/services/ekd-asset-service";

// Get all available URL formats for an asset
const urls = ekdAssetService.getAllAssetUrls(asset);
console.log({
  public: urls.public, // Direct public access
  organized: urls.organized, // Organized by client/project/type
  download: urls.download, // API download endpoint
  signed: urls.signed, // Signed URL (if available)
});

// Choose optimal URL strategy
const getOptimalUrl = (asset: EKDAssetResponse) => {
  // Prefer public URL for performance
  if (ekdService.hasPublicAccess(asset)) {
    return ekdService.getPublicAssetUrl(asset);
  }

  // Fallback to download endpoint
  return ekdService.getDownloadUrl(asset.id);
};
```

## � **Asset Response Format**

```typescript
interface EKDAssetResponse {
  // Core identification
  id: string; // Unique asset ID
  name: string; // Original filename

  // File information
  asset_type: string; // image, video, document, etc.
  size: number; // File size in bytes
  mime_type: string; // MIME type

  // URLs and access
  download_url?: string; // API download path
  public_url?: string; // Direct public URL

  // Organization
  client_id?: string; // Client identifier
  project_name?: string; // Project name
  tags?: string[]; // Searchable tags

  // Metadata
  created_at: string; // Creation timestamp
  updated_at?: string; // Last update
  metadata?: Record<string, unknown>; // Extended metadata

  // Processing
  algorithm_results?: Record<string, unknown>; // AI/ML results
}
```

## 🏗️ **Project File Structure**

```
📁 Your Project Structure:

✅ CORE SERVICES:
   lib/
   ├── ekd-assets.ts                 # Main EKD service (singleton)
   ├── asset-utils.ts                # Frontend upload utilities
   └── services/
       └── ekd-asset-service.ts      # Enhanced URL management

✅ REACT INTEGRATION:
   lib/hooks/
   └── useAssets.ts                  # React hooks for asset management

✅ UI COMPONENTS:
   components/assets/
   └── AssetComponents.tsx           # Pre-built asset components

✅ API ENDPOINTS:
   app/api/assets/
   ├── upload/route.ts               # Asset upload proxy
   ├── route.ts                      # List/manage assets
   └── [id]/route.ts                 # Asset details

✅ ADMIN TOOLS:
   app/api/admin/assets/
   ├── route.ts                      # Admin asset management
   └── download/[id]/route.ts        # Admin download proxy
```

## 🌟 **Production Features**

### Performance & Reliability

- ✅ **Multiple URL Strategies**: Public, organized, download endpoints
- ✅ **Automatic Fallbacks**: Never fails to serve assets
- ✅ **Efficient Uploads**: Chunked upload support
- ✅ **Caching Ready**: CDN-compatible URLs

### Security & Access Control

- ✅ **User Authentication**: All uploads tied to authenticated users
- ✅ **API Key Security**: Secure server-to-server communication
- ✅ **Tag-based Access**: User-scoped and visibility controls
- ✅ **File Validation**: MIME type and size checking

### Developer Experience

- ✅ **TypeScript Support**: Full type definitions
- ✅ **React Hooks**: Built-in hooks for common operations
- ✅ **Pre-built Components**: Ready-to-use UI components
- ✅ **Progress Tracking**: Upload progress callbacks
- ✅ **Error Handling**: Comprehensive error states

### Scalability & Monitoring

- ✅ **Health Checks**: API connectivity monitoring
- ✅ **Batch Operations**: Efficient bulk processing
- ✅ **Tag System**: Advanced asset organization
- ✅ **Metadata Support**: Extensible asset information

## 🚀 **Common Integration Patterns**

### E-commerce Product Images

```typescript
// Upload product image
const productImage = await uploadAsset({
  file: imageFile,
  title: `Product ${productId} - Main Image`,
  assetType: "image",
  tags: ["product", `product:${productId}`, "marketplace"],
  isPublic: true,
});

// Display in product card
<AssetImage
  asset={productImage}
  width={300}
  height={300}
  alt={product.name}
  className="rounded-lg"
/>;
```

### User Profile Pictures

```typescript
// Upload profile picture
const profilePic = await uploadAsset({
  file: avatarFile,
  title: `Profile Picture - ${user.name}`,
  assetType: "image",
  tags: ["profile", `user:${user.id}`, "avatar"],
  isPublic: false,
});

// Display with fallback
<AssetImage
  asset={profilePic}
  width={64}
  height={64}
  alt={user.name}
  className="rounded-full"
  onError={() => setShowDefault(true)}
/>;
```

### Document Management

```typescript
// Upload document
const document = await uploadAsset({
  file: pdfFile,
  title: "User Manual v2.1",
  assetType: "document",
  tags: ["documentation", "manual", "public"],
  isPublic: true,
});

// Download link
<AssetDownload asset={document} showAllUrls={false} />;
```

## 🎉 **Ready for Production**

This EKD Digital Assets system provides:

1. **Enterprise-Grade Reliability**: Proven in production environments
2. **Developer-Friendly APIs**: Simple, consistent, well-documented
3. **React Integration**: Hooks and components for rapid development
4. **Flexible Architecture**: Multiple URL strategies and access patterns
5. **Security First**: Authentication, validation, and access control
6. **Scalable Design**: Handles high-volume applications

**Start integrating immediately** - the system is battle-tested and production-ready! 🚀

---

## 📚 **Quick Reference**

| Operation   | Method                | Example                                                  |
| ----------- | --------------------- | -------------------------------------------------------- |
| **Upload**  | `uploadAsset()`       | `await uploadAsset({ file, title, assetType: "image" })` |
| **Display** | `<AssetImage>`        | `<AssetImage asset={asset} width={300} />`               |
| **List**    | `listAssets()`        | `await listAssets({ limit: 20, assetType: "image" })`    |
| **URL**     | `getPublicAssetUrl()` | `ekdService.getPublicAssetUrl(asset)`                    |
| **Delete**  | `deleteAsset()`       | `await ekdService.deleteAsset(assetId)`                  |
| **Health**  | `checkHealth()`       | `await ekdService.checkHealth()`                         |

## 🎯 **Common Use Cases**

### Image Gallery

```tsx
function ImageGallery() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch("/api/v1/assets?page=1&size=50")
      .then((r) => r.json())
      .then((data) => setAssets(data.items));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {assets.map((asset) => (
        <img
          key={asset.id}
          src={`/api/v1/assets/${asset.id}/download`}
          alt={asset.original_filename}
          className="w-full h-48 object-cover"
        />
      ))}
    </div>
  );
}
```

### File Upload

```tsx
function FileUpload() {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("clientId", "my-app");
    formData.append("projectName", "uploads");
    formData.append("assetType", "image");

    const response = await fetch("/api/v1/assets/upload", {
      method: "POST",
      body: formData,
    });

    const asset = await response.json();
    console.log("Uploaded:", asset.id);
  };

  return (
    <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
  );
}
```

### Bulk Delete

```typescript
const deleteAssets = async (assetIds) => {
  await fetch("/api/v1/assets/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operation: "delete",
      assetIds: assetIds,
    }),
  });
};
```

## ⚙️ **Configuration**

Set these environment variables:

```env
DATABASE_URL="postgresql://user:pass@host:port/db"
VPS_IP_ADDRESS="your.vps.ip"          # Optional
VPS_PASSWORD="your-vps-password"      # Optional
```

## 🔒 **Authentication**

All API endpoints require user authentication. Include session cookies or authentication headers with your requests.

---

**Ready to use!** Start uploading and serving assets immediately. 🚀

| Method   | Endpoint                       | Purpose                        |
| -------- | ------------------------------ | ------------------------------ |
| `POST`   | `/api/v1/assets/upload`        | Upload new assets              |
| `GET`    | `/api/v1/assets`               | List assets with pagination    |
| `GET`    | `/api/v1/assets/[id]/download` | Download individual assets     |
| `DELETE` | `/api/v1/assets/[id]`          | Delete single asset            |
| `POST`   | `/api/v1/assets/bulk`          | Bulk operations (delete, etc.) |

### Organization & Management

| Method | Endpoint                             | Purpose                   |
| ------ | ------------------------------------ | ------------------------- |
| `GET`  | `/api/v1/orgs`                       | List client organizations |
| `GET`  | `/api/v1/users/me`                   | Current user info         |
| `GET`  | `/api/v1/admin/available-file-types` | Supported file types      |

## 📁 **Key Files in Implementation**

```
✅ CORE APIs:
   src/app/api/v1/assets/upload/route.ts           # Upload handling
   src/app/api/v1/assets/[id]/download/route.ts    # Download serving
   src/app/api/v1/assets/bulk/route.ts             # Bulk operations
   src/app/api/v1/assets/route.ts                  # Asset listing

✅ UI COMPONENTS:
   src/components/assets/AssetManager.tsx          # Main gallery component
   src/components/assets/AssetCard.tsx             # Individual asset display
   src/components/upload/EnhancedFileUploadArea.tsx # Upload interface

✅ UTILITIES:
   src/lib/vps-file-manager.ts                     # VPS upload utility
   src/lib/database.ts                             # Database service
   src/lib/types/types.ts                          # TypeScript definitions

✅ CONFIGURATION:
   prisma/schema.prisma                            # Database schema
   next.config.ts                                  # Next.js configuration
```

## 🔧 **Usage Examples for Developers**

### 1. Upload Assets

```typescript
// Form data upload
const formData = new FormData();
formData.append("file", file);
formData.append("clientId", "your-client");
formData.append("projectName", "your-project");
formData.append("assetType", "image");

const response = await fetch("/api/v1/assets/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log("Uploaded asset:", result);
```

### 2. List Assets

```typescript
// Get paginated asset list
const response = await fetch(
  "/api/v1/assets?page=1&size=20&sortBy=created_at&sortOrder=desc"
);
const { items, total, pages } = await response.json();

console.log(`Found ${total} assets across ${pages} pages`);
```

### 3. Download Assets

```typescript
// Direct download URL
const downloadUrl = `/api/v1/assets/${assetId}/download`;

// For preview (inline display)
const previewUrl = `/api/v1/assets/${assetId}/download?preview=true`;

// Use in img tag or Next.js Image
<Image
  src={downloadUrl}
  alt="Asset"
  width={300}
  height={200}
  unoptimized={mimeType === "image/svg+xml"} // For SVG files
/>;
```

### 4. Bulk Operations

```typescript
// Delete multiple assets
const response = await fetch("/api/v1/assets/bulk", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    operation: "delete",
    assetIds: ["uuid1", "uuid2", "uuid3"],
  }),
});

const { successCount, failureCount, errors } = await response.json();
```

### 5. Using in React Components

```tsx
import { useState, useEffect } from "react";

function AssetGallery() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        const response = await fetch("/api/v1/assets?page=1&size=50");
        const data = await response.json();
        setAssets(data.items);
      } catch (error) {
        console.error("Failed to load assets:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, []);

  if (loading) return <div>Loading assets...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {assets.map((asset) => (
        <div key={asset.id} className="border rounded p-4">
          <img
            src={`/api/v1/assets/${asset.id}/download`}
            alt={asset.name}
            className="w-full h-48 object-cover"
          />
          <p className="mt-2 text-sm">{asset.original_filename}</p>
          <p className="text-xs text-gray-500">{asset.mime_type}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🌟 **Key Benefits for Developers**

### ✅ **Reliability**

- **Dual Storage**: Files stored in both database and VPS
- **Automatic Fallbacks**: Never fails to serve files
- **Error Handling**: Comprehensive error responses

### ✅ **Performance**

- **Database-First**: Fast serving from PostgreSQL
- **Chunked Uploads**: Handles large files efficiently
- **Background Processing**: Non-blocking operations

### ✅ **Developer Experience**

- **Simple APIs**: RESTful endpoints, clear responses
- **TypeScript Support**: Full type definitions
- **Consistent URLs**: Predictable asset URL patterns
- **Rich Metadata**: Complete file information

### ✅ **Security**

- **User Authentication**: Assets tied to authenticated users
- **Access Control**: Role-based permissions
- **File Validation**: MIME type and size checking
- **CORS Support**: Secure cross-origin requests

## 🚀 **Production Ready Features**

1. **Scalability**: Handles high upload/download volumes
2. **Monitoring**: Comprehensive logging and error tracking
3. **File Integrity**: Checksum validation and deduplication
4. **Multi-Client**: Organization and project separation
5. **Asset Versioning**: Version tracking and history

## 🔧 **Environment Configuration**

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# VPS Storage (Optional)
VPS_IP_ADDRESS="your.vps.ip"
VPS_PASSWORD="your-vps-password"

# Asset Serving
ASSET_BASE_URL="https://your-asset-domain.com"
ASSET_STORAGE_BASE_PATH="/var/www/assets"
```

## 🎉 **Ready for Integration**

This asset management system is **production-ready** and provides:

1. **Complete Asset Lifecycle**: Upload → Store → Retrieve → Delete
2. **Robust Storage**: Dual storage with automatic failover
3. **Rich APIs**: Everything developers need for asset management
4. **UI Components**: Pre-built components for common operations
5. **Type Safety**: Full TypeScript support throughout

**Start using the APIs immediately** - they're battle-tested and ready for production! 🚀
