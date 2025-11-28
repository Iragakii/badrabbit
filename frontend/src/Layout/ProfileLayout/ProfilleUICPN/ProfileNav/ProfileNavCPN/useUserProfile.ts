import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../../../../../config/api";

const useUserProfile = (walletaddress: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletaddress) {
      setLoading(false);
      setProfileData(null);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(getApiUrl(`api/user/${walletaddress}`), { withCredentials: true });
        setProfileData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error fetching profile data");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [walletaddress]);

  return { loading, profileData, error };
};

export default useUserProfile;
