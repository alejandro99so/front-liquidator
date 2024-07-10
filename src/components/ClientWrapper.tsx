// components/ClientWrapper.tsx
"use client";

import useCheckSignData from '@/hooks/useCheckSignData';
import React from 'react';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
    useCheckSignData();

    return <>{children}</>;
};

export default ClientWrapper;
