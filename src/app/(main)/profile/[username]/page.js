'use client';
import { useFetch } from "@/lib/hooks/useFetch";
import { notFound, useRouter } from "next/navigation";
import {
    FlameIcon, Coins, Medal, BadgeCheck, Swords, Users, GhostIcon,
    LucideFlameKindling
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCharacterData, getRankSymbol } from "@/utils/helpers";
import { MoonLoader } from "react-spinners";
import { useContext, useEffect } from "react";
import { userContext } from "@/context/userContext";

export default function ProfilePage({ params }) {

    const { user: thisUser } = useContext(userContext)
    const { username } = params;
    const { loading, error, data } = useFetch(`/api/users/user?username=${username}`, {}, true, true);
    const user = data?.specificUser || {};

    const collectibles = user.collectibles?.filter(item => item.type === "common") || [];
    const chests = user.collectibles?.filter(item => item.type === "chest") || [];
    const character = getCharacterData(2999);

    const router = useRouter();  // Initialize useRouter for redirection

    // Check if the logged-in user is trying to view their own profile
    useEffect(() => {
        if (thisUser.username === user.username) {
            router.push('/profile');  // Redirect to /profile if usernames match
        }
    }, [thisUser.username, user.username, router]);  // Re-run if the usernames change

    return (
        <div className="container max-w-[1400px] mx-auto sm:px-6 lg:px-8 my-10">
            {loading ?
                <div className="h-[90vh] w-full flex items-center justify-center">
                    <MoonLoader size={20} color="gray" />
                </div>
                : error ?
                    <div className="flex flex-col gap-2 items-center justify-center align-middle h-[90vh]">
                        <LucideFlameKindling color="grey" />
                        <p className="text-xs text-muted-foreground">
                            Something Went Wrong!
                        </p>
                    </div>
                    : <div className="flex flex-col lg:flex-row gap-6  ">
                        {/* Left: Card (50%) */}
                        <div className="flex items-center  lg:w-1/2 bg-background border rounded-xl  shadow-xl p-6">
                            <div className="w-full  flex flex-col items-center text-center">
                                <div className="relative">
                                    <img
                                        src={character.img}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-10 h-10 absolute bottom-0 right-0 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                </div>
                                <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
                                <p className="text-sm text-muted-foreground">@{user.username}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-sm">
                                    <Stat icon={<FlameIcon className="text-red-500" size={18} />} label="XP" value={user.xp} />
                                    <Stat icon={<Coins className="text-yellow-500" size={18} />} label="Coins" value={user.coins} />
                                    <Stat icon={<Medal className="text-purple-500" size={18} />} label="Global Rank" value={`#${user.globalRank}`} />
                                    <Stat icon={<BadgeCheck className="text-green-500" size={18} />} label="Rank" value={getRankSymbol(user.xp)} />
                                    <Stat icon={<Swords className="text-blue-500" size={18} />} label="Tasks" value={user.assignedTasks?.length || 0} />
                                    <Stat icon={<Users className="text-pink-500" size={18} />} label="Collectibles" value={user.collectibles?.length || 0} />
                                </div>

                                {/* Interests */}
                                {user.interests?.length > 0 && (
                                    <div className="mt-6 w-full">
                                        <h3 className="text-md font-semibold mb-2">Interests</h3>
                                        <div className="flex flex-wrap gap-4 justify-center">
                                            {user.interests.map((interest, idx) => (
                                                <TooltipProvider key={idx}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex flex-col items-center w-24 cursor-pointer hover:scale-105 transition-transform">
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
                            </div>
                        </div>

                        {/* Right: Collectibles + Chests (50%) */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
                            {/* Collectibles */}
                            <div className="bg-background rounded-xl border p-6 shadow">
                                <h3 className="text-lg font-semibold mb-4">Collectibles</h3>
                                {collectibles.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {collectibles.map((item, index) => (
                                            <CollectibleCard key={index} item={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyMessage message="No collectibles found." />
                                )}
                            </div>

                            {/* Chests */}
                            <div className="bg-background rounded-xl border p-6 shadow">
                                <h3 className="text-lg font-semibold mb-4">Chests</h3>
                                {chests.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {chests.map((item, index) => (
                                            <CollectibleCard key={index} item={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyMessage message="No chests found." />
                                )}
                            </div>
                        </div>
                    </div>}
        </div>
    );
}

// ---------------------- Reusable Components ----------------------

const Stat = ({ icon, label, value }) => (
    <div className="flex items-center justify-start gap-2">
        {icon}
        <span>{label}: <b>{value}</b></span>
    </div>
);

const CollectibleCard = ({ item }) => (
    <div className="border p-4 rounded-lg bg-muted/20 text-center shadow-sm">
        <img
            src={'/download.png'}
            alt={item.name}
            className="w-20 h-20 object-contain mx-auto mb-2"
        />
        <h4 className="text-sm font-semibold">{item.name}</h4>
        <p className="text-xs text-muted-foreground">{item.description}</p>
    </div>
);

const EmptyMessage = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-sm text-muted-foreground mt-4">
        <GhostIcon size={24} />
        <p>{message}</p>
    </div>
);
