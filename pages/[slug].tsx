/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import {ProductDetail} from "@/interface/Products";
import { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";

export async function getServerSideProps() {
  let products: any[] = [];
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
    const slugs = products.map((p: any) => p.slug);

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

const allProducts = [
  // Electronics - Mobiles
  { id: "e-m-1", title: "iPhone 14 Pro", category: "electronics", subcategory: "mobiles", price: "KSh 180,000", image: "/images/products/iphone.jpg" },
  { id: "e-m-2", title: "Samsung Galaxy S22", category: "electronics", subcategory: "mobiles", price: "KSh 120,000", image: "/images/products/galaxy.jpg" },
  { id: "e-m-3", title: "Infinix Hot 12", category: "electronics", subcategory: "mobiles", price: "KSh 18,000", image: "/images/products/infinix.jpg" },
  { id: "e-m-4", title: "Tecno Spark 10", category: "electronics", subcategory: "mobiles", price: "KSh 16,500", image: "/images/products/tecno.jpg" },
  { id: "e-m-5", title: "Xiaomi Redmi Note 12", category: "electronics", subcategory: "mobiles", price: "KSh 22,000", image: "/images/products/redmi.jpg" },

  // Fashion - Shoes
  { id: "f-s-1", title: "Men's Running Shoes", category: "fashion", subcategory: "shoes", price: "KSh 4,500", image: "/images/products/shoes1.jpg" },
  { id: "f-s-2", title: "Women's Heels", category: "fashion", subcategory: "shoes", price: "KSh 3,800", image: "/images/products/heels.jpg" },
  { id: "f-s-3", title: "Unisex Sneakers", category: "fashion", subcategory: "shoes", price: "KSh 6,000", image: "/images/products/sneakers.jpg" },
  { id: "f-s-4", title: "Kid's Sports Shoes", category: "fashion", subcategory: "shoes", price: "KSh 2,000", image: "/images/products/kids-shoes.jpg" },
  { id: "f-s-5", title: "Formal Office Shoes", category: "fashion", subcategory: "shoes", price: "KSh 5,200", image: "/images/products/formal.jpg" },

  // Home - Beds
  { id: "h-b-1", title: "5x6 Wooden Bed", category: "home", subcategory: "beds", price: "KSh 28,000", image: "/images/products/bed1.jpg" },
  { id: "h-b-2", title: "6x6 King Bed", category: "home", subcategory: "beds", price: "KSh 40,000", image: "/images/products/bed2.jpg" },
  { id: "h-b-3", title: "Metal Bunk Bed", category: "home", subcategory: "beds", price: "KSh 18,000", image: "/images/products/bunk.jpg" },
  { id: "h-b-4", title: "Upholstered Bed Frame", category: "home", subcategory: "beds", price: "KSh 35,000", image: "/images/products/upholstered.jpg" },
  { id: "h-b-5", title: "Kids Bed With Storage", category: "home", subcategory: "beds", price: "KSh 25,000", image: "/images/products/kids-bed.jpg" },
];

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
