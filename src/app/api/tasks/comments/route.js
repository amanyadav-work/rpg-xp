import { Comment } from '@/models/comment';
import { dbConnect } from '@/utils/dbConnect';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json({ message: 'Missing taskId' }, { status: 400 });
        }

        const comments = await Comment.find({
            taskId
        }).populate('from', 'name image _id username').sort({ createdAt: -1 });

        return Response.json({ comments }, { status: 201 });

    } catch (err) {
        console.error('[GET COMMENT ERROR]', err);
        return Response.json({ message: 'Failed to get comment' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { taskId, from, message } = await req.json();

        const comment = await Comment.create({
            taskId, from, message
        });

        return Response.json({ comment }, { status: 201 });

    } catch (err) {
        console.error('[ADD COMMENT ERROR]', err);
        return Response.json({ message: 'Failed to add comment' }, { status: 500 });
    }
}
