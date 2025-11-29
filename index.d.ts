/**
 * NODE CMS Frontend - Global Type Definitions
 *
 * This file contains all the type definitions for the NODE CMS application.
 * It serves as the central type registry for the entire frontend application.
 */

declare module '*.css' {
  const content: string
  export default content
}

// ================================
// GLOBAL DECLARATIONS
// ================================

declare global {
  // ================================
  // GLOBAL ENUMS
  // ================================

  enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    GUEST = 'GUEST',
    MODERATOR = 'MODERATOR'
  }

  enum UserRank {
    NEW = 'NEW',
    NORMAL = 'NORMAL',
    FREQUENT = 'FREQUENT',
    ELITE = 'ELITE',
    VIP = 'VIP',
    MASTER = 'MASTER'
  }

  enum PlatformType {
    TELEGRAM = 'TELEGRAM',
    OTHER = 'OTHER'
  }

  enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PARTIAL = 'PARTIAL',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
  }

  enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    PARTIAL = 'PARTIAL',
    REFUNDED = 'REFUNDED'
  }

  enum PaymentMethod {
    BINANCE = 'BINANCE',
    NOWPAYMENT = 'NOWPAYMENT',
    STRIPE = 'STRIPE',
    PLISIO = 'PLISIO',
    CHANGENOW = 'CHANGENOW',
    CRYPTOMUS = 'CRYPTOMUS',
    OTHER = 'OTHER'
  }

  enum DeliveryStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
    PARTIAL = 'PARTIAL'
  }

  enum TelegramTransferStatus {
    PENDING = 'PENDING',
    VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
    CUSTOMER_JOINED = 'CUSTOMER_JOINED',
    TRANSFER_IN_PROGRESS = 'TRANSFER_IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
  }

  enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
  }

  enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
  }

  enum NotificationType {
    ORDER = 'ORDER',
    PAYMENT = 'PAYMENT',
    RESTOCK = 'RESTOCK',
    SYSTEM = 'SYSTEM',
    PROMOTION = 'PROMOTION'
  }

  enum CouponType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT'
  }

  enum CouponStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    DEPLETED = 'DEPLETED'
  }

  enum CouponScope {
    ALL_PRODUCTS = 'ALL_PRODUCTS',
    SPECIFIC_PRODUCTS = 'SPECIFIC_PRODUCTS',
    SPECIFIC_CATEGORIES = 'SPECIFIC_CATEGORIES'
  }

  // ================================
  // GLOBAL BASE TYPES
  // ================================

  interface BaseEntity {
    id: number
    createdAt: Date
    updatedAt: Date
    meta?: Record<string, any> | null
  }

  interface SettingsData<T = any> {
    success: boolean

    data: { key: string; value: T }
  }

  type DynamicPageKey =
    | 'returnsExchanges'
    | 'deliveryTerms'
    | 'paymentPricing'
    | 'paymentTerms'
    | 'privacyPolicy'
    | 'termsUse'

  // ================================
  // GLOBAL AUTH & USER TYPES
  // ================================
  // Final union type for Filter

  type Params<Key extends string> = Promise<{ [K in Key]: string }>
  type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

  type PageProps = {
    params: Params
    searchParams: SearchParams
  }

  // Common props for all filters
  type BaseField = {
    name: string
    label: string
    placeholder?: string
    isMultiStore?: boolean
  }

  // Input field
  type InputField = BaseField & {
    type: 'input'
  }

  // Select field with API
  type SelectApiField = BaseField & {
    type: 'select-api'
    url: string
    multiple?: boolean
    options?: (data: any) => { label: string; value: string }[]
  }

  // Date field
  type DateField = BaseField & {
    type: 'date'
  }

  // Final union type for Filter
  type FilterField = InputField | SelectApiField | DateField | CheckboxField

  interface TAdmin {
    id: string
    name: string
    email: string
    avatar?: string | null
    isActive: boolean
    isAdmin: boolean
    createdAt: string
    updatedAt: string
    permissions: string[]
    isSuperAdmin: boolean
    // Legacy fields (optional for backward compatibility)
    username?: string
    firstName?: string
    lastName?: string
    phone?: string
    telegramUsername?: string
    role?: 'ADMIN'
    isBanned?: boolean
    banReason?: string
    isVerified?: boolean
    customRole?: Role | null
  }

  interface User extends BaseEntity {
    email: string
    username?: string | null
    passwordHash?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    telegramUsername?: string | null
    role: UserRole
    rank: UserRank
    totalSpent: number
    totalOrders: number
    discountPercent: number
    isActive: boolean
    isVerified: boolean
    isBanned: boolean
    banReason?: string | null
    isGuest: boolean
    guestToken?: string | null
    tags: string[]
    note?: string | null
    roleId?: number | null
    lastLoginAt?: Date | null
    emailVerifiedAt?: Date | null
    // Relations
    customRole?: Role | null
    orders?: Order[]
    tickets?: Ticket[]
    notifications?: Notification[]
    loginSessions?: LoginSession[]
    couponUsage?: CouponUsage[]
  }

  interface Role extends BaseEntity {
    name: string
    description?: string | null
    isActive: boolean
    // Relations
    permissions?: RolePermission[]
    moderators?: User[]
  }

  interface RolePermission {
    id: number
    roleId: number
    resource: string
    actions: string[]
  }

  interface LoginSession extends BaseEntity {
    id: string
    userId: number
    token: string
    userAgent?: string | null
    ipAddress?: string | null
    isActive: boolean
    expiresAt: Date
    // Relations
    user?: User
  }

  // ================================
  // GLOBAL PRODUCT & CATALOG TYPES
  // ================================

  interface Category extends BaseEntity {
    name: string
    slug: string
    description?: string | null
    icon?: string | null
    isActive: boolean
    sortOrder: number
    parentId?: number | null
    // Relations
    parent?: Category | null
    children?: Category[]
    products?: Product[]
  }

  interface Product extends BaseEntity {
    sku: string
    name: string
    description?: string | null
    type: ProductType
    platform?: PlatformType | null
    telegramUrl?: string | null
    price: number
    originalPrice?: number | null
    costPrice?: number | null
    stockCount: number
    soldCount: number
    minQuantity: number
    maxQuantity: number
    isActive: boolean
    isPrivate: boolean
    privateUrl?: string | null
    isFeatured: boolean
    images: string[]
    thumbnail?: string | null
    categoryId: number
    seo?: Record<string, any> | null
    tags?: string[]
    // Relations
    category?: Category
    accounts?: Account[]
    orderItems?: OrderItem[]
    notifications?: Notification[]
  }

  interface Account extends BaseEntity {
    productId: number
    platform: PlatformType
    encryptedData: string
    isUsed: boolean
    isValid: boolean
    requiresOtp: boolean
    hasPremium: boolean
    usedAt?: Date | null
    usedByOrderId?: number | null
    // Relations
    product?: Product
    usedByOrder?: Order | null
  }

  // ================================
  // GLOBAL ORDER & PAYMENT TYPES
  // ================================

  interface Order extends BaseEntity {
    id: number
    orderNumber: string
    status: OrderStatus
    subtotal: Decimal
    discount: Decimal
    total: Decimal
    deliveryStatus: DeliveryStatus
    deliveredAt: Date | null
    createdAt: Date
    items: OrderItem[]
    user: User
  }

  interface OrderItem extends BaseEntity {
    orderId: number
    productId: number
    quantity: number
    unitPrice: number
    totalPrice: number
    // Relations
    order?: Order
    product?: Product
    telegramTransfer?: TelegramTransfer | null
  }

  interface Payment extends BaseEntity {
    orderId: number
    method: PaymentMethod
    status: PaymentStatus
    amount: number
    paidAmount: number
    refundedAmount: number
    gateway: string
    gatewayTxnId?: string | null
    gatewayStatus?: string | null
    binanceOrderId?: string | null
    binanceStatus?: string | null
    processedAt?: Date | null
    failedAt?: Date | null
    failureReason?: string | null
    // Relations
    order?: Order
  }

  interface Delivery extends BaseEntity {
    orderId: number
    status: DeliveryStatus
    accounts: Record<string, any>
    fileUrl?: string | null
    format?: string | null
    deliveredAt?: Date | null
    downloadedAt?: Date | null
    downloadCount: number
    // Relations
    order?: Order
  }

  interface TelegramTransfer extends BaseEntity {
    orderItemId: number
    status: TelegramTransferStatus
    targetUrl: string
    customerTelegram: string
    joinVerified: boolean
    joinVerifiedAt?: Date | null
    transferStartedAt?: Date | null
    transferCompletedAt?: Date | null
    screenshotUrl?: string | null
    proofData?: Record<string, any> | null
    failureReason?: string | null
    retryCount: number
    // Relations
    orderItem?: OrderItem
  }

  // ================================
  // GLOBAL COUPON & PROMOTION TYPES
  // ================================

  interface Coupon extends BaseEntity {
    code: string
    name?: string | null
    description?: string | null
    type: CouponType
    status: CouponStatus
    scope: CouponScope
    discountValue: number
    maxDiscountAmount?: number | null
    minOrderAmount?: number | null
    usageLimit?: number | null
    usageCount: number
    userUsageLimit?: number | null
    startsAt?: Date | null
    expiresAt?: Date | null
    applicableProductIds: number[]
    applicableCategoryIds: number[]
    // Relations
    usage?: CouponUsage[]
  }

  interface CouponUsage {
    id: number
    couponId: number
    orderId: number
    userId?: number | null
    guestEmail?: string | null
    discountAmount: number
    orderAmount: number
    createdAt: Date
    // Relations
    coupon?: Coupon
    order?: Order
    user?: User | null
  }

  // ================================
  // GLOBAL CONTENT TYPES
  // ================================

  interface ArticleCategory extends BaseEntity {
    name: string
    slug: string
    // Relations
    blogs?: Article[]
  }

  interface Article extends BaseEntity {
    title: string
    slug: string
    excerpt?: string | null
    content: string
    thumbnail?: string | null
    gallery: string[]
    tags: string[]
    views: number
    isPublished: boolean
    publishedAt?: Date | null
    categoryId: number
    seo?: Record<string, any> | null
    // Relations
    categories?: ArticleCategory[]
    author?: User
    readTime?: number
  }

  interface PackageCategory extends BaseEntity {
    name: string
    slug: string
    // Relations
    packages?: Package[]
  }

  interface Package extends BaseEntity {
    title: string
    slug: string
    excerpt?: string | null
    content: string
    thumbnail?: string | null
    gallery: string[]
    tags: string[]
    views: number
    isPublished: boolean
    publishedAt?: Date | null
    categoryId: number
    seo?: Record<string, any> | null
    // Package-specific fields
    destination?: string | null
    price?: {
      amount: number
      currency?: string
      discountedPrice?: number
    } | null
    duration?: {
      days: number
      nights: number
    } | null
    maxGroupSize?: number | null
    rating?: number | null
    reviewCount?: number | null
    highlights?: string[]
    inclusions?: string[]
    exclusions?: string[]
    itinerary?: Array<{
      day: number
      title: string
      description: string
    }>
    availability?: string | null
    // Relations
    category?: PackageCategory
  }

  // ================================
  // GLOBAL SUPPORT TYPES
  // ================================

  interface Ticket extends BaseEntity {
    ticketNumber: string
    userId?: number | null
    guestEmail?: string | null
    subject: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    assignedTo?: string | null
    resolvedAt?: Date | null
    // Relations
    user?: User | null
    replies?: TicketReply[]
  }

  interface TicketReply extends BaseEntity {
    ticketId: number
    content: string
    isStaff: boolean
    authorId?: number | null
    authorName?: string | null
    attachments: string[]
    // Relations
    ticket?: Ticket
  }

  interface Notification extends BaseEntity {
    userId?: number | null
    type: NotificationType
    title: string
    message: string
    data?: Record<string, any> | null
    isRead: boolean
    readAt?: Date | null
    productId?: number | null
    orderId?: number | null
    // Relations
    user?: User | null
    product?: Product | null
  }

  // ================================
  // GLOBAL SYSTEM TYPES
  // ================================

  interface Settings {
    id: number
    key: string
    value?: Record<string, any> | null
  }

  interface AuditLog {
    id: number
    userId?: number | null
    action: string
    entity: string
    entityId?: string | null
    oldValues?: Record<string, any> | null
    newValues?: Record<string, any> | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt: Date
  }

  // ================================
  // GLOBAL UTILITY TYPES
  // ================================

  type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

  // ================================
  // GLOBAL QUERY & FILTER TYPES
  // ================================

  interface BaseQuery {
    page?: number
    limit?: number
    q?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }

  interface UserFilters extends BaseQuery {
    role?: UserRole
    rank?: UserRank
    isActive?: boolean
    isBanned?: boolean
    isGuest?: boolean
  }

  interface ProductFilters extends BaseQuery {
    categoryId?: number
    platform?: PlatformType
    type?: ProductType
    isActive?: boolean
    isFeatured?: boolean
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  }

  interface OrderFilters extends BaseQuery {
    userId?: number
    status?: OrderStatus
    deliveryStatus?: DeliveryStatus
    dateFrom?: Date
    dateTo?: Date
  }

  interface ArticleFilters extends BaseQuery {
    categoryId?: number
    isPublished?: boolean
    tags?: string[]
  }

  // ================================
  // GLOBAL API RESPONSE TYPES
  // ================================

  interface PaginationMeta {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }

  interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message: string
    errors?: string[]
  }

  interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    pagination: PaginationMeta
  }

  // ================================
  // GLOBAL BUSINESS LOGIC TYPES
  // ================================

  interface CartItem {
    productId: number
    quantity: number
    price: number
  }

  interface CheckoutData {
    items: CartItem[]
    guestEmail?: string
    couponCode?: string
    customerInfo?: {
      name?: string
      phone?: string
      telegramUsername?: string
    }
  }

  interface DeliveryData {
    accounts: Array<{
      platform: PlatformType
      username: string
      password: string
      email?: string
      phone?: string
      additionalData?: Record<string, any>
    }>
    format: 'txt' | 'xlsx' | 'json'
  }

  interface TelegramTransferData {
    customerTelegram: string
    targetUrl: string
    transferType: 'ownership' | 'admin' | 'member'
    verificationRequired: boolean
  }

  // ================================
  // GLOBAL STATISTICS TYPES
  // ================================

  interface SalesStats {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    averageOrderValue: number
    conversionRate: number
  }

  interface ProductStats {
    totalProducts: number
    activeProducts: number
    outOfStock: number
    lowStock: number
    topSellingProducts: Array<{
      product: Product
      salesCount: number
      revenue: number
    }>
  }

  interface UserStats {
    totalUsers: number
    newUsers: number
    activeUsers: number
    usersByRank: Record<UserRank, number>
    usersByRole: Record<UserRole, number>
  }

  // ================================
  // TELEGRAM ACCOUNT TYPES
  // ================================

  interface TelegramAccountResponse {
    id: number
    phone: string | undefined
    sessionPath: string | undefined
    proxy:
      | {
          host?: string
          port?: number
          username?: string
          password?: string
        }
      | undefined
    status: 'used' | 'available' | 'invalid'
    createdAt: Date
  }

  interface TelegramAccountListResponse {
    accounts: TelegramAccountResponse[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

// ================================
// ENUMS
// ================================

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  GUEST = 'GUEST',
  MODERATOR = 'MODERATOR'
}

export enum UserRank {
  NEW = 'NEW',
  NORMAL = 'NORMAL',
  FREQUENT = 'FREQUENT',
  ELITE = 'ELITE',
  VIP = 'VIP',
  MASTER = 'MASTER'
}

export enum ProductType {
  FILE = 'FILE',
  SERVICE = 'SERVICE',
  SERIAL = 'SERIAL',
  PREMIUM = 'PREMIUM'
}

export enum PlatformType {
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  TELEGRAM = 'TELEGRAM',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE',
  OTHER = 'OTHER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  BINANCE = 'BINANCE',
  NOWPAYMENT = 'NOWPAYMENT',
  STRIPE = 'STRIPE',
  PLISIO = 'PLISIO',
  CHANGENOW = 'CHANGENOW',
  CRYPTOMUS = 'CRYPTOMUS',
  OTHER = 'OTHER'
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL'
}

export enum TelegramTransferStatus {
  PENDING = 'PENDING',
  VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
  CUSTOMER_JOINED = 'CUSTOMER_JOINED',
  TRANSFER_IN_PROGRESS = 'TRANSFER_IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationType {
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  RESTOCK = 'RESTOCK',
  SYSTEM = 'SYSTEM',
  PROMOTION = 'PROMOTION'
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  DEPLETED = 'DEPLETED'
}

export enum CouponScope {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  SPECIFIC_PRODUCTS = 'SPECIFIC_PRODUCTS',
  SPECIFIC_CATEGORIES = 'SPECIFIC_CATEGORIES'
}

// ================================
// BASE ENTITY TYPES
// ================================

export interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
  meta?: Record<string, any> | null
}

