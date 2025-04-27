'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TimeLineSlider = () => {
    const sectionRef = useRef(null);
    const imgRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const prevScroll = useRef(0);

    // Scroll progress for vertical timeline line
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    // Intersection observer to sync timeline bullet highlighting
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setActiveIndex(index);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        );

        imgRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            imgRefs.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <section className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="container flex flex-col gap-28">
                <div ref={sectionRef} className="h-[300vh] relative flex gap-6">
                    {/* LEFT - Text */}
                    <div className="h-screen w-[52%] sticky top-0 flex justify-between">
                        <div className="w-full mt-56">
                            <h2 className="mb-10 text-4xl font-semibold text-pretty">
                                Embark on Your Hero's Journey
                            </h2>
                            <div className="flex flex-col gap-3 text-muted-foreground text-sm mt-6">
                                {[
                                    'Choose your quest and define your path — the adventure awaits.',
                                    'Battle challenges and defeat the enemies of procrastination.',
                                    'Level up your skills and gain experience points (XP) as you progress.',
                                    'Claim victory and celebrate your achievements with rewards and titles.',
                                ].map((label, index) => (
                                    <div key={index} className="flex gap-8 items-center">
                                        <p
                                            className={`p-2 font-semibold text-lg transition-all duration-500 rounded-full h-[3.5rem] min-w-[3.5rem] flex items-center justify-center ${index === activeIndex
                                                ? ' bg-foreground text-background '
                                                : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {index + 1}
                                        </p>
                                        <p
                                            className={`transition-colors w-full text-lg ${index === activeIndex
                                                ? 'text-red-600 font-medium'
                                                : 'text-muted-foreground'
                                                }`}
                                        >
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-[20%]">
                            <div
                                className="h-full w-2 bg-background absolute right-0 top-0"
                                style={{
                                    backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0), #ffe1e1 21%, #ffafaf 50%, #ffe1e1 79%, rgba(255, 255, 255, 0))`,
                                }}
                            >
                                <motion.div
                                    style={{
                                        height,
                                        boxShadow: 'rgb(175 4 4) 0px 0px 11px -2px',
                                    }}
                                    className="w-2 bg-destructive"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Animated Images */}
                    <div className="h-full w-[49%] flex flex-col justify-between gap-10 rounded-2xl pt-56 px-10">
                        {[ 
                            'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e869db75b4f4e2ae14a213_Tell%20Zara%20your%20hiring%20requirements%20(1)-p-800.avif', 
                            'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e869dd9182cd45560d2492_V3%20-%20with%20transcript%20shown%20(55)-p-800.avif',
                            'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e9900e2e7bb34d6030015b_Let%20AI%20match%20you%20with%20the%20best%20talent%20(3)-p-800.avif',
                            'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e99016a05e6fcbcb32943a_V3%20-%20with%20transcript%20shown%20(60).avif'
                        ].map((src, idx) => (
                            <AnimatedImage
                                key={src}
                                src={src}
                                index={idx}
                                setRef={(el) => (imgRefs.current[idx] = el)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const AnimatedImage = ({ src, index, setRef }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { threshold: 1 });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={src}
                ref={(el) => {
                    ref.current = el;
                    setRef(el);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full"
                data-index={index}
            >
                <img
                    src={src}
                    alt={`Timeline step ${index + 1}`}
                    className="w-full rounded-xl shadow-md"
                />
            </motion.div>
        </AnimatePresence >
    );
};

export default TimeLineSlider;
