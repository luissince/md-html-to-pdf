import { Margin } from "@/lib/definitions";
import { useEffect, useRef, useState } from "react";

interface IframePreviewProps {
    source: {
        type: 'md' | 'html' | 'url';
        content: string;
    };
    customSize: { width: number, height: number }
    margins: Margin
    backgroundColor: string,
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

const IframePreview: React.FC<IframePreviewProps> = ({ 
    source, 
    customSize, 
    margins, 
    backgroundColor,
    onLoad,
    onError
 }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!iframeRef.current) return;

        const iframe = iframeRef.current;
        
        // Función para establecer estilos y evento de carga
        const setupIframe = () => {
            if (iframe.contentWindow) {
                // Aplicar estilos al cuerpo del iframe
                try {
                    const iframeBody = iframe.contentDocument?.body;
                    if (iframeBody) {
                        iframeBody.style.margin = '0';
                        iframeBody.style.padding = '0';
                    }
                    
                    setLoading(false);
                    if (onLoad) onLoad();
                } catch (error) {
                    console.error("Error accessing iframe content:", error);
                    if (onError) onError(error instanceof Error ? error : new Error(String(error)));
                }
            }
        };

        // Manejar carga del iframe
        const handleLoad = () => {
            setupIframe();
        };

        iframe.addEventListener('load', handleLoad);

        if (source.type === 'html' || source.type === 'md') {
            // Cargar HTML directamente
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    doc.open();
                    doc.write(source.content);
                    doc.close();
                }
            } catch (error) {
                console.error("Error writing HTML to iframe:", error);
                if (onError) onError(error instanceof Error ? error : new Error(String(error)));
            }
        } else if (source.type === 'url') {
            // Cargar desde URL
            iframe.src = source.content;
        }

        return () => {
            iframe.removeEventListener('load', handleLoad);
        };
    }, [source, onLoad, onError]);

    return (
        <iframe
            ref={iframeRef}
            className="border "
            style={{
                width: `${customSize.width}mm`,
                height: customSize.height ? `${customSize.height}mm` : "auto",
                padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
                backgroundColor: backgroundColor,
            }}
            title="HTML Preview"
        />
    );
};

export default IframePreview;