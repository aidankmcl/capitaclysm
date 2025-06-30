import { FC } from "react";
import { Box, Card, Typography, Button } from "@mui/joy";

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
    <Card sx={{ p: 2, textAlign: "center" }}>
      <Typography level="h4" color="danger" sx={{ mb: 2 }}>
        Stock Market Error
      </Typography>
      <Typography level="body-sm" color="neutral" sx={{ mb: 2 }}>
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