// ================================
// AUTH & USER TYPES
// ================================

export interface TAdmin {
  id: number
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  roleId?: string
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  email: string
  username?: string | null
  passwordHash?: string | null
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  telegramUsername?: string | null
  role: UserRole
  rank: UserRank
  totalSpent: number
  totalOrders: number
  discountPercent: number
  isActive: boolean
  isVerified: boolean
  isBanned: boolean
  banReason?: string | null
  isGuest: boolean
  guestToken?: string | null
  tags: string[]
  note?: string | null
  roleId?: number | null
  lastLoginAt?: Date | null
  emailVerifiedAt?: Date | null
  // Relations
  customRole?: Role | null
  orders?: Order[]
  tickets?: Ticket[]
  notifications?: Notification[]
  loginSessions?: LoginSession[]
  couponUsage?: CouponUsage[]
}

export interface Role extends BaseEntity {
  name: string
  description?: string | null
  isActive: boolean
  // Relations
  permissions?: RolePermission[]
  moderators?: User[]
}

export interface RolePermission {
  id: number
  roleId: number
  resource: string
  actions: string[]
}

export interface LoginSession extends BaseEntity {
  id: string
  userId: number
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  isActive: boolean
  expiresAt: Date
  // Relations
  user?: User
}

// ================================
// PRODUCT & CATALOG TYPES
// ================================

