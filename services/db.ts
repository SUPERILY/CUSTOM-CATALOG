import { PrismaClient } from '@prisma/client';
import { Product, Category, Banner, StockStatus } from '../types';

// Prisma Client Initialization
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to avoid creating too many connections
  // during hot-reloading.
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

export const DB = {
  getProducts: async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        images: true,
        category: true,
        features: true,
      },
    });
    return products as Product[];
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        features: true,
      },
    });
    return product as Product | null;
  },

  saveProduct: async (productData: Omit<Product, 'id' | 'category' | 'images' | 'features' | 'createdAt' | 'updatedAt'> & { id?: string, categoryId: string, features: string[], images: string[] }): Promise<Product> => {
    const { id, categoryId, features, images, ...data } = productData;

    const featureData = features.map(text => ({ text }));
    const imageData = images.map(url => ({ url }));

    if (id) {
      // Update existing product
      const updatedProduct = await prisma.$transaction(async (tx) => {
        await tx.feature.deleteMany({ where: { productId: id } });
        await tx.image.deleteMany({ where: { productId: id } });

        return tx.product.update({
          where: { id },
          data: {
            ...data,
            category: { connect: { id: categoryId } },
            features: { create: featureData },
            images: { create: imageData },
          },
          include: {
            images: true,
            category: true,
            features: true,
          },
        });
      });
      return updatedProduct as Product;
    } else {
      // Create new product
      const newProduct = await prisma.product.create({
        data: {
          ...data,
          category: { connect: { id: categoryId } },
          features: { create: featureData },
          images: { create: imageData },
        },
        include: {
          images: true,
          category: true,
          features: true,
        },
      });
      return newProduct as Product;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    await prisma.product.delete({ where: { id } });
  },

  duplicateProduct: async (id: string): Promise<Product> => {
    const original = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        features: true,
      },
    });

    if (!original) {
      throw new Error('Product not found');
    }

    // Generate unique SKU
    let newSku = `${original.sku}-COPY`;
    let counter = 1;

    while (await prisma.product.findFirst({ where: { sku: newSku } })) {
      newSku = `${original.sku}-COPY${counter}`;
      counter++;
    }

    // Create duplicate
    const duplicate = await prisma.product.create({
      data: {
        name: `${original.name} (Copy)`,
        sku: newSku,
        description: original.description,
        price: original.price,
        hidePrice: original.hidePrice,
        stockStatus: original.stockStatus,
        category: { connect: { id: original.categoryId } },
        features: {
          create: original.features.map(f => ({ text: f.text })),
        },
        images: {
          create: original.images.map(i => ({ url: i.url })),
        },
      },
      include: {
        images: true,
        category: true,
        features: true,
      },
    });

    return duplicate as Product;
  },

  getCategories: async (): Promise<Category[]> => {
    return prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  saveCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'products'> & { id?: string }): Promise<Category> => {
    if (categoryData.id) {
      return prisma.category.update({
        where: { id: categoryData.id },
        data: categoryData,
      });
    } else {
      return prisma.category.create({
        data: categoryData,
      });
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    await prisma.category.delete({ where: { id } });
  },

  getBanners: async (): Promise<Banner[]> => {
    return prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  getBannerById: async (id: string): Promise<Banner | null> => {
    return prisma.banner.findUnique({
      where: { id },
    });
  },

  createBanner: async (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> => {
    return prisma.banner.create({
      data: banner,
    });
  },

  updateBanner: async (id: string, banner: Partial<Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Banner> => {
    return prisma.banner.update({
      where: { id },
      data: banner,
    });
  },

  deleteBanner: async (id: string): Promise<void> => {
    await prisma.banner.delete({
      where: { id },
    });
  },

  // Legacy method for backward compatibility
  getBanner: async (): Promise<Banner> => {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 1,
    });

    if (banners.length > 0) {
      return banners[0];
    }

    // Create default banner if none exists
    return prisma.banner.create({
      data: {
        title: 'Welcome to the Catalog',
        subtitle: 'Explore our products.',
        imageUrl: 'https://picsum.photos/seed/banner/1200/400',
        linkText: 'Explore',
        linkUrl: '#catalog',
        isActive: true,
        displayOrder: 0,
      }
    });
  },

  // Legacy method for backward compatibility
  saveBanner: async (banner: Partial<Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Banner> => {
    const existing = await prisma.banner.findFirst({
      orderBy: { displayOrder: 'asc' },
    });

    if (existing) {
      return prisma.banner.update({
        where: { id: existing.id },
        data: banner,
      });
    }

    return prisma.banner.create({
      data: {
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || '',
        mobileImageUrl: banner.mobileImageUrl || null,
        linkText: banner.linkText || '',
        linkUrl: banner.linkUrl || '',
        isActive: banner.isActive ?? true,
        displayOrder: banner.displayOrder ?? 0,
      }
    });
  },

  // Stock Status Methods
  async getStockStatuses() {
    // Ensure defaults exist first
    const count = await prisma.stockStatus.count();
    if (count === 0) {
      await this.seedStockStatuses();
    }
    return prisma.stockStatus.findMany({
      orderBy: { label: 'asc' }
    });
  },

  async createStockStatus(data: { label: string; value: string; color: string }) {
    return prisma.stockStatus.create({
      data: {
        ...data,
        isDefault: false
      }
    });
  },

  async updateStockStatus(id: string, data: { label?: string; color?: string }) {
    return prisma.stockStatus.update({
      where: { id },
      data
    });
  },

  async deleteStockStatus(id: string) {
    return prisma.stockStatus.delete({
      where: { id }
    });
  },

  async seedStockStatuses() {
    const defaults = [
      { label: 'In Stock', value: 'IN_STOCK', color: 'green' },
      { label: 'Low Stock', value: 'LOW_STOCK', color: 'yellow' },
      { label: 'Out of Stock', value: 'OUT_OF_STOCK', color: 'red' },
      { label: 'Backorder', value: 'BACKORDER', color: 'orange' },
    ];

    for (const status of defaults) {
      await prisma.stockStatus.upsert({
        where: { value: status.value },
        update: {},
        create: {
          label: status.label,
          value: status.value,
          color: status.color,
          isDefault: true
        }
      });
    }
  },

  // Store Settings Methods
  async getStoreSettings() {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default',
          storeName: 'Eljarjini Complexe'
        }
      });
    }
    return settings;
  },

  async updateStoreSettings(data: { storeName?: string; logoUrl?: string; faviconUrl?: string }) {
    // Ensure it exists first
    await this.getStoreSettings();

    return prisma.storeSettings.update({
      where: { id: 'default' },
      data
    });
  }
};
