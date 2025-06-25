'use client';

import { CheckIcon } from "lucide-react";



const tiers = [
    {
        name: 'Basic',
        id: 'tier-basic',
        href: '#',
        priceMonthly: '$9',
        description: 'Ideal for individuals just starting their fitness journey.',
        features: [
            'Access to basic workouts',
            'Track progress manually',
            'Connect with 1 trainer',
            'Email support',
        ],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '#',
        priceMonthly: '$29',
        description: 'Perfect for active users wanting structure & more features.',
        features: [
            'Unlimited workouts',
            'Trainer-assigned plans',
            'Smart progress tracking',
            'Priority support',
            'Community features',
        ],
        featured: true,
    },
];

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
    return (
        <div className="relative isolate bg-gradient-to-br from-yellow-50 to-white dark:from-slate-900 dark:to-slate-800 px-6 py-24 sm:py-32 lg:px-8 text-black dark:text-white">
            {/* Decorative Background */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
            >
                <div
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-yellow-400 to-orange-400 opacity-30 dark:from-yellow-600 dark:to-orange-700"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            {/* Heading */}
            <div className="mx-auto max-w-5xl text-center">
                <h2 className="text-base font-semibold text-yellow-600 dark:text-yellow-400">Pricing</h2>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    Choose the right plan for you
                </p>
                <p className="mt-6 max-w-2xl mx-auto text-lg font-medium text-gray-600 dark:text-gray-300">
                    Get access to the features you need to stay on track and transform your fitness lifestyle.
                </p>
            </div>

            {/* Plans */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
                {tiers.map((tier, tierIdx) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            tier.featured
                                ? 'relative bg-gray-900 shadow-2xl border border-yellow-500/20'
                                : 'bg-white/60 dark:bg-slate-800 sm:mx-8 lg:mx-0',
                            tier.featured
                                ? ''
                                : tierIdx === 0
                                    ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                                    : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
                            'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 transition-shadow duration-300 hover:shadow-xl'
                        )}
                    >
                        <h3
                            id={tier.id}
                            className={classNames(
                                tier.featured ? 'text-yellow-400' : 'text-yellow-600 dark:text-yellow-400',
                                'text-sm font-semibold uppercase'
                            )}
                        >
                            {tier.name}
                        </h3>
                        <p className="mt-4 flex items-baseline gap-x-2">
                            <span
                                className={classNames(
                                    tier.featured ? 'text-white' : 'text-gray-900 dark:text-white',
                                    'text-5xl font-extrabold tracking-tight'
                                )}
                            >
                                {tier.priceMonthly}
                            </span>
                            <span
                                className={classNames(
                                    tier.featured ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300',
                                    'text-base'
                                )}
                            >
                                /month
                            </span>
                        </p>
                        <p
                            className={classNames(
                                tier.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300',
                                'mt-6 text-base'
                            )}
                        >
                            {tier.description}
                        </p>
                        <ul
                            role="list"
                            className={classNames(
                                tier.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-200',
                                'mt-8 space-y-3 text-sm'
                            )}
                        >
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3 items-start">
                                    <CheckIcon
                                        aria-hidden="true"
                                        className={classNames(
                                            tier.featured ? 'text-yellow-400' : 'text-yellow-600 dark:text-yellow-400',
                                            'h-6 w-5 flex-none'
                                        )}
                                    />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={tier.href}
                            aria-describedby={tier.id}
                            className={classNames(
                                tier.featured
                                    ? 'bg-yellow-500 text-gray-900 shadow hover:bg-yellow-400 focus-visible:outline-yellow-500'
                                    : 'text-yellow-700 ring-1 ring-inset ring-yellow-300 hover:ring-yellow-400 focus-visible:outline-yellow-500 dark:text-yellow-400',
                                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                            )}
                        >
                            Get started
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
