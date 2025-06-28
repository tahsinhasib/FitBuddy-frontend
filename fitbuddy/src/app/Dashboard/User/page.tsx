'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Dumbbell,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    User,
    Utensils,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserMetricsDashboard from '@/components/Dashboard/UserMetricsDashboard';
import MetricsChartTabs from '@/components/Dashboard/MetricsChartTabs';
import MetricChangesCard from '@/components/Dashboard/MetricsChangedCard';
import TrainersYouMayKnow from '@/components/Trainers/TrainersYouMayKnow';
import TrainerRequestsPanel from '@/components/Trainers/TrainerRequestPanel';
import TrainerClientMetrics from '@/components/Trainers/TrainerClientMetrics';
import ChatApp from '@/components/Messages/ChatApp';


import TrainerWorkoutPlans from '@/components/WorkoutPlan/TrainerWorkoutPlans';
import UserMetricsHeatmap from '@/components/Dashboard/UserMetricsHeatmap';

import ClientWorkoutTab from '@/components/Clients/ClientWorkoutTab';
import DarkModeToggle from '@/hooks/DarkModeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import UserProfileCard from '@/components/Profile/UserProfileCard';
import UserProfilePage from '@/components/Profile/UserProfilePage';
import UserMetricsForm from '@/components/Dashboard/UserMetricsForm';
import UserMetricsModal from '@/components/Dashboard/Modals/UserMetricsModal';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'trainer' | 'nutritionist' | 'admin';
    profileImage?: string;
}

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/Login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                router.push('/Login');
            }
        };

        fetchUser();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
  <div className="space-y-8">
    <div className="flex justify-end">
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Add Metrics
      </button>
    </div>
    <UserMetricsModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    <UserMetricsDashboard />
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <MetricsChartTabs />
      </div>
      <div className="w-full md:max-w-sm">
        <MetricChangesCard />
      </div>
    </div>
    <UserMetricsHeatmap />
  </div>
);

            case 'profile':
                return (
                    <UserProfilePage />
                );
            case 'messages':
                return (
                    <ChatApp />
                );
            case 'workouts':
                if (user?.role === 'trainer') {
                    return (
                        <TrainerWorkoutPlans />
                    );
                } else if (user?.role === 'user') {
                    return (
                        <ClientWorkoutTab />
                    );
                } else if (user?.role === 'nutritionist') {
                    return <></>;
                } else {
                    return <p className="text-red-600">Unauthorized role</p>;
                }

            case 'nutrition':
                return <h1 className="text-3xl font-bold">Nutrition</h1>;
            case 'user':
                return (
                    <TrainersYouMayKnow />
                );
            case 'trainer':
                return (
                    <>
                        <TrainerRequestsPanel />
                        <TrainerClientMetrics />
                    </>
                )
            default:
                return null;
        }
    };

    const navItems = [
        { label: 'Dashboard', tab: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Profile', tab: 'profile', icon: <User className="w-5 h-5" /> },
        { label: 'Messages', tab: 'messages', icon: <MessageSquare className="w-5 h-5" /> },
        { label: 'Workouts', tab: 'workouts', icon: <Dumbbell className="w-5 h-5" /> },
        { label: 'Nutrition', tab: 'nutrition', icon: <Utensils className="w-5 h-5" /> },
    ];

    if (user?.role === 'trainer') {
        navItems.push({ label: 'Clients', tab: 'trainer', icon: <User className="w-5 h-5" /> });
    }
    if (user?.role === 'user') {
        navItems.push({ label: 'Find Trainers', tab: 'user', icon: <User className="w-5 h-5" /> });
    }

    return (
        <div className="h-screen overflow-hidden flex bg-white dark:bg-slate-800 text-black dark:text-white">
            {/* Fixed Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 shadow-xl p-6 fixed top-0 left-0 h-full z-40 border-r border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-yellow-400">FitBuddy</h2>
                    <DarkModeToggle />
                </div>

                {user && (
                    <div className="flex items-center space-x-3 mb-6">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="User"
                                className="w-10 h-10 rounded-full border"
                            />
                        ) : (
                            <div className="bg-black text-white w-10 h-10 p-5 rounded-full flex items-center justify-center text-center font-semibold dark:bg-white dark:text-black dark:font-semibold">
                                {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                )}

                <nav className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`flex items-center gap-x-3 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-sm border group
                                ${activeTab === item.tab
                                    ? 'bg-slate-800 text-white dark:bg-white dark:text-black border-gray-300 dark:border-gray-200'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/Login');
                        }}
                        className="flex items-center gap-x-3 mt-6 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 dark:border-red-500 dark:hover:bg-red-900"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto h-screen p-6 md:p-10 pb-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>


            {/* Bottom Nav for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-inner flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item.tab}
                        onClick={() => setActiveTab(item.tab)}
                        className={`flex flex-col items-center justify-center ${activeTab === item.tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-300'
                            }`}
                    >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/Login');
                    }}
                    className="flex flex-col items-center justify-center text-red-500"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs">Logout</span>
                </button>
            </nav>
        </div>
    );

}
