# 🏗️ **LARAVEL MVC ARCHITECTURE GUIDE**

## 📋 **Tổng quan**
Hướng dẫn thiết kế kiến trúc Laravel MVC với Service, Repository Pattern cho dự án E-commerce. Bao gồm cấu trúc thư mục, code examples và best practices.

---

## 📂 **1. ARCHITECTURE OVERVIEW**

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── RegisterController.php
│   │   │   │   └── LogoutController.php
│   │   │   ├── User/
│   │   │   │   ├── DepositController.php
│   │   │   │   ├── WalletController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   └── ProfileController.php
│   │   │   └── Admin/
│   │   │       ├── UserController.php
│   │   │       ├── DepositController.php
│   │   │       ├── ProductController.php
│   │   │       ├── OrderController.php
│   │   │       └── DashboardController.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   └── RegisterRequest.php
│   │   │   ├── User/
│   │   │   │   ├── DepositRequest.php
│   │   │   │   └── UpdateProfileRequest.php
│   │   │   └── Admin/
│   │   │       ├── StoreProductRequest.php
│   │   │       └── UpdateDepositRequest.php
│   │   ├── Resources/
│   │   │   ├── Auth/
│   │   │   │   └── UserResource.php
│   │   │   ├── User/
│   │   │   │   ├── DepositResource.php
│   │   │   │   ├── WalletResource.php
│   │   │   │   └── OrderResource.php
│   │   │   └── Admin/
│   │   │       ├── UserResource.php
│   │   │       ├── DepositResource.php
│   │   │       └── ProductResource.php
│   │   └── Middleware/
│   │       ├── AdminMiddleware.php
│   │       ├── SubAdminMiddleware.php
│   │       └── ApiAuthMiddleware.php
├── Models/
│   ├── User.php
│   ├── Deposit.php
│   ├── Wallet.php
│   ├── WalletTransaction.php
│   ├── Product.php
│   ├── Category.php
│   ├── Order.php
│   ├── OrderItem.php
│   └── Notification.php
├── Services/
│   ├── Auth/
│   │   ├── AuthService.php
│   │   └── JwtService.php
│   ├── User/
│   │   ├── DepositService.php
│   │   ├── WalletService.php
│   │   └── OrderService.php
│   ├── Admin/
│   │   ├── UserManagementService.php
│   │   ├── DepositManagementService.php
│   │   └── ProductService.php
│   └── Common/
│       ├── FileUploadService.php
│       ├── NotificationService.php
│       └── ImageProcessingService.php
├── Repositories/
│   ├── Contracts/
│   │   ├── UserRepositoryInterface.php
│   │   ├── DepositRepositoryInterface.php
│   │   ├── WalletRepositoryInterface.php
│   │   └── ProductRepositoryInterface.php
│   ├── BaseRepository.php
│   ├── UserRepository.php
│   ├── DepositRepository.php
│   ├── WalletRepository.php
│   └── ProductRepository.php
├── Enums/
│   ├── UserRoleEnum.php
│   ├── UserStatusEnum.php
│   ├── DepositStatusEnum.php
│   ├── OrderStatusEnum.php
│   └── PaymentStatusEnum.php
├── Traits/
│   ├── HasApiResponse.php
│   ├── HasUuid.php
│   └── HasFileUpload.php
└── Providers/
    ├── RepositoryServiceProvider.php
    ├── ServiceServiceProvider.php
    └── CustomServiceProvider.php
