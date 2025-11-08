# Settings Page - Usage Guide

## Overview
The SettingsPage component has been fully updated to remove demo data and integrate with backend APIs. It now provides full functionality for managing vendor profile, store settings, and security.

---

## What's Changed

### ✅ Removed
- All hardcoded/demo data
- Static form fields
- Non-functional buttons

### ✅ Added
- State management for all form fields
- Backend API integration
- Real-time data fetching
- Form validation
- Loading states
- Success/error notifications
- Avatar upload functionality
- Multiple categories support
- Password change functionality

---

## Features

### 1. Profile Management
- **Upload Avatar**: Click the upload button to select and upload profile picture
- **Edit Name**: Update first name and last name
- **Edit Bio**: Add or update bio (max 500 characters with counter)
- **Auto-save**: Data persists to database

### 2. Store Settings
- **Store Name**: Update business name
- **Description**: Add store description (max 1000 characters)
- **Multiple Categories**: Add/remove product categories dynamically
  - Type category name and press Enter or click Add
  - Remove categories by clicking the X button
- **Address**: Complete address with city, state, and zip code
- **Country**: Fixed to "India" (cannot be changed)

### 3. Security
- **Password Change**: Update password with validation
  - Current password verification required
  - New password must be at least 6 characters
  - Real-time password matching validation
  - Fields clear after successful update

### 4. Notifications
- Success messages (green banner)
- Error messages (red banner)
- Auto-dismiss after 5 seconds
- Manual dismiss with X button

---

## Setup Requirements

### 1. Vendor ID
The component requires a vendor ID to function. Currently it reads from localStorage:

```javascript
localStorage.setItem("vendorId", "your-vendor-id-here");
```

**For production**, update this line in SettingsPage.tsx:
```typescript
// Current (line 18):
const vendorId = typeof window !== "undefined" ? localStorage.getItem("vendorId") || "" : "";

// Replace with your auth system:
const vendorId = useAuth().user?.id || ""; // Example with auth context
```

### 2. API Upload Endpoint
The avatar upload uses the existing `/api/upload` endpoint. Ensure it's configured and working.

---

## How to Use

### Initial Load
1. Component automatically fetches vendor data on mount
2. All form fields populate with existing data
3. Shows loading spinner while fetching

### Update Profile
1. Edit first name, last name, or bio
2. Optionally upload new avatar
3. Click "Save Changes" button
4. See success/error notification

### Update Store Settings
1. Edit store name and description
2. Add categories:
   - Type category name
   - Press Enter or click "Add" button
   - Remove by clicking X on tag
3. Update address fields (city, state, zip, full address)
4. Click "Save Changes"

### Change Password
1. Enter current password
2. Enter new password (min 6 chars)
3. Confirm new password
4. See real-time validation messages
5. Click "Save Changes"
6. Fields clear on success

---

## Validation

### Profile
- ✅ First name required
- ✅ Last name required
- ✅ Bio max 500 characters

### Store
- ✅ Store name required (max 100 chars)
- ✅ Description required (max 1000 chars)
- ✅ At least one category required
- ✅ Complete address required

### Password
- ✅ All fields required
- ✅ New password min 6 characters
- ✅ Passwords must match
- ✅ Current password must be correct

---

## Error Handling

All errors are displayed in the notification banner:
- Network errors
- Validation errors
- Server errors
- Authentication errors

---

## State Management

The component maintains separate state for:
- `profileData` - Profile information
- `storeData` - Store settings
- `passwordData` - Password change data
- `message` - Success/error notifications
- `loading` - Save operation state
- `fetchingData` - Initial data load state
- `uploadingAvatar` - Avatar upload state

---

## API Integration

The component uses the service layer in `src/services/settingsService.ts`:

```typescript
import {
  getVendorProfile,
  updateVendorProfile,
  updateStoreSettings,
  updatePassword,
  uploadAvatar,
} from "@/services/settingsService";
```

---

## Testing Checklist

Before using in production:

- [ ] Set up proper authentication system
- [ ] Replace localStorage vendor ID with auth token
- [ ] Test avatar upload functionality
- [ ] Test all form validations
- [ ] Test error scenarios
- [ ] Test with real backend API
- [ ] Verify data persists correctly
- [ ] Test on mobile responsive view

---

## Troubleshooting

### "Please login to access settings"
- Vendor ID not found in localStorage
- Set vendor ID or implement proper auth

### "Failed to load profile data"
- Backend API not responding
- Check API endpoints are running
- Verify vendor ID is valid

### Avatar upload not working
- Check `/api/upload` endpoint
- Verify file size limits
- Check supported file types

### Changes not saving
- Check network tab for API errors
- Verify vendor ID is correct
- Check backend validation errors

---

## Next Steps

1. **Authentication**: Implement proper JWT authentication
2. **Middleware**: Add auth middleware to protect routes
3. **Testing**: Write unit and integration tests
4. **Validation**: Add client-side validation library (e.g., Zod)
5. **Analytics**: Add tracking for settings changes
6. **Audit Log**: Track who changed what and when

---

## Code Location

- **Component**: `src/components/vendor/SettingsPage.tsx`
- **Service**: `src/services/settingsService.ts`
- **Types**: `src/types/settings.ts`
- **API Routes**: `src/app/api/settings/`
- **Controller**: `src/app/api/controllers/settingsController.ts`

---

## Support

For issues or questions:
1. Check API documentation: `src/app/api/settings/README.md`
2. Review implementation guide: `SETTINGS_IMPLEMENTATION.md`
3. Check browser console for errors
4. Verify network requests in DevTools
