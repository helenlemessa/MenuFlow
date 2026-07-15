const Privacy = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <h1 className="font-display text-4xl font-bold mb-6">Privacy Policy</h1>
    <div className="prose dark:prose-invert space-y-4 text-gray-600 dark:text-gray-400">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>MenuFlow respects your privacy. This policy describes how we handle information when you use our restaurant ordering system.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Information We Collect</h2>
      <p>We collect minimal information necessary to process your table orders, including table number and order details. We do not require customer accounts or personal registration.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">How We Use Information</h2>
      <p>Order information is used solely to prepare and serve your food, calculate bills, and improve our service.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Data Security</h2>
      <p>We implement appropriate security measures to protect order data transmitted through our system.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
      <p>For privacy-related questions, please contact the restaurant directly.</p>
    </div>
  </div>
);

export default Privacy;