export interface Category extends BaseEntity {
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  isActive: boolean
  sortOrder: number
  parentId?: number | null
  // Relations
  parent?: Category | null
  children?: Category[]
  products?: Product[]
}

export interface Product extends BaseEntity {
  sku: string
  name: string
  description?: string | null
  type: ProductType
  platform?: PlatformType | null
  telegramUrl?: string | null
  price: number
  originalPrice?: number | null
  costPrice?: number | null
  stockCount: number
  soldCount: number
  minQuantity: number
  maxQuantity: number
  isActive: boolean
  isPrivate: boolean
  privateUrl?: string | null
  isFeatured: boolean
  images: string[]
  thumbnail?: string | null
  categoryId: number
  seo?: Record<string, any> | null
  // Relations
  category?: Category
  accounts?: Account[]
  orderItems?: OrderItem[]
  notifications?: Notification[]
}

export interface Account extends BaseEntity {
  productId: number
  platform: PlatformType
  encryptedData: string
  isUsed: boolean
  isValid: boolean
  requiresOtp: boolean
  hasPremium: boolean
  usedAt?: Date | null
  usedByOrderId?: number | null
  // Relations
  product?: Product
  usedByOrder?: Order | null
}

// ================================
// ORDER & PAYMENT TYPES
// ================================

