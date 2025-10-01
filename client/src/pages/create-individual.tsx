import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiFacebook } from "react-icons/si";
import { Upload, X } from "lucide-react";

const individualAuctionSchema = z.object({
  facebookGroup: z.string().min(1, "Please select a Facebook group"),
  itemName: z.string().min(3, "Item name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startingBid: z.string().min(1, "Starting bid is required"),
  bidIncrement: z.string().min(1, "Bid increment is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type IndividualAuctionFormData = z.infer<typeof individualAuctionSchema>;

export default function CreateIndividual() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<IndividualAuctionFormData>({
    resolver: zodResolver(individualAuctionSchema),
    defaultValues: {
      facebookGroup: "",
      itemName: "",
      description: "",
      startingBid: "",
      bidIncrement: "5",
      startTime: "",
      endTime: "",
    },
  });

  const handleSubmit = async (data: IndividualAuctionFormData) => {
    setIsSubmitting(true);
    console.log("Creating individual auction:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  //todo: remove mock functionality
  const mockGroups = [
    { id: "1", name: "Vintage Car Enthusiasts", members: "2.3K" },
    { id: "2", name: "Antique Collectors Market", members: "5.1K" },
    { id: "3", name: "Local Buy & Sell", members: "12K" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">
          Create Individual Post Auction
        </h1>
        <p className="text-muted-foreground mt-1">
          Post a single auction directly to your Facebook group
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SiFacebook className="h-5 w-5 text-primary" />
                Facebook Group
              </CardTitle>
              <CardDescription>Select where to post this auction</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="facebookGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger data-testid="select-facebook-group">
                          <SelectValue placeholder="Choose a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name} • {group.members} members
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
              <CardDescription>Describe the item you're auctioning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vintage 1967 Ford Mustang"
                        className="text-lg"
                        {...field}
                        data-testid="input-item-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the item, condition, features..."
                        className="min-h-[120px]"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value.length}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Item Images</Label>
                <div className="mt-2">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover-elevate"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload images
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      data-testid="input-image-upload"
                    />
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 bg-destructive rounded-full flex items-center justify-center"
                        >
                          <X className="h-4 w-4 text-destructive-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bidding Settings</CardTitle>
              <CardDescription>Set your auction parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startingBid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Bid ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          data-testid="input-starting-bid"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bidIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Increment ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          data-testid="input-bid-increment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          data-testid="input-start-time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          data-testid="input-end-time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isSubmitting}
            data-testid="button-post-to-facebook"
          >
            <SiFacebook className="h-5 w-5 mr-2" />
            {isSubmitting ? "Posting to Facebook..." : "Post to Facebook Group"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
