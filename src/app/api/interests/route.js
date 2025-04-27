import { Interest } from '@/models/interest';
import { dbConnect } from '@/utils/dbConnect';


export async function GET(req) {
    await dbConnect();
    let interests = await Interest.find();
    if (!interests) {
        return Response.json({ message: 'Interests not found' }, { status: 404 });
    }

    return Response.json({ interests }, { status: 201 });
}
