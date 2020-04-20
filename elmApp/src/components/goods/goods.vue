<template>
    <div>
        <div class="goodsContainer">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li class="menu-item border-1px" :class="{'current':currentIndex===index}" v-for="(item, index) in goods" :key="index" @click="switchItem(index, $event)">
                        <span class="text">
                            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
                            {{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li class="food-list food-list-hook" v-for="(item, index) in goods" :key="index">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li class="food-item border-1px" v-for="(food, index2) in item.foods" :key="index2" @click="handleClickFood(food, $event)">
                                <div class="icon">
                                    <img :src="food.icon" width="57" height="57" alt="" srcset="">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol @cart-add="_drop" :food="food"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery_price="seller.deliveryPrice" :minprice="seller.minPrice"></shopcart>
        </div>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart.vue';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import food from '../food/food.vue';
export default {
    data () {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {} // 要传给food组件的food详情
        };
    },
    props: ['seller'],
    created () {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
        this.$ajax({
            method: 'GET',
            url: '/api/goods'
        }).then(res => {
            this.goods = res.data.data;
            this.$nextTick(() => { // 如果在vue项目中要操作原生DOM，一定要在DOM成功渲染后并且要在这个nextTick回调中执行
                this._initScroll();
                this._calculateHeight();
            });
        });
    },
    methods: {
        _initScroll () {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true // 如果不写这个属性，better-scroll会默认阻止添加点击事件
            });
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                click: true,
                probeType: 3 // probeType为3,不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
            });
            // 设置滚动监听事件，pos为位置信息
            this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        _calculateHeight () {
            // 拿到foodlist这个DOM对象
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            console.log(foodList);
            console.log(typeof (foodList));
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;// clientHeight 为内部可视区高度，就是用户可以看到的高度值(内容height+上下padding)
                this.listHeight.push(height);
            }
        },
        switchItem (index, event) {
            // 过滤跳原生的DOM点击事件
            if (!event._constructed) {
                return;
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];
            this.foodsScroll.scrollToElement(el, 300); // scrollToElement 滚动到目标元素
        },
        _drop (target) {
            this.$refs.shopcart.drop(target);
        },
        // 点击出现food详情
        handleClickFood (food, event) {
            if (!event._constructed) {
                return;
            }
            console.log('11');
            this.selectedFood = food;
            this.$refs.food.show();
        }
    },
    computed: {
        currentIndex () {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods () {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        foods.push(food);
                    }
                });
            });
            return foods;
        }
    },
    components: {
        shopcart,
        cartcontrol,
        food
    },
    events: {
        'cart.add' (target) {
            this._drop(target);
        }
    },
    destroyed () {
        this.menuScroll.destroy();
        this.foodsScroll.destroy();
    }
};
</script>
<style lang="stylus">
@import '../../common/style/mixin.styl';
    .goodsContainer
        display flex
        position absolute
        top 174px
        bottom 46px
        width 100%
        overflow hidden
        .menu-wrapper
            flex 0 0 80px
            width 80px
            background #f3f5f7
            .menu-item
                display table
                padding 0 12px
                height 54px
                width 56px
                line-height 14px
                border-1px(rgba(7, 17, 27, 0.1))
                &.current
                    position relative
                    z-index 10px
                    margin-top -1px
                    background #ffffff
                    font-weight 700
                    .text
                        border-none()
                .icon
                    display inline-block
                    width 12px
                    height 12px
                    vertical-align top
                    margin-right 2px
                    background-size 12px 12px
                    background-repeat no-repeat
                    &.decrease
                        bg-image(decrease_3)
                    &.discount
                        bg-image(discount_3)
                    &.guarantee
                        bg-image(guarantee_3)
                    &.invoice
                        bg-image(invoice_3)
                    &.special
                        bg-image(special_3)
                .text
                    display table-cell
                    width 56px
                    vertical-align middle
                    font-size 12px
        .foods-wrapper
            flex 1
            .title
                padding-left 14px
                height 26px
                line-height 26px
                border-left 2px solid #d9dde1
                font-size 12px
                color rgb(147, 153, 159)
                background #f3f5f7
            .food-item
                display flex
                margin 18px
                border-1px(rgba(7, 17, 27, 0.1))
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
                        height 14px
                        line-height 14px
                        font-size 14px
                        color rgb(7,17,27)
                    .desc, .extra
                        line-height 12px
                        font-size 10px
                        color rgb(147,153,159)
                    .desc
                        margin-bottom 8px
                    .extra
                        line-height 10px
                        .count
                            margin-right 12px
                    .price
                        font-weight 700
                        line-height 24px
                        .now
                            margin-right 8px
                            font-size 14px
                            color rgb(240, 20, 20)
                        .old
                            text-decoration line-through
                            font-size 10px
                            color rgb(147, 153, 159)
                    .cartcontrol-wrapper
                        position absolute
                        right 0
                        bottom 0
</style>
