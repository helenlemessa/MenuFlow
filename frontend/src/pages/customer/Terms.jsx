const Terms = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <h1 className="font-display text-4xl font-bold mb-6">Terms of Service</h1>
    <div className="prose dark:prose-invert space-y-4 text-gray-600 dark:text-gray-400">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>By using the MenuFlow ordering system, you agree to these terms.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ordering</h2>
      <p>Orders placed through the QR menu system are binding once submitted to the kitchen. Please review your order carefully before confirming.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pricing</h2>
      <p>All prices are displayed in the restaurant's local currency and include applicable taxes and service charges as shown in your bill summary.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Payment</h2>
      <p>Payment is made directly to restaurant staff. We accept cash, card, Telebirr, and bank transfer.</p>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Availability</h2>
      <p>Menu items are subject to availability. The restaurant reserves the right to modify menu items and prices.</p>
    </div>
  </div>
);

export default Terms;
