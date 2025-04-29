'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { userContext } from "@/context/userContext";
import { useFetch } from "@/lib/hooks/useFetch";
import { getColorByCategory, getOrGenerateWeeklyGoal, getWeeklyProgress, updateWeeklyProgress } from "@/utils/helpers";
import { ArrowUpFromDotIcon, ArrowUpRightIcon, Coins, FlameIcon, Heart, Info, LucideFlameKindling, LucideShare2, Megaphone, PartyPopper, UsersRound } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";
import Comments from "@/components/comments";
import { CircularProgressBar } from "@/components/CircularProgressBar";
import { ShareTaskForm } from "@/components/shareform";
import Link from "next/link";



const Tasks = () => {
    const { user, setUser } = useContext(userContext)
    const [selectedTask, setSelectedTask] = useState(null)
    const [isSharing, setIsSharing] = useState(null)
    const { loading: userLoading, refetch: userRefetch } = useFetch('/api/users', {}, false, true);
    const { loading: shareLoading, error: shareError, data: sharedTasks, refetch: sharedRefetch } = useFetch(`/api/tasks/share?userId=${user?._id}`, {}, true, true);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [isLiked, setIsLiked] = useState([])
    const { loading: taskLoading, error: taskError, data } = useFetch('/api/tasks', { method: "POST", body: JSON.stringify(user?.assignedTasks) }, user?.assignedTasks ? true : false, user?.assignedTasks ? true : false);
    const tasks = data?.tasks || [];
    const { loading: likeLoading, error: likeError, data: likeData, refetch: likeReFetch } = useFetch('/api/tasks/likes', {}, false, false);
    const [weeklyGoal, setWeeklyGoal] = useState({ xpGoal: 0, coinsGoal: 0 });
    const [weeklyProgress, setWeeklyProgress] = useState({ xp: 0, coins: 0 });
    const [isSharedTask, setIsSharedTask] = useState(null)


    useEffect(() => {
        const savedLikes = JSON.parse(localStorage.getItem("likedTasks")) || [];
        setIsLiked(savedLikes);
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            const goal = getOrGenerateWeeklyGoal(tasks);
            setWeeklyGoal(goal);
        }
    }, [tasks]);

    useEffect(() => {
        const progress = getWeeklyProgress();
        setWeeklyProgress(progress);
    }, [user]);

    const handleXpandCoins = async (addXp, addCoins) => {
        if (addXp === 0 && addCoins === 0) {
            return; // No operation if both are 0
        }
    
        let newUserData = {
            ...user,
            xp: user.xp + addXp,  // Adjust XP correctly, not using user.coins
            coins: user.coins + addCoins,
        };
    
        const result = await userRefetch({
            method: "PUT",
            body: JSON.stringify(newUserData),
        });
    
        if (result.success) {
            setUser({...result.data.user});
        } else {
            toast.error(result.message || "Failed to add resources.");
        }
    };
    
    const handleCompletedTask = async (item) => {
        // Step 1: Update assignedTasks
        const updatedTasks = user.assignedTasks.map(task => {
            if (task.taskId === item._id) {
                return { ...task, completed: true };
            }
            return task;
        });

        // Step 2: Build updated user data
        const newUserData = {
            ...user,
            coins: user.coins + item.coins,
            xp: user.xp + item.xp,
            assignedTasks: updatedTasks, // ✅ updated tasks
        };

        // Step 3: Send the update
        const result = await userRefetch({
            method: "PUT",
            body: JSON.stringify(newUserData),
        });

        // Step 4: Handle the result
        if (result.success) {
            setUser(result.data.user);
            updateWeeklyProgress(item.xp, item.coins);
            const taskToUpdate = tasks.find(task => task._id === item._id);
            if (taskToUpdate) {
                taskToUpdate.completed = true;
            }
            toast.success(`Hooray! ${item.title} completed!`);
        } else {
            toast.error(result.message || "Something went wrong!");
        }
    };

    const handleLike = async (id) => {
        let type = "addLike";
        if (isLiked.includes(id)) {
            type = "removeLike"
        };
        const result = await likeReFetch({
            method: "POST",
            body: JSON.stringify({ taskId: id, type }),
        });

        if (result.success) {
            if (type === "addLike") {

                const updatedLikes = [...isLiked, id];
                setIsLiked(updatedLikes);
                localStorage.setItem("likedTasks", JSON.stringify(updatedLikes));
            } else {


                const updatedLikes = [...isLiked].filter(i => i !== id)
                setIsLiked(updatedLikes);
                localStorage.setItem("likedTasks", JSON.stringify(updatedLikes));
            }
        } else {
            toast.error(result.message)
        }
    }


    return (
        <div className='container max-w-[1400px] mx-auto sm:px-6 lg:px-8 pb-20'>
            <section className='mt-10'>
                <h2 className='text-2xl font-semibold mb-2'>
                    Your This Week&apos;s Tasks
                </h2>
                <hr className='border-muted-foreground/40 mb-6' />
                <div className="flex relative gap-4">
                    <Dialog onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setSelectedTask(null); setIsSharing(null); setIsSharedTask(null)
                        }
                    }}>
                        <div className="w-[73%]">
                            <div className='grid grid-cols-3 gap-4'>
                                {taskLoading ?
                                    <div className="h-[90vh]  col-span-3 w-full flex items-center justify-center">
                                        <MoonLoader size={20} color="gray" />
                                    </div>
                                    : taskError ?
                                        <div className="flex col-span-3 flex-col gap-2 items-center justify-center align-middle h-full">
                                            <LucideFlameKindling color="grey" />
                                            <p className="text-xs text-muted-foreground">
                                                Something Went Wrong!
                                            </p>
                                        </div>
                                        : (tasks?.length > 0 &&
                                            tasks.map((task, index) => (
                                                <Card className={`gap-3.5 justify-between ${getColorByCategory()} dark:bg-[#1a1a1a] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`} key={task._id}>
                                                    <CardHeader>
                                                        <div className="flex justify-between items-center mb-3.5">
                                                            <div className="text-xs dark:bg-muted/20 dark:text-yellow-300 bg-yellow-500/50 text-yellow-900 font-semibold py-1.5 px-4 border rounded-full w-fit">{task.difficulty}</div>
                                                            <div className="text-xs flex items-center gap-2">
                                                                <div className="flex items-center gap-1  rounded-sm text-xs">
                                                                    <Coins size={20} fill="yellow" color="black" />{task.coins} RK
                                                                </div>
                                                                <div className="flex items-center gap-1  rounded-sm text-xs">
                                                                    <FlameIcon size={13} fill="red" color="black" />{task.xp} XP
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <CardTitle>{task.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm">{task.shortDescription}</p>
                                                    </CardContent>
                                                    <CardFooter className='flex justify-between items-center'>
                                                        <DialogTrigger asChild>
                                                            <Button onClick={() => { setSelectedTask(task); setIsSharing(false) }} variant='outline' className='text-xs p-2'>See Details <ArrowUpFromDotIcon className="w-[5px] rotate-90" /></Button>
                                                        </DialogTrigger>
                                                        <div className="w-fit space-x-2.5 text-xs flex items-center">
                                                            <Button variant='none' className={`has-[>svg]:px-0 p-0 ${likeLoading && "pointer-events-none"} text-xs items-center`} onClick={() => handleLike(task._id)}>{isLiked.indexOf(task._id) !== -1 ? task.likes + 1 : task.likes}<Heart fill={isLiked.indexOf(task._id) !== -1 ? "red" : ''} stroke={isLiked.indexOf(task._id) !== -1 ? "rose" : 'white'} /></Button>
                                                            <DialogTrigger asChild>
                                                                <Button onClick={() => { setSelectedTask(task); setIsSharing(true) }} variant='none' className='has-[>svg]:px-0 p-0'><LucideShare2 size={12} /></Button>
                                                            </DialogTrigger>
                                                        </div>
                                                    </CardFooter>
                                                </Card>

                                            )))
                                }

                            </div>
                            <div className="flex items-center gap-4 py-18">
                                <div className="flex-grow border-t border-gray-500"></div>
                                <span className="text text-sm uppercase">                                Tasks Shared With You
                                </span>
                                <div className="flex-grow border-t border-gray-500"></div>
                            </div>

                            {sharedTasks?.tasks?.length > 0 ? sharedTasks && (
                                <div className='grid grid-cols-3 gap-4'>
                                    {shareLoading ? (
                                        <div className="h-[90vh] col-span-3 w-full flex items-center justify-center">
                                            <MoonLoader size={20} color="gray" />
                                        </div>
                                    ) : shareError ? (
                                        <div className="flex col-span-3 flex-col gap-2 items-center justify-center align-middle h-full">
                                            <LucideFlameKindling color="grey" />
                                            <p className="text-xs text-muted-foreground">Something went wrong!</p>
                                        </div>
                                    ) : (
                                        sharedTasks?.tasks?.length > 0 &&
                                        sharedTasks.tasks.map((task, index) => (
                                            <Card
                                                className={`gap-3.5 justify-between ${getColorByCategory()} dark:bg-[#1a1a1a] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`}
                                                key={task._id}
                                            >
                                                <CardHeader>
                                                    <div className="flex justify-between items-center mb-3.5">
                                                        <div className="text-xs dark:bg-muted/20 dark:text-yellow-300 bg-yellow-500/50 text-yellow-900 font-semibold py-1.5 px-4 border rounded-full w-fit">
                                                            {task.difficulty}
                                                        </div>
                                                        <div className="flex items-center gap-1 -space-x-2.5">
                                                            {[...task.from].slice(0, 2).map((i, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={i.image}
                                                                    alt={i.username}
                                                                    className="w-6 h-6 rounded-full object-cover border border-muted"
                                                                />
                                                            ))}
                                                            {task.from.length > 2 && (
                                                                <div className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center text-muted-foreground border border-muted">
                                                                    +{task.from.length - 2}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <CardTitle>{task.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm">{task.shortDescription}</p>
                                                </CardContent>
                                                <CardFooter className="flex justify-between items-center">
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedTask(task);
                                                                setIsSharing(false);
                                                                setIsSharedTask(true)
                                                            }}
                                                            variant="outline"
                                                            className="text-xs p-2"
                                                        >
                                                            See Details <ArrowUpFromDotIcon className="w-[5px] rotate-90" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <div className="w-fit space-x-2.5 text-xs flex items-center">
                                                        <Button
                                                            variant="none"
                                                            className={`has-[>svg]:px-0 p-0 ${likeLoading && "pointer-events-none"} text-xs items-center`}
                                                            onClick={() => handleLike(task.id)}
                                                        >
                                                            {isLiked.indexOf(task.id) !== -1 ? task.likes + 1 : task.likes}
                                                            <Heart
                                                                fill={isLiked.indexOf(task.id) !== -1 ? "red" : ""}
                                                                stroke={isLiked.indexOf(task.id) !== -1 ? "rose" : "white"}
                                                            />
                                                        </Button>

                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 items-center justify-center align-middle col-span-full text-center text-sm text-muted-foreground min-h-[35vh]">
                                    <UsersRound color="grey" />
                                    <p className="text-xs text-muted-foreground">
                                        No shared quests from your friends... yet 👀
                                    </p>
                                </div>

                            )}

                        </div>

                        {selectedTask &&
                            (
                                isSharing ?
                                    <DialogContent onCloseAutoFocus={(e) => e.preventDefault()} className='  '>
                                            <DialogHeader>
                                                <div className=" mb-4 h-[200px] rounded-md  top-0 bottom-0 left-0 right-0 w-full max-h-64 bg-cover flex items-center justify-center " style={{
                                                    backgroundImage: 'url(https://img.freepik.com/free-photo/anime-style-character-meditating-contemplating-mindfulness_23-2151476704.jpg)'
                                                }}>
                                                    <div className="flex bg-background px-3 py-1 rounded-sm items-center justify-between">
                                                        <DialogTitle className="text-lg font-semibold ">
                                                            {selectedTask.title}
                                                        </DialogTitle>
                                                    </div>
                                                </div>
                                            </DialogHeader>
                                            <ShareTaskForm taskId={selectedTask._id} from={user._id} senderEmail={user.email} />

                                    </DialogContent>
                                    : (
                                        <DialogContent onCloseAutoFocus={(e) => e.preventDefault()} className='items-center  grid grid-cols-2 gap-8 w-[700px] min-w-[70%]'>
                                            <div>
                                                <DialogHeader>
                                                    <div className="relative mb-4">
                                                        <img
                                                            src="https://img.freepik.com/free-photo/anime-style-character-meditating-contemplating-mindfulness_23-2151476704.jpg"
                                                            className={`rounded-md w-full max-h-64 object-cover ${selectedTask.completed && "grayscale"}`}
                                                            alt="Task visual"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <DialogTitle className="text-2xl font-semibold">
                                                            {selectedTask.title}
                                                        </DialogTitle>
                                                        {!isSharedTask && <div className="text-xs flex items-center gap-2">
                                                            <div className="flex items-center gap-1  rounded-sm text-xs">
                                                                <Coins size={20} fill="yellow" color="black" />{selectedTask.coins} RK
                                                            </div>
                                                            <div className="flex items-center gap-1  rounded-sm text-xs">
                                                                <FlameIcon size={13} fill="red" color="black" />{selectedTask.xp} XP
                                                            </div>
                                                        </div>}
                                                    </div>
                                                    <DialogDescription className="text-muted-foreground mt-1">
                                                        {selectedTask.longDescription}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid grid-cols-4 gap-4 border-y py-3 my-3 text-sm text-muted-foreground ">
                                                    <div>
                                                        <p className="font-medium text-foreground">Category</p>
                                                        <p>{selectedTask.category}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">Difficulty</p>
                                                        <p>{selectedTask.difficulty}</p>
                                                    </div>
                                                    {!isSharedTask && <div>
                                                        <p className="font-medium text-foreground">Completed</p>
                                                        <p className={`${selectedTask.completed && 'text-green-500'}`}>{selectedTask.completed ? "Yes" : "Nope"}</p>
                                                    </div>}
                                                    <div>
                                                        <p className="font-medium text-foreground">See More</p>
                                                        <a target="_blank" href={`https://www.google.com/search?q=${selectedTask.title}`} variant='link' className='p-0 hover:border-b transition-all duration-100 pb-0.5 border-foreground' >Google it <ArrowUpRightIcon className="inline size-3.5" /></a>
                                                    </div>
                                                </div>
                                                {!isSharedTask && <Button className='w-full' onClick={() => handleCompletedTask(selectedTask)} disabled={userLoading || selectedTask.completed}>
                                                    {userLoading ? <MoonLoader size={12} /> :
                                                        (selectedTask.completed ?
                                                            <>
                                                                Congrats you did it, Awesome
                                                                <PartyPopper />
                                                            </>
                                                            : "Mark As Complete")
                                                    }
                                                </Button>}
                                            </div>
                                            <div className="space-y-2.5 h-full">

                                                <Accordion value={accordionOpen ? "challenger" : ""}
                                                    onValueChange={(value) => setAccordionOpen(value === "challenger")} type="single" collapsible className="space-y-2.5 mb-4">
                                                    {isSharedTask && (
                                                        <AccordionItem value="challenger">
                                                            <AccordionTrigger className='border bg-muted/25 p-3 '>
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="text-sm font-medium">Your Challengers</span>
                                                                    <div className="flex items-center gap-1 -space-x-2.5">
                                                                        {[...selectedTask.from].slice(0, 4).map((i, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={i.image}
                                                                                alt={i.username}
                                                                                className="w-6 h-6 rounded-full object-cover border border-muted"
                                                                            />
                                                                        ))}
                                                                        {selectedTask.from.length > 4 && (
                                                                            <div className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center text-muted-foreground border border-muted">
                                                                                +{selectedTask.from.length - 4}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className=" max-h-[25vh] overflow-y-auto" >
                                                                    {selectedTask.from.map((i, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="relative border my-2 items-center justify-between flex p-2 border-border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
                                                                        >
                                                                            <div className="flex w-full items-center gap-4">
                                                                                <img
                                                                                    src={i.image}
                                                                                    alt={i.username}
                                                                                    className="w-10 h-10 rounded-full object-cover border border-muted"
                                                                                />
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-medium text-sm">{i.name}</span>
                                                                                    <span className="text-xs text-muted-foreground">@{i.username}</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="w-full">
                                                                                <p className="text-xs text-muted-foreground italic">“{i.message}”</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>


                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    )}
                                                </Accordion>
                                                <Comments selectedTask={selectedTask} mxh={accordionOpen ? '20vh' : isSharedTask ? '45vh' : '55vh'} />

                                            </div>
                                        </DialogContent>)
                            )}
                    </Dialog>

                    <div className="w-[27%] h-fit sticky top-20 space-y-4">
                        <div className="flex items-center gap-3 bg-background border p-3 px-4 rounded-lg w-full max-w-md">
                            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                                <Megaphone size={20} />
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold">Boost your XP & Coins ⚡</p>
                                <p className="text-xs text-muted-foreground">Share tasks instantly, earn rewards effortlessly. Challenge, share, collect.</p>

                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 shadow-md border rounded-xl">
                            <h2 className='text-xs text-muted-foreground font-semibold mb-4'>
                                Weekly Goals
                            </h2>
                            {!taskLoading ? <div className="flex items-center justify-center gap-4 mb-4">

                                <CircularProgressBar
                                    progress={weeklyProgress.xp}
                                    label={`${weeklyProgress.xp} / ${weeklyGoal.xpGoal} XP`}
                                    max={weeklyGoal.xpGoal}
                                    progressColor='red'
                                    claimed={weeklyProgress.claimed?.xp}
                                    fn={() => {handleXpandCoins(200,0);
                                        updateWeeklyProgress(200, 0, "xp");   
                                    }}
                                    targetId="xp-target"

                                >

                                    <FlameIcon size={45}     fill={weeklyProgress.claimed?.xp ? "gray" : "red"} color="black" className=" drop-shadow-flame" />
                                </CircularProgressBar>

                                <CircularProgressBar
                                    progress={weeklyProgress.coins}
                                    label={`${weeklyProgress.coins} / ${weeklyGoal.coinsGoal} RK`}
                                    max={weeklyGoal.coinsGoal}
                                    claimed={weeklyProgress.claimed?.coins}
                                    progressColor='gold'
                                    fn={() => {handleXpandCoins(0,200)
                                        updateWeeklyProgress(0, 200, "coins");   
                                    }}
                                      targetId="coin-target"
                                >
                                    <Coins size={40} fill={weeklyProgress.claimed?.coins ? "gray" : "gold"} color="black" className="drop-shadow-coin " />
                                </CircularProgressBar>
                            </div> :
                                <div className="h-[10vh]  col-span-3 w-full flex items-center justify-center">
                                    <MoonLoader size={20} color="gray" />
                                </div>
                            }
                        </div>
                        {sharedTasks?.tasks?.length > 0 && (
                            <div className="bg-muted/10 p-4 shadow-md border rounded-xl">
                                <h2 className="text-xs text-muted-foreground font-semibold mb-4">
                                    Your Besties
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {
                                        (() => {
                                            const userMap = new Map();

                                            sharedTasks.tasks.forEach((task) => {
                                                task.from.forEach((user) => {
                                                    if (userMap.has(user._id)) {
                                                        userMap.get(user._id).count += 1;
                                                    } else {
                                                        userMap.set(user._id, { ...user, count: 1 });
                                                    }
                                                });
                                            });

                                            const users = Array.from(userMap.values());

                                            return users.map((user, idx) => (
                                                <div
                                                    key={user._id}
                                                    className="flex flex-col items-center justify-center text-center p-4 rounded-lg hover:bg-muted/50 transition-all"
                                                >
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-2">
                                                        <img
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <Link href={`/profile/${user.username}`} className="text-xs hover:underline font-semibold text-muted-foreground mb-1">
                                                        @{user.username}
                                                    </Link>
                                                    <div className="text-sm font-medium">
                                                        {user.name}
                                                    </div>
                                                    <div className="mt-2 text-xs text-yellow-500">
                                                        Shared {user.count} task{user.count > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            ));
                                        })() // ← invoke the function!
                                    }
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section >



        </div >
    );
};






export default Tasks