import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { BotComponent } from "../../components/Bot/Bot";
import api from "../../utils/api";
import { BotStructure } from "../../types";

export const Bot: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [botData, setBotData] = useState<BotStructure | null>(null);

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const { data } = await api.get(`/bots/${id}`);
        setBotData(data);
      } catch (err) {
        console.error("Erro ao carregar bot:", err);
      }
    };

    if (id) fetchBot();
  }, [id]);

  const name = botData?.name ?? "Simo Botlist - Bot";
  const description =
    botData?.short_description ??
    "Descubra e apresente projetos incríveis na Simo Botlist!";
  const image = botData
    ? `https://api-simo.squareweb.app/api/bots/${botData.id}/og`
    : `https://simo-botlist.vercel.app/api/bots/${botData.id}/og`;

  return (
    <>
      <Helmet>
        <title>{`${name} - Simo Botlist`}</title>
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={`https://simo-botlist.vercel.app/bot/${id}`} />
          
        <meta name="theme-color" content="#4169E1" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <BotComponent />
    </>
  );
};
