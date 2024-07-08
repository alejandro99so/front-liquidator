"use client"
import { ButtonLink } from "@/components/Buttons/ButtonLink";
import PageContainer from "@/components/PageContainer/PageContainer";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const BuildingPage = () => {
    const { t } = useTranslation(["building"])
    return (
        <PageContainer>
            <Image src={"/background/page_building.png"} alt="" width={300} height={200} />
            <div>
                <h2>{t("title")}</h2>
                <p>{t("paragraph")}</p>
            </div>
            <ButtonLink href="/Dashboard" title={t("home")} />
        </PageContainer>
    );
}

export default BuildingPage;