# Super Admin Account Features - Complete Overview

## What is a Super Admin Account?

A super admin account has elevated privileges that allow the account holder to:
- View all users in the system
- View all files uploaded by any user
- View complete system activity logs
- Manage user permissions (promote/demote admins)
- Delete users and their data
- Delete any file in the system
- Access the Admin Dashboard

## Key Features

### 1. Complete User Management
- **View all users** with their profile information
- **Search users** by username, display name, or email
- **Make Admin** - Promote regular users to admin status
- **Remove Admin** - Demote admin users back to regular users
- **Delete User** - Remove a user account and all associated data

### 2. Global File Management
- **View all files** across the entire system
- **See file owners** and upload dates
- **Monitor storage usage** per file
- **Search files** by filename
- **Delete files** from any user's account

### 3. System Activity Monitoring
- **Complete audit trail** of all system actions
- **Track user logins** and logouts
- **Monitor file operations** (uploads, downloads, deletions)
- **Search activity logs** by action type
- **Timeline view** of system events

### 4. System Statistics Dashboard
- **Total users count** in the system
- **Total files count** across all users
- **Total activities** tracked
- **Recent activity feed** for quick overview

## How to Create a Super Admin Account

### Prerequisites
1. Supabase integration configured
2. Environment variable `NEXT_PUBLIC_ADMIN_SECRET` set in Vercel

### Steps
1. Open FTPVault application
2. Click on "Get Started" or Login button
3. Go to **Register** tab
4. Enter email and password
5. Check **"Create as Admin Account"**
6. Enter the admin secret key
7. Complete email confirmation
8. Login to access Admin Dashboard

## Admin Dashboard Interface

### Tabs
- **Overview** - Quick stats and recent activities
- **Users** - Manage all user accounts
- **Files** - View and manage all files
- **Activity** - View system audit trail

### Search & Filter
All tabs include search functionality to find:
- Users by name, username, or email
- Files by name
- Activities by action type

## Database Integration

The admin features leverage Supabase's Row Level Security (RLS) with policies that:
- Allow admins to read all user profiles
- Allow admins to read all files
- Allow admins to read all activity logs
- Allow admins to update and delete user accounts
- Automatically created user profiles on signup
- Track all activities for audit purposes

## Security Features

1. **Admin Secret Validation** - Prevents unauthorized admin creation
2. **Row Level Security (RLS)** - Database-level access control
3. **Activity Logging** - Complete audit trail of admin actions
4. **User Isolation** - RLS ensures normal users only see their own data
5. **Email Confirmation** - All signups require email verification

## Admin Utilities (Backend Functions)

Located in `/lib/admin-utils.ts`:

- `getAllUsers()` - Fetch all user profiles
- `getAllFiles()` - Fetch all files with owner info
- `getAllActivityLogs()` - Fetch system activity logs
- `getUserStatistics()` - Get system statistics
- `deleteUser(userId)` - Delete a user and all their data
- `deleteFile(fileId)` - Delete a file
- `updateUserAdmin(userId, isAdmin)` - Change admin status
- `getUserFileCount(userId)` - Count files for a user
- `getUserStorageUsage(userId)` - Calculate storage used by a user

## Admin Dashboard Component

Located in `/components/ftp/admin-dashboard.tsx`:

Provides the complete admin interface with:
- Tab navigation between Overview, Users, Files, and Activity
- Search and filtering capabilities
- User management controls
- File management controls
- Activity log viewer
- Real-time data loading
- Responsive design

## Data Flow

1. **Admin Login** → Supabase Auth validates credentials
2. **Check Admin Status** → Auth context checks `is_admin` flag
3. **Route to Dashboard** → App routes to Admin Dashboard component
4. **Fetch Data** → Admin utilities query Supabase with RLS
5. **Display & Manage** → Admin can view and manage all data

## Important Notes

- Admin accounts still need email confirmation to complete signup
- Admin status is stored in user metadata in Supabase Auth
- Deleting a user automatically cascades to delete their files and activity logs
- All admin actions are logged in the activity_logs table
- The admin secret is required only during account creation, not for login

## File Structure

```
lib/
  ├── admin-utils.ts              # Admin utility functions
  └── auth-context.tsx             # Includes isAdmin flag
components/ftp/
  └── admin-dashboard.tsx         # Complete admin interface
app/
  └── page.tsx                    # Routes admins to dashboard
```

## Next Steps

1. Set the `NEXT_PUBLIC_ADMIN_SECRET` environment variable
2. Create your first admin account
3. Access the Admin Dashboard
4. Start managing users, files, and activity
5. Promote other users to admin as needed

See `ADMIN_SETUP.md` for detailed setup instructions.
