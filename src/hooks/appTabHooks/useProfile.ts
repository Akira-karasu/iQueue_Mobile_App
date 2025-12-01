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
  const [accountInfo, setAccountInfo] = useState({ accountID: "N/A", email: "" });
  const [editedEmail, setEditedEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        if (isMounted) {
          setUserInfo(user);
          setAccountInfo({ accountID: String(user.id), email: user.email });
          setEditedEmail(user.email); // initialize editedEmail
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

  // Update email
const handleChangeEmail = useCallback(async (newEmail: string) => {
  try {
    console.log("📧 handleChangeEmail called with:", newEmail);
    
    setLoading(true);
    setError(null);
    
    // ✅ Validate email is not empty
    if (!newEmail || newEmail.trim() === "") {
      console.warn("⚠️ Email is empty");
      setError("Email cannot be empty");
      setLoading(false);
      return;
    }
    
    // ✅ Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      console.warn("⚠️ Invalid email format:", newEmail);
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // ✅ Validate account ID
    const accountId = Number(accountInfo.accountID);
    console.log("🔐 Account ID:", accountId, "Email:", newEmail);
    
    if (!accountId || isNaN(accountId)) {
      throw new Error("Account ID is invalid");
    }

    console.log("📡 Calling changeEmail API...");
    
    const { changeEmail } = authService();
    const response = await changeEmail(accountId, newEmail);
    
    console.log("✅ Email updated successfully:", response);
    
    // ✅ Update local state
    setAccountInfo(prev => ({ ...prev, email: newEmail }));
    setUserInfo(prev => prev ? { ...prev, email: newEmail } : null);
    setError(null);
    
  } catch (err: any) {
    const errorMessage = err.message || "Failed to update email";
    console.error("❌ Error updating email:", errorMessage, err);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
}, [accountInfo.accountID]); // ✅ Only depend on accountID
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
    setEditedEmail,
    setAccountInfo,
    setPasswords,
    handleChangeEmail,
    user_id,
    onGoToProfile: () => navigateTo("Profile"),
    onGoToAppSettings: () => navigateTo("AppSettings"),
    onGoToAccountSettings: () => navigateTo("AccountSettings"),
  };
}
