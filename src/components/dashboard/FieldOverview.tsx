import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FieldCard from "./FieldCard";
import FieldImageSelector from "../fields/FieldImageSelector";
import { supabase } from "@/lib/supabase";

interface Field {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical";
  cropType: string;
  soilMoisture: number;
  sunlight: number;
  growthStage: string;
  fieldImage?: string;
}

interface FieldOverviewProps {
  fields?: Field[];
  onAddField?: () => void;
  onFieldClick?: (fieldId: string) => void;
}

const FieldOverview = ({
  fields = [
    {
      id: "field-1",
      name: "North Field",
      status: "healthy",
      cropType: "Corn",
      soilMoisture: 75,
      sunlight: 85,
      growthStage: "Mature",
    },
    {
      id: "field-2",
      name: "South Field",
      status: "warning",
      cropType: "Wheat",
      soilMoisture: 45,
      sunlight: 90,
      growthStage: "Growing",
    },
    {
      id: "field-3",
      name: "East Field",
      status: "critical",
      cropType: "Soybeans",
      soilMoisture: 30,
      sunlight: 65,
      growthStage: "Early",
    },
    {
      id: "field-4",
      name: "West Field",
      status: "healthy",
      cropType: "Barley",
      soilMoisture: 80,
      sunlight: 75,
      growthStage: "Mature",
    },
    {
      id: "field-5",
      name: "Central Field",
      status: "healthy",
      cropType: "Alfalfa",
      soilMoisture: 65,
      sunlight: 80,
      growthStage: "Growing",
    },
    {
      id: "field-6",
      name: "Riverside",
      status: "warning",
      cropType: "Rice",
      soilMoisture: 90,
      sunlight: 70,
      growthStage: "Growing",
    },
  ],
  onAddField = () => console.log("Add field clicked"),
  onFieldClick = (fieldId) => console.log(`Field ${fieldId} clicked`),
}: FieldOverviewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  // Filter fields based on search query and active tab
  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.cropType.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && field.status === activeTab;
  });

  return (
    <Card className="w-full h-full p-6 bg-white overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Field Overview</h2>
        <Button onClick={onAddField} className="flex items-center gap-2">
          <Plus size={16} />
          Add Field
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search fields..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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
            className="w-full sm:w-auto"
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

      {filteredFields.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto max-h-[calc(100%-130px)]">
          {filteredFields.map((field) => (
            <FieldCard
              key={field.id}
              id={field.id}
              name={field.name}
              status={field.status}
              cropType={field.cropType}
              soilMoisture={field.soilMoisture}
              sunlight={field.sunlight}
              growthStage={field.growthStage}
              fieldImage={field.fieldImage}
              onClick={() => onFieldClick(field.id)}
              onImageClick={() => {
                setSelectedField(field);
                setIsImageSelectorOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-2">
            <Search size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-gray-700">No fields found</h3>
          <p className="text-gray-500 mt-1 max-w-md">
            {searchQuery
              ? `No fields match your search "${searchQuery}". Try a different search term.`
              : "There are no fields to display. Add a new field to get started."}
          </p>
          {!searchQuery && (
            <Button onClick={onAddField} className="mt-4">
              Add Your First Field
            </Button>
          )}
        </div>
      )}

      {/* Field Image Selector Dialog */}
      {selectedField && (
        <FieldImageSelector
          currentImage={selectedField.fieldImage}
          onImageChange={async (newImage) => {
            try {
              // Update field image in Supabase
              const { error } = await supabase
                .from("fields")
                .update({ field_image: newImage })
                .eq("id", selectedField.id);

              if (error) throw error;

              // Update the field in the local state
              const updatedFields = fields.map((field) =>
                field.id === selectedField.id
                  ? { ...field, fieldImage: newImage }
                  : field,
              );

              // Show success message
              alert(`Field image updated successfully!`);
            } catch (error) {
              console.error("Error updating field image:", error);
              alert(`Failed to update field image: ${error.message}`);
            }
          }}
          open={isImageSelectorOpen}
          onOpenChange={setIsImageSelectorOpen}
        />
      )}
    </Card>
  );
};

export default FieldOverview;
