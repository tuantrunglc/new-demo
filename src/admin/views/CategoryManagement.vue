<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-indigo-800">
          <i class="fas fa-layer-group mr-3 text-indigo-600"></i>
          Quản lý danh mục sản phẩm
        </h1>
        <button 
          @click="showCreateModal = true"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Thêm danh mục
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center my-12 py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p class="text-indigo-600 font-medium">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <!-- Categories Tree -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Cây danh mục</h2>
              <div class="flex items-center space-x-2">
                <button 
                  @click="expandAll"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <i class="fas fa-expand-alt mr-1"></i>
                  Mở rộng tất cả
                </button>
                <button 
                  @click="collapseAll"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i class="fas fa-compress-alt mr-1"></i>
                  Thu gọn tất cả
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-2">
              <CategoryItem
                v-for="category in rootCategories"
                :key="category.id"
                :category="category"
                :level="0"
                @edit="editCategory"
                @delete="deleteCategory"
                @add-child="addChildCategory"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Category Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveCategory">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tên danh mục *</label>
                  <input 
                    v-model="categoryForm.name"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập tên danh mục"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input 
                    v-model="categoryForm.slug"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ten-danh-muc"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục cha</label>
                <select 
                  v-model="categoryForm.parentId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Không có danh mục cha --</option>
                  <option 
                    v-for="category in flatCategories" 
                    :key="category.id"
                    :value="category.id"
                    :disabled="category.id === categoryForm.id"
                  >
                    {{ '—'.repeat(category.level) }} {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea 
                  v-model="categoryForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập mô tả danh mục"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thứ tự sắp xếp</label>
                  <input 
                    v-model.number="categoryForm.sortOrder"
                    type="number" 
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select 
                    v-model="categoryForm.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hình ảnh danh mục</label>
                <div class="flex items-center space-x-4">
                  <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-image text-gray-400 text-2xl"></i>
                  </div>
                  <div>
                    <button 
                      type="button"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Chọn hình ảnh
                    </button>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG (tối đa 2MB)</p>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center">
                  <input 
                    v-model="categoryForm.showInMenu"
                    type="checkbox" 
                    class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <label class="ml-2 text-sm text-gray-700">Hiển thị trong menu</label>
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="categoryForm.isFeatured"
                    type="checkbox" 
                    class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <label class="ml-2 text-sm text-gray-700">Danh mục nổi bật</label>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-4 mt-6">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

// Category Item Component
const CategoryItem = {
  name: 'CategoryItem',
  props: {
    category: Object,
    level: Number
  },
  emits: ['edit', 'delete', 'add-child'],
  setup() {
    const expanded = ref(true)
    
    const toggleExpanded = () => {
      expanded.value = !expanded.value
    }
    
    const getStatusClass = (status) => {
      return status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }
    
    const getStatusText = (status) => {
      return status === 'active' ? 'Hoạt động' : 'Tạm ngưng'
    }
    
    return {
      expanded,
      toggleExpanded,
      getStatusClass,
      getStatusText
    }
  },
  template: `
    <div>
      <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
           :style="{ marginLeft: level * 20 + 'px' }">
        <button 
          v-if="category.children && category.children.length > 0"
          @click="toggleExpanded"
          class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 mr-2"
        >
          <i :class="expanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
        </button>
        <div v-else class="w-8"></div>
        
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
          <i class="fas fa-folder text-gray-500"></i>
        </div>
        
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="getStatusClass(category.status)"
            >
              {{ getStatusText(category.status) }}
            </span>
            <span v-if="category.isFeatured" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Nổi bật
            </span>
          </div>
          <p class="text-sm text-gray-500">{{ category.description || 'Không có mô tả' }}</p>
          <div class="text-xs text-gray-400 mt-1">
            {{ category.productsCount || 0 }} sản phẩm • Thứ tự: {{ category.sortOrder }}
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="$emit('add-child', category)"
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Thêm danh mục con"
          >
            <i class="fas fa-plus text-sm"></i>
          </button>
          <button 
            @click="$emit('edit', category)"
            class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="Chỉnh sửa"
          >
            <i class="fas fa-edit text-sm"></i>
          </button>
          <button 
            @click="$emit('delete', category)"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Xóa"
          >
            <i class="fas fa-trash text-sm"></i>
          </button>
        </div>
      </div>
      
      <div v-if="expanded && category.children && category.children.length > 0" class="mt-2">
        <CategoryItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :level="level + 1"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-child="$emit('add-child', $event)"
        />
      </div>
    </div>
  `
}

export default {
  name: 'CategoryManagement',
  components: {
    CategoryItem
  },
  setup() {
    const loading = ref(false)
    const saving = ref(false)
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const isEditing = ref(false)
    
    const categoryForm = ref({
      id: null,
      name: '',
      slug: '',
      description: '',
      parentId: '',
      sortOrder: 0,
      status: 'active',
      showInMenu: true,
      isFeatured: false,
      image: null
    })
    
    // Mock categories data
    const categories = ref([
      {
        id: 1,
        name: 'Điện tử',
        slug: 'dien-tu',
        description: 'Các sản phẩm điện tử',
        parentId: null,
        sortOrder: 1,
        status: 'active',
        showInMenu: true,
        isFeatured: true,
        productsCount: 150,
        children: [
          {
            id: 2,
            name: 'Điện thoại',
            slug: 'dien-thoai',
            description: 'Smartphone và điện thoại di động',
            parentId: 1,
            sortOrder: 1,
            status: 'active',
            showInMenu: true,
            isFeatured: false,
            productsCount: 80,
            children: [
              {
                id: 3,
                name: 'iPhone',
                slug: 'iphone',
                description: 'Điện thoại iPhone',
                parentId: 2,
                sortOrder: 1,
                status: 'active',
                showInMenu: true,
                isFeatured: false,
                productsCount: 25,
                children: []
              },
              {
                id: 4,
                name: 'Samsung',
                slug: 'samsung',
                description: 'Điện thoại Samsung',
                parentId: 2,
                sortOrder: 2,
                status: 'active',
                showInMenu: true,
                isFeatured: false,
                productsCount: 30,
                children: []
              }
            ]
          },
          {
            id: 5,
            name: 'Laptop',
            slug: 'laptop',
            description: 'Máy tính xách tay',
            parentId: 1,
            sortOrder: 2,
            status: 'active',
            showInMenu: true,
            isFeatured: false,
            productsCount: 70,
            children: []
          }
        ]
      },
      {
        id: 6,
        name: 'Thời trang',
        slug: 'thoi-trang',
        description: 'Quần áo và phụ kiện thời trang',
        parentId: null,
        sortOrder: 2,
        status: 'active',
        showInMenu: true,
        isFeatured: true,
        productsCount: 200,
        children: [
          {
            id: 7,
            name: 'Quần áo nam',
            slug: 'quan-ao-nam',
            description: 'Thời trang nam',
            parentId: 6,
            sortOrder: 1,
            status: 'active',
            showInMenu: true,
            isFeatured: false,
            productsCount: 100,
            children: []
          },
          {
            id: 8,
            name: 'Quần áo nữ',
            slug: 'quan-ao-nu',
            description: 'Thời trang nữ',
            parentId: 6,
            sortOrder: 2,
            status: 'active',
            showInMenu: true,
            isFeatured: false,
            productsCount: 100,
            children: []
          }
        ]
      },
      {
        id: 9,
        name: 'Nhà cửa & Đời sống',
        slug: 'nha-cua-doi-song',
        description: 'Đồ dùng gia đình',
        parentId: null,
        sortOrder: 3,
        status: 'inactive',
        showInMenu: false,
        isFeatured: false,
        productsCount: 50,
        children: []
      }
    ])
    
    const rootCategories = computed(() => {
      return categories.value.filter(cat => !cat.parentId)
    })
    
    const flatCategories = computed(() => {
      const flattenCategories = (cats, level = 0) => {
        let result = []
        for (const cat of cats) {
          result.push({ ...cat, level })
          if (cat.children && cat.children.length > 0) {
            result.push(...flattenCategories(cat.children, level + 1))
          }
        }
        return result
      }
      return flattenCategories(categories.value)
    })
    
    const resetForm = () => {
      categoryForm.value = {
        id: null,
        name: '',
        slug: '',
        description: '',
        parentId: '',
        sortOrder: 0,
        status: 'active',
        showInMenu: true,
        isFeatured: false,
        image: null
      }
    }
    
    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      isEditing.value = false
      resetForm()
    }
    
    const editCategory = (category) => {
      categoryForm.value = { ...category, parentId: category.parentId || '' }
      isEditing.value = true
      showEditModal.value = true
    }
    
    const addChildCategory = (parentCategory) => {
      resetForm()
      categoryForm.value.parentId = parentCategory.id
      showCreateModal.value = true
    }
    
    const deleteCategory = async (category) => {
      const hasChildren = category.children && category.children.length > 0
      const hasProducts = category.productsCount > 0
      
      let warningText = `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`
      if (hasChildren) {
        warningText += '\n\nDanh mục này có danh mục con. Tất cả danh mục con sẽ bị xóa.'
      }
      if (hasProducts) {
        warningText += `\n\nDanh mục này có ${category.productsCount} sản phẩm. Các sản phẩm sẽ không còn danh mục.`
      }
      
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: warningText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      })
      
      if (result.isConfirmed) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Remove category from list
          const removeFromCategories = (cats, id) => {
            return cats.filter(cat => {
              if (cat.id === id) return false
              if (cat.children) {
                cat.children = removeFromCategories(cat.children, id)
              }
              return true
            })
          }
          
          categories.value = removeFromCategories(categories.value, category.id)
          
          await Swal.fire({
            title: 'Đã xóa!',
            text: 'Danh mục đã được xóa thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          
        } catch (error) {
          await Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi xóa danh mục.',
            icon: 'error'
          })
        }
      }
    }
    
    const saveCategory = async () => {
      saving.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Generate slug from name if not provided
        if (!categoryForm.value.slug) {
          categoryForm.value.slug = categoryForm.value.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
        
        if (isEditing.value) {
          // Update existing category
          const updateInCategories = (cats) => {
            return cats.map(cat => {
              if (cat.id === categoryForm.value.id) {
                return { ...cat, ...categoryForm.value }
              }
              if (cat.children) {
                cat.children = updateInCategories(cat.children)
              }
              return cat
            })
          }
          
          categories.value = updateInCategories(categories.value)
          
        } else {
          // Add new category
          const newCategory = {
            ...categoryForm.value,
            id: Date.now(), // Generate ID
            children: [],
            productsCount: 0
          }
          
          if (categoryForm.value.parentId) {
            // Add as child category
            const addToParent = (cats) => {
              return cats.map(cat => {
                if (cat.id === categoryForm.value.parentId) {
                  cat.children = [...(cat.children || []), newCategory]
                }
                if (cat.children) {
                  cat.children = addToParent(cat.children)
                }
                return cat
              })
            }
            
            categories.value = addToParent(categories.value)
          } else {
            // Add as root category
            categories.value.push(newCategory)
          }
        }
        
        await Swal.fire({
          title: 'Thành công!',
          text: `Danh mục đã được ${isEditing.value ? 'cập nhật' : 'thêm'} thành công.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        closeModal()
        
      } catch (error) {
        await Swal.fire({
          title: 'Lỗi!',
          text: `Có lỗi xảy ra khi ${isEditing.value ? 'cập nhật' : 'thêm'} danh mục.`,
          icon: 'error'
        })
      } finally {
        saving.value = false
      }
    }
    
    const expandAll = () => {
      // This would need to be implemented with refs to CategoryItem components
      console.log('Expand all categories')
    }
    
    const collapseAll = () => {
      // This would need to be implemented with refs to CategoryItem components
      console.log('Collapse all categories')
    }
    
    onMounted(() => {
      // Load categories from API
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
    
    return {
      loading,
      saving,
      showCreateModal,
      showEditModal,
      isEditing,
      categoryForm,
      categories,
      rootCategories,
      flatCategories,
      closeModal,
      editCategory,
      addChildCategory,
      deleteCategory,
      saveCategory,
      expandAll,
      collapseAll
    }
  }
}
</script>

<style scoped>
/* Custom styles for category tree */
.category-tree {
  font-family: 'Inter', sans-serif;
}
</style>