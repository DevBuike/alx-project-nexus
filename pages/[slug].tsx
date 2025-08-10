/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import {ProductDetail, ProductLists} from "@/interface/Products";
import { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";

export async function getServerSideProps() {
  const products: ProductDetail[] = [];
  let categories: any[] = [];

  let productPage = 1;
  let categoryPage = 1;

  let hasNextProduct = true;
  let hasNextCategory = true;

  try {
    while (hasNextProduct) {
      const response = await fetch(`https://alx-project-nexus-psi.vercel.app/api/v1/products/?page=${productPage}`);
      const data = await response.json();

      products.push(...data.results);
      hasNextProduct = !!data.links?.next;
      productPage += 1;
    }

    while (hasNextCategory) {
      const response = await fetch(`https://alx-project-nexus-psi.vercel.app/api/v1/categories/?page=${categoryPage}`);
      const data = await response.json();

      categories.push(...data.results);
      hasNextCategory = !!data.links?.next;
      categoryPage += 1;
    }

    // extracting the slugs of each product so i can get the full product detail and extract the category value
    const slugs = products.map((p) => p.slug);

    // Fetch product detail by slug
    const detailedResponses = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const response = await fetch(`https://alx-project-nexus-psi.vercel.app/api/v1/products/${slug}/`);
          return await response.json();
        } catch {
          return null;
        }
      })
    );

    // filter products that may return empty..
    const detailedProducts = detailedResponses.filter(Boolean);

    return {
      props: {
        products,
        categories,
        detailedProducts,
      }
    };
  } catch (error) {
    return {
      props: {
        products: [],
        categories: [],
        detailedProducts: [],
      }
    };
  }
}


export default function CategoryPage({detailedProducts}: {detailedProducts: ProductDetail[]}) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const { slug } = router.query;

  useEffect(() => {
    const filtered = detailedProducts.filter(
      (p) => p.category.slug === slug
    );
    setProducts(filtered);
  }, [detailedProducts, slug]);

  return (
    <main className="p-6 bg-gray-500 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6 capitalize text-center mt-10">
        Products in {slug?.toString().replace(/-/g, ' ')}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found in this category.</p>
      ) : (
        <div className="flex flex-wrap gap-5 mt-10">
          {products.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      )}
    </main>
  );
}
