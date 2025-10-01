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
} from "@/components/ui/form";

const auctionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  facebookUrl: z.string().url("Must be a valid Facebook URL").refine(
    (url) => url.includes("facebook.com"),
    "Must be a Facebook URL"
  ),
  startingBid: z.string().min(1, "Starting bid is required"),
  minIncrement: z.string().min(1, "Minimum increment is required"),
  endTime: z.string().min(1, "End time is required"),
});

type AuctionFormData = z.infer<typeof auctionSchema>;

interface CreateAuctionFormProps {
  onSubmit: (data: AuctionFormData) => void;
}

export function CreateAuctionForm({ onSubmit }: CreateAuctionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      title: "",
      description: "",
      facebookUrl: "",
      startingBid: "",
      minIncrement: "10",
      endTime: "",
    },
  });

  const handleSubmit = async (data: AuctionFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(data);
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Auction</CardTitle>
        <CardDescription>
          Set up a new auction and link it to your Facebook group post
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auction Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Vintage 1967 Ford Mustang"
                      {...field}
                      data-testid="input-auction-title"
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
                      placeholder="Describe the item being auctioned..."
                      className="min-h-[100px]"
                      {...field}
                      data-testid="input-auction-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Post URL (Permalink)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/groups/..."
                      {...field}
                      data-testid="input-facebook-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                name="minIncrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Increment ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        data-testid="input-min-increment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-create-auction"
            >
              {isSubmitting ? "Creating..." : "Publish Auction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
