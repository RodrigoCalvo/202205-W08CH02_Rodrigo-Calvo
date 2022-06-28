import mongoose from 'mongoose';
import { mongoooseConnect, RelationField } from '../db/mongoose.js';

export interface iUser {
    id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    robots: Array<RelationField>;
}

const userSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    email: String,
    pwd: { type: mongoose.SchemaTypes.String, required: true },
    robot: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.pwd;
    },
});

export const User = mongoose.model('User', userSchema);

(async () => {
    await mongoooseConnect();
})();
