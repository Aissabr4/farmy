import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  MapPin,
  Ruler,
  Droplets,
  Mountain,
  Leaf,
  Calendar,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

// Form validation schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Field name must be at least 2 characters" }),
  size: z.string().min(1, { message: "Field size is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  soilType: z.string({
    required_error: "Please select a soil type",
  }),
  cropType: z.string({
    required_error: "Please select a crop type",
  }),
  plantingDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFieldFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

const AddFieldForm = ({
  onSubmit = (data) => console.log("Form submitted:", data),
  onCancel = () => console.log("Form cancelled"),
}: AddFieldFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      size: "",
      location: "",
      soilType: "",
      cropType: "",
      plantingDate: "",
      notes: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-[600px] mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Field</CardTitle>
        <CardDescription>
          Enter the details for your new agricultural field.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="North Field" {...field} />
                        <Leaf className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      A unique name to identify this field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field Size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Size (acres)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" placeholder="10" {...field} />
                        <Ruler className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The size of the field in acres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="GPS coordinates or address"
                          {...field}
                        />
                        <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      GPS coordinates or descriptive location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Soil Type */}
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <Mountain className="absolute right-8 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="sand">Sandy</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="peat">Peat</SelectItem>
                        <SelectItem value="chalk">Chalk</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The predominant soil type in this field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Crop Type */}
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <Droplets className="absolute right-8 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of crop planned for this field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Planting Date */}
              <FormField
                control={form.control}
                name="plantingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planting Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" {...field} />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      When you plan to plant this field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                      placeholder="Additional information about this field..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any additional information about this field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Add Field</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddFieldForm;
