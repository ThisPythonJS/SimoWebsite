import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { Params, useParams } from "react-router-dom";
import { BotStructure, UserStructure } from "../../types";
import { ThemeContext } from "../../contexts/ThemeContext";
import { borderColor } from "../../utils/theme/border";
import { BotCard } from "../BotList/BotCard";
import { UserLoading } from "./UserLoading";
import simo from "../../assets/images/simo.png";
import { CopyButton } from "../Mixed/Copy";
import { Badges } from "../Badges/Badges";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Image, Settings } from "lucide-react";

/**
 * NOTE:
 * - Assumes api.getUserFromDB(userid) returns fields:
 *   { id, username, avatar, banner_url, bio, public_flags, premium_type }
 * - Tries api.getMe() to detect "is me". If you don't have api.getMe(), remove try/catch or implement accordingly.
 */

/* --- Mapeamento básico de public_flags (bitfield) para mostrar — ajuste conforme quiser --- */
const DISCORD_FLAGS_MAP: {
  bit: number;
  key: string;
  icon: string;
  name: string;
  description: string;
}[] = [
  { bit: 1 << 0, key: "DISCORD_EMPLOYEE", icon: "🛠️", name: "Discord Employee", description: "Trabalha no Discord." },
  { bit: 1 << 1, key: "PARTNERED_SERVER_OWNER", icon: "🤝", name: "Partnered", description: "Dono de servidor parceiro." },
  { bit: 1 << 2, key: "HYPESQUAD_EVENTS", icon: "🎪", name: "HypeSquad Events", description: "Membro do HypeSquad Events." },
  { bit: 1 << 3, key: "BUG_HUNTER_LEVEL_1", icon: "🔍", name: "Bug Hunter", description: "Caçador de bugs (nível 1)." },
  { bit: 1 << 6, key: "EARLY_SUPPORTER", icon: "🌟", name: "Early Supporter", description: "Apoiou cedo a plataforma." },
  { bit: 1 << 8, key: "BUG_HUNTER_LEVEL_2", icon: "🐞", name: "Bug Hunter II", description: "Caçador de bugs (nível 2)." },
  { bit: 1 << 9, key: "VERIFIED_BOT", icon: "🤖", name: "Bot Verificado", description: "Possui bot verificado." },
  { bit: 1 << 17, key: "EARLY_VERIFIED_BOT_DEVELOPER", icon: "👨‍💻", name: "Bot Dev (Early)", description: "Desenvolvedor de bot verificado." },
  // adicione mais flags conforme necessário...
];

/* --- Mapeia public_flags (number) para lista de badges detectadas --- */
function parsePublicFlags(bitfield?: number) {
  if (!bitfield || bitfield === 0) return [];
  return DISCORD_FLAGS_MAP.filter((f) => (bitfield & f.bit) !== 0);
}

