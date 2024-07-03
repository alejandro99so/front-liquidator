import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './selectModal.module.css';
import Modal from '../Modal';
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';

interface SelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (image: string) => void;
}

const SelectModal: React.FC<SelectModalProps> = ({ isOpen, onClose, onImageSelect }) => {
    const { t } = useTranslation(['pay'])
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setIsCameraOpen(false);
            if (videoRef.current) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        }
    }, [isOpen]);

    const handleCameraClick = async () => {
        if (videoRef.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraOpen(true);
            } catch (error) {
                console.error("Error accessing camera: ", error);
            }
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const imageUrl = canvasRef.current.toDataURL('image/png');
                setSelectedImage(imageUrl);
                setIsCameraOpen(false);
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                onImageSelect(imageUrl);
            }
        }
    };

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
                onImageSelect(imageUrl);
            }
        };
        input.click();
    };

    return (
        <Modal isOpen={isOpen} title={t("select")} onClose={onClose}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <button className={styles.button} onClick={handleCameraClick}>
                        <Image src="/Camera.svg" alt='Camera.svg' width={100} height={100} />
                        <label>{t("camera")}</label>
                    </button>
                    <button className={styles.button} onClick={handleGalleryClick}>
                        <Image src="/Galery.svg" alt='Galery.svg' width={100} height={100} />
                        <label>{t("gallery")}</label>
                    </button>
                </div>

                <div className={styles.containerButtons}>
                    <ButtonAction title={t("cancel")} color='red' onClick={onClose} />
                </div>
                {isCameraOpen && (
                    <div className={styles.cameraContainer}>
                        <video ref={videoRef} className={styles.video} />
                        <button className={styles.button} onClick={takePhoto}>Take Photo</button>
                    </div>
                )}
                <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
            </div>
            {selectedImage && <Image src={selectedImage} alt="Selected" className={styles.preview} width={80} height={80} />}
        </Modal>
    );
}

export default SelectModal;
