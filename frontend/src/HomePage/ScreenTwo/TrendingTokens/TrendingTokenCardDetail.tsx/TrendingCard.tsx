import { useEffect, useState } from "react";
import EachTrendingCardCPN from "./EachTrendingCardCPN";
import { getApiUrl } from "../../../../config/api";

interface Token {
  id: string;
  name: string;
  symbol: string;
  cmcLink: string;
  api: string;
}

interface TokenData {
  chartData: number[];
  currentPrice: number;
  change: number;
}

const TrendingCard = () => {
  const [data, setData] = useState<Record<string, TokenData>>({});

  // Define tokens array inside component to use getApiUrl
  const tokens: Token[] = [
    {
      id: "littlemanyu",
      name: "Manyu",
      symbol: "MANYU",
      cmcLink: "https://coinmarketcap.com/vi/currencies/manyu-ethereum/",
      api: getApiUrl("api/price/chart/littlemanyu"),
    },
    {
      id: "freysa-ai",
      name: "Freysa",
      symbol: "FAI",
      cmcLink: "https://coinmarketcap.com/vi/currencies/freysa-ai/",
      api: getApiUrl("api/price/chart/freysa-ai"),
    },
    {
      id: "bucky-2",
      name: "Bucky",
      symbol: "BUCKY",
      cmcLink: "https://coinmarketcap.com/vi/currencies/bucky-2/",
      api: getApiUrl("api/price/chart/bucky-2"),
    },
    {
      id: "retard-finder-coin",
      name: "Retard",
      symbol: "RETARD",
      cmcLink: "https://coinmarketcap.com/vi/currencies/retard-finder-coin/",
      api: getApiUrl("api/price/chart/retard-finder-coin"),
    },
    {
      id: "ski-mask-dog",
      name: "Ski mask dog",
      symbol: "SKI",
      cmcLink: "https://coinmarketcap.com/vi/currencies/ski-mask-dog/",
      api: getApiUrl("api/price/chart/ski-mask-dog"),
    },
    {
      id: "apu-apustaja",
      name: "Apu",
      symbol: "APU",
      cmcLink: "https://coinmarketcap.com/vi/currencies/apu-apustaja/",
      api: getApiUrl("api/price/chart/apu-apustaja"),
    },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      const promises = tokens.map(async (token) => {
        try {
          const res = await fetch(token.api);
          const json = await res.json();

          if (!json || !Array.isArray(json.prices)) {
            console.warn(`Invalid data for ${token.id}`, json);
            return { id: token.id, chartData: [], currentPrice: 0, change: 0 };
          }

          const allPrices = json.prices.map((p: [number, number]) => p[1]);
          const limitedPrices = allPrices
            .filter((_: number, index: number) => index % 2 === 0)
            .slice(0, 10);
          const currentPrice = allPrices[allPrices.length - 1] || 0;
          const prevPrice =
            allPrices[allPrices.length - 25] || allPrices[0] || 0;
          const change =
            prevPrice > 0 ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0;
          return {
            id: token.id,
            chartData: limitedPrices,
            currentPrice,
            change,
          };
        } catch (err) {
          console.error(`Error fetching ${token.id}:`, err);
          return { id: token.id, chartData: [], currentPrice: 0, change: 0 };
        }
      });
      const results = await Promise.all(promises);
      const newData: Record<string, TokenData> = {};
      results.forEach(
        (r) =>
          (newData[r.id] = {
            chartData: r.chartData,
            currentPrice: r.currentPrice,
            change: r.change,
          })
      );
      setData(newData);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {tokens.map((token) => (
        <EachTrendingCardCPN
          key={token.id}
          token={token}
          chartData={data[token.id]?.chartData || []}
          currentPrice={data[token.id]?.currentPrice || 0}
          change={data[token.id]?.change || 0}
        />
      ))}
    </>
  );
};

export default TrendingCard;
