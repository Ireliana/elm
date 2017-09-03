<template>
  <div class="cartcontrol">
      <transition name="move">
          <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCart">
              <span class="icon-remove_circle_outline inner"></span>
          </div>
      </transition>  
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
    },
  },
  methods: {
    addCart() {
      if (!this.food.count) {
        this.$set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      this.$emit('cart-add', event.target);
    },
    decreaseCart() {
      if (this.food.count) {
        this.food.count--;
      }
    },
  },
};

</script>

<style lang="stylus">
    .cartcontrol
      font-size 0
      .move-enter-active,.move-leave-active
        transition all 0.4s linear
        .inner
          transition all 0.4s linear  
      .move-enter,.move-leave-to
        opacity 0
        transform translate3d(24px,0,0)
        .inner
          opacity 0  
          transform rotate(180deg)
      .move-enter-to,.move-leave
        opacity 1
        transform translate3d(0,0,0)
        .inner
          opacity 1
          transform rotate(0)
      .cart-decrease
        display inline-block
        padding 6px
        .inner
           display inline-block 
           font-size 24px
           line-height 24px
           color rgb(0,160,220)
      .cart-count
        display inline-block
        vertical-align top
        width 12px
        padding-top 6px
        line-height 24px
        text-align center
        font-size 10px
        color rgb(147,153,159)
      .cart-add
        display inline-block
        padding 6px
        font-size 24px
        line-height 24px
        color rgb(0,160,220)             
</style>
