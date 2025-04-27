import { userContext } from "@/context/userContext";
import { useFetch } from "@/lib/hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { LucideFlameKindling, MessageCircleMore, SendHorizonalIcon } from "lucide-react";
import { MoonLoader } from "react-spinners";
import { formatDistanceToNowStrict } from "date-fns";
import { formatDistanceShort } from "@/utils/helpers";
import Link from "next/link";

const Comments = ({ selectedTask, mxh}) => {
    const { user } = useContext(userContext)
    const [allComments, setAllComments] = useState([])
    const { loading: commentLoading, error: commentError, data: commentData, refetch: commentReFetch } = useFetch(`/api/tasks/comments?taskId=${selectedTask._id}`, {}, true, false);
    const [input, setInput] = useState('')

    console.log(commentData);

    useEffect(() => {
        if (commentData?.comments?.length > 0) {
            setAllComments([...commentData.comments])
        } else if (commentData?.comment) {

            setAllComments([...allComments, {
                ...commentData.comment,
                from: {
                    name: user.name,
                    username: user.username,
                    image: user.image,
                }
            }])
        }
    }, [commentData])



    const addComment = async (taskId) => {
        const result = await commentReFetch({
            method: "POST",
            body: JSON.stringify({ taskId, from: user._id, message: input }),
        });
        if (result.success) {
            setInput('')
            toast.success('Comment Added Successfully')
        } else {
            toast.error(result.message)
        }
    }
    return (
        <>
            {commentLoading ?
                <div className="h-full w-full flex items-center justify-center">
                    <MoonLoader size={20} color="gray" />
                </div>
                : commentError ?
                    <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                        <LucideFlameKindling color="grey" />
                        <p className="text-xs text-muted-foreground">
                            Something Went Wrong!
                        </p>
                    </div>
                    : <div className="h-full">
                        <div className="grid gap-1 text-xs ">
                            <Label htmlFor="comment">Join the discussion</Label>
                            <div className="flex items-center gap-2 border p-1.5 rounded-md shadow-md">
                                <img src={user?.image} alt="user's avatar" width={35} height={35} className="border-blue-700 hover:border-amber-500 p-[2px] rounded-full object-cover aspect-square " />
                                <input value={input} onChange={(e) => setInput(e.target.value)} id="comment" placeholder="Helping me a lot..." className='focus:outline-0 w-full hover:bg-none' autoComplete="off" />
                                <Button variant='outline' onClick={() => addComment(selectedTask._id)}><SendHorizonalIcon /></Button>
                            </div>
                            {/* {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>} */}
                        </div>
                        <div className='space-y-2 transition-[max-height] duration-300 ease-in-out overflow-y-auto' style={{ maxHeight: mxh || '420px' }}>
                            {allComments.length > 0 ? allComments.map(comment => {
                                return<div
                                key={comment._id}
                                className="rounded-md bg-muted/30 dark:bg-muted/10 p-3 my-3 shadow-sm"
                              >
                                <div className="flex items-center gap-3 border-b pb-2 mb-2">
                                  <Link  href={`/profile/${comment.from.username}`}><img
                                    src={comment.from.image}
                                    alt="user's avatar"
                                    width={35}
                                    height={35}
                                    className="rounded-full object-cover border p-[1.5px] border-blue-500 hover:border-amber-400 transition-colors aspect-square"
                                  /></Link>
                                  <div className="flex justify-between items-center w-full text-sm">
                                    <div>
                                      <Link className="font-semibold hover:underline" href={`/profile/${comment.from.username}`}>{comment.from.username}</Link>
                                      <p className="text-xs text-muted-foreground">{comment.from.name}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-right">
                                      {formatDistanceShort(new Date(comment.createdAt), { addSuffix: true })}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic pl-1">“{comment.message}”</p>
                              </div>
                              
                            })
                                : <div className='flex  min-h-[55vh] transition-[max-height] duration-300 ease-in-out flex-col gap-2 items-center justify-center align-middle h-full'  style={{ maxHeight: mxh || '420px' }}>
                                    <MessageCircleMore color="grey" />
                                    <p className="text-xs text-muted-foreground">
                                        Be the first one to comment
                                    </p>
                                </div>
                            }
                        </div>
                    </div>}
        </>
    )
}

export default Comments