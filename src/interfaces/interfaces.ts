import { UserFile } from '../types/types';

export interface FileProps {
    file: UserFile;
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}

export interface FilesProps {
    files: UserFile[];
    loading: boolean;
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}