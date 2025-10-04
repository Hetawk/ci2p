# EKD Digital Assets API - Quick Integration Guide

## Overview

The EKD Digital Assets API is a simple, powerful service for uploading, storing, and serving digital assets. Works with any programming language.

**Base URL:** `https://www.assets.andgroupco.com`

## Authentication

Include these headers in all requests:

```
X-API-Key: your-api-key
X-API-Secret: your-api-secret
```

## Core Endpoints

### 1. Upload Asset

```http
POST /api/v1/assets/upload
Content-Type: multipart/form-data
```

**Required Fields:**

- `file` - The file to upload
- `asset_type` - Type: `image`, `video`, `document`, `audio`, `3d`, `archive`
- `client_id` - Your client identifier
- `project_name` - Project name for organization

**Optional:**

- `tags` - Comma-separated tags (e.g., "product,marketplace")

### 2. Download Asset

```http
GET /api/v1/assets/{asset_id}/download
```

### 3. List Assets

```http
GET /api/v1/assets?limit=20&offset=0&asset_type=image
```

### 4. Delete Asset

```http
DELETE /api/v1/assets/{asset_id}
```

## Quick Examples

### JavaScript/Node.js

```javascript
// Upload
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
// Use: asset.id for download URL
```

### Python

```python
import requests

# Upload
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
    files=files, data=data, headers=headers
)

asset = response.json()
print(f"Asset ID: {asset['id']}")
```

### cURL

```bash
curl -X POST https://www.assets.andgroupco.com/api/v1/assets/upload \
  -H "X-API-Key: your-api-key" \
  -H "X-API-Secret: your-api-secret" \
  -F "file=@image.jpg" \
  -F "asset_type=image" \
  -F "client_id=my-app" \
  -F "project_name=uploads"
```

## Response Format

```json
{
  "id": "uuid-here",
  "name": "filename.jpg",
  "asset_type": "image",
  "size": 1024576,
  "mime_type": "image/jpeg",
  "download_url": "/api/v1/assets/{id}/download",
  "created_at": "2025-01-01T00:00:00Z",
  "tags": ["product"]
}
```

## Display Assets

Use the download URL directly:

```html
<img
  src="https://www.assets.andgroupco.com/api/v1/assets/{asset_id}/download"
  alt="Asset"
/>
```

## Error Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API keys)
- `404` - Asset not found
- `413` - File too large (max 100MB)

## Integration Steps

1. Get API credentials from EKD Digital Assets
2. Upload files using the upload endpoint
3. Store the returned asset ID
4. Display assets using the download URL
5. Manage assets with list/delete endpoints

That's it! The API works with any programming language that can make HTTP requests.
