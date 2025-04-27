import { Collectible } from '@/models/collectible';
import { dbConnect } from '@/utils/dbConnect';


export async function GET(req) {
    await dbConnect();
    let collectible = await Collectible.find();
    if (!collectible) {
        return Response.json({ message: 'Collectibles not found' }, { status: 404 });
    }

    return Response.json({ collectible }, { status: 201 });
}
