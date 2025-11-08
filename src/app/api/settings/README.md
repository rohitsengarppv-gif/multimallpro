# Vendor Settings API Documentation

This document describes the API endpoints for managing vendor settings including profile, store, and security settings.

## Authentication

All endpoints require authentication. Include the vendor ID in the request headers:
```
x-vendor-id: <vendor_id>
```

## Endpoints

### 1. Get Vendor Profile

**Endpoint:** `GET /api/settings/profile`

**Description:** Retrieve the current vendor's profile information.

**Headers:**
```
x-vendor-id: <vendor_id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "vendor_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "avatar": {
      "public_id": "avatar_id",
      "url": "https://example.com/avatar.jpg"
    },
    "bio": "Passionate entrepreneur...",
    "businessName": "My Store",
    "businessDescription": "Store description...",
    "productCategories": ["Electronics", "Fashion"],
    "businessAddress": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

---

### 2. Update Vendor Profile

**Endpoint:** `PUT /api/settings/profile`

**Description:** Update vendor profile information (name, avatar, bio).

**Headers:**
```
x-vendor-id: <vendor_id>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": {
    "public_id": "avatar_id",
    "url": "https://example.com/avatar.jpg"
  },
  "bio": "Updated bio text..."
}
```

**Required Fields:**
- `firstName` (string)
- `lastName` (string)

**Optional Fields:**
- `avatar` (object with `public_id` and `url`)
- `bio` (string, max 500 characters)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "vendor_id",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": {
      "public_id": "avatar_id",
      "url": "https://example.com/avatar.jpg"
    },
    "bio": "Updated bio text..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Missing vendor ID
- `404 Not Found`: Vendor not found
- `500 Internal Server Error`: Server error

---

### 3. Update Store Settings

**Endpoint:** `PUT /api/settings/store`

**Description:** Update store settings including name, description, categories, and address.

**Headers:**
```
x-vendor-id: <vendor_id>
Content-Type: application/json
```

**Request Body:**
```json
{
  "businessName": "My Awesome Store",
  "businessDescription": "We sell quality products...",
  "productCategories": ["Electronics", "Fashion", "Home & Garden"],
  "businessAddress": "123 Main Street, Building A",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001"
}
```

**Required Fields:**
- `businessName` (string, max 100 characters)
- `businessDescription` (string, max 1000 characters)
- `productCategories` (array of strings, at least one category)
- `businessAddress` (string, max 200 characters)
- `city` (string, max 50 characters)
- `state` (string, max 50 characters)

**Optional Fields:**
- `zipCode` (string, max 10 characters)

**Note:** Country is automatically set to "India" and cannot be changed.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Store settings updated successfully",
  "data": {
    "_id": "vendor_id",
    "businessName": "My Awesome Store",
    "businessDescription": "We sell quality products...",
    "productCategories": ["Electronics", "Fashion", "Home & Garden"],
    "businessAddress": "123 Main Street, Building A",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid data
- `401 Unauthorized`: Missing vendor ID
- `404 Not Found`: Vendor not found
- `500 Internal Server Error`: Server error

---

### 4. Update Password (Security)

**Endpoint:** `PUT /api/settings/security`

**Description:** Update vendor password.

**Headers:**
```
x-vendor-id: <vendor_id>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Required Fields:**
- `currentPassword` (string)
- `newPassword` (string, min 6 characters)
- `confirmPassword` (string, must match newPassword)

**Validation Rules:**
- New password must be at least 6 characters
- New password and confirm password must match
- Current password must be correct

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields, passwords don't match, or password too short
- `401 Unauthorized`: Missing vendor ID or incorrect current password
- `404 Not Found`: Vendor not found
- `500 Internal Server Error`: Server error

---

## Example Usage

### Using Fetch API

```javascript
// Get Profile
const getProfile = async (vendorId) => {
  const response = await fetch('/api/settings/profile', {
    method: 'GET',
    headers: {
      'x-vendor-id': vendorId
    }
  });
  return await response.json();
};

// Update Profile
const updateProfile = async (vendorId, data) => {
  const response = await fetch('/api/settings/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-vendor-id': vendorId
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Update Store Settings
const updateStore = async (vendorId, data) => {
  const response = await fetch('/api/settings/store', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-vendor-id': vendorId
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

// Update Password
const updatePassword = async (vendorId, passwords) => {
  const response = await fetch('/api/settings/security', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-vendor-id': vendorId
    },
    body: JSON.stringify(passwords)
  });
  return await response.json();
};
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/settings'
});

// Get Profile
const getProfile = (vendorId) => {
  return api.get('/profile', {
    headers: { 'x-vendor-id': vendorId }
  });
};

// Update Profile
const updateProfile = (vendorId, data) => {
  return api.put('/profile', data, {
    headers: { 'x-vendor-id': vendorId }
  });
};

// Update Store
const updateStore = (vendorId, data) => {
  return api.put('/store', data, {
    headers: { 'x-vendor-id': vendorId }
  });
};

// Update Password
const updatePassword = (vendorId, passwords) => {
  return api.put('/security', passwords, {
    headers: { 'x-vendor-id': vendorId }
  });
};
```

## Notes

1. **Authentication**: Currently using `x-vendor-id` header. In production, implement proper JWT authentication middleware.

2. **File Uploads**: For avatar images, use the existing `/api/upload` endpoint first to upload the image, then use the returned `public_id` and `url` in the profile update request.

3. **Country**: The country field is fixed to "India" as per requirements and cannot be changed through the store settings endpoint.

4. **Categories**: Multiple categories can be added to the store. Ensure at least one category is selected.

5. **Password Security**: Passwords are hashed using bcrypt before storage. The current password verification is required before updating to a new password.

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication error)
- `404`: Not Found (resource not found)
- `500`: Internal Server Error
