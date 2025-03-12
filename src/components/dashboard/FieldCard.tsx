import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Droplets, Leaf, Sun } from "lucide-react";

interface FieldCardProps {
  id?: string;
  name?: string;
  status?: "healthy" | "warning" | "critical";
  cropType?: string;
  soilMoisture?: number;
  sunlight?: number;
  growthStage?: string;
  fieldImage?: string;
  onClick?: () => void;
  onImageClick?: () => void;
}

const FieldCard = ({
  id = "field-1",
  name = "North Field",
  status = "healthy",
  cropType = "Corn",
  soilMoisture = 75,
  sunlight = 85,
  growthStage = "Mature",
  fieldImage = "",
  onClick = () => console.log("Field card clicked"),
  onImageClick = () => console.log("Field image clicked"),
}: FieldCardProps) => {
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

  return (
    <Card
      className="w-[180px] h-[180px] flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow bg-white"
      onClick={onClick}
    >
      {/* Status indicator dot */}
      <div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full ${statusColors[status]}`}
      ></div>

      {/* Circular field representation */}
      <div className="flex items-center justify-center pt-4">
        <div
          className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (onImageClick) onImageClick();
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${fieldImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=150&q=80"})`,
            }}
          ></div>
        </div>
      </div>

      <CardContent className="p-3 pt-2 text-center">
        <h3 className="font-medium text-sm truncate">{name}</h3>
        <p className="text-xs text-gray-500 truncate">{cropType}</p>
        <Badge
          variant={statusVariants[status]}
          className="mt-1 text-[10px] py-0 px-2"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardContent>

      <CardFooter className="p-2 pt-0 justify-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center">
                <Droplets size={14} className="text-blue-500" />
                <span className="text-[10px] mt-1">{soilMoisture}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Soil Moisture</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center">
                <Sun size={14} className="text-yellow-500" />
                <span className="text-[10px] mt-1">{sunlight}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sunlight</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center">
                <Leaf size={14} className="text-green-500" />
                <span className="text-[10px] mt-1">
                  {growthStage.substring(0, 3)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Growth Stage: {growthStage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default FieldCard;
