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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MALE_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=John&gender=male&clothingColor=blue&top=hat&clothingGraphic=bear&facialHairColor=black&facialHairType=beardMedium",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&gender=male&clothingColor=green&top=hat&clothingGraphic=deer&facialHairColor=brown&facialHairType=beardLight",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=David&gender=male&clothingColor=brown&top=hat&clothingGraphic=skull&facialHairColor=black&facialHairType=beardMedium",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&gender=male&clothingColor=blue&top=winterHat01&clothingGraphic=bear&facialHairColor=black&facialHairType=beardMajestic",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=James&gender=male&clothingColor=green&top=winterHat02&clothingGraphic=deer&facialHairColor=brown&facialHairType=beardMedium",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=William&gender=male&clothingColor=brown&top=winterHat03&clothingGraphic=skull&facialHairColor=black&facialHairType=beardLight",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Richard&gender=male&clothingColor=blue&top=hat&clothingGraphic=bear&facialHairColor=brown&facialHairType=beardMajestic",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas&gender=male&clothingColor=green&top=hat&clothingGraphic=deer&facialHairColor=black&facialHairType=beardMedium",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer&gender=male&clothingColor=brown&top=hat&clothingGraphic=skull&facialHairColor=brown&facialHairType=beardLight",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Worker&gender=male&clothingColor=blue&top=winterHat01&clothingGraphic=bear&facialHairColor=black&facialHairType=beardMedium",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Technician&gender=male&clothingColor=green&top=winterHat02&clothingGraphic=deer&facialHairColor=brown&facialHairType=beardMajestic",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager&gender=male&clothingColor=brown&top=winterHat03&clothingGraphic=skull&facialHairColor=black&facialHairType=beardLight",
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar = "",
  onAvatarChange,
  open,
  onOpenChange,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("preset");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [customUrl, setCustomUrl] = useState<string>("");

  const handleSave = () => {
    if (selectedTab === "preset") {
      onAvatarChange(selectedAvatar);
    } else if (selectedTab === "custom" && customUrl) {
      onAvatarChange(customUrl);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Avatar</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="preset"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Avatars</TabsTrigger>
            <TabsTrigger value="custom">Custom URL</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="mt-4">
            <RadioGroup
              value={selectedAvatar}
              onValueChange={setSelectedAvatar}
              className="grid grid-cols-4 gap-4"
            >
              {MALE_AVATARS.map((avatar, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value={avatar}
                    id={`avatar-${index}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`avatar-${index}`}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Avatar
                      className={`h-16 w-16 border-2 ${selectedAvatar === avatar ? "border-primary" : "border-transparent"}`}
                    >
                      <AvatarImage
                        src={avatar}
                        alt={`Avatar option ${index + 1}`}
                      />
                    </Avatar>
                    <span className="text-xs mt-1">Avatar {index + 1}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="custom-url">Custom Avatar URL</Label>
                <Input
                  id="custom-url"
                  placeholder="https://example.com/avatar.png"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
              </div>

              {customUrl && (
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={customUrl} alt="Custom avatar preview" />
                    <AvatarFallback>Preview</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Avatar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;
