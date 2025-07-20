<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="hero-title">
                Chào mừng đến với 
                <span class="text-primary">EcoMan</span>
              </h1>
              <p class="hero-subtitle">
                Nền tảng thương mại điện tử hàng đầu Việt Nam với hàng ngàn sản phẩm chất lượng cao
              </p>
              <div class="hero-features">
                <div class="feature-item">
                  <i class="fas fa-shipping-fast"></i>
                  <span>Giao hàng nhanh chóng</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-shield-alt"></i>
                  <span>Bảo hành chính hãng</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-headset"></i>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
              <div class="hero-actions">
                <router-link to="/register" class="btn btn-primary btn-lg me-3">
                  <i class="fas fa-user-plus me-2"></i>
                  Đăng ký ngay
                </router-link>
                <router-link to="/login" class="btn btn-outline-primary btn-lg">
                  <i class="fas fa-sign-in-alt me-2"></i>
                  Đăng nhập
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image">
              <div class="image-placeholder">
                <i class="fas fa-shopping-cart fa-5x text-primary"></i>
                <h3 class="mt-3">Khám phá ngay!</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="section-title">Tại sao chọn EcoMan?</h2>
            <p class="section-subtitle">Những lợi ích tuyệt vời khi mua sắm cùng chúng tôi</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-gift"></i>
              </div>
              <h4>Ưu đãi hấp dẫn</h4>
              <p>Giảm giá lên đến 50% cho thành viên mới và nhiều chương trình khuyến mãi đặc biệt</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-star"></i>
              </div>
              <h4>Sản phẩm chất lượng</h4>
              <p>Hàng ngàn sản phẩm được tuyển chọn kỹ lưỡng từ các thương hiệu uy tín</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-coins"></i>
              </div>
              <h4>Tích điểm thưởng</h4>
              <p>Nhận điểm thưởng với mỗi giao dịch và đổi lấy những phần quà hấp dẫn</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h2 class="cta-title">Sẵn sàng bắt đầu mua sắm?</h2>
            <p class="cta-subtitle">Tham gia cộng đồng hàng triệu người dùng đã tin tưởng EcoMan</p>
            <div class="cta-actions">
              <router-link to="/register" class="btn btn-primary btn-lg me-3">
                <i class="fas fa-rocket me-2"></i>
                Bắt đầu ngay
              </router-link>
              <router-link to="/auth-test" class="btn btn-outline-light btn-lg">
                <i class="fas fa-info-circle me-2"></i>
                Tìm hiểu thêm
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  mounted() {
    // Add any initialization logic here
  }
}
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-features {
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.feature-item i {
  margin-right: 0.75rem;
  color: #ffd700;
  width: 20px;
}

.hero-actions .btn {
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.hero-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-image {
  position: relative;
  z-index: 2;
}

.image-placeholder {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.features-section {
  background: #f8f9fa;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2.5rem 1.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color, #ff6b35) 0%, #ff8c42 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.feature-icon i {
  font-size: 2rem;
  color: white;
}

.feature-card h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-color, #ff6b35) 0%, #ff8c42 100%);
  color: white;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-actions .btn {
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: white;
  color: var(--primary-color, #ff6b35);
}

.text-primary {
  color: #ffd700 !important;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-actions .btn {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .hero-actions .btn:last-child {
    margin-bottom: 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
</style>