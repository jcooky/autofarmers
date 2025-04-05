'use client';

import React, { useEffect, useRef } from 'react';
import { createQR } from '@solana/pay';

interface QRCodeComponentProps {
  value: string;
  className?: string;
  size?: number;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  value,
  className,
  size = 32,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current && value) {
      qrRef.current.innerHTML = '';
      const qrCode = createQR(value, size);
      console.log(qrCode);
      qrCode.append(qrRef.current);
    }
  }, [value]);

  return <div ref={qrRef} className={className} />;
};

export default QRCodeComponent;
