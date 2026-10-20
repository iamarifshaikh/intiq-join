/* English. The survey's words are the client's (intiq_retailer_survey_v2), emojis replaced by icons in
   the design; the rest (buttons, errors) are ours. Every language file has exactly these keys. */
export const en = {
  langName: 'English',
  chooseLanguage: 'Choose your language / भाषा चुनें',
  trust: 'We never ask for money, OTP or bank details',
  footer: 'A retailer research initiative by Team INTIMASIA',
  listen: 'Listen',
  next: 'Continue',
  back: 'Back',
  stepOf: 'Step {n} of {total}',

  /* welcome */
  welcomeTag: 'Retailer survey · INTIQ Rewards',
  titleLine1: 'Your Purchases.',
  titleLine2: 'Your Rewards.',
  news: 'Great news for hosiery and knitwear retailers!',
  forRetailers: 'Innerwear, Sleepwear, Loungewear, Shapewear and Activewear retailers, get ready!',
  programme: 'TEAM INTIMASIA is bringing you a unique REWARDS PROGRAM!',
  earn: 'Now earn exciting rewards on your regular business purchases!',
  launch: 'Launching first in Maharashtra and Gujarat, followed by expansion across India!',
  pride: 'Your business, your hard work—and now your REWARDS!',
  invite: 'If you would like to be part of this exciting Rewards Program, click CONTINUE and answer a few simple questions.',
  tagline: 'Because every purchase deserves a REWARD!',
  team: 'TEAM INTIMASIA',
  continueHint: 'Click CONTINUE and step into the world of Rewards!',
  promise: 'No sales targets. No compulsory brand purchases. No extra commitment.',
  benefits: [
    'Earn rewards on eligible regular business purchases',
    'Freedom to purchase from participating brands',
    'First phase planned for Maharashtra and Gujarat, with expansion across India',
  ],
  privacy: 'Your answers will be used for research and programme planning. Survey participation does not automatically guarantee membership or rewards.',
  joined: '{n} retailers have already joined',

  /* confirm */
  confirmTitle: 'Before we begin',
  confirmSub: 'This short survey will help us understand your store and purchasing preferences.',
  confirmText: 'I confirm that I am a retailer / business owner and would like to continue with this survey.',

  /* details */
  detailsTitle: 'Tell us about yourself',
  detailsSub: 'Share your contact details so our team can understand retailer feedback and, if you wish, share programme updates.',
  ownerName: 'Your name',
  shopName: 'Shop / business name',
  mobile: 'Mobile number',
  mobileHint: 'Enter your 10-digit mobile number',
  city: 'City / town',
  state: 'State',
  chooseState: 'Please select',
  searchState: 'Search your state',
  storeType: 'Type of store',
  storeTypes: ['Innerwear specialist', 'Multi-brand garment store', 'Department store', 'Sportswear / activewear store', 'Wholesale / retail', 'Other'],
  checkDetails: 'Please complete the required fields before continuing.',

  /* purchase */
  purchaseTitle: 'Approximately how much merchandise do you purchase every month?',
  purchase: ['Below ₹50,000', '₹50,000–₹2 lakh', '₹2–5 lakh', 'Above ₹5 lakh', 'Prefer not to say'],

  /* how they buy */
  methodsTitle: 'How do you usually purchase merchandise?',
  pickAll: 'Select all options that apply.',
  methods: ['Directly from brands', 'From distributors', 'From wholesalers', 'From company sales representatives', 'Online B2B platforms'],

  /* brands */
  brandsTitle: 'Which brands do you currently stock?',
  brandsHint: 'Select all brands you currently stock.',
  searchBrands: 'Search brands',
  noBrandMatch: 'No brand with that name. Pick “Other / Local Brands” and type it below.',
  otherLocal: 'Other / Local Brands',
  otherBrands: 'Other brand names (optional)',
  suggestQ: 'Are there any other brands you would like to see on INTIQ?',
  suggestPlaceholder: 'Enter brand suggestions (optional)',

  /* interest */
  rewardTitle: 'Would you like to earn additional rewards on your regular stock purchases?',
  reward: ['Yes, definitely', 'Maybe, I would like to know more', 'Not interested'],
  joinTitle: 'Would you like to receive an invitation to join INTIQ Rewards?',
  join: ['Yes, I am interested', 'Please contact me with details', 'Not at present'],

  /* review */
  reviewTitle: 'Check and submit',
  reviewSub: 'Your answers at a glance. Tap Edit to change anything.',
  edit: 'Edit',
  consent: 'I agree to receive information about INTIQ Rewards and programme updates.',
  submit: 'Submit survey',
  sending: 'Sending…',
  sendFailed: 'Could not send. Please check your internet and try again.',
  tooMany: 'Too many tries from this phone. Please try again in an hour.',

  /* thank you */
  thanksTitle: 'Thank You for Your Interest!',
  thanksTagline: 'आपकी खरीदारी, अब और भी फ़ायदेमंद!',
  thanksText: 'Your feedback will help us build a more rewarding programme for the Innerwear, Comfortwear and Sportswear retail community.',
  thanksLine: 'INTIQ Rewards — Every Purchase Deserves a Reward.',
  thanksSub: 'Stay connected for upcoming programme announcements.',
  foundingStore: 'Founding Store {n}',
  foundingNote: 'Your place among the first retailers is saved.',
  share: 'Send to another retailer',
  linkCopied: 'Link copied',
}

export type Messages = typeof en
