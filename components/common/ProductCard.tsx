import Link from 'next/link';
import Image from 'next/image';
import { ProductDetail} from "@/interface/Products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({product}: {product:ProductDetail}) => {
  const { addToCart } = useCart();

  return (
    <div className="flex space-x-6 " >
      <Link
        href={`/products/${product.slug}`}
        className="w-[220px] h-[320px] bg-neutral-50 rounded-lg shadow p-4 hover:shadow-md transition"
      >
        <div className=' mb-4 w-full'>
          <img
            src={product.primary_image.image_url}
            alt={product.name}
            className="w-full h-full object-cover mb-2 rounded"
          />
          <p className="text-sm font-medium text-gray-800 truncate mt-5">{product.name}</p>
          <div className='flex items-center justify-between mt-8'>
            <p className="text-[#3e9f9c] font-bold">${product.price}</p>
            <button className='px-3 py-1 bg-[#3e9f9c] rounded-lg text-white text-sm hover:bg-[#3e9f9cf0] transition' 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}>
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard;
