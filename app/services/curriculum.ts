export interface Topic {
    name: string
    estimated_time_hours: number
    interview_frequency_score: number
    status: 'pending' | 'in_progress' | 'completed'
    material: string[]
    repoLink?: string
}

export interface Section {
    title: string
    topics: Topic[]
}

export interface Domain {
    title: string
    estimated_days: number
    sections: Record<string, Section>
}

export interface Curriculum {
    meta: {
        goal: string
        duration_days: number
        daily_study_hours: string
    }
    [key: string]: Domain | any
}

export const curriculumData: Curriculum = {
    "meta": {
        "goal": "Become a strong Software Architect",
        "duration_days": 120,
        "daily_study_hours": "2–3"
    },
    "LLD": {
        "title": "LLD Deep Dive",
        "estimated_days": 40,
        "sections": {
            "oop_fundamentals": {
                "title": "OOP & Design Fundamentals",
                "topics": [
                    {
                        "name": "SOLID Principles",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://martinfowler.com/bliki/SOLID.html",
                            "https://refactoring.guru/design-patterns/solid"
                        ]
                    },
                    {
                        "name": "Composition over Inheritance",
                        "estimated_time_hours": 3,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://martinfowler.com/bliki/CompositionOverInheritance.html"
                        ]
                    },
                    {
                        "name": "Immutability & Value Objects",
                        "estimated_time_hours": 3,
                        "interview_frequency_score": 3,
                        "status": "pending",
                        "material": [
                            "https://martinfowler.com/bliki/ValueObject.html"
                        ]
                    }
                ]
            },
            "design_patterns": {
                "title": "Design Patterns",
                "topics": [
                    {
                        "name": "Creational Patterns",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://refactoring.guru/design-patterns/creational-patterns"
                        ]
                    },
                    {
                        "name": "Structural Patterns",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://refactoring.guru/design-patterns/structural-patterns"
                        ]
                    },
                    {
                        "name": "Behavioral Patterns",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://refactoring.guru/design-patterns/behavioral-patterns"
                        ]
                    }
                ]
            },
            "concurrency_async": {
                "title": "Concurrency & Async Design",
                "topics": [
                    {
                        "name": "Thread Safety & Race Conditions",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://www.baeldung.com/java-concurrency"
                        ]
                    },
                    {
                        "name": "Async & Event Loop",
                        "estimated_time_hours": 3,
                        "interview_frequency_score": 3,
                        "status": "pending",
                        "material": [
                            "https://nodejs.dev/en/learn/the-nodejs-event-loop/"
                        ]
                    }
                ]
            },
            "lld_interview_problems": {
                "title": "LLD Interview Problems",
                "topics": [
                    {
                        "name": "Design Cache (LRU / LFU)",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://leetcode.com/problems/lru-cache/",
                            "https://www.educative.io/courses/grokking-the-object-oriented-design-interview"
                        ]
                    },
                    {
                        "name": "Design Rate Limiter",
                        "estimated_time_hours": 5,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://github.com/donnemartin/system-design-primer#rate-limiter"
                        ]
                    },
                    {
                        "name": "Design Splitwise",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://workat.tech/machine-coding/practice/splitwise-problem"
                        ]
                    }
                ]
            }
        }
    },
    "HLD": {
        "title": "High-Level System Design",
        "estimated_days": 40,
        "sections": {
            "fundamentals": {
                "title": "System Design Fundamentals",
                "topics": [
                    {
                        "name": "Scalability, Availability, Latency",
                        "estimated_time_hours": 5,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://github.com/donnemartin/system-design-primer",
                            "https://aws.amazon.com/builders-library/"
                        ]
                    },
                    {
                        "name": "CAP & PACELC Theorem",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/"
                        ]
                    }
                ]
            },
            "architecture_patterns": {
                "title": "Architecture Patterns",
                "topics": [
                    {
                        "name": "Microservices vs Modular Monolith",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://martinfowler.com/articles/microservices.html"
                        ]
                    },
                    {
                        "name": "Event-Driven Architecture",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://martinfowler.com/articles/201701-event-driven.html"
                        ]
                    },
                    {
                        "name": "CQRS & Saga Pattern",
                        "estimated_time_hours": 5,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://microservices.io/patterns/data/saga.html"
                        ]
                    }
                ]
            },
            "hld_interview_systems": {
                "title": "HLD Interview Systems",
                "topics": [
                    {
                        "name": "Design URL Shortener",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://github.com/donnemartin/system-design-primer#design-a-url-shortener"
                        ]
                    },
                    {
                        "name": "Design E-commerce System",
                        "estimated_time_hours": 6,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://aws.amazon.com/architecture/"
                        ]
                    },
                    {
                        "name": "Design Order Management System",
                        "estimated_time_hours": 5,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://microservices.io/patterns/data/transactional-outbox.html"
                        ]
                    }
                ]
            }
        }
    },
    "AWS": {
        "title": "AWS Solutions Architect",
        "estimated_days": 40,
        "sections": {
            "core_services": {
                "title": "Core AWS Services",
                "topics": [
                    {
                        "name": "EC2, ASG, ELB",
                        "estimated_time_hours": 5,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://docs.aws.amazon.com/ec2/"
                        ]
                    },
                    {
                        "name": "S3 Deep Dive",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://docs.aws.amazon.com/s3/"
                        ]
                    },
                    {
                        "name": "RDS vs DynamoDB",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://aws.amazon.com/rds/",
                            "https://aws.amazon.com/dynamodb/"
                        ]
                    }
                ]
            },
            "network_security": {
                "title": "Networking & Security",
                "topics": [
                    {
                        "name": "VPC, Subnets, Routing",
                        "estimated_time_hours": 5,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://docs.aws.amazon.com/vpc/"
                        ]
                    },
                    {
                        "name": "IAM, KMS, Secrets Manager",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://docs.aws.amazon.com/iam/"
                        ]
                    }
                ]
            },
            "architecture_best_practices": {
                "title": "Architecture & Exam Focus",
                "topics": [
                    {
                        "name": "Well-Architected Framework",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 5,
                        "status": "pending",
                        "material": [
                            "https://aws.amazon.com/architecture/well-architected/"
                        ]
                    },
                    {
                        "name": "High Availability & DR",
                        "estimated_time_hours": 4,
                        "interview_frequency_score": 4,
                        "status": "pending",
                        "material": [
                            "https://aws.amazon.com/disaster-recovery/"
                        ]
                    }
                ]
            }
        }
    }
}

