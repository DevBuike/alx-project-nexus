import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#56b8b5] text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} iBuy. All rights reserved.</p>
        <p>
          <Link href="#" className="text-gray-100 hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
export default Footer;
