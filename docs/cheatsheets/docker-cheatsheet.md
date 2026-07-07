#  Docker Cheatsheet — For Everyday Use
> A beginner-friendly guide to the most common Docker commands you'll use daily.

---

##  Start & Stop Containers

| Command | What it does |
|---|---|
| `docker compose up` | Start all containers |
| `docker compose up -d` | Start in background (detached mode) |
| `docker compose down` | Stop and remove containers |
| `docker compose restart` | Restart all containers |
| `docker compose stop` | Stop containers (without removing) |
| `docker compose start` | Start already created containers |

---

##  Check Status

| Command | What it does |
|---|---|
| `docker ps` | Show only running containers |
| `docker ps -a` | Show all containers (including stopped) |
| `docker images` | List all downloaded images |
| `docker system df` | Show Docker disk usage |
| `docker inspect <name>` | Detailed info about a container |

---

##  Logs (Most Useful for Debugging!)

| Command | What it does |
|---|---|
| `docker compose logs` | Show logs of all containers |
| `docker compose logs -f` | Follow/live logs of all containers |
| `docker compose logs -f backend` | Live logs of a specific container |
| `docker logs <container_id>` | Logs by container ID |
| `docker logs --tail 100 <container_id>` | Last 100 lines only |

>  **Tip:** Use `-f` flag whenever something breaks — it shows errors in real time.

---

##  Go Inside a Container (like SSH)

```bash
docker exec -it <container_name> bash   # Open terminal inside container
docker exec -it <container_name> sh     # Use this if bash doesn't work
```

>  **Tip:** Container name is visible under the **NAMES** column in `docker ps`

---

##  Rebuild (When Code Changes Aren't Reflecting)

| Command | What it does |
|---|---|
| `docker compose up --build` | Rebuild and start |
| `docker compose up --build -d` | Rebuild in background |
| `docker compose build` | Just rebuild without starting |

>  **Tip:** If your latest changes aren't showing up, always try `--build` flag.

---

##  Cleanup Commands

| Command | What it does |
|---|---|
| `docker system prune -a` | Remove ALL unused containers, images, networks |
| `docker rm -f $(docker ps -aq)` | Force remove all containers |
| `docker rmi -f $(docker images -aq)` | Remove all images |
| `docker volume prune` | Remove unused volumes |
| `docker network prune` | Remove unused networks |

>  **Warning:** `prune` commands are irreversible. Make sure you don't need the data before running them.

---

##  Emergency Commands (When Nothing Works!)

| Command | What it does |
|---|---|
| `sudo docker rmi -f $(sudo docker images -aq)` | Force remove ALL images |
| `sudo docker rm -f $(sudo docker ps -aq)` | Force remove ALL containers |
| `sudo docker system prune -a --volumes` | Remove everything — images, containers, networks & volumes |

>  **Warning:** These are nuclear options — only use when you want a completely fresh start.

**Remove images one by one using Image ID** (when bulk remove doesn't work):
```bash
sudo docker rmi -f <image_id>

# Example:
sudo docker rmi -f 2a5c65859499
sudo docker rmi -f ea7752e531c9
sudo docker rmi -f 60a93af0bba5
```
>  **Tip:** Get Image IDs from `docker images` command under the **IMAGE ID** column.

---

##  Verify Everything is Cleaned Up

```bash
docker ps -a      # Should return empty list
docker images     # Should return empty list
docker system df  # Should show 0 usage
```

---

##  Common Errors & Quick Fixes

| Error | Fix |
|---|---|
| `Port already in use` | Run `docker compose down` then `up` again |
| `Changes not reflecting` | Run `docker compose up --build` |
| `Container keeps restarting` | Check logs: `docker compose logs -f <name>` |
| `No space left on device` | Run `docker system prune -a` |
| `Permission denied` | Add `sudo` before the command |

---

##  Quick Reference — Most Used Daily Commands

```bash
# Start project
docker compose up -d

# Check what's running
docker ps

# See live logs
docker compose logs -f

# Rebuild after code changes
docker compose up --build -d

# Stop everything
docker compose down

# Clean up everything
docker system prune -a
```

---

##  Key Concepts (Explained Simply)

| Term | Simple Explanation |
|---|---|
| **Image** | A blueprint/template for a container (like a class in code) |
| **Container** | A running instance of an image (like an object from a class) |
| **Volume** | Persistent storage that survives container restarts |
| **Network** | Lets containers talk to each other |
| **Docker Compose** | A tool to manage multiple containers together using a single file |
| **docker-compose.yml** | Config file that defines all your containers and settings |

---

> Made for developers who just need Docker to work 
> Use `sudo` before any command if you get a permission error on Linux.
