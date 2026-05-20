import { Router, Request, Response } from 'express';
import Tag from '../models/Tag';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create tag' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

export default router;