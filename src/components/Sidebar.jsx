import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { getSidebarItems } from '../data/sidebarMenu';
import { DabangLogo, NavIcon } from './icons/NavIcons';

function ChevronDown({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default function Sidebar({ isOpen, onClose }) {
    const items = getSidebarItems();
    const location = useLocation();
    const [openGroups, setOpenGroups] = useState(() =>
        items.filter((item) => item.children).map((item) => item.id),
    );

    const hasActiveChild = (item) =>
        item.children?.some((child) => child.path === location.pathname);

    const toggleGroup = (groupId) => {
        setOpenGroups((current) =>
            current.includes(groupId)
                ? current.filter((id) => id !== groupId)
                : [...current, groupId],
        );
    };

    const sidebarContent = (
        <>
            <div className="flex h-16 items-center gap-3 px-5">
                <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-8 w-8"
                    alt="Shelf OS Logo"
                />
                <span className="text-xl font-semibold tracking-tight text-[#202224]">
                    Shelf OS
                </span>
            </div>

            <nav className="scrollbar-hide min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
                {items.map((item) => {
                    const isRootActive = item.path === location.pathname;
                    const isGroupActive = hasActiveChild(item);
                    const isOpen = item.children ? openGroups.includes(item.id) : false;

                    return (
                        <div key={item.id} className="space-y-1">
                            <div className="flex flex-col gap-1">
                                <NavLink
                                    to={item.path || item.children?.[0]?.path}
                                    end={!item.children}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition ${
                                            isRootActive || isGroupActive
                                                ? 'bg-[#EFF4FF] text-[#1447E6]'
                                                : 'text-[#4A5565] hover:bg-[#F5F6FA] hover:text-[#000000]'
                                        }`
                                    }
                                >
                                    <NavIcon name={item.icon} />
                                    <span className="truncate">{item.name}</span>
                                    {item.children ? (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                toggleGroup(item.id);
                                            }}
                                            className={`ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                                                isOpen
                                                    ? 'text-[#2563EB]'
                                                    : 'text-[#6B7280] hover:bg-[#F5F6FA] hover:text-[#202224]'
                                            }`}
                                        >
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${
                                                    isOpen ? 'rotate-180' : 'rotate-0'
                                                }`}
                                            />
                                        </button>
                                    ) : item.badge ? (
                                        <span className="ml-auto inline-flex h-5 items-center justify-center rounded-full bg-[#FEE2E2] px-2 text-[11px] font-semibold text-[#B91C1C]">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </NavLink>

                                {item.children && isOpen ? (
                                    <div className="space-y-1 px-2">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                end
                                                onClick={onClose}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition ${
                                                        isActive
                                                            ? 'bg-[#EFF4FF] text-[#1447E6]'
                                                            : 'text-[#4A5565] hover:bg-[#F5F6FA] hover:text-[#000000]'
                                                    }`
                                                }
                                            >
                                                <span className="ml-8 truncate">{child.name}</span>
                                                {child.badge ? (
                                                    <span className="ml-auto inline-flex h-5 items-center justify-center rounded-full bg-[#FEE2E2] px-2 text-[11px] font-semibold text-[#B91C1C]">
                                                        {child.badge}
                                                    </span>
                                                ) : null}
                                            </NavLink>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </nav>
        </>
    );

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[#F0F0F0] bg-white lg:flex">
                {sidebarContent}
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#F0F0F0] bg-white transition-transform duration-300 lg:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-[#8B8D97] hover:text-[#202224]"
                    aria-label="Close menu"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {sidebarContent}
            </aside>
        </>
    );
}
