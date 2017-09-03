<template>
<div>
  <div class="shopcart">
      <div class="content">
          <div class="content-left" @click="toggleList">
              <div class="logo-wrapper">
                  <div class="logo" :class="{highlight:totalCount>0}">
                      <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
                  </div>
                  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{highlight:totalPrice>0}">¥{{totalPrice}}</div>
              <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
          </div>
          <div class="content-right" @click="pay">
            <div class="pay" :class="payClass">
               {{ payDesc}}
            </div>
          </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-for="(ball,key) in balls" v-show="ball.show" :key="key">
          <div class="inner inner-hook"></div>
        </div> 
        </transition-group> 
      </div>
      <transition name="fold" @enter="foldEnter" @leave="foldLeave">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food,key) in selectFoods" :key="key">
                <span class="name">{{food.name}}</span>
                <div class="price">¥{{food.count*food.price}}</div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div> 
              </li>
            </ul>
          </div>
        </div >
      </transition>  
  </div>
  <transition name="fade">
    <div class="list-mask" v-show="listShow" @click="listHide"> 
    </div> 
  </transition>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';

export default{
  props: {
    deliveryPrice: {
      type: Number,
      default: 0,
    },
    minPrice: {
      type: Number,
    },
    selectFoods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    cartcontrol,
  },
  data() {
    return {
      balls: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      dropballs: [],
      fold: true,
    };
  },
  methods: {
    pay() {
      if (this.totalPrice >= this.minPrice) {
        window.alert('支付成功!');
      }
    },
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropballs.push(ball);
          return;
        }
      }
    },
    empty() {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    listHide() {
      this.fold = true;
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
          el.style.display = '';
        }
      }
    },
    enter(el) {
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
      });
    },
    afterEnter(el) {
      let ball = this.dropballs.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList() {
      if (this.totalCount) {
        this.fold = !this.fold;
      }
    },
    foldEnter(el) {
      this.$nextTick(() => {
        el.style.transform = 'translateY(-100%)';
      });
    },
    foldLeave(el) {
      this.$nextTick(() => {
        el.style.transform = 'translateY(0)';
      });
    },
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.count * food.price;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差¥${diff}元起送`;
      }
      return '去结算';
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      }
      return 'enough';
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true,
            });
          }
          this.scroll.refresh();
        });
      }
      return show;
    },
  },
};
</script>

<style lang="stylus">

@import '../../public/stylus/mixin'

    .shopcart
      position fixed
      left 0
      bottom 0
      width 100%
      height 48px
      z-index 50       
      .content
        display flex
        background-color #141d27
        font-size 0
        color rgba(255,255,255,0.4)   
        .content-left
            flex 1
            .logo-wrapper
               display inline-block
               position relative
               top -10px
               margin 0 16px
               padding 6px
               width 56px
               height 56px
               box-sizing border-box
               border-radius 50%
               vertical-align top
               background-color #141d27
               .num
                  position absolute
                  top 0
                  right 0
                  width 24px
                  height 16px
                  line-height 16px
                  text-align center
                  border-radius 16px
                  font-size 9px
                  font-weight 700
                  color #fff
                  background-color rgb(240,20,20)
                  box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
               .logo
                  width 100%
                  height 100%
                  border-radius 50%
                  background-color #2b343c
                  text-align center
                  &.highlight
                     background-color rgb(0,160,220)
                  .icon-shopping_cart
                     line-height 44px
                     font-size 24px
                     color #80858a
                     &.highlight 
                      color #fff                
            .price
               display inline-block
               vertical-align top
               margin-top 12px  
               line-height 24px
               padding-right 12px
               box-sizing border-box
               border-right 1px solid rgba(255,255,255,0.1)
               font-size 16px
               font-weight 700
               &.highlight 
                  color #fff   
            .desc
               display inline-block
               vertical-align top
               line-height 24px
               margin 12px 0 0 12px
               font-size 10px
        .content-right
            flex 0 0 105px
            width 105px
            .pay
              height 48px
              line-height 48px
              text-align center
              font-size 12px
              font-weight 700 
              &.not-enough
                background-color #2b333b
              &.enough
                background-color #00b43c
                color #fff  
      .ball-container
        .drop-enter-active
          transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
          .inner 
            transition all 0.4s linear
        .ball
          position fixed
          left 32px
          bottom 22px
          z-index 200 
          .inner
            width 16px
            height 16px
            border-radius 50%
            background-color rgb(0,160,220) 
       
      .shopcart-list 
        position absolute
        top 0
        left 0
        z-index -1
        width 100%      
        &.fold-enter-active,&.fold-leave-active      
          transition all 0.5s
        .list-header 
          height 40px
          line-height 40px
          padding 0 18px
          background-color #f3f5f7
          border-bottom 1px solid rgba(7,17,27,0.1) 
          .title
            float left
            font-size 14px
            color rgb(7,17,27)  
          .empty
            float right 
            font-size 12px
            color rgb(0,160,220) 
        .list-content 
          padding 0 18px
          max-height 217px
          overflow hidden
          background-color #fff
          .food 
            position relative
            padding 12px 0
            box-sizing border-box
            border-1px(rgba(7,17,27,0.1))
            .name 
              font-size 14px
              color rgb(7,17,27)
              line-height 24px
            .price 
              position absolute
              right 90px
              bottom 12px
              line-height 24px
              font-size 14px
              font-weight 700
              color rgb(240,20,20)
            .cartcontrol-wrapper
              position absolute
              right 0
              bottom 6px
    .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 40
      backdrop-filter blur(10px)
      background-color rgba(7,17,27,0.6)
      &.fade-enter-active,&.fade-leave-active
        transition all 0.5s
      &.fade-enter,&.fade-leave-to 
        opacity 0
        background-color rgba(7,17,27,0)
      &.fade-enter-to,&.fade-leave
        opacity 1
        background-color rgba(7,17,27,0.6)      
</style>

