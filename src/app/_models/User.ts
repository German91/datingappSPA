import { Photo } from './Photo';

export interface User {
    id: number;
    username: string;
    knowAs: string;
    age: number;
    gender: number;
    created: Date;
    lastActive: Date;
    city: string;
    country: string;
    photoUrl?: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
