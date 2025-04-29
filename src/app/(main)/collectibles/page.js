'use client'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CheckCircle, Coins, FlameIcon, GhostIcon, LockKeyhole, LucideFlameKindling, Star } from 'lucide-react'
import { format } from "date-fns"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useContext, useEffect, useState } from 'react'
import { userContext } from '@/context/userContext'
import { useFetch } from '@/lib/hooks/useFetch'
import { MoonLoader } from 'react-spinners'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getMotivationalChestMessage, getRandomChestMessage, getRandomCollectibleMessage } from '@/utils/helpers'
import { toast } from 'sonner'


const Collectibles = () => {
    const { user, setUser } = useContext(userContext)
    const { loading, error, data } = useFetch('/api/collectibles', {}, true);
    const { loading: userLoading, refetch: userRefetch } = useFetch('/api/users', {}, false, true);
    const collectibles = data?.collectible || [];
    const [toBePurchased, setToBePurchased] = useState(null)
    const [dailyChests, setDailyChests] = useState([])



const commons = collectibles
? collectibles.filter(
    (collectible) =>
      collectible?.type === 'common' &&
      user?.collectibles &&
      !user.collectibles.includes(collectible._id)
  )
: [];

const chests = collectibles
? collectibles.filter(
    (collectible) =>
      collectible?.type === 'chest' &&
      user?.collectibles &&
      !user.collectibles.includes(collectible._id)
  )
: [];



    const handlePurchase = async (item) => {
        if (user.coins < item.requiredCoins) {
            toast.error("Not enough coins!");
            return;
        }
        let newUserData = {
            ...user,
            coins: user.coins - item.requiredCoins, // ✅ Deduct coins
            collectibles: [...user.collectibles, item._id], // ✅ Add collectible
        };

        const result = await userRefetch({
            method: "PUT",
            body: JSON.stringify(newUserData),
        });

        if (result.success) {
            setUser(result.data.user);
            setToBePurchased(null)
            toast.success(`${item.name} successfully purchased!`);
        } else {
            toast.error(result.message || "Failed to purchase.");
        }
    };

    const [api, setApi] = useState(null);

    useEffect(() => {
        if (api && dailyChests.length > 0) {
            const todayIndex = dailyChests.findIndex((chest) =>
                isSameDay(new Date(chest.date), today)
            );
            if (todayIndex !== -1) {
                api.scrollTo(todayIndex);
            }
        }
    }, [api, dailyChests]);


    const today = new Date() // Replace with `new Date()` in real
    // localStorage.removeItem('dailyChestsRewards')

    useEffect(() => {
        const loadDailyChests = () => {
            let data = localStorage.getItem('dailyChestsRewards')
            let shouldGenerateNew = false

            if (data) {
                data = JSON.parse(data)
                const savedDate = new Date(data.dayNum)
                const diffDays = Math.floor((today - savedDate) / (1000 * 60 * 60 * 24))
                if (diffDays >= 7) shouldGenerateNew = true
            } else {
                shouldGenerateNew = true
            }

            if (shouldGenerateNew) {
                const lastSunday = new Date(today)
                lastSunday.setDate(today.getDate() - today.getDay())

                const dailyChestsRewards = {
                    dayNum: today,
                    chests: Array.from({ length: 7 }).map((_, i) => {
                        const chestDate = new Date(lastSunday)
                        chestDate.setDate(lastSunday.getDate() + i)
                        return {
                            coins: Math.ceil(Math.random() * 350),
                            xp: Math.ceil(Math.random() * 250),
                            date: chestDate,
                            opened: false
                        }
                    })
                }

                localStorage.setItem('dailyChestsRewards', JSON.stringify(dailyChestsRewards))
                return dailyChestsRewards.chests
            }

            return data.chests
        }

        const chests = loadDailyChests()
        setDailyChests(chests)
    }, [])




    const handleOpenChest = (index) => {
        const updated = [...dailyChests]
        updated[index].opened = true
        setDailyChests(updated)

        const saved = JSON.parse(localStorage.getItem('dailyChestsRewards'))
        saved.chests = updated
        localStorage.setItem('dailyChestsRewards', JSON.stringify(saved))
    }


    const isSameDay = (date1, date2) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()


    return (
        <div className="container max-w-[1400px] mx-auto sm:px-6 lg:px-8 pb-20">
            <section className="relative p-20 flex items-center justify-end min-h-[40vh] border border-muted  rounded-2xl bg-cover " style={{ backgroundImage: "url(/wallpapersden.com_77160-3840x2160.jpg)", boxShadow: 'inset 0px 0px 220px 20px black' }}>
                <div className='text-white  max-w-lg space-y-2 border p-10 rounded-lg backdrop-blur-xl 
      bg-[linear-gradient(135deg,_#1a1a1a00,_#000000c7)]'>
                    {dailyChests.length > 0 && (<Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                        }}
                        className="w-full max-w-sm"
                    >
                        <CarouselContent>
                            {dailyChests.map((chest, index) => {
                                const chestDate = new Date(chest.date)
                                const isToday = isSameDay(chestDate, today)
                                const isPast = chestDate < today
                                const isFuture = chestDate > today

                                const formattedDate = format(chestDate, "d MMMM, EEEE") // e.g., 17 March, Wednesday

                                return <CarouselItem key={index} className="md:basis-1/2  ">
                                    <div className="p-1">
                                        <Card className='bg-muted'>
                                            <CardContent className={`${(isPast && !isToday) && "grayscale"} flex flex-col items-center justify-center  p-6`}>
                                                <img
                                                    src="/download.png"
                                                    alt={`Chest ${index + 1}`}
                                                    className="w-24 h-24"
                                                />
                                                <span className="text-xs font-semibold">{formattedDate}</span>

                                                {isToday && (
                                                    <Button variant={chest.opened ? "outline" : "default"} disabled={chest.opened} className={`${chest.opened && "grayscale-50 text-green-600"} font-semibold mt-2 text-xs w-[80%] `} onClick={() => handleOpenChest(index)}>{chest.opened ? "Opened" : "Open Chest"}</Button>
                                                )}

                                                {/* {isToday && chest.opened && (
                                                    <span className="text-green-500 font-bold">Opened</span>
                                                )} */}

                                                {(isPast && !isToday) && (
                                                    <Button disabled={true} variant='outline'
                                                        className={`${chest.opened && "grayscale-50 text-green-600"} mt-2 text-xs w-[80%] font-semibold `}
                                                    >
                                                        {chest.opened ? "Opened" : "Unopened"}
                                                    </Button>
                                                )}

                                                {isFuture && <span className="text-gray-400">Locked</span>}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            })}
                        </CarouselContent>
                        <CarouselPrevious variant='default' />
                        <CarouselNext variant='default' />
                    </Carousel>)}
                </div>
                <div className="absolute bg-background p-2 px-4 text-xs bottom-[-2px] -right-0.5 rounded-tl-sm flex items-center">
                    Your daily rewards
                </div>
            </section>

            <Dialog>
                {loading ?
                    <div className="h-[90vh] w-full flex items-center justify-center">
                        <MoonLoader size={20} color="gray" />
                    </div>
                    : error ?
                        <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                            <LucideFlameKindling color="grey" />
                            <p className="text-xs text-muted-foreground">
                                Something Went Wrong!
                            </p>
                        </div>
                        : commons?.length > 0 && chests?.length > 0 && <>

                            {/*Common Collectibles -- Purchase*/}
                            <section>
                                <div className="flex items-center gap-4 pt-8">
                                    <div className="flex-grow border-t border-gray-500"></div>
                                    <span className="text text-sm uppercase">Buy Collectibles</span>
                                    <div className="flex-grow border-t border-gray-500"></div>
                                </div>
                                <div className="grid grid-cols-2 justify-center md:grid-cols-6 gap-4">
                                    {[...commons].sort((a, b) => (a.requiredXp <= user.xp ? 0 : 1) - (b.requiredXp <= user.xp ? 0 : 1) || a.requiredXp - b.requiredXp).map((item, index) => (
                                        <div key={index}
                                            className="flex mt-20"
                                        >
                                            <Card className={`relative rounded-lg gap-0  w-full transition-all transform hover:scale-105 hover:shadow-lg hover:-rotate-2 hover:border-muted-foreground  cursor-pointer text-center group  mx-auto duration-300 ease-in-out ${item.requiredXp > user.xp && 'hover:rotate-0 hover:shadow-sm hover:border-transparent  hover:scale-100 opacity-80 dark:opacity-60 bg-muted/50 grayscale'}`}>

                                                {item.requiredXp <= user.xp && <><div className="absolute top-[20%] right-[-1px] rounded-lg z-0  w-[1px] h-0 bg-yellow-500 transition-all duration-[200ms] ease-linear group-hover:h-[60%]"></div>

                                                    <div className="absolute bottom-[20%] left-[-1px] rounded-lg z-0  w-[1px] h-0 bg-red-500 transition-all duration-[400ms] ease-linear group-hover:h-[60%]"></div>
                                                </>
                                                }
                                                <CardTitle className="text-lg font-semibold"> <img
                                                    src={"https://png.pngtree.com/png-clipart/20220806/ourmid/pngtree-cartoon-cowboy-hat-png-image_6101832.png"}
                                                    alt={item.name}
                                                    className="w-full max-w-[200px] place-self-center h-fit aspect-square object-contain -mt-30"
                                                /></CardTitle>
                                                <CardContent className="p-4 -mt-10">
                                                    <h3 className="text-md font-semibold">{item.name}</h3>
                                                    <p className="text-muted-foreground text-xs">{item.description}</p>
                                                </CardContent>
                                                <CardFooter className='flex-col gap-1 items-center justify-center'>
                                                    {item.requiredXp <= user.xp ? <DialogTrigger onClick={() => { setToBePurchased(item) }} asChild>
                                                        <div className='rounded-full  hover:text-red-600 duration-300 w-fit border flex items-center justify-center gap-2 font-medium  text-xs py-1.5 dark:text-yellow-400  px-2'> <Coins size={17} fill="yellow" color="black" className='bg-foreground rounded-full  p-0.5' />{item.requiredCoins === 0 ? 'FREE' : `${item.requiredCoins} RK`}</div>
                                                    </DialogTrigger>
                                                        : <div className='rounded-full  hover:text-red-600 duration-300 w-fit border flex items-center justify-center gap-2 font-medium  text-xs py-1.5 dark:text-yellow-400  px-2'> <Coins size={17} fill="yellow" color="black" className='bg-foreground rounded-full  p-0.5' />{item.requiredCoins === 0 ? 'FREE' : `${item.requiredCoins} RK`}</div>
                                                    }
                                                </CardFooter>
                                                {item.requiredXp >= user.xp && <TooltipProvider>
                                                    <Tooltip className="absolute bottom-0 left-0 ">
                                                        <TooltipTrigger className="absolute top-0 left-0 "><LockKeyhole size={18} fill="yellow" color="black" className='bg-foreground rounded-full text-foreground p-1' /></TooltipTrigger>
                                                        <TooltipContent className="text-foreground font-semibold text-right bg-muted border">
                                                            {item.requiredXp} XP
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>}
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/*Chest Collectibles  -- Purchase*/}
                            <section>
                                <div className="flex items-center gap-4 pt-8">
                                    <div className="flex-grow border-t border-gray-500"></div>
                                    <span className="text text-sm uppercase">Buy Chests</span>
                                    <div className="flex-grow border-t border-gray-500"></div>
                                </div>
                                <div className="grid grid-cols-2 justify-center md:grid-cols-6 gap-4">
                                    {[...chests].sort((a, b) => (a.requiredXp <= user.xp ? 0 : 1) - (b.requiredXp <= user.xp ? 0 : 1) || a.requiredXp - b.requiredXp).map((item, index) => (
                                        <div key={index}
                                            className="flex mt-20"
                                        >
                                            <Card className={`relative rounded-lg gap-0  w-full transition-all transform hover:scale-105 hover:shadow-lg hover:-rotate-2 hover:border-muted-foreground  cursor-pointer text-center group  mx-auto duration-300 ease-in-out ${item.requiredXp > user.xp && 'hover:rotate-0 hover:shadow-sm hover:border-transparent  hover:scale-100 opacity-80 dark:opacity-60 bg-muted/50 grayscale'}`}>

                                                {item.requiredXp <= user.xp && <><div className="absolute top-[20%] right-[-1px] rounded-lg z-0  w-[1px] h-0 bg-yellow-500 transition-all duration-[200ms] ease-linear group-hover:h-[60%]"></div>

                                                    <div className="absolute bottom-[20%] left-[-1px] rounded-lg z-0  w-[1px] h-0 bg-red-500 transition-all duration-[400ms] ease-linear group-hover:h-[60%]"></div>
                                                </>
                                                }
                                                <CardTitle className="text-lg font-semibold"> <img
                                                    src={"/download.png"}
                                                    alt={item.name}
                                                    className="w-full max-w-[200px] place-self-center h-fit aspect-square object-contain -mt-30"
                                                /></CardTitle>
                                                <CardContent className="p-4 -mt-5">
                                                    <h3 className="text-md font-semibold">{item.name}</h3>
                                                    <p className="text-muted-foreground text-xs">{item.description}</p>
                                                </CardContent>
                                                <CardFooter className='flex-col gap-1 items-center justify-center'>
                                                    {item.requiredXp <= user.xp ? <DialogTrigger onClick={() => { setToBePurchased(item) }} asChild>
                                                        <div className='rounded-full duration-300 w-fit border flex items-center justify-center gap-2 font-medium  text-xs py-1.5 dark:text-yellow-400  px-2'> <Coins size={17} fill="yellow" color="black" className='bg-foreground rounded-full  p-0.5' />{item.requiredCoins === 0 ? 'FREE' : `${item.requiredCoins} RK`}</div>
                                                    </DialogTrigger>
                                                        : <div className='rounded-full duration-300 w-fit border flex items-center justify-center gap-2 font-medium  text-xs py-1.5 dark:text-yellow-400  px-2'> <Coins size={17} fill="yellow" color="black" className='bg-foreground rounded-full  p-0.5' />{item.requiredCoins === 0 ? 'FREE' : `${item.requiredCoins} RK`}</div>
                                                    }
                                                </CardFooter>
                                                {item.requiredXp >= user.xp && <TooltipProvider>
                                                    <Tooltip className="absolute bottom-0 left-0 ">
                                                        <TooltipTrigger className="absolute top-0 left-0 "><LockKeyhole size={18} fill="yellow" color="black" className='bg-foreground rounded-full text-foreground p-1' /></TooltipTrigger>
                                                        <TooltipContent className="text-foreground font-semibold text-right bg-muted border">
                                                            {item.requiredXp} XP
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>}

                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>}


                {toBePurchased && <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <img
                                src={toBePurchased.image}
                                alt={toBePurchased.name}
                                className="w-10 h-10 object-contain"
                            />
                            {toBePurchased.name}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm pt-2">
                            {toBePurchased.description}. {(toBePurchased.type === "chest" && !toBePurchased?.purchased) && getMotivationalChestMessage(toBePurchased.name)}
                        </DialogDescription>
                    </DialogHeader>

                    {(toBePurchased.type === "chest" && toBePurchased.purchased) && (
                        <div className="border rounded-lg p-4 mt-1 bg-muted">
                            <h3 className="text-base font-semibold mb-1">📝 Task: {toBePurchased.task.title}</h3>
                            <p className="text-sm text-muted-foreground">{toBePurchased.task.description}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-2">
                        <div className="flex items-center gap-2 text-sm text-yellow-500 font-semibold">
                            <Coins size={18} fill="yellow" color="black" />
                            {toBePurchased.requiredCoins === 0 ? 'FREE' : `${toBePurchased.requiredCoins} RK`}
                        </div>

                        {!toBePurchased?.purchased && <div className=" flex justify-end">
                            <Button onClick={() => handlePurchase(toBePurchased)}
                                variant="outline"
                                disabled={user.coins < toBePurchased.requiredCoins}
                                className={`gap-2 text-xs ${user.coins < toBePurchased.requiredCoins && 'grayscale'}`}
                            >
                                {userLoading ? "Loading.." : <>
                                    <CheckCircle size={12} color='green' />
                                    {user.coins < toBePurchased.requiredCoins
                                        ? 'Not Enough Coins'
                                        : 'Purchase'}
                                </>
                                }
                            </Button>
                        </div>}
                    </div>

                </DialogContent>}
            </Dialog>


        </div>
    )
}

export default Collectibles