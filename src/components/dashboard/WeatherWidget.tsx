import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import {
  Cloud,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  CloudFog,
  CloudDrizzle,
  CloudSnow,
} from "lucide-react";

interface WeatherData {
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  condition?: "sunny" | "cloudy" | "rainy" | "foggy" | "snowy";
  forecast?: {
    day: string;
    temperature: number;
    condition: "sunny" | "cloudy" | "rainy" | "foggy" | "snowy";
  }[];
  location?: string;
}

interface WeatherWidgetProps {
  data?: WeatherData;
  className?: string;
}

const WeatherWidget = ({
  data = {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "sunny",
    location: "Farm Location",
    forecast: [
      { day: "Mon", temperature: 25, condition: "sunny" },
      { day: "Tue", temperature: 23, condition: "cloudy" },
      { day: "Wed", temperature: 22, condition: "rainy" },
      { day: "Thu", temperature: 24, condition: "sunny" },
      { day: "Fri", temperature: 26, condition: "sunny" },
    ],
  },
  className = "",
}: WeatherWidgetProps) => {
  // Weather condition icons mapping
  const conditionIcons = {
    sunny: <Sun className="h-8 w-8 text-yellow-500" />,
    cloudy: <Cloud className="h-8 w-8 text-gray-500" />,
    rainy: <CloudRain className="h-8 w-8 text-blue-500" />,
    foggy: <CloudFog className="h-8 w-8 text-gray-400" />,
    snowy: <CloudSnow className="h-8 w-8 text-blue-200" />,
  };

  // Small condition icons for forecast
  const smallConditionIcons = {
    sunny: <Sun className="h-4 w-4 text-yellow-500" />,
    cloudy: <Cloud className="h-4 w-4 text-gray-500" />,
    rainy: <CloudRain className="h-4 w-4 text-blue-500" />,
    foggy: <CloudFog className="h-4 w-4 text-gray-400" />,
    snowy: <CloudSnow className="h-4 w-4 text-blue-200" />,
  };

  // Weather condition descriptions
  const conditionDescriptions = {
    sunny: "Clear skies",
    cloudy: "Overcast",
    rainy: "Precipitation",
    foggy: "Low visibility",
    snowy: "Snow falling",
  };

  return (
    <Card
      className={`w-full max-w-[400px] overflow-hidden bg-white ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Weather</CardTitle>
          <Badge variant="outline" className="text-xs">
            {data.location}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          {/* Current weather icon and temperature */}
          <div className="flex items-center">
            {conditionIcons[data.condition || "sunny"]}
            <div className="ml-3">
              <div className="text-3xl font-bold">{data.temperature}°C</div>
              <div className="text-sm text-gray-500">
                {conditionDescriptions[data.condition || "sunny"]}
              </div>
            </div>
          </div>

          {/* Weather metrics */}
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-end">
                    <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">{data.humidity}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Humidity</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-end">
                    <Wind className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{data.windSpeed} km/h</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wind Speed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-end">
                    <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">
                      Feels like {data.temperature - 1}°C
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Feels Like Temperature</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-1">
            {data.forecast?.map((day, index) => (
              <div key={index} className="flex flex-col items-center p-1">
                <span className="text-xs text-gray-500">{day.day}</span>
                {smallConditionIcons[day.condition]}
                <span className="text-xs font-medium mt-1">
                  {day.temperature}°
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weather alert or tip */}
        <div className="mt-4 bg-blue-50 p-2 rounded-md">
          <div className="flex items-center text-xs text-blue-700">
            <CloudDrizzle className="h-3 w-3 mr-1" />
            <span>
              {data.condition === "rainy" || data.condition === "snowy"
                ? "Weather alert: Prepare for precipitation in your fields"
                : "Tip: Ideal conditions for field inspection today"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
