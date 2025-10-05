# Quick Start Guide - Testing the User Menu & Authentication

## 🚀 Getting Started

### 1. Start the Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧪 Test Scenarios

### Scenario A: New User Registration

1. **Go to Home Page**

   - Look at top-right corner
   - You should see: "Sign In" and "Get Started" buttons

2. **Click "Get Started"**

   - Should redirect to `/auth/register`
   - See beautiful animated background with floating orbs

3. **Fill Registration Form**

   ```
   Full Name: Test User
   Email: test@example.com
   Username: testuser (optional)
   Password: TestPass123!
   Confirm Password: TestPass123!
   ```

4. **Watch Password Strength Indicator**

   - Green checkmarks appear as requirements are met
   - All 5 requirements must be met

5. **Submit Form**

   - See success screen with checkmark animation
   - Message: "Check Your Email!"
   - Shows your email address

6. **Check Email**

   - Look in inbox for test@example.com
   - Email from "Her Promise Fulfilled"
   - Beautiful pink/purple gradient header
   - Click verification link

7. **Email Verification**

   - Redirects to `/auth/verify-email?token=xxx`
   - Shows success message
   - Receive welcome email

8. **Login**

   - Click "Go to Login" or navigate to `/auth/login`
   - Enter email and password
   - Click "Sign In"

9. **Check UserMenu**
   - Top-right corner now shows avatar with "TU" initials
   - Click avatar to see dropdown
   - Should show:
     - Your name and email
     - Dashboard links (based on your permissions)
     - Profile Settings
     - Account Settings
     - Sign Out button

---

### Scenario B: Existing User Login

1. **Go to Home Page**

   - Click "Sign In" button in top-right

2. **Enter Credentials**

   ```
   Email or Username: test@example.com (or testuser)
   Password: TestPass123!
   ```

3. **Submit**

   - Redirects to dashboard
   - UserMenu appears with your avatar

4. **Test UserMenu**
   - Click avatar → Dropdown opens
   - Click "Her Promise Dashboard" → Navigates to dashboard
   - Click avatar again → Click "Sign Out"
   - Redirected to home
   - UserMenu shows login buttons again

---

### Scenario C: Super Admin Login

1. **Go to Login Page**

   ```
   Email: patience@herpromisefulfilled.org
   Password: loveGod30!ekd
   ```

2. **Submit**

   - Successfully logs in
   - UserMenu shows:
     - Name: "Super Admin"
     - Email: patience@herpromisefulfilled.org
     - Badge: "Super Admin Access" with shield icon
     - Both dashboard links visible

3. **Test Permissions**
   - Can access both Her Promise and Portfolio dashboards
   - Full administrative access

---

### Scenario D: Forgot Password

1. **Go to Login Page**

   - Click "Forgot password?" link

2. **Enter Email**

   ```
   Email: test@example.com
   ```

3. **Submit**

   - Always shows success message (security feature)
   - Check email for password reset link

4. **Click Reset Link**

   - Redirects to `/auth/reset-password?token=xxx`
   - Enter new password
   - Submit

5. **Login with New Password**
   - Use new password to login
   - Should work successfully

---

## 🎨 Visual Elements to Check

### UserMenu (Not Logged In)

- [ ] "Sign In" button visible
- [ ] "Get Started" button visible with gradient
- [ ] Buttons have hover effects

### UserMenu (Logged In - Collapsed)

- [ ] Avatar shows initials or profile image
- [ ] Green dot indicator visible
- [ ] User name displayed (desktop)
- [ ] Role badge visible if admin (desktop)
- [ ] Hover effect on button

### UserMenu (Logged In - Expanded)

- [ ] Smooth dropdown animation
- [ ] Gradient header (pink → purple)
- [ ] Avatar in header
- [ ] Name and email displayed
- [ ] Admin badge if applicable
- [ ] Dashboard section with links
- [ ] Account section with links
- [ ] Logout button at bottom
- [ ] Hover effects on all items
- [ ] Click outside closes menu

### Login Page

- [ ] Animated gradient background orbs
- [ ] Pulsing heart logo
- [ ] Email/username input field
- [ ] Password input with show/hide toggle
- [ ] "Forgot password?" link
- [ ] "Sign In" button with gradient
- [ ] "Create Account" link
- [ ] Error messages display correctly
- [ ] Loading spinner during submission

