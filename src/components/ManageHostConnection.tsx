import { Stack, Typography } from "~/ui";
import { usePeer } from "~/services/p2p";

export const ManageHostConnection = () => {
  const { code } = usePeer();

  return (
    <Stack direction="column" spacing={2}>
      <Typography level="h4">Host Game</Typography>
      <Typography level="body-md">
        Share this code with other players to let them join:
      </Typography>
      <Typography 
        level="h2" 
        className="font-mono bg-background-level1 p-2 rounded-md text-center"
      >
        {code}
      </Typography>
      <Typography level="body-sm" color="neutral">
        Waiting for players to connect...
      </Typography>
    </Stack>
  );
}; 