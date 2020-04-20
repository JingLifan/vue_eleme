<template>
    <div class="cartcontrol">
        <transition name="cart">
            <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    props: {
        food: {
            type: Object
        }
    },
    created () {
    },
    methods: {
        addCart () {
            // 不加这个点击事件在PC端就会默认执行两次
            if (!event._constructed) {
                return;
            }
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count++;
            }
            this.$emit('cart-add', event.target);
        },
        decreaseCart () {
            if (!event._constructed) {
                return;
            }
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
};
</script>
<style lang="stylus">
    .cartcontrol
        .cart-enter-active, .cart-leave-active
            transition: all .4s linear
        .cart-enter, .cart-leave-active
            opacity: 0
            transform: translate3d(24px, 0, 0) rotate(180deg)
        .cart-decrease
            display inline-block
            padding 6px
            .inner
                line-height 24px
                font-size 20px
                color rgb(0, 160, 220)
        .cart-count
            display inline-block
            vertical-align top
            width 12px
            padding-top 6px
            line-height 24px
            text-align center
            font-size 10px
            color rgb(147, 153, 159)
        .cart-add
            display inline-block
            padding 6px
            line-height 24px
            font-size 20px
            color rgb(0, 160, 220)
</style>
