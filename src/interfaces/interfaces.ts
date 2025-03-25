import { UserFile } from '../types/types';

export interface FileProps {
    file: UserFile;
}

export interface FilesProps {
    files: UserFile[];
    loading: boolean;
}