import { Button, Dialog, Flex } from "@radix-ui/themes";
import * as React from "react";
import ReactCrop, { centerCrop, type Crop, makeAspectCrop } from "react-image-crop";

interface Props {
    onClickFn: () => Promise<void>;
    previewImage: string;
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export const ImageCropper: React.FC<Props> = ({ onClickFn, previewImage }) => {
    const [crop, setCrop] = React.useState<Crop>();
    const onImageLoad = (e: Event) => {
        const { width, height } = e.currentTarget as HTMLImageElement;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>Edit profile</Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="450px">
                <Dialog.Title style={{ textAlign: "center" }}>Edit Photo</Dialog.Title>
                <Dialog.Description size="2" mb="4" style={{ textAlign: "center" }}>
                    Make changes to your profile image.
                </Dialog.Description>
                <Flex direction="column" gap="3">
                    <ReactCrop crop={crop} circularCrop keepSelection aspect={ASPECT_RATIO} minWidth={MIN_DIMENSION} onChange={(c) => setCrop(c)}>
                        <img src={previewImage} width="100%" onLoad={onImageLoad} />
                    </ReactCrop>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
