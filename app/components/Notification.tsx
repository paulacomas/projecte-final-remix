import { useEffect, useState } from "react";
interface NotificationProps {
  successMessage?: string;
  errorMessage?: string;
}

export default function Notification({ successMessage, errorMessage }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  if (!visible || (!successMessage && !errorMessage)) {
    return null;
  }

  return (
    <div className="my-4">
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative p-6 m-6"
          role="alert"
        >
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative p-6 m-6"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
