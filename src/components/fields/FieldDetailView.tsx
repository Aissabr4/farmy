import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Calendar,
  Cloud,
  Droplets,
  Leaf,
  LineChart,
  MapPin,
  Ruler,
  Thermometer,
  Wind,
} from "lucide-react";

interface FieldDetailViewProps {
  fieldId?: string;
  fieldName?: string;
  location?: string;
  size?: number;
  cropType?: string;
  plantingDate?: string;
  harvestDate?: string;
  status?: "healthy" | "warning" | "critical";
  soilData?: {
    type?: string;
    ph?: number;
    moisture?: number;
    nutrients?: {
      nitrogen?: number;
      phosphorus?: number;
      potassium?: number;
    };
  };
  cropHistory?: Array<{
    year: string;
    crop: string;
    yield: number;
    notes?: string;
  }>;
  weatherForecast?: Array<{
    date: string;
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
  }>;
}

const FieldDetailView = ({
  fieldId = "field-1",
  fieldName = "North Field",
  location = "Section A, North-East Corner",
  size = 12.5,
  cropType = "Corn",
  plantingDate = "2023-04-15",
  harvestDate = "2023-09-30",
  status = "healthy",
  soilData = {
    type: "Loamy",
    ph: 6.8,
    moisture: 72,
    nutrients: {
      nitrogen: 65,
      phosphorus: 45,
      potassium: 80,
    },
  },
  cropHistory = [
    {
      year: "2022",
      crop: "Soybeans",
      yield: 52,
      notes: "Good yield despite dry summer",
    },
    {
      year: "2021",
      crop: "Wheat",
      yield: 58,
      notes: "Excellent growing conditions",
    },
    {
      year: "2020",
      crop: "Corn",
      yield: 48,
      notes: "Pest issues in mid-season",
    },
  ],
  weatherForecast = [
    {
      date: "Today",
      condition: "Sunny",
      temperature: 78,
      humidity: 45,
      windSpeed: 8,
    },
    {
      date: "Tomorrow",
      condition: "Partly Cloudy",
      temperature: 75,
      humidity: 50,
      windSpeed: 10,
    },
    {
      date: "Day 3",
      condition: "Chance of Rain",
      temperature: 72,
      humidity: 65,
      windSpeed: 12,
    },
    {
      date: "Day 4",
      condition: "Rainy",
      temperature: 68,
      humidity: 80,
      windSpeed: 15,
    },
    {
      date: "Day 5",
      condition: "Sunny",
      temperature: 74,
      humidity: 55,
      windSpeed: 7,
    },
  ],
}: FieldDetailViewProps) => {
  // Status color mapping
  const statusColors = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  // Status badge variant mapping
  const statusVariants = {
    healthy: "default",
    warning: "secondary",
    critical: "destructive",
  } as const;

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (
      dateString.includes("Day") ||
      dateString === "Today" ||
      dateString === "Tomorrow"
    ) {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full ${statusColors[status]} mr-3`}
          ></div>
          <h1 className="text-2xl font-bold">{fieldName}</h1>
          <Badge variant={statusVariants[status]} className="ml-3">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit Field
          </Button>
          <Button size="sm">Plan Activities</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span>{location}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ruler className="h-5 w-5 text-gray-500 mr-2" />
              <span>{size} acres</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Leaf className="h-5 w-5 text-green-500 mr-2" />
              <span>{cropType}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Planting Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span>{formatDate(plantingDate)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Expected Harvest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span>{formatDate(harvestDate)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="soil" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="soil">Soil Data</TabsTrigger>
          <TabsTrigger value="history">Crop History</TabsTrigger>
          <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="soil" className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Soil Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Type:</span>
                    <span>{soilData.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">pH Level:</span>
                    <span>{soilData.ph}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Moisture:</span>
                      <span>{soilData.moisture}%</span>
                    </div>
                    <Progress value={soilData.moisture} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Nutrient Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Nitrogen (N):</span>
                      <span>{soilData.nutrients?.nitrogen}%</span>
                    </div>
                    <Progress
                      value={soilData.nutrients?.nitrogen}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Phosphorus (P):
                      </span>
                      <span>{soilData.nutrients?.phosphorus}%</span>
                    </div>
                    <Progress
                      value={soilData.nutrients?.phosphorus}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Potassium (K):
                      </span>
                      <span>{soilData.nutrients?.potassium}%</span>
                    </div>
                    <Progress
                      value={soilData.nutrients?.potassium}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="bg-white">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Previous Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Year</th>
                      <th className="text-left py-3 px-4">Crop</th>
                      <th className="text-left py-3 px-4">Yield (bu/acre)</th>
                      <th className="text-left py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropHistory.map((record, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{record.year}</td>
                        <td className="py-3 px-4">{record.crop}</td>
                        <td className="py-3 px-4">{record.yield}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {record.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                <LineChart className="h-4 w-4 mr-2" />
                View Yield Trends
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weatherForecast.map((day, index) => (
              <Card key={index} className="bg-white">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-sm">{day.date}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-2">
                    {day.condition === "Sunny" && (
                      <Sun className="h-10 w-10 mx-auto text-yellow-500" />
                    )}
                    {day.condition === "Partly Cloudy" && (
                      <CloudSun className="h-10 w-10 mx-auto text-gray-400" />
                    )}
                    {day.condition === "Cloudy" && (
                      <Cloud className="h-10 w-10 mx-auto text-gray-400" />
                    )}
                    {day.condition === "Rainy" && (
                      <CloudRain className="h-10 w-10 mx-auto text-blue-500" />
                    )}
                    {day.condition === "Chance of Rain" && (
                      <CloudDrizzle className="h-10 w-10 mx-auto text-blue-400" />
                    )}
                    <p className="mt-1 font-medium">{day.condition}</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-center">
                      <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                      <span>{day.temperature}°F</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Wind className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{day.windSpeed} mph</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Weather icon components
const Sun = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="5" />
      <line
        x1="12"
        y1="1"
        x2="12"
        y2="3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="21"
        x2="12"
        y2="23"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4.22"
        y1="4.22"
        x2="5.64"
        y2="5.64"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="18.36"
        y1="18.36"
        x2="19.78"
        y2="19.78"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="12"
        x2="3"
        y2="12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="12"
        x2="23"
        y2="12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4.22"
        y1="19.78"
        x2="5.64"
        y2="18.36"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="18.36"
        y1="5.64"
        x2="19.78"
        y2="4.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const CloudSun = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full"
    >
      <path d="M17.5,17.5a3.5,3.5,0,0,1-3.5,3.5H7a4,4,0,0,1,0-8h.1a5.5,5.5,0,0,1,10.4,2A3.5,3.5,0,0,1,17.5,17.5Z" />
      <path
        d="M10,5A3.5,3.5,0,0,0,6.5,8.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="10"
        y1="2"
        x2="10"
        y2="3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="4.75"
        y1="4.75"
        x2="5.5"
        y2="5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="2"
        y1="10"
        x2="3"
        y2="10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
);

const CloudRain = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full"
    >
      <path d="M20,16.5A3.5,3.5,0,0,1,16.5,20H6A4,4,0,0,1,6,12h.1a5.5,5.5,0,0,1,10.4,2A3.5,3.5,0,0,1,20,16.5Z" />
      <line
        x1="8"
        y1="20"
        x2="8"
        y2="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="12"
        y1="20"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="16"
        y1="20"
        x2="16"
        y2="22"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
);

const CloudDrizzle = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full"
    >
      <path d="M20,16.5A3.5,3.5,0,0,1,16.5,20H6A4,4,0,0,1,6,12h.1a5.5,5.5,0,0,1,10.4,2A3.5,3.5,0,0,1,20,16.5Z" />
      <line
        x1="8"
        y1="19"
        x2="8"
        y2="20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="8"
        y1="22"
        x2="8"
        y2="23"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="12"
        y1="22"
        x2="12"
        y2="23"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="16"
        y1="19"
        x2="16"
        y2="20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <line
        x1="16"
        y1="22"
        x2="16"
        y2="23"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </div>
);

export default FieldDetailView;
