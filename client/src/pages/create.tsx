import { CreateAuctionForm } from "@/components/create-auction-form";
import { useToast } from "@/hooks/use-toast";

export default function Create() {
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log("Auction created:", data);
    toast({
      title: "Auction Created!",
      description: "Your auction has been published successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Create New Auction</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new auction and link it to your Facebook group post
        </p>
      </div>

      <CreateAuctionForm onSubmit={handleSubmit} />
    </div>
  );
}
