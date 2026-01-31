import { AlertTriangle } from "lucide-react";

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-warning text-warning-foreground rounded-md">
      <AlertTriangle className="w-5 h-5" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default ErrorMessage;
