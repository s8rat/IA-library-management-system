export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    available: boolean;
    quantity: number;
    coverImage?: string; // Base64 string for the cover image
    coverImageContentType?: string; // MIME type for the cover image
    description?: string; // Book description, optional
}

export interface CreateBookDTO {
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    quantity: number;
    coverImageFile?: File; // File object for uploading the cover image
    description?: string; // Book description, optional
}