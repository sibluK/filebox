import { useState, useEffect } from 'react';

interface LightboxContent {
    url: string;
    type: string;
}

export default function Lightbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<LightboxContent>({ url: '', type: '' });

    useEffect(() => {
        function handleClick(e: Event) {
            const element = e.target as HTMLElement;
            if (element.classList.contains('lightbox-trigger')) {
                const url = element.getAttribute('data-url') || '';
                const type = element.getAttribute('data-type') || '';
                setContent({ url, type });
                setIsOpen(true);
            }
        }

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    function handleClose() {
        setIsOpen(false);
        setContent({ url: '', type: '' });
    }

    function handleBackgroundClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }

    function renderContent() {
        const fileType = content.type.split('/')[0];

        switch (fileType) {
            case 'image':
                return (
                    <img 
                        src={content.url} 
                        alt="Preview" 
                        className="lightbox-content"
                    />
                );
            case 'video':
                return (
                    <video className="lightbox-content" controls>
                        <source src={content.url} type={content.type} />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'text':
                return (
                    <iframe 
                        src={content.url} 
                        className="lightbox-content lightbox-text"
                        title="Text preview"
                    />
                );
            case 'application':
                if (content.type === 'application/pdf') {
                    return (
                        <iframe 
                            src={content.url} 
                            className="lightbox-content lightbox-pdf"
                            title="PDF preview"
                        />
                    );
                }
                return <div className="lightbox-unsupported">Unsupported file type</div>;
            default:
                return <div className="lightbox-unsupported">Unsupported file type</div>;
        }
    }

    if (!isOpen) return null;

    return (
        <div 
            className="lightbox" 
            style={{ display: isOpen ? 'flex' : 'none' }}
            onClick={handleBackgroundClick}
        >
            <span className="close" onClick={handleClose}>&times;</span>
            {renderContent()}
        </div>
    );
}