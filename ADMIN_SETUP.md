# FTPVault Admin Setup Guide

## Creating a Super Admin Account

The FTPVault system now has a super admin account feature that allows designated administrators to manage all users, files, and system activity.

### Step 1: Set the Admin Secret Environment Variable

First, you need to set an admin secret key in your Vercel project environment variables. This secret is required to create admin accounts.

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Key**: `NEXT_PUBLIC_ADMIN_SECRET`
   - **Value**: Choose a strong, secure secret (e.g., `super-secret-admin-key-2024`)
   - **Environments**: Select all environments

**Important**: This should be a strong, randomly generated secret. Keep it safe and only share it with trusted administrators.

### Step 2: Create an Admin Account

Once the environment variable is set, you can create an admin account:

1. Navigate to your FTPVault application
2. Click **"Get Started"** or the login button
3. Click on the **Register** tab
4. Enter an email and password
5. **Check the "Create as Admin Account" checkbox**
6. Enter the admin secret key you configured in Step 1
7. Click **Sign Up**
8. Confirm your email (check your inbox)
9. Log in with your admin credentials

### Step 3: Admin Dashboard Features

Once logged in as an admin, you'll see the **Admin Dashboard** instead of the regular file manager. The admin dashboard has 4 tabs:

#### Overview Tab
- View system statistics (total users, total files, total activities)
- See recent system activity log
- Quick overview of system health

#### Users Tab
- View all registered users
- See user creation dates and file counts
- Search users by name, username, or email
- **Make Admin**: Promote regular users to admin
- **Remove Admin**: Demote admin users to regular users
- **Delete**: Remove users and all their files

#### Files Tab
- View all files in the system (across all users)
- See file owners, sizes, and upload dates
- Search files by name
- **Delete**: Remove any file from the system

#### Activity Tab
- View complete audit trail of system activities
- Track login, logout, file upload, download, and delete actions
- See who performed each action and when
- Search activity log

### Managing Additional Admins

1. Go to the **Users** tab
2. Find the user you want to promote
3. Click **"Make Admin"**

The user will become an admin on their next login. They can now access the admin dashboard.

### Demoting Admins

1. Go to the **Users** tab
2. Find the admin user
3. Click **"Remove Admin"**

The user will be demoted to regular user status on their next login.

## Security Best Practices

1. **Keep the admin secret safe** - Don't commit it to version control
2. **Use strong passwords** - Admin accounts should have strong, unique passwords
3. **Limit admin access** - Only promote trusted users to admin
4. **Monitor activity logs** - Regularly check the activity log for suspicious behavior
5. **Rotate secrets periodically** - Change the admin secret key every 6-12 months
6. **Audit regularly** - Review user accounts and file access patterns

## Troubleshooting

**Q: I forgot my admin password**
A: Unfortunately, you'll need to reset it through Supabase. Use the "Forgot Password" feature or contact Supabase support.

**Q: The admin checkbox doesn't appear**
A: Make sure the `NEXT_PUBLIC_ADMIN_SECRET` environment variable is set and the deployment has been updated.

**Q: Invalid admin secret error**
A: Double-check that the secret you entered matches exactly what you set in the environment variables (they are case-sensitive).

**Q: I can't see the admin dashboard after logging in**
A: Your account may not be marked as admin. Have another admin promote you using the Users tab.

## Advanced: Managing Admin Access Programmatically

If you need to create admin accounts programmatically or make bulk changes, you can use the Supabase SQL console:

```sql
-- Promote a user to admin by their ID
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'user-uuid-here';

-- Demote an admin user
UPDATE public.profiles 
SET is_admin = false 
WHERE id = 'user-uuid-here';

-- View all admin users
SELECT * FROM public.profiles WHERE is_admin = true;
```

## Support

For issues or questions about the admin setup, contact the FTPVault support team or your system administrator.
