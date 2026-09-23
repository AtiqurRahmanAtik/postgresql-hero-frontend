import Link from "next/link";

export default function Hero() {


  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Shop Smarter,{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Live Better
          </span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Discover thousands of products at unbeatable prices. Fast delivery,
          secure checkout, and a shopping experience made just for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
         <Link   href="/products"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Shop Now
          </Link>
          
          <Link  href="/about"
            className="px-8 py-3 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/20 transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}