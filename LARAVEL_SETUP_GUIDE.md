# 🚀 **HƯỚNG DẪN SETUP LARAVEL 10 + MYSQL + DOCKER**

## 📋 **Tổng quan**
Hướng dẫn chi tiết setup hệ thống backend Laravel 10 với MySQL và Docker cho dự án E-commerce.

---

## 🔧 **1. YÊU CẦU HỆ THỐNG**

### **Prerequisites:**
- Docker & Docker Compose
- Git
- Composer (optional - có thể dùng trong container)
- Node.js & NPM (cho frontend build)

---

## 📂 **2. CẤU TRÚC DỰ ÁN**

```
ecommerce-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── Admin/
│   │   │   ├── User/
│   │   │   └── Api/
│   │   ├── Requests/
│   │   ├── Resources/
│   │   └── Middleware/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   ├── Enums/
│   └── Traits/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── docker/
│   ├── nginx/
│   ├── php/
│   └── mysql/
├── storage/
├── public/
├── config/
├── routes/
├── tests/
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 🐳 **3. DOCKER CONFIGURATION**

### **3.1 docker-compose.yml**
```yaml
version: '3.8'

services:
  # Nginx Web Server
  nginx:
    image: nginx:alpine
    container_name: ecommerce_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www/html
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/sites/:/etc/nginx/sites-available/
      - ./docker/nginx/ssl/:/etc/ssl/certs/
    depends_on:
      - php
    networks:
      - ecommerce_network

  # PHP-FPM
  php:
    build:
      context: .
      dockerfile: ./docker/php/Dockerfile
    container_name: ecommerce_php
    volumes:
      - ./:/var/www/html
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    working_dir: /var/www/html
    depends_on:
      - mysql
      - redis
    networks:
      - ecommerce_network
    environment:
      - APP_ENV=local
      - APP_DEBUG=true

  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: ecommerce_mysql
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/my.cnf
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: ecommerce_db
      MYSQL_USER: ecommerce_user
      MYSQL_PASSWORD: ecommerce_password
    networks:
      - ecommerce_network

  # Redis Cache
  redis:
    image: redis:alpine
    container_name: ecommerce_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ecommerce_network

  # Mailhog (Local Email Testing)
  mailhog:
    image: mailhog/mailhog
    container_name: ecommerce_mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    networks:
      - ecommerce_network

  # Queue Worker
  queue:
    build:
      context: .
      dockerfile: ./docker/php/Dockerfile
    container_name: ecommerce_queue
    volumes:
      - ./:/var/www/html
    working_dir: /var/www/html
    command: php artisan queue:work --tries=3
    depends_on:
      - php
      - mysql
      - redis
    networks:
      - ecommerce_network

volumes:
  mysql_data:
  redis_data:

networks:
  ecommerce_network:
    driver: bridge
```

### **3.2 docker/php/Dockerfile**
```dockerfile
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libgd-dev \
    jpegoptim optipng pngquant gifsicle \
    vim \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Configure GD extension
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create user for laravel application
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Copy existing application directory contents
COPY . /var/www/html

# Copy existing application directory permissions
COPY --chown=www:www . /var/www/html

