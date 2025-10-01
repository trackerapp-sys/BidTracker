import { CreateAuctionForm } from "../create-auction-form";

export default function CreateAuctionFormExample() {
  const handleSubmit = (data: any) => {
    console.log("Auction created:", data);
  };

  return (
    <div className="p-6">
      <CreateAuctionForm onSubmit={handleSubmit} />
    </div>
  );
}
