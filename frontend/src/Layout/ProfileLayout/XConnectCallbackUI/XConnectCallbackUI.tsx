

import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../Auth/AuthContext";

const XConnectCallbackUI = () => {
  const { fetchAddress } = useAuth();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (hasProcessed) return;

    const connected = searchParams.get('connected');
    const error = searchParams.get('error');

    if (error === '1') {
      setStatus('error');
      setHasProcessed(true);
      return;
    }

    if (connected === '1') {
      // Backend set HttpOnly cookie; now fetch /api/me to get profile
      (async () => {
        try {
          await fetchAddress(); // This will update the profile with X data
          setStatus('success');
          setHasProcessed(true);
          // Stay on this page, don't auto-redirect
        } catch (e) {
          console.error(e);
          setStatus('error');
          setHasProcessed(true);
        }
      })();
    }
  }, [fetchAddress, searchParams, hasProcessed]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen text-white">
        {status === 'loading' && (
          <div className="text-4xl">Processing...</div>
        )}
        {status === 'success' && (
          <div className="text-4xl">Social Network connected successfully!</div>
        )}
        {status === 'error' && (
          <div className="text-4xl text-red-500">Failed to connect social network</div>
        )}
      </div>
    </>
  )
}

export default XConnectCallbackUI