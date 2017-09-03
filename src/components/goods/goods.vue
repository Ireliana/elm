<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,key) in goods" :key="key" class="menu-item" :class="{current:currentIndex===key}" @click="selectMenu(key)">
          <span class="text" border-1px>
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]">
            </span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="(item,key) in goods" :key="key" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" @click="selectFood(food)" class="food-item" border-1px>
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月销{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span><span v-if="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart-add="drop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopCart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
  </div>
  <food ref="food" :food="selectedFood" @cart-add="drop"></food>
</div>
</template>
<script>
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';

const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object,
    },
  },
  components: {
    shopcart,
    cartcontrol,
    food,
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {},
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    },
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http.get('/api/goods').then((res) => {
      const resData = res.body;
      if (resData.errno === ERR_OK) {
        this.goods = resData.data;
        this.$nextTick(() => {
          this.initScroll();
          this.calculateHeight();
        });
      }
    });
  },
  methods: {
    selectFood(food) {
      this.selectedFood = food;
      this.$refs.food.show();
    },
    drop(target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target);
      });
    },
    initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true,
      });
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        click: true,
        probeType: 3,
      });
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    calculateHeight() {
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        height += foodList[i].clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index) {
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodScroll.scrollToElement(el, 300);
    },
  },
};
</script>

<style lang="stylus">

@import '../../public/stylus/mixin';

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background-color #f3f5f7
      .menu-item
        display table
        width 56px
        height 54px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          margin-top  -1px
          z-index 10
          font-weight 700
          background-color #fff
          .text
            border-none()
        .text
          display table-cell
          vertical-align middle
          width 56px
          font-size 12px
          border-1px(rgba(7,17,27,0.1))
          .icon
              display inline-block
              vertical-align top
              width 12px
              height 12px
              margin-right 2px
              background-size 12px 12px
              background-repeat no-repeat
              &.decrease
                bg-image('decrease_3')
              &.discount
                bg-image('discount_3')
              &.guarantee
                bg-image('guarantee_3')
              &.invoice
                bg-image('invoice_3')
              &.special
                bg-image('special_3')              
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background-color #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon 
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name 
            margin 2px 0 8px 0
            font-size 14px
            line-height 14px
            height 14px
            color rgb(7,17,27)
          .desc,.extra
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
          .desc
            line-height 12px
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147,153,159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px

</style>