```

---

## 🎯 **2. BASE CLASSES**

### **2.1 Base Controller**
**app/Http/Controllers/Api/BaseController.php**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\HasApiResponse;
use Illuminate\Http\JsonResponse;

abstract class BaseController extends Controller
{
    use HasApiResponse;

    protected int $defaultPerPage = 15;
    protected int $maxPerPage = 100;

    /**
     * Get pagination parameters from request
     */
    protected function getPaginationParams(): array
    {
        $page = request('page', 1);
        $perPage = min(request('per_page', $this->defaultPerPage), $this->maxPerPage);

        return [
            'page' => max(1, $page),
            'per_page' => max(1, $perPage)
        ];
    }

    /**
     * Get search parameters from request
     */
    protected function getSearchParams(): array
    {
        return [
            'search' => request('search'),
            'status' => request('status'),
            'from_date' => request('from_date'),
            'to_date' => request('to_date'),
            'sort_by' => request('sort_by', 'created_at'),
            'sort_order' => request('sort_order', 'desc')
        ];
    }
}
```

### **2.2 Base Repository**
**app/Repositories/BaseRepository.php**
```php
<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->select($columns)->get();
    }

    /**
     * Get paginated records
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->select($columns)->paginate($perPage);
    }

    /**
     * Find record by ID
     */
    public function find(int $id, array $columns = ['*']): ?Model
    {
        return $this->model->select($columns)->find($id);
    }

    /**
     * Find record by field
     */
    public function findBy(string $field, $value, array $columns = ['*']): ?Model
    {
        return $this->model->select($columns)->where($field, $value)->first();
    }

    /**
     * Create new record
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update record
     */
    public function update(int $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Delete record
     */
    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    /**
     * Get query builder
     */
    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    /**
     * Search with filters
     */
    public function search(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        foreach ($filters as $field => $value) {
            if ($value !== null && $value !== '') {
                if (in_array($field, ['search', 'name', 'email'])) {
                    $query->where($field, 'LIKE', "%{$value}%");
                } else {
                    $query->where($field, $value);
                }
            }
        }

        return $query->paginate($perPage);
    }
}
```

### **2.3 Base Service**
**app/Services/BaseService.php**
```php
<?php

namespace App\Services;

use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

abstract class BaseService
{
    protected BaseRepository $repository;

    public function __construct(BaseRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all records with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    /**
     * Get record by ID
     */
    public function getById(int $id): ?Model
    {
        return $this->repository->find($id);
    }

    /**
     * Create new record
     */
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            return $this->repository->create($data);
        });
    }

    /**
     * Update record
     */
    public function update(int $id, array $data): bool
    {
        return DB::transaction(function () use ($id, $data) {
            return $this->repository->update($id, $data);
        });
    }

    /**
     * Delete record
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->repository->delete($id);
        });
    }

    /**
     * Search with filters
     */
    public function search(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->search($filters, $perPage);
    }

    /**
     * Log service action
     */
    protected function logAction(string $action, array $data = []): void
    {
        Log::info(static::class . " - {$action}", $data);
    }
}
```

---

## 🔐 **3. AUTHENTICATION IMPLEMENTATION**

