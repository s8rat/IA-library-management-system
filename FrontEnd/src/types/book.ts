export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    available: boolean;
    quantity: number;
    cover?: string;
    description?: string;
    rating?: number;
    genre?: string[];
    language?: string;
    pages?: number;
    publishYear?: number;
}

export interface CreateBookDTO {
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    quantity: number;
} 