export interface OrderItem extends BaseEntity {
  orderId: number
  productId: number
  quantity: number
  unitPrice: number
  totalPrice: number
  // Relations
  order?: Order
  product?: Product
  telegramTransfer?: TelegramTransfer | null
}

export interface Payment extends BaseEntity {
  orderId: number
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  paidAmount: number
  refundedAmount: number
  gateway: string
  gatewayTxnId?: string | null
  gatewayStatus?: string | null
  binanceOrderId?: string | null
  binanceStatus?: string | null
  processedAt?: Date | null
  failedAt?: Date | null
  failureReason?: string | null
  // Relations
  order?: Order
}

export interface Delivery extends BaseEntity {
  orderId: number
  status: DeliveryStatus
  accounts: Record<string, any>
  fileUrl?: string | null
  format?: string | null
  deliveredAt?: Date | null
  downloadedAt?: Date | null
  downloadCount: number
  // Relations
  order?: Order
}

export interface TelegramTransfer extends BaseEntity {
  orderItemId: number
  status: TelegramTransferStatus
  targetUrl: string
  customerTelegram: string
  joinVerified: boolean
  joinVerifiedAt?: Date | null
  transferStartedAt?: Date | null
  transferCompletedAt?: Date | null
  screenshotUrl?: string | null
  proofData?: Record<string, any> | null
  failureReason?: string | null
  retryCount: number
  // Relations
  orderItem?: OrderItem
}

