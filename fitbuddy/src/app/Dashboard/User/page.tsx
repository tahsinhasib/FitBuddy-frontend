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
import UserMetricsChart from '@/components/Dashboard/UserMetricsChart';
import UserMetricsTabs from '@/components/Dashboard/UserMetricsTabs';
import MetricsChartTabs from '@/components/Dashboard/MetricsChartTabs';
import MetricChangesCard from '@/components/Dashboard/MetricsChangedCard';
import TrainersYouMayKnow from '@/components/Trainers/TrainersYouMayKnow';
import TrainerRequestsPanel from '@/components/Trainers/TrainerRequestPanel';
import TrainerClientMetrics from '@/components/Trainers/TrainerClientMetrics';

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
                        <UserMetricsDashboard />


                        {/* <MetricsChartTabs />
      <MetricChangesCard /> */}

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left side: Charts */}
                            <div className="flex-1">
                                <MetricsChartTabs />
                            </div>

                            {/* Right side: Metric changes */}
                            <div className="w-full md:max-w-sm">
                                <MetricChangesCard />
                            </div>
                        </div>

                    </div>
                );
            case 'profile':
                return <h1 className="text-3xl font-bold">Profile</h1>;
            case 'messages':
                return <h1 className="text-3xl font-bold">Messages</h1>;
            case 'workouts':
                return <h1 className="text-3xl font-bold">Workouts</h1>;
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
        <div className="h-screen overflow-hidden flex">
            {/* Fixed Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white shadow-md p-6 fixed top-0 left-0 h-full z-40">
                <h2 className="text-2xl font-bold mb-4 text-indigo-600">FitBuddy</h2>

                {user && (
                    <div className="flex items-center space-x-3 mb-6">
                        {user.profileImage ? (
    <img
        src={user.profileImage}
        alt="User"
        className="w-10 h-10 rounded-full border"
    />
) : (
    <div className="avatar placeholder">
        <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-center p-2">
            <span className="text-sm font-semibold">
                {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
            </span>
        </div>
    </div>
)}


                        <div>
                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                )}

                <nav className="flex flex-col space-y-3 text-gray-700">
                    {navItems.map((item) => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`flex items-center gap-x-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-200 font-medium shadow-sm text-left ${activeTab === item.tab ? 'bg-indigo-100' : ''
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
                        className="flex items-center gap-x-3 mt-8 px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition duration-200 font-medium shadow-sm text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Scrollable Main Content */}
            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto h-screen p-6 pb-24 md:pb-10 bg-white">
                {renderContent()}
            </main>

            {/* Bottom nav for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-inner flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item.tab}
                        onClick={() => setActiveTab(item.tab)}
                        className={`flex flex-col items-center justify-center ${activeTab === item.tab ? 'text-indigo-600' : 'text-gray-500'
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
