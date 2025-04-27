import { Task } from '@/models/task';
import { dbConnect } from '@/utils/dbConnect';

export async function POST(req) {
    try {
        await dbConnect();

        const { taskId, type } = await req.json();

        if (type === "addLike") {
            await Task.findByIdAndUpdate(taskId, {
                $inc: { likes: 1 }
            });
        } else {
            await Task.findByIdAndUpdate(taskId, {
                $inc: { likes: -1 }
            });
        }

        return Response.json({ success: true }, { status: 201 });

    } catch (err) {
        console.error('[ADD LIKE TO TASK ERROR]', err);
        return Response.json({ message: 'Failed to add like' }, { status: 500 });
    }
}
