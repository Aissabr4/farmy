import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Search, Plus, Filter, MapPin, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddFieldForm from "./AddFieldForm";
import FieldDetailView from "./FieldDetailView";

interface Field {
  id: string;
  name: string;
  location: string;
  size: number;
  cropType: string;
  status: "healthy" | "warning" | "critical";
  soilMoisture: number;
  sunlight: number;
  growthStage: string;
  plantingDate: string;
  harvestDate: string;
}

interface FieldManagementProps {
  fields?: Field[];
  onAddField?: (field: any) => void;
  onEditField?: (field: any) => void;
  onDeleteField?: (fieldId: string) => void;
}

const FieldManagement = ({
  fields = [
    {
      id: "field-1",
      name: "North Field",
      location: "Section A, North-East Corner",
      size: 12.5,
      cropType: "Corn",
      status: "healthy",
      soilMoisture: 75,
      sunlight: 85,
      growthStage: "Mature",
      plantingDate: "2023-04-15",
      harvestDate: "2023-09-30",
    },
    {
      id: "field-2",
      name: "South Field",
      location: "Section B, South Corner",
      size: 8.3,
      cropType: "Wheat",
      status: "warning",
      soilMoisture: 45,
      sunlight: 90,
      growthStage: "Growing",
      plantingDate: "2023-05-10",
      harvestDate: "2023-10-15",
    },
    {
      id: "field-3",
      name: "East Field",
      location: "Section C, East Side",
      size: 15.7,
      cropType: "Soybeans",
      status: "critical",
      soilMoisture: 30,
      sunlight: 65,
      growthStage: "Early",
      plantingDate: "2023-06-01",
      harvestDate: "2023-11-05",
    },
    {
      id: "field-4",
      name: "West Field",
      location: "Section D, West Side",
      size: 10.2,
      cropType: "Barley",
      status: "healthy",
      soilMoisture: 80,
      sunlight: 75,
      growthStage: "Mature",
      plantingDate: "2023-03-20",
      harvestDate: "2023-08-15",
    },
  ],
  onAddField = (field) => {
    console.log("Field added:", field);
  },
  onEditField = (field) => {
    console.log(`Field ${field.id} updated:`, field);
  },
  onDeleteField = (fieldId) => {
    console.log(`Field ${fieldId} deleted`);
  },
}: FieldManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // Filter fields based on search query and active tab
  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && field.status === activeTab;
  });

  const handleFieldClick = (field: Field) => {
    setSelectedField(field);
    setIsDetailViewOpen(true);
  };

  const handleAddField = (fieldData: any) => {
    onAddField(fieldData);
    setIsAddFieldDialogOpen(false);
  };

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
    <div className="w-full h-full bg-gray-50">
      {/* Main content */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Field Management</h1>
          <Dialog
            open={isAddFieldDialogOpen}
            onOpenChange={setIsAddFieldDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
              </DialogHeader>
              <AddFieldForm
                onSubmit={handleAddField}
                onCancel={() => setIsAddFieldDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
            <Input
              placeholder="Search fields..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter size={14} />
              Filter
            </Button>

            <Tabs
              defaultValue="all"
              className="w-full md:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="healthy">Healthy</TabsTrigger>
                <TabsTrigger value="warning">Warning</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Field list */}
        {filteredFields.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredFields.map((field) => (
              <Card
                key={field.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleFieldClick(field)}
              >
                <CardContent className="p-0">
                  <div
                    className="flex flex-col md:flex-row border-l-4 overflow-hidden"
                    style={{
                      borderLeftColor:
                        field.status === "healthy"
                          ? "#22c55e"
                          : field.status === "warning"
                            ? "#eab308"
                            : "#ef4444",
                    }}
                  >
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg">
                              {field.name}
                            </h3>
                            <Badge variant={statusVariants[field.status]}>
                              {field.status.charAt(0).toUpperCase() +
                                field.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin size={14} className="mr-1" />
                            {field.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {field.cropType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {field.size} acres
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              statusColors[field.status],
                            )}
                          ></div>
                          <div className="text-sm">
                            <div className="text-gray-500">Status</div>
                            <div className="font-medium">
                              {field.status.charAt(0).toUpperCase() +
                                field.status.slice(1)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Leaf size={16} className="text-green-500 mr-2" />
                          <div className="text-sm">
                            <div className="text-gray-500">Growth</div>
                            <div className="font-medium">
                              {field.growthStage}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 flex items-center justify-center">
                            <span className="text-white text-[8px]">H₂O</span>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-500">Moisture</div>
                            <div className="font-medium">
                              {field.soilMoisture}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-4 bg-gray-50 md:w-48">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full p-8 text-center">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Leaf className="h-6 w-6 text-gray-400" />
                </div>
                <CardTitle className="text-xl mb-2">No fields found</CardTitle>
                <CardDescription className="max-w-md mx-auto mb-6">
                  {searchQuery
                    ? `No fields match your search "${searchQuery}". Try a different search term.`
                    : "You haven't added any fields yet. Add your first field to get started."}
                </CardDescription>
                {!searchQuery && (
                  <Button onClick={() => setIsAddFieldDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Field
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Field detail view dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedField && (
            <FieldDetailView
              fieldId={selectedField.id}
              fieldName={selectedField.name}
              location={selectedField.location}
              size={selectedField.size}
              cropType={selectedField.cropType}
              plantingDate={selectedField.plantingDate}
              harvestDate={selectedField.harvestDate}
              status={selectedField.status}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FieldManagement;
