import { Margin } from "@/app/lib/definitions";
import { useEffect, useRef } from "react";

interface IframePreviewProps {
    dataHtml: string
    customSize: { width: number, height: number }
    margins: Margin
    backgroundColor: string
}

const IframePreview: React.FC<IframePreviewProps> = ({ dataHtml, customSize, margins, backgroundColor }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(dataHtml);
                doc.close();
            }
        }
    }, [dataHtml]);

    return (
        <iframe
            ref={iframeRef}
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