// ================================
// COUPON & PROMOTION TYPES
// ================================

export interface Coupon extends BaseEntity {
  code: string
  name?: string | null
  type: CouponType
  status: CouponStatus
  scope: CouponScope
  discountValue: number
  maxDiscountAmount?: number | null
  minOrderAmount?: number | null
  usageLimit?: number | null
  usageCount: number
  userUsageLimit?: number | null
  startsAt?: Date | null
  expiresAt?: Date | null
  applicableProductIds: number[]
  applicableCategoryIds: number[]
  // Relations
  usage?: CouponUsage[]
}

export interface CouponUsage {
  id: number
  couponId: number
  orderId: number
  userId?: number | null
  guestEmail?: string | null
  discountAmount: number
  orderAmount: number
  createdAt: Date
  // Relations
  coupon?: Coupon
  order?: Order
  user?: User | null
}

// ================================
// CONTENT TYPES
// ================================

export interface ArticleCategory extends BaseEntity {
  name: string
  slug: string
  // Relations
  blogs?: Article[]
}

export interface Article extends BaseEntity {
  title: string
  slug: string
  excerpt?: string | null
  content: string
  source?: string | null
  thumbnail?: string | null
  gallery: string[]
  tags: string[]
  views: number
  isPublished: boolean
  publishedAt?: Date | null
  categoryId: number
  seo?: Record<string, any> | null
  // Relations
  category?: ArticleCategory
  author?: User
  readTime?: number
}

