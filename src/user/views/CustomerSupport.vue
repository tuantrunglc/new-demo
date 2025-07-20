<template>
  <div class="customer-support-container">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Hỗ trợ khách hàng</h1>
          <p class="text-gray-600 mt-1">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center text-green-600">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span class="text-sm font-medium">Đang hoạt động</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat Section -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Chat Header -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-headset text-lg"></i>
                </div>
                <div>
                  <h3 class="font-semibold">Chat với tư vấn viên</h3>
                  <p class="text-blue-100 text-sm">{{ supportAgent.name }} - {{ supportAgent.status }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="toggleSound" :class="soundEnabled ? 'text-white' : 'text-blue-200'" class="p-2 hover:bg-white hover:bg-opacity-10 rounded">
                  <i :class="soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute'"></i>
                </button>
                <button @click="minimizeChat" class="p-2 hover:bg-white hover:bg-opacity-10 rounded">
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Chat Messages -->
          <div class="h-96 overflow-y-auto p-4 bg-gray-50" ref="chatContainer">
            <div v-for="message in messages" :key="message.id" class="mb-4">
              <div :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
                <div :class="message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'" 
                     class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow">
                  <div v-if="message.sender === 'agent'" class="flex items-center mb-1">
                    <img :src="supportAgent.avatar" :alt="supportAgent.name" class="w-6 h-6 rounded-full mr-2">
                    <span class="text-xs text-gray-500">{{ supportAgent.name }}</span>
                  </div>
                  <p class="text-sm">{{ message.content }}</p>
                  <div v-if="message.attachments && message.attachments.length > 0" class="mt-2">
                    <div v-for="attachment in message.attachments" :key="attachment.id" class="mb-2">
                      <img v-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name" 
                           class="max-w-full h-auto rounded cursor-pointer" @click="viewImage(attachment.url)">
                      <div v-else class="flex items-center p-2 bg-gray-100 rounded">
                        <i class="fas fa-file mr-2"></i>
                        <span class="text-sm">{{ attachment.name }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs opacity-75 mt-1">{{ formatTime(message.timestamp) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div v-if="isAgentTyping" class="flex justify-start mb-4">
              <div class="bg-white text-gray-900 max-w-xs px-4 py-2 rounded-lg shadow">
                <div class="flex items-center">
                  <img :src="supportAgent.avatar" :alt="supportAgent.name" class="w-6 h-6 rounded-full mr-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-end space-x-2">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <button @click="toggleEmojiPicker" class="p-2 text-gray-400 hover:text-gray-600 rounded">
                    <i class="fas fa-smile"></i>
                  </button>
                  <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*,.pdf,.doc,.docx" class="hidden">
                  <button @click="$refs.fileInput.click()" class="p-2 text-gray-400 hover:text-gray-600 rounded">
                    <i class="fas fa-paperclip"></i>
                  </button>
                  <button @click="toggleQuickReplies" class="p-2 text-gray-400 hover:text-gray-600 rounded">
                    <i class="fas fa-bolt"></i>
                  </button>
                </div>
                <div class="relative">
                  <textarea 
                    v-model="newMessage" 
                    @keydown.enter.prevent="sendMessage"
                    placeholder="Nhập tin nhắn của bạn..."
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="2"
                  ></textarea>
                  
                  <!-- Emoji Picker -->
                  <div v-if="showEmojiPicker" class="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                    <div class="grid grid-cols-8 gap-1">
                      <button v-for="emoji in commonEmojis" :key="emoji" @click="addEmoji(emoji)" 
                              class="p-1 hover:bg-gray-100 rounded text-lg">
                        {{ emoji }}
                      </button>
                    </div>
                  </div>

                  <!-- Quick Replies -->
                  <div v-if="showQuickReplies" class="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 w-64">
                    <div class="space-y-1">
                      <button v-for="reply in quickReplies" :key="reply" @click="useQuickReply(reply)"
                              class="w-full text-left p-2 hover:bg-gray-100 rounded text-sm">
                        {{ reply }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button @click="sendMessage" :disabled="!newMessage.trim()" 
                      class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Support Info Sidebar -->
      <div class="space-y-6">
        <!-- Contact Methods -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Liên hệ trực tiếp</h3>
          <div class="space-y-4">
            <div class="flex items-center p-3 bg-green-50 rounded-lg">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-phone text-white"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">Hotline</p>
                <p class="text-green-600 font-semibold">1900 1234</p>
                <p class="text-xs text-gray-500">24/7 - Miễn phí</p>
              </div>
            </div>

            <div class="flex items-center p-3 bg-blue-50 rounded-lg">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <i class="fab fa-facebook-messenger text-white"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">Zalo</p>
                <p class="text-blue-600 font-semibold">0123 456 789</p>
                <p class="text-xs text-gray-500">8:00 - 22:00</p>
              </div>
            </div>

            <div class="flex items-center p-3 bg-red-50 rounded-lg">
              <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-envelope text-white"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">Email</p>
                <p class="text-red-600 font-semibold">support@ecoman.vn</p>
                <p class="text-xs text-gray-500">Phản hồi trong 2h</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Quick Access -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Câu hỏi thường gặp</h3>
          <div class="space-y-3">
            <button v-for="faq in popularFAQs" :key="faq.id" @click="sendQuickQuestion(faq.question)"
                    class="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <p class="text-sm font-medium text-gray-900">{{ faq.question }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ faq.category }}</p>
            </button>
          </div>
          <router-link to="/faq" class="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            Xem tất cả FAQ →
          </router-link>
        </div>

        <!-- Support Hours -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Giờ hỗ trợ</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Thứ 2 - Thứ 6</span>
              <span class="text-sm font-medium text-gray-900">8:00 - 22:00</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Thứ 7 - Chủ nhật</span>
              <span class="text-sm font-medium text-gray-900">9:00 - 21:00</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Chat trực tuyến</span>
              <span class="text-sm font-medium text-green-600">24/7</span>
            </div>
          </div>
        </div>

        <!-- Satisfaction Rating -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Đánh giá dịch vụ</h3>
          <p class="text-sm text-gray-600 mb-4">Bạn có hài lòng với dịch vụ hỗ trợ?</p>
          <div class="flex justify-center space-x-2 mb-4">
            <button v-for="star in 5" :key="star" @click="rateSatisfaction(star)"
                    :class="star <= satisfaction ? 'text-yellow-400' : 'text-gray-300'"
                    class="text-2xl hover:text-yellow-400 transition-colors">
              <i class="fas fa-star"></i>
            </button>
          </div>
          <textarea v-if="satisfaction > 0" v-model="feedbackMessage" 
                    placeholder="Chia sẻ ý kiến của bạn..."
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    rows="3"></textarea>
          <button v-if="satisfaction > 0" @click="submitFeedback"
                  class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="showImageViewer" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeImageViewer">
      <div class="relative max-w-4xl max-h-full p-4">
        <img :src="viewingImage" alt="Attachment" class="max-w-full max-h-full object-contain">
        <button @click="closeImageViewer" class="absolute top-4 right-4 text-white hover:text-gray-300">
          <i class="fas fa-times text-2xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'

export default {
  name: 'CustomerSupport',
  setup() {
    // Reactive data
    const messages = ref([])
    const newMessage = ref('')
    const isAgentTyping = ref(false)
    const soundEnabled = ref(true)
    const showEmojiPicker = ref(false)
    const showQuickReplies = ref(false)
    const showImageViewer = ref(false)
    const viewingImage = ref('')
    const satisfaction = ref(0)
    const feedbackMessage = ref('')
    const chatContainer = ref(null)

    // Support agent info
    const supportAgent = ref({
      name: 'Nguyễn Thị Hoa',
      status: 'Đang hoạt động',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Hoa&background=0D8ABC&color=fff'
    })

    // Common emojis
    const commonEmojis = ['😊', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🤝', '🙏', '👌', '✨']

    // Quick replies
    const quickReplies = ref([
      'Xin chào, tôi cần hỗ trợ',
      'Tôi muốn hỏi về sản phẩm',
      'Làm sao để theo dõi đơn hàng?',
      'Tôi muốn đổi/trả hàng',
      'Có vấn đề với thanh toán',
      'Cảm ơn bạn đã hỗ trợ!'
    ])

    // Popular FAQs
    const popularFAQs = ref([
      {
        id: 1,
        question: 'Làm sao để theo dõi đơn hàng?',
        category: 'Đơn hàng'
      },
      {
        id: 2,
        question: 'Chính sách đổi trả như thế nào?',
        category: 'Chính sách'
      },
      {
        id: 3,
        question: 'Thời gian giao hàng bao lâu?',
        category: 'Vận chuyển'
      },
      {
        id: 4,
        question: 'Làm sao để nạp tiền vào ví?',
        category: 'Thanh toán'
      }
    ])

    // Initial messages
    const initialMessages = [
      {
        id: 1,
        sender: 'agent',
        content: 'Xin chào! Tôi là Hoa, tư vấn viên của EcoMan. Tôi có thể giúp gì cho bạn hôm nay?',
        timestamp: new Date(),
        attachments: []
      }
    ]

    // Methods
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      // Add user message
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        content: newMessage.value,
        timestamp: new Date(),
        attachments: []
      }
      messages.value.push(userMessage)
      
      const messageContent = newMessage.value
      newMessage.value = ''
      
      // Scroll to bottom
      await nextTick()
      scrollToBottom()

      // Simulate agent typing
      isAgentTyping.value = true
      
      setTimeout(() => {
        isAgentTyping.value = false
        
        // Generate agent response
        const agentResponse = generateAgentResponse(messageContent)
        messages.value.push(agentResponse)
        
        // Scroll to bottom
        nextTick(() => scrollToBottom())
        
        // Play notification sound
        if (soundEnabled.value) {
          playNotificationSound()
        }
      }, 1500 + Math.random() * 1000)
    }

    const generateAgentResponse = (userMessage) => {
      const responses = [
        'Cảm ơn bạn đã liên hệ! Tôi sẽ kiểm tra thông tin và hỗ trợ bạn ngay.',
        'Tôi hiểu vấn đề của bạn. Để hỗ trợ tốt nhất, bạn có thể cung cấp thêm thông tin không?',
        'Đây là một câu hỏi rất hay! Tôi sẽ giải đáp chi tiết cho bạn.',
        'Tôi sẽ chuyển yêu cầu của bạn đến bộ phận chuyên môn để xử lý nhanh nhất.',
        'Bạn có thể cung cấp mã đơn hàng hoặc thông tin tài khoản để tôi hỗ trợ chính xác hơn không?'
      ]

      // Simple keyword-based responses
      const lowerMessage = userMessage.toLowerCase()
      let response = ''

      if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('order')) {
        response = 'Để kiểm tra đơn hàng, bạn vui lòng cung cấp mã đơn hàng hoặc số điện thoại đặt hàng. Tôi sẽ tra cứu ngay cho bạn!'
      } else if (lowerMessage.includes('nạp tiền') || lowerMessage.includes('ví')) {
        response = 'Để nạp tiền vào ví, bạn có thể vào mục "Ví của tôi" > "Nạp tiền" và làm theo hướng dẫn. Nếu cần hỗ trợ, tôi có thể hướng dẫn chi tiết!'
      } else if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product')) {
        response = 'Tôi có thể hỗ trợ bạn về thông tin sản phẩm, giá cả, tình trạng kho hàng. Bạn quan tâm đến sản phẩm nào cụ thể?'
      } else if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
        response = 'Thời gian giao hàng thông thường là 1-3 ngày làm việc tùy theo khu vực. Bạn có thể theo dõi đơn hàng trong mục "Lịch sử đơn hàng".'
      } else {
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      return {
        id: Date.now() + 1,
        sender: 'agent',
        content: response,
        timestamp: new Date(),
        attachments: []
      }
    }

    const sendQuickQuestion = (question) => {
      newMessage.value = question
      sendMessage()
    }

    const useQuickReply = (reply) => {
      newMessage.value = reply
      showQuickReplies.value = false
    }

    const addEmoji = (emoji) => {
      newMessage.value += emoji
      showEmojiPicker.value = false
    }

    const toggleEmojiPicker = () => {
      showEmojiPicker.value = !showEmojiPicker.value
      showQuickReplies.value = false
    }

    const toggleQuickReplies = () => {
      showQuickReplies.value = !showQuickReplies.value
      showEmojiPicker.value = false
    }

    const toggleSound = () => {
      soundEnabled.value = !soundEnabled.value
    }

    const minimizeChat = () => {
      // Implement minimize functionality
      alert('Tính năng thu nhỏ chat sẽ được triển khai sau!')
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Simulate file upload
      const attachment = {
        id: Date.now(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file)
      }

      const userMessage = {
        id: Date.now(),
        sender: 'user',
        content: `Đã gửi file: ${file.name}`,
        timestamp: new Date(),
        attachments: [attachment]
      }

      messages.value.push(userMessage)
      scrollToBottom()

      // Agent response
      setTimeout(() => {
        const agentResponse = {
          id: Date.now() + 1,
          sender: 'agent',
          content: 'Tôi đã nhận được file của bạn. Tôi sẽ xem xét và phản hồi sớm nhất có thể.',
          timestamp: new Date(),
          attachments: []
        }
        messages.value.push(agentResponse)
        scrollToBottom()
      }, 1000)
    }

    const viewImage = (imageUrl) => {
      viewingImage.value = imageUrl
      showImageViewer.value = true
    }

    const closeImageViewer = () => {
      showImageViewer.value = false
      viewingImage.value = ''
    }

    const rateSatisfaction = (rating) => {
      satisfaction.value = rating
    }

    const submitFeedback = () => {
      // Submit feedback
      alert('Cảm ơn bạn đã đánh giá! Phản hồi của bạn rất quan trọng với chúng tôi.')
      satisfaction.value = 0
      feedbackMessage.value = ''
    }

    const scrollToBottom = () => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }

    const playNotificationSound = () => {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // Lifecycle
    onMounted(() => {
      messages.value = [...initialMessages]
      scrollToBottom()
    })

    return {
      // Data
      messages,
      newMessage,
      isAgentTyping,
      soundEnabled,
      showEmojiPicker,
      showQuickReplies,
      showImageViewer,
      viewingImage,
      satisfaction,
      feedbackMessage,
      chatContainer,
      supportAgent,
      commonEmojis,
      quickReplies,
      popularFAQs,
      
      // Methods
      sendMessage,
      sendQuickQuestion,
      useQuickReply,
      addEmoji,
      toggleEmojiPicker,
      toggleQuickReplies,
      toggleSound,
      minimizeChat,
      handleFileUpload,
      viewImage,
      closeImageViewer,
      rateSatisfaction,
      submitFeedback,
      formatTime
    }
  }
}
</script>

<style scoped>
.customer-support-container {
  @apply p-6 bg-gray-50 min-h-screen;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>