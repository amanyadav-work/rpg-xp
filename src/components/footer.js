import Link from "next/link"

const Footer = () => {
    return (
        <>
            <footer className="bg-muted/20 border-t-2">

                <div className=' p-4 w-full flex flex-col py-13 gap-6 sm:gap-0 sm:flex-row items-center justify-between container max-w-[1400px] mx-auto sm:px-6 lg:px-8'>
                    <div className="flex flex-col gap-4 w-full sm:w-5/12 ">
                        <h2 className='text-2xl sm:text-4xl font-bold text-yellow-300'>⨯Ᵽ</h2>
                        <p className='text-xs'>At Spring, we believe in bringing style and creativity to your everyday life. From trendy apparel and accessories to unique wall art, phone cases, and stationery, we offer a curated collection to elevate your look and living space. Shop with us for quality, style, and inspiration — all at your fingertips!</p>
                    </div>

                    <div className="flex w-full  sm:w-2/12 lg:w-1/12 text-xs">
                        <div className="w-fit flex flex-col gap-4">
                            <Link className='hover:underline underline-offset-2' href="/">Home</Link>  {/* Link to Home page */}
                            <Link className='hover:underline underline-offset-2' href="https://www.amanwebdev.site/">About</Link>  {/* Link to About page */}
                            <Link className='hover:underline underline-offset-2' href="https://www.amanwebdev.site/">Contact</Link>  {/* Link to Contact page */}
                        </div>
                    </div>

                    <div className="flex w-full sm:w-2/12 lg:w-1/12 text-xs">
                        <div className="w-fit flex flex-col gap-4">
                            <Link  className='hover:underline underline-offset-2' href="/my-orders">My Orders</Link>  {/* Link to My Orders page */}
                            <Link  className='hover:underline underline-offset-2' href="/shop?ispop=true">The Populars</Link>  {/* Link to Populars page */}
                            <Link  className='hover:underline underline-offset-2' href="/wishlist">My Wishlist</Link>  {/* Link to Wishlist page */}
                        </div>
                    </div>

                    <div className="hidden lg:flex w-full sm:w-1/12 text-xs ">
                        <div className="w-fit flex flex-col gap-4">
                            <Link className='hover:underline underline-offset-2' href="https://www.amanwebdev.site/" target='_blank'>Owner&apos;s Details</Link>  {/* Link to Sister Companies page */}
                            <Link className='hover:underline underline-offset-2' href="/shop">Recent Launches</Link>  {/* Link to Recent Launches page */}
                            <Link  className='hover:underline underline-offset-2' href="/shop">Explore All</Link>  {/* Link to Explore All page */}
                        </div>
                    </div>

                </div>
                <div className='container max-w-[1400px]   mx-auto sm:px-6 lg:px-6 w-full flex items-center justify-between border-t-1 py-4 border-muted'>
                    <p className='pl-2 sm:p=0 text-xs'>
                        Designed & Developed By Aman Yadav
                    </p>
                </div>
            </footer>

        </>
    )
}

export default Footer
