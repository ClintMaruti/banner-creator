// import { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import BannerImg from "../assets/banner.png";

// const Container = styled.div`
//     display: flex;
//     justify-content: center;
// `;

// export const Canvas = () => {
//     const canvasRef = useRef(null);
//     const fileInput = useRef<HTMLInputElement>(null);
//     const [imageUrl, setImageUrl] = useState<string | null>(null);
//     useEffect(() => {
//         const canvas = canvasRef.current as unknown as HTMLCanvasElement;
//         if (!canvas) return;

//         const context = canvas.getContext("2d");
//         if (!context) return;

//         const image = new Image();
//         image.src = BannerImg;
//         image.onload = () => {
//             const aspectRatio = image.width / image.height;
//             const canvasWidth = window.innerWidth;
//             const canvasHeight = canvasWidth / aspectRatio;
//             canvas.width = canvasWidth;
//             canvas.height = canvasHeight;
//             context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
//             const centerX = canvas.width / 2;
//             const centerY = Math.floor(canvas.height / 1.365);
//             const radius = centerX / 1.5;
//             context.beginPath();
//             context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
//             context.fillStyle = "blue";
//             context.fill();
//             if (imageUrl) {
//                 const imageAspectRatio = image.naturalWidth / image.naturalHeight;
//                 // Scale image to fit inside circle
//                 let imageWidth;
//                 let imageHeight;
//                 if (imageAspectRatio > 1) {
//                     // Wider image
//                     imageWidth = radius * 2;
//                     imageHeight = imageWidth / imageAspectRatio;
//                 } else {
//                     // Taller image
//                     imageHeight = radius * 2;
//                     imageWidth = imageHeight * imageAspectRatio;
//                 }
//                 const slctdImg = new Image();
//                 slctdImg.src = imageUrl as string;
//                 context.drawImage(slctdImg, centerX - imageWidth / 2, centerY - imageHeight / 2, imageWidth, imageHeight);
//             }
//         };
//     }, [imageUrl]);
//     const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = event.target.files as FileList;
//         setImageUrl(URL.createObjectURL(selectedFiles?.[0]));
//     };
//     return (
//         <Container>
//             <canvas ref={canvasRef} style={{ height: "100vh" }}></canvas>
//             <input type="file" ref={fileInput} onChange={handleImgChange} />
//         </Container>
//     );
// };

import { Box, Button, Container, Flex, Text, TextField } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import styled from "styled-components";
import Banner from "../assets/banner.png";

const ImageContainer = styled.div`
    position: relative;
    max-width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
`;

interface ImageBoxProps {
    previewImg: string;
}

const ImageBox = styled.div<ImageBoxProps>`
    position: absolute;
    top: calc(100% - 50.35%);
    left: calc(100% - 85%);
    z-index: 9999999;
    border-radius: 50%;
    background-color: #fff;
    background-image: url(${(props) => props.previewImg});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 70%;
    height: 47%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageBtn = styled.button`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #eae7e7;
    border: none;
    border-radius: 50%;
    padding: 1rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    &:hover {
        background: #5cbd95;
    }
`;

const StyledText = styled.p`
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    z-index: 9999999;
    font-size: 30px;
    font-weight: bold;
    @media (max-width: 768px) {
        bottom: -25px;
        font-size: 14px;
    }
`;

export function Canvas() {
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const fileInput = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState<string>("");
    const handleClick = () => {
        fileInput.current?.click();
    };
    const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files as FileList;
        setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
    };
    const downloadImage = async () => {
        setLoading(true);
        try {
            if (canvasRef) {
                const canvas = await html2canvas(canvasRef.current as HTMLElement, {
                    imageTimeout: 15000, //newline
                    scale: 3, //newline
                    useCORS: true,
                });
                const dataURL = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataURL;
                link.target = "_blank";
                link.download = "dunamis_crusade.png";
                link.click();
                setLoading(false);
                URL.revokeObjectURL(link.href);
                // document.getElementById("viewportMeta")?.setAttribute("content", vp);
            }
        } catch (error) {
            setLoading(false);
            throw console.error(error);
        }
    };
    return (
        <Flex direction="column" align="center" gap="2" style={{ padding: "1rem" }}>
            <Text align="center">
                Click the
                <span>
                    <strong> + sign on </strong>
                </span>
                the image to add your Image :)
            </Text>
            <Box style={{ background: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}>
                <Container>
                    <ImageContainer ref={canvasRef}>
                        <ImageBox previewImg={previewImage}>
                            {!previewImage && <ImageBtn onClick={handleClick}>+</ImageBtn>}
                            <input type="file" ref={fileInput} style={{ display: "none" }} onChange={handleImgChange} />
                        </ImageBox>
                        <StyledText>{name}</StyledText>
                        <img src={Banner} width="100%" />
                    </ImageContainer>
                </Container>
            </Box>
            <TextField.Root disabled={previewImage === ""} placeholder="Please Enter your name" type="text" value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}>
                <TextField.Slot></TextField.Slot>
            </TextField.Root>
            <Button style={{ cursor: "pointer" }} onClick={downloadImage} disabled={previewImage === ""}>
                <a>{isLoading ? "Downloading..." : "Download"}</a>
            </Button>
            <a href="https://github.com/" target="_blank">
                Github
            </a>
            {/* <ImageCropper previewImage={previewImage} onClickFn={downloadImage} /> */}
        </Flex>
    );
}