### **3.1 Auth Service**
**app/Services/Auth/AuthService.php**
```php
<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Services\BaseService;
use App\Repositories\UserRepository;
use App\Enums\UserRoleEnum;
use App\Enums\UserStatusEnum;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService extends BaseService
{
    protected UserRepository $userRepository;
    protected JwtService $jwtService;

    public function __construct(
        UserRepository $userRepository,
        JwtService $jwtService
    ) {
        parent::__construct($userRepository);
        $this->userRepository = $userRepository;
        $this->jwtService = $jwtService;
    }

    /**
     * Login user
     */
    public function login(array $credentials): array
    {
        $user = $this->userRepository->findBy('email', $credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email hoặc mật khẩu không đúng'],
            ]);
        }

        if ($user->status !== UserStatusEnum::ACTIVE->value) {
            throw ValidationException::withMessages([
                'email' => ['Tài khoản đã bị khóa'],
            ]);
        }

        // Update last login
        $this->userRepository->update($user->id, [
            'last_login_at' => now(),
            'last_login_ip' => request()->ip()
        ]);

        $token = $this->jwtService->generateToken($user);

        return [
            'user' => $user,
            'token' => $token,
            'expires_in' => config('jwt.ttl') * 60
        ];
    }

    /**
     * Register user
     */
    public function register(array $data): array
    {
        // Validate sub admin code if provided
        if (isset($data['sub_admin_code'])) {
            $subAdmin = $this->userRepository->findBy('sub_admin_code', $data['sub_admin_code']);
            
            if (!$subAdmin || $subAdmin->role !== UserRoleEnum::SUB_ADMIN->value) {
                throw ValidationException::withMessages([
                    'sub_admin_code' => ['Mã sub admin không tồn tại hoặc đã bị vô hiệu hóa'],
                ]);
            }
            
            $data['sub_admin_id'] = $subAdmin->id;
        }

        $data['password'] = Hash::make($data['password']);
        $data['role'] = UserRoleEnum::USER->value;
        $data['status'] = UserStatusEnum::ACTIVE->value;

        $user = $this->userRepository->create($data);

        // Create wallet for user
        $user->wallet()->create([
            'balance' => 0,
            'currency' => 'VND'
        ]);

        $token = $this->jwtService->generateToken($user);

        return [
            'user' => $user->load('subAdmin'),
            'token' => $token
        ];
    }

    /**
     * Get authenticated user
     */
    public function me(): User
    {
        return Auth::user();
    }

    /**
     * Logout user
     */
    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }
}
```

### **3.2 JWT Service**
**app/Services/Auth/JwtService.php**
```php
<?php

namespace App\Services\Auth;

use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtService
{
    /**
     * Generate JWT token for user
     */
    public function generateToken(User $user): string
    {
        return JWTAuth::fromUser($user);
    }

    /**
     * Validate and get user from token
     */
    public function getUserFromToken(string $token): ?User
    {
        try {
            JWTAuth::setToken($token);
            return JWTAuth::authenticate();
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Refresh token
     */
    public function refreshToken(): string
    {
        return JWTAuth::refresh();
    }

    /**
     * Invalidate token
     */
    public function invalidateToken(string $token): bool
    {
        try {
            JWTAuth::setToken($token);
            JWTAuth::invalidate();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
```

---

## 💳 **4. DEPOSIT MANAGEMENT IMPLEMENTATION**

### **4.1 Deposit Repository**
**app/Repositories/DepositRepository.php**
```php
<?php

namespace App\Repositories;

use App\Models\Deposit;
use App\Repositories\Contracts\DepositRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class DepositRepository extends BaseRepository implements DepositRepositoryInterface
{
    public function __construct(Deposit $model)
    {
        parent::__construct($model);
    }

    /**
     * Get deposits with filters and pagination
     */
    public function getDepositsWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['user:id,name,email,avatar']);

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('code', 'like', '%' . $filters['search'] . '%')
                  ->orWhereHas('user', function ($userQuery) use ($filters) {
                      $userQuery->where('name', 'like', '%' . $filters['search'] . '%')
                               ->orWhere('email', 'like', '%' . $filters['search'] . '%');
                  });
            });
        }

        if (!empty($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get deposit statistics
     */
    public function getStatistics(): array
    {
        $today = Carbon::today();
        
        return [
            'pending_count' => $this->model->where('status', 'pending')->count(),
            'approved_count' => $this->model->where('status', 'approved')->count(),
            'rejected_count' => $this->model->where('status', 'rejected')->count(),
            'today_total' => $this->model->whereDate('created_at', $today)->sum('amount'),
            'today_approved' => $this->model->whereDate('created_at', $today)
                                          ->where('status', 'approved')
                                          ->sum('amount'),
        ];
    }

    /**
     * Get user deposits
     */
    public function getUserDeposits(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)
                          ->orderBy('created_at', 'desc')
                          ->paginate($perPage);
    }

    /**
     * Generate unique deposit code
     */
    public function generateDepositCode(): string
    {
        do {
            $code = 'DEP' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while ($this->model->where('code', $code)->exists());

        return $code;
    }
}
```

