import { User } from '@/models/user';
import { dbConnect } from '@/utils/dbConnect';


export async function GET(req) {
    await dbConnect();
    let users = await User.find().sort({ xp: -1 })   
    .limit(50)         
    .lean();    

    if (!users) {
        return Response.json({ message: 'No Users not found' }, { status: 404 });
    }

    return Response.json({ users }, { status: 201 });
}