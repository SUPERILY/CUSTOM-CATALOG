import { Category as PrismaCategory, Product as PrismaProduct, Image as PrismaImage, Feature as PrismaFeature } from '@prisma/client';

export type StockStatus = string;

export interface Image extends PrismaImage { }

export interface Feature extends PrismaFeature { }

export interface Category extends PrismaCategory { }

export interface Product extends Omit<PrismaProduct, 'stockStatus'> {
  images: Image[];
  features: Feature[];
  category: Category;
  stockStatus: StockStatus;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  linkText: string;
  linkUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
}

export interface StockStatusModel {
  id: string;
  label: string;
  value: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}