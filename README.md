# ⚡ Real-Time Leaderboard API with Redis & Express

A high-performance, real-time leaderboard REST API built using **Node.js**, **Express**, **TypeScript**, and **Redis Sorted Sets**. Designed to handle $O(\log N)$ rank lookups, multi-game tracking, regional partitioning, and user metadata management without putting heavy read/write load on relational databases.

---

## 🚀 Features

- **Microsecond Rank Lookups:** Powered by Redis Sorted Sets (`ZADD`, `ZRANGE`, `ZREVRANK`).
- **Atomic Operations:** Uses `NX` flags to prevent duplicate player entries without race conditions.
- **Player Metadata Storage:** Efficiently stores avatars, usernames, and profiles using **Redis Hashes** alongside score tracking.
- **Multi-Game & Regional Support:** Dynamic key namespaces supporting multi-region (`leaderboard:region:asia`) and multi-game (`leaderboard:game:poker`) scoring.
- **Real-Time Event Streams:** Redis Stream integration (`XADD`) for downstream event-driven architectures (WebSockets, analytics).
- **TypeScript First:** Fully typed handlers and Express routes.
- **Containerized Dev Setup:** Docker Compose setup for Redis with instant GUI visualization via **Redis Insight**.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database / In-Memory Store:** Redis
- **Redis Client:** `ioredis`
- **Containerization:** Docker & Docker Compose
- **GUI Tool:** Redis Insight

---

## 📁 Key Namespace Structure

| Data Structure | Key Pattern | Purpose |
| :--- | :--- | :--- |
| **Sorted Set** | `leaderboard:main` | Tracks player IDs and their numeric scores |
| **Sorted Set** | `leaderboard:region:<region>` | Regional score tracking (e.g., `asia`, `us`, `europe`) |
| **Sorted Set** | `leaderboard:game:<gameId>` | Game-specific score tracking |
| **Hash** | `user:<playerId>` | Stores user profile metadata (`username`, `avatar`) |
| **Stream** | `stream:leaderboard:events` | Broadcasts live score update events |

---

## 🏁 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Desktop](https://www.docker.com/)

