#!/usr/bin/env bash
# =============================================================================
# deploy.sh  —  NeuroLab Production Deployment Script
# Domain: synaping.com
# =============================================================================
# Usage:
#   ./deploy.sh            # Full deployment (pull, build, restart)
#   ./deploy.sh --ssl-init # First-time SSL certificate issuance
#   ./deploy.sh --update   # Pull latest code and restart services
# =============================================================================
set -euo pipefail

# ---- Config -----------------------------------------------------------------
DOMAIN="synaping.com"
APP_DIR="/opt/neurolab-website"
GIT_REPO="https://github.com/wang-yuhao/neurolab-website.git"
GIT_BRANCH="main"
SSL_EMAIL="admin@synaping.com"
COMPOSE_CMD="docker compose"

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ---- Checks -----------------------------------------------------------------
check_dependencies() {
    info "Checking dependencies..."
    for cmd in docker git curl; do
        command -v $cmd &>/dev/null || error "$cmd is not installed"
    done
    docker compose version &>/dev/null || error "Docker Compose v2 not found"
    ok "All dependencies OK"
}

# ---- SSL: First-time certificate issuance -----------------------------------
ssl_init() {
    info "Issuing Let's Encrypt certificate for ${DOMAIN}..."

    # Create webroot directory for ACME challenge
    mkdir -p /var/www/certbot

    # Start Nginx on HTTP only (without SSL config)
    # Temporarily rename prod conf so Nginx starts without SSL
    if [ -f "${APP_DIR}/nginx/conf.d/${DOMAIN}.conf" ]; then
        cp "${APP_DIR}/nginx/conf.d/${DOMAIN}.conf" "/tmp/${DOMAIN}.conf.bak"
        cat > "${APP_DIR}/nginx/conf.d/${DOMAIN}.conf" << 'EOF'
server {
    listen 80;
    server_name synaping.com www.synaping.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'Certbot init'; }
}
EOF
    fi

    # Start/reload Nginx
    $COMPOSE_CMD -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
    sleep 3

    # Issue certificate
    docker run --rm \
        -v /etc/letsencrypt:/etc/letsencrypt \
        -v /var/www/certbot:/var/www/certbot \
        certbot/certbot certonly \
            --webroot \
            --webroot-path /var/www/certbot \
            --email "${SSL_EMAIL}" \
            --agree-tos \
            --no-eff-email \
            --domains "${DOMAIN},www.${DOMAIN}"

    # Restore production Nginx config
    if [ -f "/tmp/${DOMAIN}.conf.bak" ]; then
        mv "/tmp/${DOMAIN}.conf.bak" "${APP_DIR}/nginx/conf.d/${DOMAIN}.conf"
    fi

    ok "SSL certificate issued for ${DOMAIN}"
    info "Reloading Nginx with SSL config..."
    $COMPOSE_CMD -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
}

# ---- Deploy -----------------------------------------------------------------
deploy() {
    info "Starting deployment to ${APP_DIR}..."

    # 1. Clone or pull latest code
    if [ -d "${APP_DIR}/.git" ]; then
        info "Pulling latest changes from ${GIT_BRANCH}..."
        cd "${APP_DIR}"
        git fetch origin
        git reset --hard "origin/${GIT_BRANCH}"
    else
        info "Cloning repository..."
        git clone --branch "${GIT_BRANCH}" "${GIT_REPO}" "${APP_DIR}"
        cd "${APP_DIR}"
    fi

    # 2. Verify .env exists
    if [ ! -f "${APP_DIR}/.env" ]; then
        error ".env file not found!\n  Run: cp ${APP_DIR}/.env.example ${APP_DIR}/.env\n  Then edit the file with your production values."
    fi

    # Source env for validation
    set -a; source "${APP_DIR}/.env"; set +a

    # 3. Validate critical env vars
    for var in MONGO_USER MONGO_PASSWORD SECRET_KEY; do
        if [ -z "${!var:-}" ]; then
            error "${var} is not set in .env"
        fi
        if [[ "${!var}" == *"CHANGE_ME"* ]]; then
            error "${var} still contains placeholder value CHANGE_ME — please set a real value"
        fi
    done

    # 4. Build and start production stack
    info "Building Docker images..."
    $COMPOSE_CMD \
        -f docker-compose.yml \
        -f docker-compose.prod.yml \
        build --no-cache

    info "Starting production stack..."
    $COMPOSE_CMD \
        -f docker-compose.yml \
        -f docker-compose.prod.yml \
        up -d --remove-orphans

    # 5. Health check
    info "Waiting for services to be healthy..."
    sleep 10

    BACKEND_STATUS=$(curl -sf http://localhost:8000/health 2>/dev/null || echo 'FAILED')
    if [[ "$BACKEND_STATUS" == *'FAILED'* ]]; then
        warn "Backend health check failed — check logs: docker compose logs backend"
    else
        ok "Backend is healthy"
    fi

    NGINX_STATUS=$(curl -sf http://localhost/nginx-health 2>/dev/null || echo 'FAILED')
    if [[ "$NGINX_STATUS" == *'FAILED'* ]]; then
        warn "Nginx health check failed — check logs: docker compose logs nginx"
    else
        ok "Nginx is healthy"
    fi

    ok "Deployment complete! Site available at https://${DOMAIN}"
    info "View logs:  docker compose logs -f"
    info "Stop:       docker compose down"
}

# ---- Entry Point ------------------------------------------------------------
check_dependencies

case "${1:-deploy}" in
    --ssl-init) ssl_init ;;
    --update)   deploy ;;
    deploy)     deploy ;;
    *)          echo "Usage: $0 [deploy|--ssl-init|--update]"; exit 1 ;;
esac
