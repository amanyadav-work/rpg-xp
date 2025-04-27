'use client';

import { Button } from "@/components/ui/button";
import { userContext } from "@/context/userContext";
import { useFetch } from "@/lib/hooks/useFetch";
import { HeartPulseIcon, LucideFlameKindling } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";

const OnBoarding = () => {
    const { user, setUser } = useContext(userContext)
    const [selectedInterests, setSelectedInterests] = useState([])
    const { loading, error, data } = useFetch('/api/interests', {}, true);
    let interests = data?.interests || [];
    const {loading:userLoading, refetch: userRefetch } = useFetch('/api/users', {}, false, true);
    const router = useRouter();

    const setInterests = async () => {
        let newUserData = user;
        newUserData.interests = [...selectedInterests];

        const result = await userRefetch({
            method: "PUT",
            body: JSON.stringify(newUserData),
        })
        if (result.success) {
            setUser(result.data.user);
            router.push('/dashboard');
        } else {
            toast.error(result.message)
        }
    }

    const handleSelected = (id) => {
        if (!selectedInterests.includes(id))
            setSelectedInterests([...selectedInterests, id])
        else {
            setSelectedInterests(selectedInterests.filter(i => id !== i))
        }
    }


    return (
        <div className="container max-w-[1200px] mx-auto sm:px-6 lg:px-8 pb-20">
            <h2 className="text-3xl font-bold mb-6 text-center py-10"></h2>
            <div className="flex items-center gap-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm uppercase">Choose Your Interests</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            {loading ?
                <div className="h-[90vh] w-full flex items-center justify-center">
                    <MoonLoader size={20} color="gray" />
                </div>
                : <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {interests.length > 0 && interests.map((interest, index) => (
                            <div key={index}
                                className="flex mt-20"
                                onClick={() => handleSelected(interest._id)}
                            >
                                <div className={`rounded-lg bg-muted   transition-transform transform hover:scale-105 hover:shadow-lg hover:-rotate-2 hover:border-muted-foreground border cursor-pointer ${selectedInterests.includes(interest._id)
                                    ? 'bg-gradient-to-b from-transparent via-rose-100 to-rose-50 dark:via-rose-900 dark:to-rose-950 border-rose-500'
                                    : 'bg-muted border-transparent'
                                    }`}>

                                    {/* <HeartPulseIcon size={120} strokeWidth={1.3} className="-mt-14  w-full" /> */}
                                    <img
                                        src={"https://png.pngtree.com/png-clipart/20220806/ourmid/pngtree-cartoon-cowboy-hat-png-image_6101832.png"}
                                        alt={interest.name}
                                        className="w-full h-fit aspect-square object-contain -mt-30"
                                    />
                                    <div className="p-4 -mt-13">
                                        <h3 className="text-lg font-semibold">{interest.name}</h3>
                                        <p className="text-muted-foreground text-sm">{interest.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button className='w-full my-10' onClick={setInterests} disabled={loading || selectedInterests.length === 0 || userLoading}>
                        {userLoading ? <MoonLoader size={12} /> : "Save Interests"}</Button>
                </>
            }
            {error && (
                <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                    <LucideFlameKindling color="grey" />
                    <p className="text-xs text-muted-foreground">
                        Something Went Wrong!
                    </p>
                </div>

            )}
        </div>
    );
};

export default OnBoarding;