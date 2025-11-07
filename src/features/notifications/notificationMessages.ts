/**
 * Notification Message Templates
 * Big Tech-style notifications with meaningful emojis and engaging copy
 */

export const NotificationMessages = {
  // Listing Management
  LISTING_SUBMITTED: {
    title: (brand: string, model: string) => `🎉 Listing Submitted Successfully!`,
    body: (brand: string, model: string) =>
      `Your ${brand} ${model} is being reviewed. We'll notify you within 24-48 hours! 🚀`,
  },

  LISTING_APPROVED: {
    title: (brand: string, model: string) => `✅ Great News! Your Listing is Live`,
    body: (brand: string, model: string) =>
      `${brand} ${model} is now visible to buyers. Good luck with your sale! 🎊`,
  },

  LISTING_REJECTED: {
    title: () => `⚠️ Action Required`,
    body: (reason: string) =>
      `Your listing needs attention. ${reason}. Tap to update and resubmit.`,
  },

  LISTING_INTEREST: {
    title: (count: number) => `👀 ${count} ${count === 1 ? 'Person' : 'People'} Viewed Your Car`,
    body: (brand: string, model: string) =>
      `Your ${brand} ${model} is getting attention! Keep your listing updated.`,
  },

  // Buyer Inquiries
  NEW_INQUIRY: {
    title: () => `💬 New Message from Buyer`,
    body: (brand: string, model: string) =>
      `Someone is interested in your ${brand} ${model}. Reply quickly to close the deal! ⚡`,
  },

  OFFER_RECEIVED: {
    title: (price: string) => `💰 New Offer: ${price}`,
    body: (brand: string, model: string) =>
      `You received an offer for your ${brand} ${model}. Tap to review and respond.`,
  },

  // Price Alerts
  PRICE_DROP_SUGGESTION: {
    title: () => `💡 Tip: Consider a Price Adjustment`,
    body: (days: number) =>
      `Your listing has been active for ${days} days. A small price drop could help! 📉`,
  },

  SIMILAR_LISTING_SOLD: {
    title: () => `🔥 Similar Car Just Sold!`,
    body: (brand: string, model: string, price: string) =>
      `A ${brand} ${model} sold for ${price}. Your listing is competitive! 💪`,
  },

  // Booking/Test Drive
  TEST_DRIVE_BOOKED: {
    title: () => `🚗 Test Drive Scheduled`,
    body: (date: string, time: string) =>
      `Test drive confirmed for ${date} at ${time}. Don't forget! 📅`,
  },

  TEST_DRIVE_REMINDER: {
    title: () => `⏰ Test Drive in 1 Hour`,
    body: (brand: string, model: string) =>
      `Your test drive for ${brand} ${model} starts soon. Get ready! 🎯`,
  },

  TEST_DRIVE_COMPLETED: {
    title: () => `✨ How Was the Test Drive?`,
    body: () =>
      `We'd love your feedback! Rate your experience and help others. ⭐`,
  },

  // Payment & Transaction
  PAYMENT_RECEIVED: {
    title: (amount: string) => `💸 Payment Received: ${amount}`,
    body: () =>
      `Congratulations! The payment has been confirmed. Check your account. 🎉`,
  },

  PAYMENT_PENDING: {
    title: () => `⏳ Payment Processing`,
    body: (estimatedTime: string) =>
      `Your payment is being processed. Expected completion: ${estimatedTime}.`,
  },

  PAYMENT_FAILED: {
    title: () => `❌ Payment Failed`,
    body: () =>
      `There was an issue with your payment. Please update your payment method.`,
  },

  // Account & Profile
  PROFILE_VERIFIED: {
    title: () => `✅ Profile Verified!`,
    body: () =>
      `You're all set! Your verified badge will help build trust with buyers. 🛡️`,
  },

  DOCUMENT_EXPIRING: {
    title: (documentName: string, days: number) =>
      `⚠️ ${documentName} Expiring in ${days} Days`,
    body: () =>
      `Keep your documents up to date to continue selling. Tap to update now.`,
  },

  // Promotions & Marketing
  LISTING_FEATURED: {
    title: () => `🌟 Your Listing is Now Featured!`,
    body: () =>
      `Your car will be seen by 3x more buyers. Watch the inquiries roll in! 📈`,
  },

  SPECIAL_OFFER: {
    title: () => `🎁 Special Offer Just for You!`,
    body: (discount: string) =>
      `Get ${discount} off featured listings this week. Limited time only! ⏰`,
  },

  // Reminders
  UPDATE_LISTING_REMINDER: {
    title: () => `💡 Keep Your Listing Fresh`,
    body: (days: number) =>
      `It's been ${days} days since your last update. Add new photos or details!`,
  },

  DOCUMENT_REQUIRED: {
    title: () => `📄 Documents Needed`,
    body: () =>
      `Upload required documents to complete your listing. It only takes 2 minutes!`,
  },

  // Success & Milestones
  FIRST_LISTING: {
    title: () => `🎉 Congratulations on Your First Listing!`,
    body: () =>
      `You're on your way! We'll notify you when buyers show interest. 🚀`,
  },

  SOLD_MILESTONE: {
    title: (count: number) => `🏆 ${count} Cars Sold!`,
    body: () =>
      `Amazing achievement! You're a trusted seller on our platform. Keep it up! 💪`,
  },

  // System & Updates
  APP_UPDATE: {
    title: () => `✨ New Features Available`,
    body: () =>
      `We've made VahanHelp even better! Update now to enjoy the latest improvements.`,
  },

  MAINTENANCE: {
    title: () => `🔧 Scheduled Maintenance`,
    body: (time: string) =>
      `We'll be upgrading our systems ${time}. Brief downtime expected.`,
  },

  // Social Proof
  TRENDING_LISTING: {
    title: () => `🔥 Your Listing is Trending!`,
    body: (views: number) =>
      `${views}+ views in the last 24 hours. Your car is in demand! 📊`,
  },

  NEW_FOLLOWER: {
    title: (name: string) => `👤 ${name} Started Following You`,
    body: () =>
      `You have a new follower! They'll be notified about your future listings.`,
  },

  // Wishlist
  ADDED_TO_WISHLIST: {
    title: (brand: string, model: string) => `💝 ${brand} ${model} Added to Your Wishlist!`,
    body: () =>
      `Our team will reach out to you shortly with more details. We'll find you the perfect car! 🚗✨`,
  },

  WISHLIST_CAR_AVAILABLE: {
    title: (brand: string, model: string) => `🎯 Great News! ${brand} ${model} is Available`,
    body: (price: string) =>
      `A car matching your wishlist is now available at ${price}. Check it out before it's gone! ⚡`,
  },

  WISHLIST_PRICE_DROP: {
    title: (brand: string, model: string) => `💰 Price Drop Alert!`,
    body: (brand: string, model: string, oldPrice: string, newPrice: string) =>
      `${brand} ${model} from your wishlist dropped from ${oldPrice} to ${newPrice}. Great deal! 🎉`,
  },

  WISHLIST_REMINDER: {
    title: () => `💭 Still Looking for Your Dream Car?`,
    body: (count: number) =>
      `You have ${count} ${count === 1 ? 'car' : 'cars'} in your wishlist. Our team is ready to help you find the perfect match! 🤝`,
  },
};

// Helper function to format notification with context
export const formatNotification = (
  template: { title: (...args: any[]) => string; body: (...args: any[]) => string },
  ...args: any[]
) => {
  return {
    title: template.title(...args),
    body: template.body(...args),
  };
};