# Change current user to www
USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
```

### **3.3 docker/nginx/nginx.conf**
```nginx
user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/javascript
        application/xml+rss
        application/json;

    include /etc/nginx/sites-available/*.conf;
}
```

### **3.4 docker/nginx/sites/default.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    location ~ /\.ht {
        deny all;
    }

    # Handle static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

---

## ⚙️ **4. LARAVEL CONFIGURATION**

### **4.1 .env Configuration**
```env
# Application
APP_NAME="E-Commerce API"
APP_ENV=local
APP_KEY=base64:your_app_key_here
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=ecommerce_user
DB_PASSWORD=ecommerce_password

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@ecommerce.local
MAIL_FROM_NAME="${APP_NAME}"

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_TTL=1440

# File Storage
FILESYSTEM_DISK=public

# Queue
QUEUE_CONNECTION=redis

# Broadcasting
BROADCAST_DRIVER=pusher

# Pusher (WebSocket)
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_APP_CLUSTER=ap1

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

# Payment Gateway
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Third-party Services
ZALO_OA_ID=your_zalo_oa_id
ZALO_ACCESS_TOKEN=your_zalo_access_token
```

### **4.2 composer.json Dependencies**
```json
{
    "require": {
        "php": "^8.1",
        "guzzlehttp/guzzle": "^7.2",
        "laravel/framework": "^10.10",
        "laravel/sanctum": "^3.2",
        "laravel/tinker": "^2.8",
        "tymon/jwt-auth": "^2.0",
        "spatie/laravel-permission": "^5.10",
        "spatie/laravel-activitylog": "^4.7",
        "intervention/image": "^2.7",
        "maatwebsite/excel": "^3.1",
        "pusher/pusher-php-server": "^7.2",
        "predis/predis": "^2.0",
        "league/flysystem-aws-s3-v3": "^3.0",
        "barryvdh/laravel-cors": "^2.0",
        "fruitcake/laravel-cors": "^3.0"
    },
    "require-dev": {
        "fakerphp/faker": "^1.9.1",
        "laravel/pint": "^1.0",
        "laravel/sail": "^1.18",
        "mockery/mockery": "^1.4.4",
        "nunomaduro/collision": "^7.0",
        "phpunit/phpunit": "^10.1",
        "spatie/laravel-ignition": "^2.0",
        "laravel/telescope": "^4.14",
        "barryvdh/laravel-ide-helper": "^2.13"
    }
}
```

---

## 🚀 **5. SETUP COMMANDS**

### **5.1 Initial Setup**
```bash
# Clone repository
git clone <your-repo-url> ecommerce-backend
cd ecommerce-backend

# Copy environment file
cp .env.example .env

# Start Docker containers
docker-compose up -d

# Install Composer dependencies
docker-compose exec php composer install

# Generate application key
docker-compose exec php php artisan key:generate

# Generate JWT secret
docker-compose exec php php artisan jwt:secret

# Run migrations
docker-compose exec php php artisan migrate

# Run seeders
docker-compose exec php php artisan db:seed

# Create storage link
docker-compose exec php php artisan storage:link

# Clear cache
docker-compose exec php php artisan config:clear
docker-compose exec php php artisan cache:clear
docker-compose exec php php artisan route:clear
docker-compose exec php php artisan view:clear
```

### **5.2 Development Commands**
```bash
# Enter PHP container
docker-compose exec php bash

# Create migration
docker-compose exec php php artisan make:migration create_table_name

# Create model with migration
docker-compose exec php php artisan make:model ModelName -m

# Create controller
docker-compose exec php php artisan make:controller ControllerName

# Create service
docker-compose exec php php artisan make:service ServiceName

# Create repository
docker-compose exec php php artisan make:repository RepositoryName

# Create request
docker-compose exec php php artisan make:request RequestName

# Create resource
docker-compose exec php php artisan make:resource ResourceName

# Run tests
docker-compose exec php php artisan test

# Generate IDE helper files
docker-compose exec php php artisan ide-helper:generate
docker-compose exec php php artisan ide-helper:models
docker-compose exec php php artisan ide-helper:meta
```

---

## 📦 **6. PACKAGE INSTALLATION & CONFIGURATION**

### **6.1 JWT Authentication**
```bash
# Install JWT
composer require tymon/jwt-auth

# Publish config
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"

# Generate secret
php artisan jwt:secret
```

**Config: config/jwt.php**
```php
<?php

return [
    'secret' => env('JWT_SECRET'),
    'keys' => [
        'public' => env('JWT_PUBLIC_KEY'),
        'private' => env('JWT_PRIVATE_KEY'),
        'passphrase' => env('JWT_PASSPHRASE'),
    ],
    'ttl' => env('JWT_TTL', 1440), // 24 hours
    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // 2 weeks
    'algo' => env('JWT_ALGO', 'HS256'),
    'required_claims' => [
        'iss',
        'iat',
        'exp',
        'nbf',
        'sub',
        'jti',
    ],
    'persistent_claims' => [],
    'lock_subject' => true,
    'leeway' => env('JWT_LEEWAY', 0),
    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),
    'decrypt_cookies' => false,
    'providers' => [
        'jwt' => Tymon\JWTAuth\Providers\JWT\Lcobucci::class,
        'auth' => Tymon\JWTAuth\Providers\Auth\Illuminate::class,
        'storage' => Tymon\JWTAuth\Providers\Storage\Illuminate::class,
    ],
];
```

### **6.2 Laravel Permission**
```bash
# Install package
composer require spatie/laravel-permission

# Publish migration
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Run migration
php artisan migrate
```

### **6.3 Activity Log**
```bash
# Install package
composer require spatie/laravel-activitylog

# Publish migration
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"

# Run migration
php artisan migrate
```

### **6.4 Image Intervention**
```bash
# Install package
composer require intervention/image

# Publish config
php artisan vendor:publish --provider="Intervention\Image\ImageServiceProviderLaravelRecent"
```

---

## 🔧 **7. LARAVEL CONFIGURATION FILES**

### **7.1 config/app.php - Service Providers**
```php
'providers' => [
    // Default providers...
    
    // Custom Service Providers
    App\Providers\RepositoryServiceProvider::class,
    App\Providers\ServiceServiceProvider::class,
    
    // Third-party providers
    Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
    Spatie\Permission\PermissionServiceProvider::class,
    Intervention\Image\ImageServiceProvider::class,
    Maatwebsite\Excel\ExcelServiceProvider::class,
],

'aliases' => [
    // Default aliases...
    
    // Custom aliases
    'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,
    'JWTFactory' => Tymon\JWTAuth\Facades\JWTFactory::class,
    'Image' => Intervention\Image\Facades\Image::class,
],
```

### **7.2 config/cors.php**
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### **7.3 config/filesystems.php**
```php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
        'throw' => false,
    ],

    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
        'throw' => false,
    ],

    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'endpoint' => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        'throw' => false,
    ],
],
```

---

## 🏗️ **8. LARAVEL ARCHITECTURE SETUP**

### **8.1 Service Provider for Repositories**
**app/Providers/RepositoryServiceProvider.php**
```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            \App\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );
        
        $this->app->bind(
            \App\Repositories\Contracts\DepositRepositoryInterface::class,
            \App\Repositories\DepositRepository::class
        );
        
        // Add more repository bindings...
    }
}
```

### **8.2 Base Repository**
**app/Repositories/BaseRepository.php**
```php
<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->model->find($id)->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->find($id)->delete();
    }
}
```

### **8.3 Base Service**
**app/Services/BaseService.php**
```php
<?php

namespace App\Services;

use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseService
{
    protected $repository;

    public function __construct(BaseRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function getById(int $id): ?Model
    {
        return $this->repository->find($id);
    }

    public function create(array $data): Model
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
```

---

## 📝 **9. ARTISAN COMMANDS**

### **9.1 Custom Artisan Commands**
```bash
# Create custom commands for project setup
php artisan make:command MakeService
php artisan make:command MakeRepository
php artisan make:command SetupProject
```

### **9.2 Useful Development Commands**
```bash
# Generate API documentation
php artisan l5-swagger:generate

# Optimize for production
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear all caches
php artisan optimize:clear

# Queue management
php artisan queue:work
php artisan queue:restart
php artisan queue:failed
```

---

## 🔒 **10. SECURITY CONSIDERATIONS**

### **10.1 Environment Security**
```bash
# Set proper file permissions
chmod 600 .env
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### **10.2 Security Headers (Middleware)**
```php
// app/Http/Middleware/SecurityHeaders.php
public function handle($request, Closure $next)
{
    $response = $next($request);
    
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    return $response;
}
```

---

## 📊 **11. MONITORING & LOGGING**

### **11.1 Laravel Telescope (Development)**
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### **11.2 Log Configuration**
```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14,
    ],
    
    'api' => [
        'driver' => 'daily',
        'path' => storage_path('logs/api.log'),
        'level' => 'info',
        'days' => 30,
    ],
],
```

---

## 🚀 **12. DEPLOYMENT**

### **12.1 Production Docker Compose**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www/html
      - ./docker/nginx/nginx.prod.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/ssl/:/etc/ssl/certs/
    depends_on:
      - php
    restart: unless-stopped

  php:
    build:
      context: .
      dockerfile: ./docker/php/Dockerfile.prod
    volumes:
      - ./:/var/www/html
    depends_on:
      - mysql
      - redis
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - APP_DEBUG=false

  mysql:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

### **12.2 Production Deployment Script**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Install dependencies
docker-compose exec php composer install --no-dev --optimize-autoloader

# Run migrations
docker-compose exec php php artisan migrate --force

# Clear and cache
docker-compose exec php php artisan config:cache
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache

# Restart queue workers
docker-compose exec php php artisan queue:restart

echo "✅ Deployment completed!"
```

---

## 📚 **13. RECOMMENDED PACKAGES**

### **13.1 Core Packages**
```json
{
    "tymon/jwt-auth": "JWT Authentication",
    "spatie/laravel-permission": "Role & Permission management",
    "spatie/laravel-activitylog": "Activity logging",
    "intervention/image": "Image manipulation",
    "maatwebsite/excel": "Excel import/export",
    "pusher/pusher-php-server": "Real-time notifications",
    "predis/predis": "Redis client",
    "guzzlehttp/guzzle": "HTTP client"
}
```

### **13.2 Development Packages**
```json
{
    "laravel/telescope": "Debugging assistant",
    "barryvdh/laravel-ide-helper": "IDE helper",
    "laravel/pint": "Code style fixer",
    "phpunit/phpunit": "Testing framework"
}
```

---

## ✅ **14. FINAL CHECKLIST**

- [ ] Docker containers running
- [ ] Database connected
- [ ] Migrations completed
- [ ] Seeders run
- [ ] JWT configured
- [ ] File storage working
- [ ] Cache configured
- [ ] Queue working
- [ ] Mail configured
- [ ] API routes accessible
- [ ] Authentication working
- [ ] File uploads working

---

**📅 Last Updated:** 2024-01-01  
**👨‍💻 Author:** Development Team  
**🎯 Status:** Production Ready
