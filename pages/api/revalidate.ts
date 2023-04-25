import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.query.secret !== process.env.NEXT_REVALIDATE_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (!req.query.path) {
        return res.status(401).json({ message: 'No revalidation path provided.' });
    }

    if (Array.isArray(req.query.path)) {
        return res.status(401).json({ message: 'Please provide one path at a time instead of arrays.' });
    }

    try {
        await res.revalidate(req.query.path);
        return res.json({
            revalidated: true
        });
    } catch (err) {
        return res.status(500).send('Error revalidating');
    }
}