### **4.2 Deposit Service**
**app/Services/User/DepositService.php**
```php
<?php

namespace App\Services\User;

use App\Models\Deposit;
use App\Services\BaseService;
use App\Repositories\DepositRepository;
use App\Services\Common\FileUploadService;
use App\Services\Common\NotificationService;
use App\Enums\DepositStatusEnum;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DepositService extends BaseService
{
    protected DepositRepository $depositRepository;
    protected FileUploadService $fileUploadService;
    protected NotificationService $notificationService;

    public function __construct(
        DepositRepository $depositRepository,
        FileUploadService $fileUploadService,
        NotificationService $notificationService
    ) {
        parent::__construct($depositRepository);
        $this->depositRepository = $depositRepository;
        $this->fileUploadService = $fileUploadService;
        $this->notificationService = $notificationService;
    }

    /**
     * Create deposit request
     */
    public function createDeposit(array $data): Deposit
    {
        return DB::transaction(function () use ($data) {
            $user = Auth::user();
            
            // Generate deposit code and reference
            $code = $this->depositRepository->generateDepositCode();
            $referenceCode = 'NAP_' . $user->id . '_' . time();

            // Handle proof image upload
            $proofImage = null;
            if (isset($data['proof_image'])) {
                $proofImage = $this->fileUploadService->uploadBase64Image(
                    $data['proof_image'],
                    'deposits/proofs'
                );
            }

            $depositData = [
                'code' => $code,
                'user_id' => $user->id,
                'amount' => $data['amount'],
                'description' => $data['description'] ?? null,
                'bank_account' => $data['bank_account'] ?? null,
                'proof_image' => $proofImage,
                'reference_code' => $referenceCode,
                'status' => DepositStatusEnum::PENDING->value,
            ];

            $deposit = $this->depositRepository->create($depositData);

            // Update wallet pending balance
            $user->wallet()->increment('pending_balance', $data['amount']);

            // Send notification to admins
            $this->notificationService->notifyAdmins(
                'Yêu cầu nạp tiền mới',
                "Người dùng {$user->name} đã tạo yêu cầu nạp tiền {$code} với số tiền " . number_format($data['amount']) . 'đ',
                'deposit_created',
                ['deposit_id' => $deposit->id]
            );

            $this->logAction('deposit_created', [
                'user_id' => $user->id,
                'deposit_id' => $deposit->id,
                'amount' => $data['amount']
            ]);

            return $deposit;
        });
    }

    /**
     * Get user deposit history
     */
    public function getUserDeposits(int $perPage = 15): \Illuminate\Pagination\LengthAwarePaginator
    {
        $userId = Auth::id();
        return $this->depositRepository->getUserDeposits($userId, $perPage);
    }
}
```

---

## 👥 **5. USER MANAGEMENT IMPLEMENTATION**

### **5.1 User Repository**
**app/Repositories/UserRepository.php**
```php
<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Enums\UserRoleEnum;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Get users with filters
     */
    public function getUsersWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['subAdmin:id,name,sub_admin_code', 'wallet:user_id,balance']);

        // Apply filters
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['sub_admin_id'])) {
            $query->where('sub_admin_id', $filters['sub_admin_id']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('phone', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get sub admins
     */
    public function getSubAdmins(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('role', UserRoleEnum::SUB_ADMIN->value)
                          ->withCount('managedUsers')
                          ->withSum('managedUsersOrders', 'final_amount')
                          ->paginate($perPage);
    }

    /**
     * Get users by sub admin
     */
    public function getUsersBySubAdmin(int $subAdminId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('sub_admin_id', $subAdminId)
                          ->with(['wallet:user_id,balance', 'orders'])
                          ->paginate($perPage);
    }

    /**
     * Generate unique sub admin code
     */
    public function generateSubAdminCode(): string
    {
        do {
            $code = 'SA' . str_pad(mt_rand(1, 999), 3, '0', STR_PAD_LEFT);
        } while ($this->model->where('sub_admin_code', $code)->exists());

        return $code;
    }

    /**
     * Validate sub admin code
     */
    public function validateSubAdminCode(string $code): ?User
    {
        return $this->model->where('sub_admin_code', $code)
                          ->where('role', UserRoleEnum::SUB_ADMIN->value)
                          ->where('status', 'active')
                          ->first();
    }
}
```

