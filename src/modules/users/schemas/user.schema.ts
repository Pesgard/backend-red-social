import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    _id: Types.ObjectId; // 👈 Añade esto para evitar el 'unknown'


    @Prop({ required: true, trim: true })
    first_name: string;

    @Prop({ required: true, trim: true })
    last_name: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ trim: true })
    phone?: string;

    @Prop({ trim: true })
    address?: string;

    @Prop({ required: true, unique: true, trim: true })
    alias: string;

    @Prop({ default: 'https://cdn.redsocialapp.com/avatars/default.png' })
    avatar_url: string;

    @Prop({ default: true })
    is_active: boolean;

    // NestJS + Mongoose timestamps → por defecto: createdAt / updatedAt
    createdAt?: Date;
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Índices para búsquedas optimizadas
UserSchema.index({ email: 1 });
UserSchema.index({ alias: 1 });

// Virtual para obtener el nombre completo
UserSchema.virtual('full_name').get(function (this: User) {
    return `${this.first_name} ${this.last_name}`;
});

// ✅ Configurar toJSON para ocultar campos sensibles y dar formato limpio
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false, // elimina automáticamente __v
    transform: (_doc: UserDocument, ret: Record<string, any>) => {
        // Ocultar password si existe
        if ('password' in ret) delete ret.password;

        // Convertir _id a id (string)
        if ('_id' in ret) {
            ret.id = ret._id.toString();
            delete ret._id;
        }

        // Puedes mantener createdAt / updatedAt, o quitarlos si lo deseas:
        // delete ret.createdAt;
        // delete ret.updatedAt;

        return ret;
    },
});
