export type AdCategory =
  | 'Sale'
  | 'New Year'
  | 'Beauty & Personal Care'
  | 'Apparel'
  | 'Accessories'
  | 'Apps'
  | 'Sports & Outdoor'
  | 'Pets'
  | 'Food & Beverage'
  | 'Baby, Kids & Maternity'
  | 'Tech & Electronics'
  | 'SaaS'
  | 'Health'

export interface Ad {
  id: string
  title: string
  thumbnail: string
  category: AdCategory
  likes: number
  isNew?: boolean
}
