'use client'
import React, { useContext } from 'react';
import {
    Table,
    TableBody,

    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle, Coins, FlameIcon, LucideFlameKindling, Star, X } from 'lucide-react';
import { useFetch } from '@/lib/hooks/useFetch';
import { userContext } from '@/context/userContext';
import { getRankSymbol } from '@/utils/helpers';
import { MoonLoader } from 'react-spinners';


const Dashboard = () => {
    const { user } = useContext(userContext)
    const { loading, error, data } = useFetch('/api/public', {}, true);
  
    let allUsers = data?.users || null;
    return (
        <div className="container max-w-[1400px] mx-auto sm:px-6 lg:px-8 pb-20">
            <section className="relative p-20 flex items-center justify-between min-h-[40vh] border border-muted  rounded-2xl bg-cover " style={{ backgroundImage: "url(https://4kwallpapers.com/images/wallpapers/tanjiro-kamado-1920x1080-18718.jpg)", boxShadow: 'inset 0px 0px 220px 20px black' }}>
                <div className='text-white  max-w-lg space-y-2 border p-10 rounded-lg backdrop-blur-xl 
  bg-[linear-gradient(135deg,_#1a1a1a00,_#000000c7)]'>
                    <div className="flex gap-2.5">
                        <Button className='rounded-full'><b className='-mx-1'>⨯Ᵽ</b>Exclusives</Button>
                        <Button className='rounded-full bg-background text-foreground' variant='outline'><Star className='text-yellow-500 fill-yellow-500' />3.24k</Button>
                    </div>
                    <h1 className='text-2xl font-bold brightness-200'>Volarant Stylish</h1>
                    <div className='max-w-[30%] border' />
                    <p className='text-sm font-medium'>
                        We are glad to see you on our Gamers Explained website! Please enter your username and password to enter or register on the site. We are glad to see you on our Gamers Explained website! Please enter your username on the site.
                    </p>
                    <Button variant='link' className=' text-white' style={{ padding: "0px" }}>Search on google <ArrowUpRight /></Button>
                </div>
                <div className="absolute text-white bottom-[-2px] right-1 flex items-center">
                    <div className='border backdrop-blur-xl rounded-xs  flex items-center gap-1 font-medium  text-xs py-1.5 px-2  bg-[linear-gradient(135deg,_#1a1a1a00,_#000000c7)]'> <CheckCircle size={14} strokeWidth={2.5} /> Mark as complete</div>
                    <div className=' rounded-xs  flex items-center gap-1 font-medium  text-xs py-1.5 px-2'> <Coins size={20} fill="yellow" color="black" />2K</div>
                    <div className=' rounded-xs  flex items-center gap-1 font-medium  text-xs py-1.5 px-2'>  <FlameIcon size={13} fill="red" color="black" />20
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className='flex justify-between py-12 gap-8'>
                <div className='w-[60%]'>
                    <div className='flex items-baseline gap-2'>
                        <h1 className='text-xl font-bold'>The Leaderboard</h1>
                        <p className='text-xs font-medium border px-2'>See Your Rankings</p>
                    </div>

                    {user && <Table className='-mt-4 max-h-[400px] overflow-auto'>
                        <TableHeader>
                            <TableRow className='invisible'>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>UserName & Name</TableHead>
                                <TableHead>Coins Count</TableHead>
                                <TableHead>Xp Count</TableHead>
                                <TableHead>Rank</TableHead>
                                <TableHead className="text-right">Member Since</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='  bg-muted/30'>
                                <TableCell className="font-medium  pl-4 py-4">
                                    <div className="relative">
                                        <span className='flex justify-center items-center size-5 bg-foreground text-background rounded-full font-bold absolute top-[-10%]'>{user.rank}</span>
                                        <img src={user.image} className='size-20 aspect-square rounded-sm object-cover' />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <span className='text-muted-foreground text-xs font-medium'>
                                            {user.username}</span>
                                        <span className='flex gap-2 items-center'>
                                            {user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell> <div className=' rounded-xs  flex items-center gap-1 font-medium  '> <Coins size={20} fill="yellow" color="black" />{user.coins}</div></TableCell>

                                <TableCell>
                                    <div className=' rounded-xs  flex items-center gap-1 font-medium  text-xs py-1.5 px-2'>  <FlameIcon size={16} fill="red" color="black" />{user.xp}
                                    </div></TableCell>
                                <TableCell> # {user.globalRank}</TableCell>
                                <TableCell className="text-right pr-4 py-4">Member Since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>}


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
                            : <Table className='-mt-4 max-h-[400px] overflow-auto'>
                                <TableHeader>
                                    <TableRow className='invisible'>
                                        <TableHead className="w-[100px]">Image</TableHead>
                                        <TableHead>UserName & Name</TableHead>
                                        <TableHead>Coins Count</TableHead>
                                        <TableHead>Xp Count</TableHead>
                                        <TableHead>Rank</TableHead>
                                        <TableHead className="text-right">Member Since</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allUsers?.length > 0 && allUsers.map((i, idx) => {
                                        return <TableRow key={i.username} className=' dark:bg-red-500/10 bg-muted'>
                                            <TableCell className="font-medium  pl-4 py-4">
                                                <div className="relative">
                                                    <span className='flex justify-center items-center size-5 bg-foreground text-background rounded-full font-bold absolute top-[-10%]'>{getRankSymbol(i.xp)}</span>
                                                    <img src={i.image} className='size-20 aspect-square rounded-sm object-cover' />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col'>
                                                    <span className='text-muted-foreground text-xs font-medium'>
                                                        {i.username}</span>
                                                    <span className='flex gap-2 items-center'>
                                                        {i.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell> <div className=' rounded-xs  flex items-center gap-1 font-medium  '> <Coins size={20} fill="yellow" color="black" />{i.coins}</div></TableCell>
                                            <TableCell>
                                                <div className=' rounded-xs  flex items-center gap-1 font-medium  text-xs py-1.5 px-2'>  <FlameIcon size={16} fill="red" color="black" />{i.xp}
                                                </div></TableCell>
                                            <TableCell> # {idx + 1}</TableCell>
                                            <TableCell className="text-right pr-4 py-4">Member Since {new Date(i.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>}
                </div>


                {/* Player List & Actual Games */}
                <div className="w-[40%]">
                    <div className='flex items-baseline gap-2'>
                        <h1 className='text-xl font-bold'>The Streak</h1>
                        <p className='text-xs font-medium border px-2'>See Your Rankings</p>
                    </div>

                    {/* Actual Games */}
                    <section className="actual-games">
                        <h2>Actual Games</h2>
                        <div className="game-list">
                            {[
                                "Warcraft 3",
                                "Starcraft 2",
                                "Fortnite",
                                "Apex Legends",
                                "League of Legends",
                                "Dota 2",
                                "CS Go"
                            ].map((game, index) => (
                                <div key={index} className="game-item">
                                    <img src="https://via.placeholder.com/100" alt={game} />
                                    <p>{game}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </section>

        </div>
    );
};

export default Dashboard;