export interface PackageCategory extends BaseEntity {
  name: string
  slug: string
  // Relations
  packages?: Package[]
}

export interface Package extends BaseEntity {
  title: string
  slug: string
  excerpt?: string | null
  content: string
  thumbnail?: string | null
  gallery: string[]
  tags: string[]
  views: number
  isPublished: boolean
  publishedAt?: Date | null
  categoryId: number
  seo?: Record<string, any> | null
  // Package-specific fields
  destination?: string | null
  price?: {
    amount: number
    currency?: string
    discountedPrice?: number
  } | null
  duration?: {
    days: number
    nights: number
  } | null
  maxGroupSize?: number | null
  rating?: number | null
  reviewCount?: number | null
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  itinerary?: Array<{
    day: number
    title: string
    description: string
  }>
  availability?: string | null
  // Relations
  category?: PackageCategory
}

// ================================
// SUPPORT TYPES
// ================================

export interface Ticket extends BaseEntity {
  ticketNumber: string
  userId?: number | null
  guestEmail?: string | null
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string | null
  resolvedAt?: Date | null
  // Relations
  user?: User | null
  replies?: TicketReply[]
}

export interface TicketReply extends BaseEntity {
  ticketId: number
  content: string
  isStaff: boolean
  authorId?: number | null
  authorName?: string | null
  attachments: string[]
  // Relations
  ticket?: Ticket
}

