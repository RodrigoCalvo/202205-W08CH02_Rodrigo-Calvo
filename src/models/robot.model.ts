import mongoose from 'mongoose';
import { mongoooseConnect, RelationField } from '../db/mongoose.js';

export interface iRobot {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    image: string;
    speed: number;
    life: number;
    born: string;
    users: Array<RelationField>;
}

const robotSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    image: String,
    speed: { type: Number, min: 0, max: 10 },
    life: { type: Number, min: 0, max: 10 },
    born: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

robotSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});

export const Robot = mongoose.model('Robot', robotSchema);

await mongoooseConnect();
