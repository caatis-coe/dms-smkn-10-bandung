import logo from '@/assets/Logo-SMK-10-Bandung.png';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={logo} alt="SMK 10 Bandung Logo" {...props} />;
}