---

## 🛍️ **6. PRODUCT MANAGEMENT IMPLEMENTATION**

### **6.1 Product Repository**
**app/Repositories/ProductRepository.php**
```php
<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Get products with filters
     */
    public function getProductsWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['category:id,name,slug', 'images' => function ($q) {
            $q->where('is_primary', true)->orWhere('sort_order', 0);
        }]);

        // Apply filters
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['featured'])) {
            $query->where('featured', true);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('sku', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->where('featured', true)
                          ->where('status', 'active')
                          ->with(['category', 'images'])
                          ->limit($limit)
                          ->get();
    }

    /**
     * Generate unique SKU
     */
    public function generateSku(string $categoryPrefix = 'PRD'): string
    {
        do {
            $sku = $categoryPrefix . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        } while ($this->model->where('sku', $sku)->exists());

        return $sku;
    }

    /**
     * Update product stock
     */
    public function updateStock(int $productId, int $quantity, string $operation = 'decrease'): bool
    {
        $product = $this->find($productId);
        
        if (!$product) {
            return false;
        }

        if ($operation === 'decrease') {
            if ($product->stock < $quantity) {
                return false; // Insufficient stock
            }
            $newStock = $product->stock - $quantity;
        } else {
            $newStock = $product->stock + $quantity;
        }

        return $this->update($productId, ['stock' => $newStock]);
    }
}
```

---

## 📊 **7. REQUEST VALIDATION**

### **7.1 Deposit Request**
**app/Http/Requests/User/DepositRequest.php**
```php
<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'amount' => [
                'required',
                'numeric',
                'min:50000',
                'max:50000000'
            ],
            'description' => [
                'nullable',
                'string',
                'max:500'
            ],
            'bank_account' => [
                'nullable',
                'string',
                'max:50'
            ],
            'proof_image' => [
                'nullable',
                'string', // Base64 string
                'max:5000000' // ~5MB
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Số tiền nạp là bắt buộc',
            'amount.min' => 'Số tiền nạp tối thiểu 50.000đ',
            'amount.max' => 'Số tiền nạp tối đa 50.000.000đ',
            'amount.numeric' => 'Số tiền phải là số',
            'description.max' => 'Mô tả không được quá 500 ký tự',
            'bank_account.max' => 'Số tài khoản không được quá 50 ký tự',
            'proof_image.max' => 'Ảnh chứng từ quá lớn (tối đa 5MB)'
        ];
    }

    public function attributes(): array
    {
        return [
            'amount' => 'số tiền',
            'description' => 'mô tả',
            'bank_account' => 'số tài khoản',
            'proof_image' => 'ảnh chứng từ'
        ];
    }
}
```

### **7.2 Register Request**
**app/Http/Requests/Auth/RegisterRequest.php**
```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email'
            ],
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
                'confirmed'
            ],
            'phone' => [
                'nullable',
                'string',
                'regex:/^[0-9]{10,15}$/'
            ],
            'sub_admin_code' => [
                'nullable',
                'string',
                'exists:users,sub_admin_code'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Họ tên là bắt buộc',
            'name.min' => 'Họ tên phải có ít nhất 2 ký tự',
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã được sử dụng',
            'password.required' => 'Mật khẩu là bắt buộc',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp',
            'phone.regex' => 'Số điện thoại không đúng định dạng',
            'sub_admin_code.exists' => 'Mã sub admin không tồn tại'
        ];
    }
}
```

---

## 📄 **8. API RESOURCES**

