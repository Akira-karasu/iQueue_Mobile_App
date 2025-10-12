import { useCallback, useEffect, useState } from 'react';

export function useOtpTimer(initialSeconds = 30) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isCounting, setIsCounting] = useState(false);

  const startTimer = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsCounting(true);
  }, [initialSeconds]);

  const stopTimer = useCallback(() => {
    setIsCounting(false);
  }, []);

  const resetTimer = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsCounting(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isCounting || secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting, secondsLeft]);

    const sendOtp = () => {
    startTimer(); // Start countdown after sending
  };

    const resendOtp = () => {
    sendOtp(); // Resend OTP again
  };


  return { 
    secondsLeft, 
    isCounting, 
    startTimer, 
    stopTimer, 
    resetTimer,
    sendOtp,
    resendOtp
 };
}
