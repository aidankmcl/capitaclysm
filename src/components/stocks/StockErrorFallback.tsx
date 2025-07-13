import { FC } from "react";
import { Card, Typography, Button } from "~/ui";

interface StockErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export const StockErrorFallback: FC<StockErrorFallbackProps> = ({ 
  error = "An error occurred while loading stock data", 
  onRetry, 
  onClose 
}) => {
  return (
    <Card className="p-2 text-center">
      <Typography level="h4" color="danger" className="mb-2">
        Stock Market Error
      </Typography>
      <Typography level="body-sm" color="neutral" className="mb-2">
        {error}
      </Typography>
      <div className="flex gap-1 justify-center">
        {onRetry && (
          <Button variant="solid" onClick={onRetry}>
            Retry
          </Button>
        )}
        {onClose && (
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </Card>
  );
}; 