### **8.1 User Resource**
**app/Http/Resources/Auth/UserResource.php**
```php
<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar ? url($this->avatar) : null,
            'role' => $this->role,
            'status' => $this->status,
            'wallet_balance' => $this->whenLoaded('wallet', function () {
                return $this->wallet?->balance ?? 0;
            }),
            'sub_admin' => $this->whenLoaded('subAdmin', function () {
                return $this->subAdmin ? [
                    'id' => $this->subAdmin->id,
                    'name' => $this->subAdmin->name,
                    'code' => $this->subAdmin->sub_admin_code
                ] : null;
            }),
            'last_login_at' => $this->last_login_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

### **8.2 Deposit Resource**
**app/Http/Resources/User/DepositResource.php**
```php
<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepositResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'amount' => $this->amount,
            'formatted_amount' => number_format($this->amount) . 'đ',
            'description' => $this->description,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'bank_account' => $this->bank_account,
            'proof_image' => $this->proof_image ? url($this->proof_image) : null,
            'reference_code' => $this->reference_code,
            'admin_note' => $this->admin_note,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'avatar' => $this->user->avatar ? url($this->user->avatar) : null,
                ];
            }),
            'processed_by' => $this->whenLoaded('processedBy', function () {
                return $this->processedBy ? [
                    'id' => $this->processedBy->id,
                    'name' => $this->processedBy->name,
                ] : null;
            }),
            'processed_at' => $this->processed_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'Chờ xử lý',
            'approved' => 'Đã duyệt',
            'rejected' => 'Từ chối',
            default => ucfirst($this->status)
        };
    }
}
```

---

## 🎯 **9. ENUMS**

### **9.1 User Role Enum**
**app/Enums/UserRoleEnum.php**
```php
<?php

namespace App\Enums;

