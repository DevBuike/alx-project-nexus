// components/CategorySection.tsx
import Link from 'next/link';
import ProductCard from './ProductCard';
import { ProductDetail } from "@/interface/Products";

interface Props {
  title: string;
  categoryNames: string[];
  products: ProductDetail[];
}

export default function CategorySection({ title, categoryNames, products }: Props) {
  const filteredProducts = products.filter((product) =>
    categoryNames.includes(product.category?.name)
  );

  if (filteredProducts.length === 0) return null;

  return (
    <div className="w-full mx-auto mt-12 space-y-12">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#3e9f9c]">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto py-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
