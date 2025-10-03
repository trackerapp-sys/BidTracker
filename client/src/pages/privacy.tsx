export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                When you use BidTracker, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Facebook profile information (name, email, profile picture) when you login with Facebook</li>
                <li>Auction and bidding activity within the app</li>
                <li>Usage data to improve our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and maintain the BidTracker service</li>
                <li>Authenticate your account and enable login</li>
                <li>Display your profile information in auctions and bids</li>
                <li>Improve our service and user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information. 
                Your data is stored securely and we do not share it with third parties except as necessary to provide our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Facebook Login</h2>
              <p className="text-gray-700">
                When you login with Facebook, we only access basic profile information that you have made public. 
                We do not post to your Facebook account or access private information without your explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us through the app or at our support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
