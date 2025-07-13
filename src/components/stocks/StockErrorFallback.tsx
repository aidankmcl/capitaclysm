import { FC } from "react";
import { Box, Card, Typography, Button } from "~/ui";

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
    <Card sx={{ padding: 8, textAlign: "center" }}>
      <Typography level="h4" color="danger" sx={{ marginBottom: 8 }}>
        Stock Market Error
      </Typography>
      <Typography level="body-sm" color="neutral" sx={{ marginBottom: 8 }}>
        {error}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
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
      </Box>
    </Card>
  );
}; 