### Register Page

- [ ] Animated gradient background orbs
- [ ] Pulsing heart logo
- [ ] Name input field
- [ ] Email input field
- [ ] Username input field (optional)
- [ ] Password input with show/hide toggle
- [ ] Confirm password input
- [ ] Password strength checklist
- [ ] Real-time validation feedback
- [ ] Success screen after registration
- [ ] Error messages display correctly

---

## 🔍 Testing Checklist

### Authentication Flow

- [ ] Can register new user
- [ ] Receives verification email
- [ ] Can verify email via link
- [ ] Can login with email
- [ ] Can login with username
- [ ] Cannot login without email verification
- [ ] Can request password reset
- [ ] Receives reset email
- [ ] Can reset password
- [ ] Can login with new password
- [ ] Super admin can login with env credentials

### UserMenu Functionality

- [ ] Shows correct state when not logged in
- [ ] Shows correct state when logged in
- [ ] Avatar displays correctly
- [ ] Dropdown opens on click
- [ ] Dropdown closes on outside click
- [ ] Dashboard links are role-based
- [ ] Can navigate to dashboards
- [ ] Can navigate to settings (when created)
- [ ] Logout works correctly
- [ ] Loading states show during actions

### Security

- [ ] Password must meet requirements
- [ ] Email must be valid format
- [ ] Username must be 3-20 characters
- [ ] Cannot login without verification
- [ ] Reset token expires after 1 hour
- [ ] Session persists for 7 days
- [ ] Logout clears session

### Responsive Design

- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Touch interactions work
- [ ] Dropdown fits on screen
- [ ] Forms are usable on mobile

---

## 🐛 Known Issues / Limitations

### Current Limitations

1. **Email Verification Pages** - Not yet created

   - Create `/auth/verify-email/page.tsx`
   - Handle success/error states

2. **Password Reset Pages** - Not yet created

   - Create `/auth/forgot-password/page.tsx`
   - Create `/auth/reset-password/page.tsx`

3. **Profile/Settings Pages** - Not yet created

   - Create `/settings/profile/page.tsx`
   - Create `/settings/page.tsx`

4. **Middleware** - Not yet updated

   - Update to check emailVerified
   - Add role-based access control

5. **Image Upload** - Not implemented
   - Profile picture upload functionality
   - Image storage configuration

---

## 📊 Database Verification

### Check User in Database

```sql
-- View users
SELECT id, email, username, name, role, emailVerified, active, dashboard
FROM User;

-- Check specific user
SELECT * FROM User WHERE email = 'test@example.com';

-- View verification tokens
SELECT id, email, verificationToken
FROM User
WHERE emailVerified = false;

-- View reset tokens
SELECT id, email, resetToken, resetTokenExpiry
FROM User
WHERE resetToken IS NOT NULL;
```

---

## 🔧 Troubleshooting

### Issue: UserMenu Not Showing

**Solution:**

- Check browser console for errors
- Verify `/api/auth/me` returns correct response
- Check if auth cookie is set (DevTools → Application → Cookies)

### Issue: Cannot Login

**Solution:**

- Verify email is verified in database
- Check password is correct
- Ensure user is active
- Check browser console for API errors

### Issue: Email Not Sending

**Solution:**

- Verify SMTP2GO credentials in `.env`
- Check `SMTP2GO_API_KEY` is valid
- Verify email addresses are correct
- Check server logs for email errors

### Issue: Dropdown Not Opening

**Solution:**

- Check z-index conflicts
- Verify Framer Motion is installed
- Check browser console for errors
- Clear browser cache

### Issue: Styles Not Applied

**Solution:**

- Ensure Tailwind CSS is configured
- Run `npm run dev` to rebuild
- Check if custom classes are defined
- Verify no CSS conflicts

---

## 🎉 Success Indicators

You know everything is working when:

- ✅ UserMenu appears on all pages
- ✅ Shows correct state based on auth
- ✅ Animations are smooth
- ✅ Can register, verify, and login
- ✅ Dropdown menu is functional
- ✅ Role-based links display correctly
- ✅ Logout redirects to home
- ✅ Session persists on page reload
- ✅ No console errors
- ✅ Responsive on all devices

**Happy Testing! 🚀**
