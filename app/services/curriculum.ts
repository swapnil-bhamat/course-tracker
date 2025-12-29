export interface Topic {
    id: string
    title: string
    description: string
    studyMaterials: {
        type: 'video' | 'article' | 'doc'
        label: string
        url: string
    }[]
    completed: boolean
    repoLink?: string
}

export interface Subject {
    id: string
    title: string
    icon: string
    topics: Topic[]
}

export const curriculum: Subject[] = [
    {
        id: 'lld',
        title: 'Low-Level Design (LLD)',
        icon: 'layout',
        topics: [
            {
                id: 'solid',
                title: 'SOLID Principles',
                description: 'Master the 5 core principles of object-oriented design.',
                studyMaterials: [
                    { type: 'video', label: 'SOLID in 15 Minutes', url: 'https://youtube.com/...' },
                    { type: 'article', label: 'Detailed Guide to SOLID', url: 'https://...' }
                ],
                completed: false
            },
            {
                id: 'design-patterns',
                title: 'Creational & Structural Patterns',
                description: 'Learn Singleton, Factory, Observer, and Decorator patterns.',
                studyMaterials: [
                    { type: 'video', label: 'Refactoring Guru - Patterns', url: 'https://refactoring.guru/design-patterns' }
                ],
                completed: false
            }
        ]
    },
    {
        id: 'hld',
        title: 'High-Level Design (HLD)',
        icon: 'database',
        topics: [
            {
                id: 'scalability',
                title: 'Scalability & Load Balancing',
                description: 'Horizontal vs Vertical scaling, the role of Load Balancers.',
                studyMaterials: [
                    { type: 'article', label: 'The System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }
                ],
                completed: false
            },
            {
                id: 'caching',
                title: 'Caching Strategies',
                description: 'Read-through, write-through, write-back caching and Redis.',
                studyMaterials: [
                    { type: 'doc', label: 'AWS Caching Guide', url: 'https://aws.amazon.com/caching/' }
                ],
                completed: false
            }
        ]
    },
    {
        id: 'aws',
        title: 'AWS Solution Architect',
        icon: 'cloud',
        topics: [
            {
                id: 'iam-vpc',
                title: 'IAM & VPC Networking',
                description: 'Secure identities and isolated network environments.',
                studyMaterials: [
                    { type: 'video', label: 'AWS Certified Solutions Architect Course', url: 'https://...' }
                ],
                completed: false
            }
        ]
    }
]
