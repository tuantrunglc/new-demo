<template>
  <div id="featuredCarousel" class="carousel slide featured-carousel mb-4" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button 
        v-for="(item, index) in carouselItems" 
        :key="'indicator-' + item.id"
        type="button" 
        data-bs-target="#featuredCarousel" 
        :data-bs-slide-to="index" 
        :class="{ active: index === 0 }" 
        :aria-current="index === 0 ? 'true' : 'false'"
        :aria-label="'Slide ' + (index + 1)">
      </button>
    </div>
    
    <div class="carousel-inner">
      <div 
        v-for="(item, index) in carouselItems" 
        :key="'slide-' + item.id"
        class="carousel-item" 
        :class="{ active: index === 0 }"
        :style="{ backgroundImage: `url(${item.image})` }">
        <div class="carousel-caption d-flex flex-column justify-content-center h-100">
          <div class="container">
            <div class="row">
              <div class="col-md-6 text-start">
                <h2 class="display-4 fw-bold">{{ item.title }}</h2>
                <p class="lead">{{ item.subtitle }}</p>
                <a :href="item.buttonLink" class="btn btn-lg btn-primary">
                  {{ item.buttonText }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <button class="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script>
import { carouselItems } from '../../data/products';

export default {
  name: 'FeaturedCarousel',
  data() {
    return {
      carouselItems: carouselItems
    }
  }
}
</script>

<style scoped>
.carousel-item {
  position: relative;
}

.carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
}

.carousel-caption {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: left;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #e05e00;
  border-color: #e05e00;
}
</style>