export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using BidTracker, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of the Service</h2>
              <p className="text-gray-700 mb-4">
                BidTracker is an auction management platform for Facebook groups. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the service in compliance with all applicable laws</li>
                <li>Provide accurate information in your auctions and bids</li>
                <li>Respect other users and maintain a positive community</li>
                <li>Not use the service for fraudulent or illegal activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Auctions and Bidding</h2>
              <p className="text-gray-700 mb-4">
                When participating in auctions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All bids are binding commitments to purchase</li>
                <li>Auction creators are responsible for accurate item descriptions</li>
                <li>Payment and delivery arrangements are between buyers and sellers</li>
                <li>BidTracker facilitates the auction process but is not party to transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Termination</h2>
              <p className="text-gray-700">
                We reserve the right to terminate accounts that violate these terms or engage in harmful behavior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700">
                BidTracker is provided "as is" without warranties. We are not liable for any damages arising from use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us through the app.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
