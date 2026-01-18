import { Spinner } from "../ui/spinner";
import { Card } from "../ui/card";

function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Card className="gap-4 flex flex-col p-8 items-center justify-center border-0 shadow-lg bg-gradient-card">
        <Spinner className="w-20 h-20 text-primary" />
        <span className="text-lg">{message}</span>
      </Card>
    </div>
  );
}

export default LoadingPage;
