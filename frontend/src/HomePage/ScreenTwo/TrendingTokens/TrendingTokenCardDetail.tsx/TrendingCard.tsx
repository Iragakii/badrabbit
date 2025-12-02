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
  image?: string;
}

const TrendingCard = () => {
  const [data, setData] = useState<Record<string, TokenData>>({});

  // Define tokens array inside component to use getApiUrl - Total 8 tokens
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
    {
      id: "pepe",
      name: "Pepe",
      symbol: "PEPE",
      cmcLink: "https://coinmarketcap.com/currencies/pepe/",
      api: getApiUrl("api/price/chart/pepe"),
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      cmcLink: "https://coinmarketcap.com/currencies/dogecoin/",
      api: getApiUrl("api/price/chart/dogecoin"),
    },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      // Fetch tokens sequentially with delay to avoid rate limit
      const newData: Record<string, TokenData> = {};
      
      for (const token of tokens) {
        try {
          const res = await fetch(token.api);
          
          // Handle 429 rate limit
          if (res.status === 429) {
            console.warn(`Rate limit for ${token.id}, using cached data if available`);
            // Use existing data if available
            if (data[token.id]) {
              newData[token.id] = data[token.id];
            } else {
              newData[token.id] = { chartData: [], currentPrice: 0, change: 0 };
            }
            // Wait before next request
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          
          const json = await res.json();

          if (!json || !Array.isArray(json.prices)) {
            console.warn(`Invalid data for ${token.id}`, json);
            newData[token.id] = { 
              chartData: [], 
              currentPrice: 0, 
              change: 0,
              image: json.image || undefined
            };
            continue;
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
          
          newData[token.id] = {
            chartData: limitedPrices,
            currentPrice,
            change,
            image: json.image || undefined,
          };
          
          // Delay between requests to avoid rate limit
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (err) {
          console.error(`Error fetching ${token.id}:`, err);
          // Use existing data if available
          if (data[token.id]) {
            newData[token.id] = data[token.id];
          } else {
            newData[token.id] = { chartData: [], currentPrice: 0, change: 0 };
          }
        }
      }
      
      setData(newData);
    };

    fetchAll();
    // Increase interval to 5 minutes to reduce API calls
    const interval = setInterval(fetchAll, 300_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          image={data[token.id]?.image}
        />
      ))}
    </>
  );
};

export default TrendingCard;
