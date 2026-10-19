const indian = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** 30000 → "₹30,000" (Indian grouping: ₹1,25,000) */
export const formatINR = (value: number) => '₹' + indian.format(Math.round(value))
