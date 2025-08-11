/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "../components/common/SearchBar";
import { useCart } from "@/context/CartContext";
import { ProductLists, ProductsResponse } from "@/interface/Products";


export async function getServerSideProps(context: { query: { page: string; }; }) {
  const currentPage = parseInt(context.query.page ?? '1', 10);

  try {
    const res = await fetch(`https://alx-project-nexus-psi.vercel.app/api/v1/products/?page=${currentPage}&page_size=30`);
    const data: ProductsResponse = await res.json();
    const next = data.links.next ?? null;
    const previous = data.links.previous ?? null;
    const pageSize = data.page_size;

    const productList: ProductLists[] = data.results;

    return {
      props: {
        products: productList,
        count: data.count,
        next,
        previous,
        pageSize,
        currentPage: Number(currentPage),
      },
      
    };
  } catch (error) {
    //console.error("Failed to fetch products:", error);
    return {
      props: {
        products: [],
        count: 0,
        next: null,
        previous: null,
        pageSize: null,
        currentPage: 1,
      },
    };
  }
}


export default function ProductsPage({products, count, currentPage, pageSize }: {
  products: ProductLists[];
  count: number;
  pageSize: number;
  currentPage: number;
}) {
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();

  //numbering the pagination based on number of products and products displayed per page
  const totalPages = Math.ceil(count / pageSize);

  //updating each pagination
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
        setFilteredProducts(products);
        setMessage('');
        return;
      };

    try {
      const res = await fetch(`/api/products?search=${query}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data: ProductsResponse = await res.json();
      const productList = data.results;

      
      if (productList.length < 1) {
        setFilteredProducts([]);
        setMessage(`No products found for ${query}! `);
      } else {
        setFilteredProducts(productList);
        setMessage('');
      } 
    } catch (error) {
      setFilteredProducts([]);
      setMessage('Error fetching products');
    }
  };

  const handleAddToCart = (product: ProductLists) => {
    addToCart(product);
  };

  return (
    <main className="min-h-screen py-12 px-6 text-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">All Our Products</h2>

        <div className="flex justify-center mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-between gap-y-5 gap-2 lg:gap-x-8">
          {message && <p>{message} </p>}
          {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
            
              <Link key={product.id}
                href={`/products/${product.slug}`}
                className="w-[170px] md:max-w-[220px] lg:w-[310px] h-[320px] bg-neutral-50 rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <div className=' mb-4 w-full'>
                  <img
                    src={product.primary_image.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover mb-2 rounded"
                  />
                  <p className="text-sm font-medium text-gray-800 truncate mt-5">{product.name}</p>
                  <div className='flex items-center justify-between mt-8'>
                    <p className="text-green-600 font-bold">${product.price}</p>
                    <button className='hidden md:block px-3 py-1 bg-blue-500 rounded-lg text-white text-sm hover:bg-blue-600 transition' 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}>
                      Add to Cart
                    </button>
                  </div>
                  <button className='md:hidden w-[80%] mt-5 mx-auto px-3 py-1 bg-blue-500 rounded-lg text-white text-sm hover:bg-blue-600 transition' 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}>
                      Add to Cart
                    </button>
                </div>
              </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10 space-x-2">
          {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i + 1}
              href={`/products/?page=${i + 1}`}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              } hover:bg-blue-500 transition`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