export interface Notification extends BaseEntity {
  userId?: number | null
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any> | null
  isRead: boolean
  readAt?: Date | null
  productId?: number | null
  orderId?: number | null
  // Relations
  user?: User | null
  product?: Product | null
}

// ================================
// SYSTEM TYPES
// ================================

export interface Settings {
  id: number
  key: string
  value?: Record<string, any> | null
}

export interface AuditLog {
  id: number
  userId?: number | null
  action: string
  entity: string
  entityId?: string | null
  oldValues?: Record<string, any> | null
  newValues?: Record<string, any> | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
}

// ================================
// UTILITY TYPES
// ================================

export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

// ================================
// QUERY & FILTER TYPES
// ================================

// export interface BaseQuery {
//   page?: number
//   limit?: number
//   q?: string
//   sortBy?: string
//   sortOrder?: 'asc' | 'desc'
// }

export interface UserFilters extends BaseQuery {
  role?: UserRole
  rank?: UserRank
  isActive?: boolean
  isBanned?: boolean
  isGuest?: boolean
}

export interface ProductFilters extends BaseQuery {
  categoryId?: number
  platform?: PlatformType
  type?: ProductType
  isActive?: boolean
  isFeatured?: boolean
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export interface OrderFilters extends BaseQuery {
  userId?: number
  status?: OrderStatus
  deliveryStatus?: DeliveryStatus
  dateFrom?: Date
  dateTo?: Date
}

export interface ArticleFilters extends BaseQuery {
  categoryId?: number
  isPublished?: boolean
  tags?: string[]
}

// ================================
// API RESPONSE TYPES
// ================================

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message: string
  errors?: string[]
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationMeta
}

// ================================
// BUSINESS LOGIC TYPES
// ================================

export interface CartItem {
  productId: number
  quantity: number
  price: number
}

export interface CheckoutData {
  items: CartItem[]
  guestEmail?: string
  couponCode?: string
  customerInfo?: {
    name?: string
    phone?: string
    telegramUsername?: string
  }
}

export interface DeliveryData {
  accounts: Array<{
    platform: PlatformType
    username: string
    password: string
    email?: string
    phone?: string
    additionalData?: Record<string, any>
  }>
  format: 'txt' | 'xlsx' | 'json'
}

export interface TelegramTransferData {
  customerTelegram: string
  targetUrl: string
  transferType: 'ownership' | 'admin' | 'member'
  verificationRequired: boolean
}

// ================================
// STATISTICS TYPES
// ================================

export interface SalesStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  conversionRate: number
}

export interface ProductStats {
  totalProducts: number
  activeProducts: number
  outOfStock: number
  lowStock: number
  topSellingProducts: Array<{
    product: Product
    salesCount: number
    revenue: number
  }>
}

export interface UserStats {
  totalUsers: number
  newUsers: number
  activeUsers: number
  usersByRank: Record<UserRank, number>
  usersByRole: Record<UserRole, number>
}

// ================================
// FILE UPLOAD TYPES
// ================================

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE'
}

export interface UploadedFile {
  id: number
  fileId: string
  url: string
  type: FileType
}

export interface FileUploadResponse extends ApiResponse<UploadedFile[]> {
  success: boolean
  data: UploadedFile[]
  message: string
}

// ================================
// EXPORT ALL TYPES FOR CONVENIENCE
// ================================

export type {
  Account,
  ApiResponse,
  Article,
  ArticleCategory,
  ArticleFilters,
  AuditLog,
  BaseEntity,
  BaseQuery,
  CartItem,
  Category,
  CheckoutData,
  Coupon,
  CouponUsage,
  Delivery,
  DeliveryData,
  LoginSession,
  Notification,
  Order,
  OrderFilters,
  OrderItem,
  Package,
  PackageCategory,
  PaginatedResponse,
  PaginationMeta,
  Payment,
  Product,
  ProductFilters,
  ProductStats,
  Role,
  RolePermission,
  SalesStats,
  Settings,
  TAdmin,
  TelegramTransfer,
  TelegramTransferData,
  Ticket,
  TicketReply,
  User,
  UserFilters,
  UserStats
}

// Make this a module
export {}
