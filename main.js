const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'




Vue.component('good-card', {
  template: `<div class="good-card">
    <h2>{{ title }}</h2>
    <p>$ {{ price }}</p>
  </div>`,
  props: {
    title: String,
    price: Number
  }
})




Vue.component('goods-list', {
  template: `<div class="goods-list">
    <good-card 
      v-for="good of list" 
      v-bind:key="good.id_product"
      v-bind:title="good.product_name"
      v-bind:price="good.price"
      v-on:click="onAdd(good)"
    ></good-card>
  </div>`,
  props: {
    list: Array
  },
  methods: {
    onAdd(good) {
      this.$emit('add', good)
    }
  }
})




Vue.component('search', {
  template: `<div class="search">
    <input type="text" v-model="searchString" class="goods-search" />
    <button class="search-button" type="button" v-on:click="onClick">Искать</button>
  </div>`,
  data() {
    return {
      searchString: ''
    }
  },  
  methods: {
    onClick(){
      this.$emit('search', this.searchString)
    }
  }
})




Vue.component('cart-item', {
  template: `<div class="good-card">
    <h2>{{ good.product_name }}</h2>
    <p>$ {{ good.price }}</p>
    <button v-on:click="onRemove">Х</button>
  </div>`,
  props: {
    good: Object
  },
  methods: {
    onRemove() {
      this.$emit('remove', this.good);
    }
  }
})




Vue.component('cart', {
  template: `<div class="modal" v-if="isVisibleCart">
    <span class="close" v-on:click="onClose">x</span>

    <div class="goods-list">
      <cart-item  v-for="good of cart" v-bind:key="good.id_product" v-bind:good="good" v-on:remove="onRemove" ></cart-item>
    </div>
  </div>`,
  props: {
    cart: Array
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onRemove(good) {
      this.$emit('remove', good)
    }
  }
});




new Vue({
  el: "#app",
  data: {
    goods: [],
    filteredGoods: [],
    cart: [],
    isVisibleCart: false
  },
  methods: {
    loadGoods(){
      fetch(`${API_URL}catalogData.json`)
        .then((request) => request.json())
        .then((data) => {
          this.goods = data;
          this.filteredGoods = data;
        })
    },
    loadCart(){
      fetch(`${API_URL}getBasket.json`)
        .then((request) => request.json())
        .then((data) => {
          this.cart = data.contents;
        })
    },
    addToCart(good){
      fetch(`${API_URL}addToBasket.json`)
        .then(() => {
          this.cart.push(good)
        })
    },
    removeFromCart(good){
      fetch(`${API_URL}deleteFromBasket.json`)
        .then(() => {
          const index = this.cart.findIndex((item) => item.id_product === good.id_product)
          this.cart.splice(index, 1)
        })
    },
    onSearch(searchString){
      const regex = new RegExp(searchString, 'i');
      this.filteredGoods = this.goods.filter((good) => regex.test(good.product_name))
    },
    onToggleCart() {
      this.isVisibleCart = !this.isVisibleCart
    }
  },



  mounted() {
    this.loadGoods();
    this.loadCart();
  }
})