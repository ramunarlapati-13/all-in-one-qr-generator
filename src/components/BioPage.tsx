import React from 'react';
import {
    InstagramLogo,
    YoutubeLogo,
    Globe,
    ShoppingBag,
    Link as LinkIcon,
    TwitterLogo,
    LinkedinLogo,
    FacebookLogo,
    TiktokLogo,
    GithubLogo
} from '@phosphor-icons/react';

interface BioPageProps {
    name: string;
    role: string;
    avatarUrl: string;
    qrValue: string;
    qrColor: string;
    links: {
        label: string;
        url: string;
        icon: string;
    }[];
}

const BioPage: React.FC<BioPageProps> = ({ name, role, avatarUrl, links }) => {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'instagram': return <InstagramLogo size={24} />;
            case 'youtube': return <YoutubeLogo size={24} />;
            case 'website': return <Globe size={24} />;
            case 'shop': return <ShoppingBag size={24} />;
            case 'twitter': return <TwitterLogo size={24} />;
            case 'linkedin': return <LinkedinLogo size={24} />;
            case 'facebook': return <FacebookLogo size={24} />;
            case 'tiktok': return <TiktokLogo size={24} />;
            case 'github': return <GithubLogo size={24} />;
            default: return <LinkIcon size={24} />;
        }
    };

    return (
        <div
            className="relative flex h-full min-h-[600px] w-full max-w-[400px] flex-col bg-[#1f1122] dark justify-between group/design-root overflow-x-hidden shadow-2xl overflow-hidden"
            style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
        >
            <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">

                <div className="flex p-4 flex-col items-center">
                    <div className="flex w-full flex-col gap-4 items-center">
                        <div className="flex gap-4 flex-col items-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-[#ce2bee]/20 shadow-[0_0_20px_rgba(206,43,238,0.2)]"
                                style={{ backgroundImage: `url("${avatarUrl}")` }}
                            ></div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{name}</p>
                                <p className="text-[#c092c9] text-base font-normal leading-normal text-center">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="px-4 py-4">
                    <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3">Links</h3>
                    <div className="flex flex-col gap-2">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 bg-[#2a172e] hover:bg-[#3d2142] p-3 rounded-2xl cursor-pointer transition-all hover:translate-x-1 group no-underline"
                            >
                                <div className="text-white flex items-center justify-center rounded-xl bg-[#422348] shrink-0 size-10 group-hover:bg-[#ce2bee] transition-colors">
                                    {getIcon(link.icon)}
                                </div>
                                <p className="text-white text-base font-semibold leading-normal flex-1 truncate">{link.label}</p>
                            </a>
                        ))}
                    </div>
                </div>

            </div>


            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
        </div>
    );
};

export default BioPage;
