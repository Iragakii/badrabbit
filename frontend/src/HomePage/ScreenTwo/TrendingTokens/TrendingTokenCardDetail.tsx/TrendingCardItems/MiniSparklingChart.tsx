import React, { useEffect, useState } from "react";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

import Stack from "@mui/material/Stack";

import Box from "@mui/material/Box";

export default function MiniSparklingChart() {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
const [showHighlight, setShowHighlight] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const handleHighlightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowHighlight(event.target.checked);
  };

  const handleTooltipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTooltip(event.target.checked);
  };

  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1"
        );
        const json = await res.json();

        // Extract only prices
        const allPrices = json.prices.map((p: [number, number]) => p[1]);
        const limitedPrices = allPrices.filter((_: number, index: number) => index % 2 === 0).slice(0, 10);
        setData(limitedPrices);
      } catch (err) {
        console.error("Error fetching ETH price:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60_000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading ETH Sparkline...</div>;

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
