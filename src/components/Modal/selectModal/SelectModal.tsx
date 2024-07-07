import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './selectModal.module.css';
import Modal from '../Modal';
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
import jsQR from 'jsqr';

interface SelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (image: string) => void;
    onQrCodeDetected: (data: string) => void;
}

const SelectModal: React.FC<SelectModalProps> = ({ isOpen, onClose, onImageSelect, onQrCodeDetected }) => {
    const { t } = useTranslation(['pay']);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [imageSource, setImageSource] = useState<'camera' | 'gallery' | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const resetState = useCallback(() => {
        setIsCameraOpen(false);
        setIsImageSelected(false);
        setSelectedImage(null);
        setImageSource(null);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            resetState();
            if (videoRef.current) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        }
    }, [isOpen, resetState]);

    useEffect(() => {
        const startCamera = async () => {
            if (isCameraOpen && videoRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                } catch (error) {
                    console.error("Error accessing camera: ", error);
                }
            }
        };

        if (isCameraOpen) {
            startCamera();
        }

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, [isCameraOpen]);

    const detectQRCode = useCallback((imageData: ImageData) => {
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
            console.log("QR Code detected: ", qrCode.data);
            onQrCodeDetected(qrCode.data);
        } else {
            console.log("No QR Code detected");
        }
    }, []);

    const takePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const imageUrl = canvasRef.current.toDataURL('image/png');
                setSelectedImage(imageUrl);

                const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                detectQRCode(imageData);

                setIsCameraOpen(false);
                setIsImageSelected(true);
                setImageSource("camera");
            }
        }
    }, [detectQRCode]);

    const handleGalleryClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const imageUrl = URL.createObjectURL(file);
                setSelectedImage(imageUrl);

                const img = new window.Image();
                img.src = imageUrl;
                img.onload = () => {
                    if (canvasRef.current) {
                        const context = canvasRef.current.getContext('2d');
                        if (context) {
                            canvasRef.current.width = img.width;
                            canvasRef.current.height = img.height;
                            context.drawImage(img, 0, 0, img.width, img.height);
                            const imageData = context.getImageData(0, 0, img.width, img.height);
                            detectQRCode(imageData);
                        }
                    }
                };
                setIsImageSelected(true);
                setImageSource("gallery");
            }
        };
        input.click();
    };

    const handleCloseCamera = useCallback(() => {
        setIsCameraOpen(false);
        setIsImageSelected(false);
        setImageSource(null);
        if (videoRef.current) {
            const stream = videoRef.current.srcObject as MediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, []);

    const handleRedoPhoto = () => {
        setSelectedImage(null);
        setIsImageSelected(false);
        setIsCameraOpen(true);
    };

    const handleSavePhoto = () => {
        if (selectedImage) {
            onImageSelect(selectedImage);
            onClose();
        }
    };

    return (
        <>
            {isCameraOpen || isImageSelected ? (
                <div className={styles.overlay}>
                    <div className={styles.cameraContainer}>
                        {selectedImage ? (
                            <Image src={selectedImage} alt="Selected" width={400} height={300} className={styles.video} />
                        ) : (
                            <video ref={videoRef} className={styles.video} autoPlay playsInline />
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div className={styles.containerButtons}>
                            {isImageSelected ? (
                                <>
                                    <ButtonAction title={t(imageSource === 'camera' ? "redoPhoto" : "selectAnother")} color='#313131' onClick={imageSource === 'camera' ? handleRedoPhoto : handleGalleryClick} />
                                    <ButtonAction title={t("savePhoto")} color='#1F046B' onClick={handleSavePhoto} />
                                </>
                            ) : (
                                <>
                                    <ButtonAction title={t("cancel")} color='#313131' onClick={handleCloseCamera} />
                                    <ButtonAction title={t("takePhoto")} color='#1F046B' onClick={takePhoto} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Modal isOpen={isOpen} title={t("select")} onClose={onClose}>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <button className={styles.button} onClick={() => setIsCameraOpen(true)}>
                                <Image src="/icons/Camera.svg" alt='Camera.svg' width={100} height={100} />
                                <label>{t("camera")}</label>
                            </button>
                            <button className={styles.button} onClick={handleGalleryClick}>
                                <Image src="/icons/Galery.svg" alt='Galery.svg' width={100} height={100} />
                                <label>{t("gallery")}</label>
                            </button>
                        </div>

                        <div className={styles.containerButtons}>
                            <ButtonAction title={t("cancel")} color='#313131' onClick={onClose} />
                            <ButtonAction title={t("accept")} color='#1F046B' onClick={handleSavePhoto} />
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default SelectModal;
