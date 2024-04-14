import React, { useEffect, useRef } from "react";

interface Props {
    htmlContent: string;
}
export const Potrait: React.FC<Props> = ({ htmlContent }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to fit the content
        canvas.width = 500; // Set width as needed
        canvas.height = 500; // Set height as needed

        // Draw HTML content onto the canvas
        // const htmlContent = `
        //     <div>
        //         <img src="/assets/circle.png" alt="circle" />
        //         <img src="/assets/square.png" alt="square" />
        //     </div>
        // `;
        const data = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' + '<foreignObject width="100%" height="100%">' + htmlContent + "</foreignObject>" + "</svg>");

        const img = new Image();
        img.onload = function () {
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);
            // Convert canvas to an image file
            const dataURL = canvas.toDataURL("image/png");

            // Download the image file
            const link = document.createElement("a");
            link.download = "portrait.png";
            link.href = dataURL;
            link.click();
        };
        img.src = data;
    }, []);

    return <canvas ref={canvasRef}></canvas>;
};
