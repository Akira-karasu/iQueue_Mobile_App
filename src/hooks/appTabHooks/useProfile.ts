import { useAuth } from "@/src/context/authContext";
import { authService } from "@/src/services/authService";
import { ProfileStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Profile"
>;

interface UserInfo {
  id: string | number;
  email: string;
}

export function useProfile() {
  const { getUser } = useAuth();

  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const userFromAuth = getUser();
  const user_id = userFromAuth?.id ? Number(userFromAuth.id) : null;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accountInfo, setAccountInfo] = useState({ accountID: "N/A", email: "", username: "" });
  const [editedEmail, setEditedEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ Separate states for password change
  const [changePassError, setChangePassError] = useState<string | null>(null);
  const [changePassSuccessMessage, setChangePassSuccessMessage] = useState<string | null>(null);

  // Fetch user info
  useEffect(() => {
    if (!user_id) return;
    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const { getUserInfo } = authService();
        const response = await getUserInfo(user_id);
        const user = response?.data ?? response;

        console.log("📥 Fetched user info:", user);

        if (isMounted) {
          setUserInfo(user);
          setAccountInfo({ accountID: String(user.id), email: user.email, username: user.username || "" });
          setUsername(user.username || "");
          setEditedEmail(user.email);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to fetch user info");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserInfo();
    return () => { isMounted = false; };
  }, [user_id]);

  // ✅ Clear messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // ✅ Clear password messages after 5 seconds
  // useEffect(() => {
  //   if (changePassError || changePassSuccessMessage) {
  //     const timer = setTimeout(() => {
  //       setChangePassError(null);
  //       setChangePassSuccessMessage(null);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [changePassError, changePassSuccessMessage]);

  // Update email
  const handleChangeEmail = useCallback(async (newEmail: string) => {
    try {
      console.log("📧 handleChangeEmail called with:", newEmail);
      
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      if (!newEmail || newEmail.trim() === "") {
        console.warn("⚠️ Email is empty");
        setError("❌ Email cannot be empty");
        setLoading(false);
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        console.warn("⚠️ Invalid email format:", newEmail);
        setError("❌ Please enter a valid email address");
        setLoading(false);
        return;
      }

      if (newEmail === accountInfo.email) {
        console.warn("ℹ️ Email is the same as current email");
        setLoading(false);
        return;
      }

      const accountId = Number(accountInfo.accountID);
      console.log("🔐 Account ID:", accountId, "Email:", newEmail);
      
      if (!accountId || isNaN(accountId)) {
        throw new Error("Account ID is invalid");
      }

      console.log("📡 Calling changeEmail API...");
      
      const { changeEmail } = authService();
      const response = await changeEmail(accountId, newEmail);
      
      console.log("✅ Email updated successfully:", response);
      
      setAccountInfo(prev => ({ ...prev, email: newEmail }));
      setEditedEmail(newEmail);
      setUserInfo(prev => prev ? { ...prev, email: newEmail } : null);

      authService().forgot_send_otp(newEmail);

      setSuccessMessage("✅ Email updated successfully!");
      setError(null);
      
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update email";
      console.error("❌ Error updating email:", errorMessage, err);
      setError(`❌ ${errorMessage}`);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  }, [accountInfo.accountID, accountInfo.email]);

  // Update username
  const handleChangeUsername = useCallback(async (newUsername: string) => {
    try {
      console.log("👤 handleChangeUsername called with:", newUsername);
      
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      if (!newUsername || newUsername.trim() === "") {
        console.warn("⚠️ Username is empty");
        setError("❌ Username cannot be empty");
        setLoading(false);
        return;
      }

      if (newUsername.length < 3) {
        console.warn("⚠️ Username too short");
        setError("❌ Username must be at least 3 characters");
        setLoading(false);
        return;
      }

      if (newUsername === accountInfo.username) {
        console.warn("ℹ️ Username is the same as current username");
        setLoading(false);
        return;
      }

      const accountId = Number(accountInfo.accountID);
      console.log("🔐 Account ID:", accountId, "Username:", newUsername);

      if (!accountId || isNaN(accountId)) {
        throw new Error("Account ID is invalid");
      }

      console.log("📡 Calling changeUsername API...");
      
      const { changeUsername } = authService();
      const response = await changeUsername(accountId, newUsername);
      
      console.log("✅ Username updated successfully:", response);

      setAccountInfo(prev => ({ ...prev, username: newUsername }));
      setUsername(newUsername);
      setUserInfo(prev => prev ? { ...prev, username: newUsername } : null);
      setSuccessMessage("✅ Username updated successfully!");
      setError(null);
      
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update username";
      console.error("❌ Error updating username:", errorMessage, err);
      setError(`❌ ${errorMessage}`);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  }, [accountInfo.accountID, accountInfo.username]);

  // ✅ Update password with separate error/success states
  const handleChangePassword = useCallback(async () => {
    try {
      console.log("🔐 handleChangePassword called");
      
      setLoading(true);
      setChangePassError(null);  // ✅ Use separate error state
      setChangePassSuccessMessage(null);  // ✅ Use separate success state
      
      // ✅ Validate current password
      if (!passwords.current || passwords.current.trim() === "") {
        console.warn("⚠️ Current password is empty");
        setChangePassError("❌ Please enter your current password");
        setLoading(false);
        return;
      }

      // ✅ Validate new password
      if (!passwords.new || passwords.new.trim() === "") {
        console.warn("⚠️ New password is empty");
        setChangePassError("❌ Please enter a new password");
        setLoading(false);
        return;
      }

      // ✅ Validate password length
      if (passwords.new.length < 6) {
        console.warn("⚠️ Password too short");
        setChangePassError("❌ Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // ✅ Validate confirm password
      if (!passwords.confirm || passwords.confirm.trim() === "") {
        console.warn("⚠️ Confirm password is empty");
        setChangePassError("❌ Please confirm your password");
        setLoading(false);
        return;
      }

      // ✅ Check if passwords match
      if (passwords.new !== passwords.confirm) {
        console.warn("⚠️ Passwords do not match");
        setChangePassError("❌ New password and confirm password do not match");
        setLoading(false);
        return;
      }

      // ✅ Validate account ID
      const accountId = Number(accountInfo.accountID);
      console.log("🔐 Account ID:", accountId);
      
      if (!accountId || isNaN(accountId)) {
        throw new Error("Account ID is invalid");
      }

      console.log("📡 Calling changePasswordId API...");
      
      const { changePasswordId } = authService();
      const response = await changePasswordId(
        accountId,
        passwords.current,
        passwords.new,
        passwords.confirm
      );
      
      console.log("✅ Password changed successfully:", response);

      // ✅ Clear password fields
      setPasswords({ current: "", new: "", confirm: "" });
      setChangePassSuccessMessage("✅ Password changed successfully!");  // ✅ Use separate success state
      setChangePassError(null);
      
    } catch (err: any) {
      const errorMessage = err.message || "Failed to change password";
      console.error("❌ Error changing password:", errorMessage, err);
      setChangePassError(`❌ ${errorMessage}`);  // ✅ Use separate error state
      setChangePassSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  }, [passwords, accountInfo.accountID]);

  // Navigation helpers
  const navigateTo = useCallback((screen: keyof ProfileStackParamList) => {
    navigation.navigate(screen);
  }, [navigation]);

  return {
    accountInfo,
    passwords,
    userInfo,
    editedEmail,
    loading,
    error,
    successMessage,
    changePassError,  // ✅ Export password error
    changePassSuccessMessage,  // ✅ Export password success message
    setEditedEmail,
    setAccountInfo,
    setPasswords,
    handleChangeEmail,
    handleChangeUsername,
    handleChangePassword,
    username,
    setUsername,
    user_id,
    onGoToProfile: () => navigateTo("Profile"),
    onGoToAppSettings: () => navigateTo("AppSettings"),
    onGoToAccountSettings: () => navigateTo("AccountSettings"),
  };
}