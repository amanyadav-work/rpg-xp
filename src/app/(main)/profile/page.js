'use client';

import { BadgeCheck, Swords, Medal, Users } from "lucide-react";
import { Button } from '@/components/ui/button'
import { CheckCircle, Coins, FlameIcon, GhostIcon, LockKeyhole, LucideFlameKindling, Star } from 'lucide-react'

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useContext, useState } from 'react'
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
import { darkenHexColor, getCharacterData, getMotivationalChestMessage, getRandomChestMessage, getRandomCollectibleMessage } from '@/utils/helpers'
import { useTheme } from "next-themes";


const Profile = () => {
  const { loading, error, data } = useFetch('/api/collectibles', {}, true);
  const { user } = useContext(userContext);
  const character = getCharacterData(user?.xp||0);
  const { theme } = useTheme()

  // Set the CSS variable dynamically
  document.documentElement.style.setProperty('--character-color', character.color);

  const collectibles = data?.collectible || [];
  const userCollectibles = user?.collectibles || [];
  
  const ownedCommon = collectibles.filter(
    (collectible) =>
      collectible?.type === 'common' &&
      userCollectibles.includes(collectible._id)
  );
  
  const ownedChests = collectibles.filter(
    (collectible) =>
      collectible?.type === 'chest' &&
      userCollectibles.includes(collectible._id)
  );
  

  const [current, setCurrent] = useState(null)

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <MoonLoader size={24} color="gray" />
      </div>
    );
  }
  

  return (
    <div className="container max-w-[1400px] mx-auto p-6">
      <div className="p-8 shadow-md flex flex-col md:flex-row gap-8">

        {/* CHARACTER VISUAL */}
        <div className="relative w-full md:w-1/3  flex flex-col items-center">

          <span
            className="absolute top-0 left-0 bg-background text-xs font-semibold px-4 py-1 border-b-4 border-r-4 rounded-br-md"
            style={{ borderColor: character.color }}>{user?.rank} &nbsp; Character</span>
          <img
            src={character.img}
            alt={character.name}
            className="rounded-xl w-full  object-cover border-4 border-yellow-400 dark:border-yellow-500 shadow-lg"
            style={{ borderColor: character.color }} />
          <img
            src={user.image}
            alt={user.name}
            className="absolute bottom-5 right-0 w-16 h-16 border-4 border-white dark:border-gray-800 rounded-full object-cover shadow-md bg-white"
            title={user.name}
          />
          <h2 className="mt-4 text-xl font-bold text-yellow-300 dark:text-yellow-600" style={{ color: theme === "dark" ? character.color : darkenHexColor(character.color, 0.2) }}>{character.name}</h2>
        </div>

        {/* USER STATS */}
        <div className="flex-1 space-y-5">

          <div className="space-y-2">
            <p className="text-md ">@{user.username}</p>
            <h1 className="text-4xl font-extrabold">{user.name}</h1>
          </div>
          <p className="text-sm text-accent-foreground/70 italic pl-1 -mt-1">“{character.description}”</p>

          {/* USER STATISTICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 items-center ">
            <StatItem theme={theme} character={character} icon={<Medal size={22} />} label="Global Rank" value={`#${user.globalRank}`} />
            <StatItem theme={theme} character={character} icon={<FlameIcon size={22} />} label="Experience" value={user.xp} />
            <StatItem theme={theme} character={character} icon={<Coins size={22} />} label="RK Coins" value={user.coins} />
            <StatItem theme={theme} character={character} icon={<BadgeCheck size={22} />} label="Your Rank" value={user?.rank} />
            <StatItem theme={theme} character={character} icon={<Swords size={22} />} label="Tasks" value={user.assignedTasks.length} />
            <StatItem theme={theme} character={character} icon={<Users size={22} />} label="Collectibles" value={user.collectibles.length} />
            <div className="col-span-2 text-center"> <div className="flex items-center gap-4 py-10">
              <div className="flex-grow border-dashed border-t-2 border-gray-500"></div>
              <span className="dark:text-gray-400 text-xl uppercase tracking-widest italic">Your Stats</span>
              <div className="flex-grow border-dashed border-t-2 border-gray-500"></div>
            </div></div>
          </div>



        </div>
      </div>
      {/* Interests */}
      {user.interests?.length > 0 && (
        <div className="mt-6 w-full">
          {/* <h2 className="text-lg font-semibold mb-2">Your Interests</h2> */}
          <div className="flex items-center flex-wrap gap-4 justify-start">
            {user.interests.map((interest, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col  items-center  w-24 cursor-pointer hover:scale-105 transition-transform">
                      <img
                        src={interest.imgUrl}
                        alt={interest.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <span className="mt-1 text-xs font-medium text-foreground">{interest.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm text-muted-foreground bg-muted border shadow-lg">
                    {interest.description || "No description available."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}
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
            : <>
              {/*Your Collectibles*/}
              <section className="my-9">
                <SectionHeader title="Your Collectibles" />
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {ownedCommon.length > 0 ? ownedCommon.map((item, index) => (
                    <div key={index}
                      className="flex mt-20"
                    >
                      <Card className={`relative rounded-sm gap-0 bg-transparent  border-0 border-b w-full transition-transform transform hover:border-white/50 duration-500 cursor-pointer text-center`} style={{
                        boxShadow: "inset 0px -20px 33px -36px white"
                      }}>
                        <CardTitle className="text-lg font-semibold"> <img
                          src={"https://png.pngtree.com/png-clipart/20220806/ourmid/pngtree-cartoon-cowboy-hat-png-image_6101832.png"}
                          alt={item.name}
                          className="w-full max-w-[200px] place-self-center h-fit aspect-square object-contain -mt-30"
                        /></CardTitle>
                        <CardContent className="p-4 -mt-10">
                          <h3 className="text-md font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground text-xs">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )) : (
                    <div className="flex flex-col gap-2 items-center justify-center align-middle h-full col-span-full text-center text-sm text-muted-foreground min-h-[35vh]">
                      <GhostIcon color="grey" />
                      <p className="text-xs text-muted-foreground">
                        {getRandomCollectibleMessage()}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/*Your Chests*/}
              <section className="mb-16">
                <SectionHeader title="Your Chests" />
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {ownedChests.length > 0 ? ownedChests.map((item, index) => (
                    <DialogTrigger onClick={() => { setCurrent({ ...item, purchased: true }) }} key={index}
                      className="flex mt-20"
                    >
                      <Card className={`relative rounded-lg gap-0  w-full transition-transform transform hover:scale-105 hover:shadow-lg hover:-rotate-2 hover:border-muted-foreground border cursor-pointer text-center`}>
                        <CardTitle className="text-lg font-semibold"> <img
                          src={"download.png"}
                          alt={item.name}
                          className="w-full max-w-[200px] place-self-center h-fit aspect-square object-contain -mt-30"
                        /></CardTitle>
                        <CardContent className="p-4 -mt-5">
                          <h3 className="text-md font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground text-xs">{item.description}</p>
                        </CardContent>
                        <CardFooter className='flex-col gap-1 items-center justify-center'>
                          <div className='rounded-full grayscale opacity-70 duration-300 w-fit border flex items-center justify-center gap-2 font-medium  text-xs py-1.5 px-2'> <Coins size={17} fill="yellow" color="black" className='bg-foreground rounded-full text-foreground p-0.5' />PURCHASED</div>
                        </CardFooter>
                      </Card>
                    </DialogTrigger>
                  )) : (
                    <div className="flex flex-col gap-2 items-center justify-center align-middle h-full col-span-full text-center text-sm text-muted-foreground min-h-[35vh]">
                      <GhostIcon color="grey" />
                      <p className="text-xs text-muted-foreground">
                        {getRandomChestMessage()}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </>}


        {current && <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <img
                src={current.image}
                alt={current.name}
                className="w-10 h-10 object-contain"
              />
              {current.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm pt-2">
              {current.description}. {(current.type === "chest" && !current?.purchased) && getMotivationalChestMessage(current.name)}
            </DialogDescription>
          </DialogHeader>

          {(current.type === "chest" && current.purchased) && (
            <div className="border rounded-lg p-4 mt-1 bg-muted">
              <h3 className="text-base font-semibold mb-1">📝 Task: {current.task.title}</h3>
              <p className="text-sm text-muted-foreground">{current.task.description}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm text-yellow-500 font-semibold">
              <Coins size={18} fill="yellow" color="black" />
              {current.requiredCoins === 0 ? 'FREE' : `${current.requiredCoins} RK`}
            </div>

            {!current?.purchased && <div className=" flex justify-end">
              <Button onClick={() => handlePurchase(current)}
                variant="outline"
                disabled={user.coins < current.requiredCoins}
                className={`gap-2 text-xs ${user.coins < current.requiredCoins && 'grayscale'}`}
              >
                {userLoading ? "Loading.." : <>
                  <CheckCircle size={12} color='green' />
                  {user.coins < current.requiredCoins
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

  );
};

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-4 py-10">
    <div className="flex-grow border-t border-yellow-600 dark:border-yellow-500"></div>
    <span className="dark:text-yellow-400 text-sm uppercase tracking-widest">{title}</span>
    <div className="flex-grow border-t border-yellow-600 dark:border-yellow-500"></div>
  </div>
);
const StatItem = ({ icon, label, value, character, theme }) => (
  <div className="relative max-w-[180px]">
    <div className="animated-border-box-glow"></div>
    <div className="animated-border-box flex items-center   gap-4 p-4 border rounded-lg shadow-inner ">
      <div className="rounded-full aspect-square  min-w-10 aspe flex items-center justify-center text-black" style={{ backgroundColor: character.color }}>
        {icon}
      </div>
      <div className="flex flex-col text-xs font-medium">
        <span className="text-xl">{value}</span> {label}
      </div>
    </div>
    <div className="flex invisible items-center gap-4 p-4 border rounded-lg shadow-inner ">
      <div className="rounded-full aspect-square min-w-10 flex items-center justify-center text-black" style={{ backgroundColor: character.color }}>
        {icon}
      </div>
      <div className="flex flex-col text-sm font-medium">
        <span className="text-xl">{value}</span> {label}
      </div>
    </div>
  </div>
);





export default Profile;
