<template>
  <div class="user-management">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Quản lý người dùng</h2>
      
      <div class="d-flex">
        <div class="input-group me-2" style="width: 300px;">
          <span class="input-group-text bg-white">
            <i class="fas fa-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Tìm kiếm người dùng..." 
            v-model="searchQuery"
          >
        </div>
        
        <button class="btn btn-primary">
          <i class="fas fa-plus me-1"></i> Thêm người dùng
        </button>
      </div>
    </div>
    
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tên người dùng</th>
                <th scope="col">Họ tên</th>
                <th scope="col">Email</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Ngày đăng ký</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Đơn hàng</th>
                <th scope="col" class="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.registeredDate }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="user.status === 'active' ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ user.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                  </span>
                </td>
                <td>{{ user.orders }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-1">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        <span class="text-muted">Hiển thị {{ filteredUsers.length }} trên {{ users.length }} người dùng</span>
      </div>
      
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1">Trước</a>
          </li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Sau</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../stores/adminStore'

export default {
  name: 'UserManagement',
  setup() {
    const adminStore = useAdminStore()
    const searchQuery = ref('')
    
    const users = computed(() => adminStore.getUsers())
    
    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      )
    })
    
    return {
      users,
      filteredUsers,
      searchQuery
    }
  }
}
</script>