enum UserRoleEnum: string
{
    case ADMIN = 'admin';
    case SUB_ADMIN = 'sub_admin';
    case USER = 'user';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Quản trị viên',
            self::SUB_ADMIN => 'Sub Admin',
            self::USER => 'Người dùng',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function options(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
```

### **9.2 Deposit Status Enum**
**app/Enums/DepositStatusEnum.php**
```php
<?php

namespace App\Enums;

enum DepositStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Chờ xử lý',
            self::APPROVED => 'Đã duyệt',
            self::REJECTED => 'Từ chối',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'warning',
            self::APPROVED => 'success',
            self::REJECTED => 'danger',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
```

---

## 🔧 **10. TRAITS**

### **10.1 API Response Trait**
**app/Traits/HasApiResponse.php**
```php
<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

trait HasApiResponse
{
    /**
     * Success response
     */
    protected function successResponse(
        $data = null,
        string $message = 'Thành công',
        int $statusCode = 200
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if ($data !== null) {
            if ($data instanceof LengthAwarePaginator) {
                $response['data'] = [
                    'items' => $data->items(),
                    'pagination' => [
                        'current_page' => $data->currentPage(),
                        'per_page' => $data->perPage(),
                        'total' => $data->total(),
                        'total_pages' => $data->lastPage(),
                        'has_next' => $data->hasMorePages(),
                        'has_prev' => $data->currentPage() > 1,
                    ]
                ];
            } else {
                $response['data'] = $data;
            }
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Error response
     */
    protected function errorResponse(
        string $message = 'Có lỗi xảy ra',
        int $statusCode = 400,
        array $errors = []
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Validation error response
     */
    protected function validationErrorResponse(array $errors): JsonResponse
    {
        return $this->errorResponse(
            'Dữ liệu không hợp lệ',
            422,
            $errors
        );
    }

    /**
     * Unauthorized response
     */
    protected function unauthorizedResponse(string $message = 'Không có quyền truy cập'): JsonResponse
    {
        return $this->errorResponse($message, 401);
    }

    /**
     * Not found response
     */
    protected function notFoundResponse(string $message = 'Không tìm thấy dữ liệu'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Resource response
     */
    protected function resourceResponse(
        JsonResource $resource,
        string $message = 'Thành công',
        int $statusCode = 200
    ): JsonResponse {
        return $this->successResponse($resource, $message, $statusCode);
    }
}
```

---

## 🔗 **11. SERVICE PROVIDERS**

### **11.1 Repository Service Provider**
**app/Providers/RepositoryServiceProvider.php**
```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    protected array $repositories = [
        \App\Repositories\Contracts\UserRepositoryInterface::class => \App\Repositories\UserRepository::class,
        \App\Repositories\Contracts\DepositRepositoryInterface::class => \App\Repositories\DepositRepository::class,
        \App\Repositories\Contracts\WalletRepositoryInterface::class => \App\Repositories\WalletRepository::class,
        \App\Repositories\Contracts\ProductRepositoryInterface::class => \App\Repositories\ProductRepository::class,
        \App\Repositories\Contracts\OrderRepositoryInterface::class => \App\Repositories\OrderRepository::class,
        \App\Repositories\Contracts\CategoryRepositoryInterface::class => \App\Repositories\CategoryRepository::class,
    ];

    public function register(): void
    {
        foreach ($this->repositories as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }

    public function boot(): void
    {
        //
    }
}
```

### **11.2 Service Service Provider**
**app/Providers/ServiceServiceProvider.php**
```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    protected array $services = [
        \App\Services\Auth\AuthService::class,
        \App\Services\Auth\JwtService::class,
        \App\Services\User\DepositService::class,
        \App\Services\User\WalletService::class,
        \App\Services\User\OrderService::class,
        \App\Services\Admin\UserManagementService::class,
        \App\Services\Admin\DepositManagementService::class,
        \App\Services\Admin\ProductService::class,
        \App\Services\Common\FileUploadService::class,
        \App\Services\Common\NotificationService::class,
        \App\Services\Common\ImageProcessingService::class,
    ];

    public function register(): void
    {
        foreach ($this->services as $service) {
            $this->app->singleton($service);
        }
    }

    public function boot(): void
    {
        //
    }
}
```

---

## 📚 **12. RECOMMENDED PACKAGES**

### **12.1 Core Packages**
```json
{
    "tymon/jwt-auth": "^2.0",
    "spatie/laravel-permission": "^5.10",
    "spatie/laravel-activitylog": "^4.7",
    "intervention/image": "^2.7",
    "maatwebsite/excel": "^3.1",
    "pusher/pusher-php-server": "^7.2",
    "predis/predis": "^2.0",
    "league/flysystem-aws-s3-v3": "^3.0"
}
```

### **12.2 Development Packages**
```json
{
    "laravel/telescope": "^4.14",
    "barryvdh/laravel-ide-helper": "^2.13",
    "laravel/pint": "^1.0",
    "phpunit/phpunit": "^10.1"
}
```

---

## ✅ **13. FINAL CHECKLIST**

### **13.1 Architecture Setup:**
- [ ] Base classes created (Controller, Repository, Service)
- [ ] Repository pattern implemented
- [ ] Service layer implemented
- [ ] Request validation setup
- [ ] API resources created
- [ ] Enums defined
- [ ] Traits implemented
- [ ] Service providers registered

### **13.2 Authentication System:**
- [ ] JWT authentication configured
- [ ] User roles and permissions
- [ ] Sub admin management
- [ ] Middleware protection

### **13.3 Core Features:**
- [ ] Deposit management system
- [ ] Wallet transactions
- [ ] User management
- [ ] Product management
- [ ] Order processing

### **13.4 Code Quality:**
- [ ] PSR-12 coding standards
- [ ] Type hints and return types
- [ ] Proper error handling
- [ ] Logging implementation
- [ ] Unit tests coverage

---

**📅 Last Updated:** 2024-01-01  
**👨‍💻 Architect:** Development Team  
**🎯 Status:** Production Ready  
**🏗️ Pattern:** Repository + Service + MVC
