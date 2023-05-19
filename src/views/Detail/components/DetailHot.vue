<script setup>
import { useRoute } from 'vue-router'
import { getHotGoodsAPI } from '@/api/detail'

const props = defineProps({
  hotType: {
    type: Number,
  },
})
const TYPEMAP = {
  1: '24小时热播',
  2: '周热播',
}
const title = computed(() => {
  return TYPEMAP[props.hotType]
})
const hotGoods = ref([])
const route = useRoute()
async function getHotGoods() {
  const res = await getHotGoodsAPI({
    id: route.params.id,
    type: props.hotType,
  })
  hotGoods.value = res.result
  // console.log(hotGoods.value)
}
onMounted(() => {
  getHotGoods()
})
</script>

<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <!-- 商品区块 -->
    <RouterLink v-for="item in hotGoods" :key="item.id" :to="`/detail/${item.id}`" class="goods-item">
      <img :src="item.picture" alt="">
      <p class="name ellipsis">
        {{ item.name }}
      </p>
      <p class="desc ellipsis">
        {{ item.desc }}
      </p>
      <p class="price">
        ¥{{ item.price }}
      </p>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.goods-hot {
  h3 {
    height: 70px;
    background: $helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  .goods-item {
    display: block;
    padding: 20px 30px;
    text-align: center;
    background: #fff;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }
}
</style>