export const User: React.FC = () => {
  const params: Params = useParams<string>();
  const userid: string = params.userid as string;

  const [user, setUser] = useState<UserStructure | null>(null);
  const [userBots, setUserBots] = useState<BotStructure[]>([]);
  const [showFlagsModal, setShowFlagsModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // se o visitante é o próprio usuário
  const [loadingMeCheck, setLoadingMeCheck] = useState(true);
  const { color } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      try {
        // busca dados do perfil
        const { data } = await api.getUserFromDB(userid);
        const bots = await api.getAllBots();
        setUser(data);
        setUserBots(bots.data.filter((b: BotStructure) => b.owner_id === userid));
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        // fallback: redireciona pra home se quiser
        window.location.href = "/";
      }
    })();
  }, [userid]);

  useEffect(() => {
    (async () => {
      // tenta detectar se o visitante é o dono do perfil para mostrar painel de configurações
      try {
        if (!api.getMe) {
          // se não existir getMe, ignora silenciosamente
          setIsOwner(false);
          setLoadingMeCheck(false);
          return;
        }
        const resp = await api.getMe();
        const me = resp?.data;
        if (me && user) {
          setIsOwner(me.id === user.id);
        } else if (me && !user) {
          // se user ainda não foi carregado, compara depois
          setIsOwner(me.id === userid);
        }
      } catch (err) {
        // não quebra se endpoint não existir / falhar
        setIsOwner(false);
      } finally {
        setLoadingMeCheck(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return <UserLoading />;

  const badges = parsePublicFlags((user as any).public_flags);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const premiumType = (user as any).premium_type ?? 0; // 0 | 1 | 2 (site premium)

  return (
    <main className="flex justify-center w-full px-4 py-8">
      <section className="w-full max-w-[1100px] rounded-2xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 shadow-lg">
        {/* BANNER */}
        <div className="relative h-[220px] w-full bg-gradient-to-r from-neutral-800 to-neutral-900">
          {user.banner_url ? (
            <img
              src={user.banner_url}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full" />
          )}

          {/* Avatar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
            <img
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = simo;
              }}
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              alt={`${user.username} avatar`}
              className="w-36 h-36 rounded-full border-[6px] border-neutral-900 shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* MAIN INFO */}
        <div className="pt-20 pb-8 px-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-sky-400">{user.username}</h1>

              {/* Premium site badge */}
              {premiumType === 1 && (
                <div className="px-2 py-1 rounded-md text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white/90 shadow-md">
                  Basic
                </div>
              )}
              {premiumType === 2 && (
                <div className="px-3 py-1 rounded-md text-sm bg-gradient-to-r from-yellow-500 via-pink-500 to-indigo-600 text-white shadow-[0_6px_18px_rgba(99,102,241,0.12)]">
                  Advanced
                </div>
              )}
            </div>

            {/* Bio abaixo do nome */}
            {user.bio ? (
              <p className="text-sm text-neutral-300 max-w-[780px] mt-2 leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm text-neutral-500 mt-2">Sem bio cadastrada.</p>
            )}

            {/* ID (clicável copia automaticamente) */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleCopyId}
                className="text-xs px-3 py-1 rounded-md bg-neutral-800/60 hover:bg-neutral-800 transition flex items-center gap-2"
                title="Clique para copiar ID"
              >
                <span className="select-none">ID: {user.id}</span>
              </button>
              {copied && (
                <span className="text-xs bg-green-600/20 text-green-300 px-2 py-0.5 rounded-md">
                  Copiado!
                </span>
              )}
            </div>

            {/* Badges square (pequeno quadrado clicável) */}
            <div className="mt-4">
              <button
                onClick={() => setShowFlagsModal(true)}
                className="w-12 h-12 rounded-xl bg-neutral-800/60 border border-neutral-700 flex items-center justify-center hover:scale-[1.03] transition-transform"
                title="Ver insígnias"
              >
                {/* Mostra o componente Badges (usado por você) */}
                <Badges flags={(user as any).public_flags ?? (user.flags ?? 0)} />
              </button>
            </div>

            {/* Painel de Configurações para o próprio usuário */}
            {!loadingMeCheck && isOwner && (
              <div className="mt-6 w-full max-w-[760px]">
                <div className="bg-neutral-800/40 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-900/60 flex items-center justify-center border border-neutral-700">
                      <Settings size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Configurações do Perfil</div>
                      <div className="text-xs text-neutral-400">Gerencie seu banner, bio e bots</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-slate-700 to-slate-800 hover:scale-[1.02] transition">
                      <Edit2 size={16} />
                      <span className="text-sm">Editar Bio</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-800 transition">
                      <Image size={16} />
                      <span className="text-sm">Alterar Banner</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-800 transition">
                      <span className="text-sm">Gerenciar Bots</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTS LIST */}
        <div className="border-t border-neutral-800 px-8 py-8">
          <h2 className="text-xl font-semibold text-center mb-6">Bots de {user.username}</h2>

          {userBots.length === 0 ? (
            <div className="text-center text-neutral-400">Nenhum bot encontrado.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-6 place-items-center">
              {userBots.map((bot: BotStructure, idx: number) => (
                <BotCard key={idx} bot={bot} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de flags */}
      <AnimatePresence>
        {showFlagsModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-900/95 border border-neutral-800 rounded-xl p-6 w-[92%] max-w-[520px] shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={() => setShowFlagsModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-semibold mb-3">Insígnias de Discord</h3>

              {badges.length === 0 ? (
                <div className="text-neutral-400 text-sm">Nenhuma insígnia encontrada.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {badges.map((b) => (
                    <div key={b.key} className="flex items-center gap-3 p-3 rounded-md bg-neutral-800/40 border border-neutral-700">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md text-xl">
                        {b.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-sm text-neutral-400">{b.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Site Premium info */}
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Premium do site</div>
                    <div className="text-xs text-neutral-400">
                      {premiumType === 0 && "Nenhum"}
                      {premiumType === 1 && "Basic"}
                      {premiumType === 2 && "Advanced"}
                    </div>
                  </div>
                  <div>
                    {premiumType === 2 ? (
                      <div className="px-3 py-1 rounded-md bg-gradient-to-r from-yellow-400 to-pink-500 text-black text-sm">Advanced</div>
                    ) : premiumType === 1 ? (
                      <div className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Basic</div>
                    ) : (
                      <div className="px-3 py-1 rounded-md bg-neutral-700 text-neutral-200 text-sm">Nenhum</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
