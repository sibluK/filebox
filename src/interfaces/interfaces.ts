import { UserFile } from '../types/types';

export interface FileProps {
    file: UserFile;
    openEditModal: () => void;
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}

export interface FilesProps {
    files: UserFile[];
    loading: boolean;
    setFiles: React.Dispatch<React.SetStateAction<UserFile[]>>;
}

export interface useSingleFileProps {
    file_id: number | undefined;
}