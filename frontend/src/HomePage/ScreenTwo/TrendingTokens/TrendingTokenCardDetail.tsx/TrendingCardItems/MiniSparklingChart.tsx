import React from "react";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

import Stack from "@mui/material/Stack";

import Box from "@mui/material/Box";

interface MiniSparklingChartProps {
  data: number[];
}

export default function MiniSparklingChart({ data }: MiniSparklingChartProps) {
  const [showHighlight, setShowHighlight] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const handleHighlightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowHighlight(event.target.checked);
  };

  const handleTooltipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTooltip(event.target.checked);
  };

  if (!data || data.length === 0) return <div>...</div>;

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
    
      <Stack direction="row" sx={{ width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={data}
            height={60}
            color="#78C841"
            showHighlight={showHighlight}
            showTooltip={showTooltip}
          />
        </Box>

      </Stack>
    </Stack>
  );
}
