import Link from 'next/link';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full text-center py-6 px-4 bg-transparent">
      <div className="flex justify-center space-x-6">
        <Link 
          href="https://github.com/janinynobrega" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
        >
          <FaGithub size={24} />
        </Link>
        <Link 
          href="https://www.linkedin.com/in/janiny-nóbrega-27506b106" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
        >
          <FaLinkedinIn size={24} />
        </Link>
        <Link 
          href="https://wa.me/+5585999525131" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-green-600 transition-colors duration-200"
        >
          <FaWhatsapp size={24} />
        </Link>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Janiny Nóbrega. Todos os direitos reservados.
      </p>
    </footer>
  );
}
