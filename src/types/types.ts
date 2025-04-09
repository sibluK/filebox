export type UserFile = {
    id: number;
    user_id: string;
    url: string;
    s3_key: string;
    name: string;
    type: string;
    size: number;
    added_at: string;
    is_public?: boolean;
    downloads: bigint;
    tags: FileTag[];
}

export type FileTag = {
    id: number;
    file_id: number;
    tag_name: string;
}