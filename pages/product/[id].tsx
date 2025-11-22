import React, { useState } from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../types';
import { DB } from '../../services/db';
import { StockBadge } from '../../components/StockBadge';
import { ArrowLeft, Tag, Check, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

interface ProductPageProps {
  product: Product;
}

interface ProductPageParams extends ParsedUrlQuery {
  id: string;
}

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const activeImageUrl = product.images?.[activeImage]?.url;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalog
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          {/* Image Gallery */}
          <div className="p-6 bg-gray-50">
            <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm mb-4 relative">
              {activeImageUrl ? (
                <Image
                  src={activeImageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-24 h-24" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${activeImage === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent hover:border-gray-300'
                      }`}
                  >
                    <Image src={img.url} alt={`View ${idx + 1}`} fill sizes="25vw" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-10 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-medium">
                <Tag className="w-3 h-3 mr-1" /> {product.category?.name || 'Uncategorized'}
              </span>
              <StockBadge status={product.stockStatus} size="lg" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className={`text-3xl text-gray-900 mb-6 ${product.hidePrice ? 'font-medium' : 'font-light'}`}>
              {product.hidePrice ? 'Contact for Price' : `$${product.price.toFixed(2)}`}
            </p>

            <div className="prose prose-indigo text-gray-600 mb-8">
              <p className="text-lg leading-relaxed">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature.id} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto pt-6 border-t text-sm text-gray-500 flex justify-between items-center">
              <span>SKU: {product.sku}</span>
              <span className="italic">Catalog Mode Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await DB.getProducts();
  const paths = products.map(product => ({
    params: { id: product.id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps, ProductPageParams> = async (context) => {
  const { id } = context.params!;
  const product = await DB.getProductById(id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
    revalidate: 60,
  };
};

export default ProductPage;
