/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ImageCarousel from "../components/common/ImageCarousel";
import { ProductList, ProductDetail, CategoryList } from "@/interface/Products";
import CategorySection from '@/components/common/CategorySection';
import ProductCard from '@/components/common/ProductCard';

export async function getStaticProps() {
  const products: ProductList[] = [];
  const categories: ProductList[] = [];

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
        revalidate: 3600,
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


export default function Home({ categories, detailedProducts}: { categories: CategoryList[], detailedProducts: ProductDetail[]}) {
  const [featured, setFeatured] = useState(detailedProducts);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [filteredProducts, setFilteredProducts] = useState<ProductDetail[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  //filtering the roducts based on the featured value
  useEffect(() => {
    const featuredProducts = detailedProducts.filter((product) => {
      return product.is_featured;
    });
    setFeatured(featuredProducts);
  }, [detailedProducts]);

  const filterProductsByPrice = () => {
    if (minPrice === null && maxPrice === null) {
      setFilteredProducts(detailedProducts);
      return;
    }
    const filtered = detailedProducts.filter((product) => {
      const price = product.price;
      return (
        (minPrice === null || price >= minPrice) &&
        (maxPrice === null || price <= maxPrice)
      );
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="text-black min-h-screen bg-neutral-50-100 from-yellow-50 via-white to-stone-100 pb-12 px-6 md:px-10 lg:px-20 ">

      {/* Sidebar */}
      <ul className="w-full flex items-center gap-8 p-4 mb-5 bg-neutral-50 rounded shadow overflow-x-auto">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={category.slug}
              className="flex items-center justify-between cursor-pointer font-medium hover:text-yellow-500 transition"
              onClick={() => toggleMenu(category.name)}
            >
              <span>{category.name}</span>
              <span className="text-sm ml-2"> ›</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="max-w-7xl mx-auto flex flex-row items-start gap-8">
        
        {/* Carousel */}
        <div className="flex-1">
          <ImageCarousel
            images={[
              "/assets/carousel/img-1.png",
              "/assets/carousel/img-2.png",
              "/assets/carousel/img-3.jpg",
              "/assets/carousel/img-4.jpg",
              "/assets/carousel/img-5.gif",
            ]}
          />
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-20 ">
        <div className="w-[80%] max-w-[600px] mx-auto md:flex gap-2 items-center md:justify-center mt-8 mb-4">
          <h1 className="text-sm text-gray-800">Filter By Price:</h1>
          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Min Price"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 max-w-[90px] md:max-w-[170px]"
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 max-w-[90px] md:max-w-[170px]"
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <button className="px-4 py-2 bg-[#ffa800] text-white rounded hover:bg-[#ffa800f0] transition" onClick={filterProductsByPrice}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* featured Products section */}
      <div className="max-w-7xl mx-auto mt-10 bg-[#dfdfdf] py-10 rounded px-2">
        <h2 className="text-xl lg:text-[30px] text-center font-bold text-[#3e9f9c] mb-10">Featured Products</h2>
        <div className="flex gap-4 overflow-x-auto py-5">
          {featured.slice().reverse().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="bg-[url('/assets/bg/ecom-bg.jpg')] w-full h-[300px] bg-no-repeat bg-center bg-cover py-30">
        <div className="">
          <h3 className="text-white font-semibold text-2xl text-center">FLASH SALE | 30% Off Starts NOW!</h3>
          <p></p>
        </div>
      </div>

      {/*displaying products based on categories */}
      <div className="mt-20">
        <h3 className="text-center text-[#3e9f9c] my-8 text-xl font-semibold">Explore our Categories</h3>
        <CategorySection
        title="Clothing"
        categoryNames={['Jackets', 'Suits', 'Shirts']}
        products={filteredProducts.length > 0 ? filteredProducts : detailedProducts}
        />

        <CategorySection
          title="Home Appliances"
          categoryNames={['Home Appliances']}
          products={filteredProducts.length > 0 ? filteredProducts : detailedProducts}
        />

        <CategorySection
          title="Health & Beauty"
          categoryNames={['Fragrance', 'Hygeine']}
          products={filteredProducts.length > 0 ? filteredProducts : detailedProducts}
        />

        <CategorySection
          title="Home "
          categoryNames={['Bedding']}
          products={filteredProducts.length > 0 ? filteredProducts : detailedProducts}
        />
      </div>

      {/* Newsletter Subscription Section */}
      <div className="mt-20 bg-[#dfdfdf] py-5">
        <div className=" lg:w-[70%] mx-auto flex flex-col gap-2 items-center mt-5 mb-4">
          <h1 className="text-sm text-gray-800 mb-3">Subscribe to our Newsletter </h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter Your Name"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" onClick={() => {
              alert('Thank you for subscribing! We will keep you updated with the latest products and offers.');
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
