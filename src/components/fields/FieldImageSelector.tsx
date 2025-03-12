import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface FieldImageSelectorProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELD_IMAGES = [
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=150&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&q=80",
  "https://images.unsplash.com/photo-1535486509975-18366f9825df?w=150&q=80",
  "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=150&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&q=80",
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=150&q=80",
];

const FieldImageSelector: React.FC<FieldImageSelectorProps> = ({
  currentImage = "",
  onImageChange,
  open,
  onOpenChange,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("preset");
  const [selectedImage, setSelectedImage] = useState<string>(
    currentImage || FIELD_IMAGES[0],
  );
  const [customUrl, setCustomUrl] = useState<string>("");

  const handleSave = () => {
    if (selectedTab === "preset") {
      onImageChange(selectedImage);
    } else if (selectedTab === "custom" && customUrl) {
      onImageChange(customUrl);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Field Image</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="preset"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Images</TabsTrigger>
            <TabsTrigger value="custom">Custom URL</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="mt-4">
            <RadioGroup
              value={selectedImage}
              onValueChange={setSelectedImage}
              className="grid grid-cols-4 gap-4"
            >
              {FIELD_IMAGES.map((image, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value={image}
                    id={`field-image-${index}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`field-image-${index}`}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div
                      className={`h-16 w-16 rounded-md bg-cover bg-center border-2 ${selectedImage === image ? "border-primary" : "border-transparent"}`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <span className="text-xs mt-1">Field {index + 1}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="custom-url">Custom Image URL</Label>
                <Input
                  id="custom-url"
                  placeholder="https://example.com/field.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
              </div>

              {customUrl && (
                <div className="flex justify-center">
                  <div
                    className="h-32 w-32 rounded-md bg-cover bg-center border"
                    style={{ backgroundImage: `url(${customUrl})` }}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FieldImageSelector;
