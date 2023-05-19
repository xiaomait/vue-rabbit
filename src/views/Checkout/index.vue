<script setup>
import { useRouter } from 'vue-router'

// 导入省市区三级联动 element-china-area-data
import { useCartStore } from '@/stores/cartStore'
import { createOrderAPI, getCheckInfoAPI } from '@/api/checkout'

// 导入收货地址接口
import { addAddressAPI, delAddressAPI } from '@/api/address'

const router = useRouter()
const cartStore = useCartStore()
const checkInfo = ref({}) // 订单对象
const curAddress = ref({}) // 选中的地址对象 默认的收货地址
const activeAddresses = ref({}) // 激活的地址
async function getCheckInfo() {
  const res = await getCheckInfoAPI()
  checkInfo.value = res.result
  // 适配收货地址
  const item = checkInfo.value.userAddresses.find(item => item.isDefault === 0)
  curAddress.value = item
  // 适配默认激活地址
  activeAddresses.value = item
  // console.log(res.result)
}
onMounted(() => {
  getCheckInfo()
})
onUpdated(() => {
  getCheckInfo()
})
// 控制弹框打开
const showChangeDialog = ref(false)
const showAddDialog = ref(false)
// 切换地址
function switchAddress(item) {
  activeAddresses.value = item
  // console.log(activeAddresses.value)
}
function changeConfirm() {
  curAddress.value = activeAddresses.value
  showChangeDialog.value = false
}
/* 添加收货地址
因为不知道具体是地址编码所以采用api接口的例子
注释就是未使用的变量
以下为 element-china-area-data 的数据
const addressData = regionData
const selectedOptions = ref([])
*/
// 收货地址的对象
const addressFrom = reactive({
  receiver: '',
  contact: '',
  provinceCode: '210000', // 省份编码
  cityCode: '210200', // 城市编码
  countyCode: '210202', // 城市编码
  address: '', // 详细地址编码
  postalCode: '',
  addressTags: '我的家', // 地址标签
  isDefault: 0,
  fullLocation: '我的家', // 完整地址
})
// const isDefault = ref(true)
// 收货地址验证规则 仅做简单校验
const rules = reactive({
  receiver: [
    { required: true, message: '必须填写收货人姓名', trigger: 'blur' },
  ],
  contact: [
    { required: true, message: '必须填写手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号格式错误', trigger: 'blur' },
  ],
  selectedOptions: [
    { required: true, message: '必须选择地区', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '必须填写详细地址', trigger: 'blur' },
  ],
  postalCode: [
    { required: true, message: '必须填写邮政编码', trigger: 'blur' },
  ],
})
async function addAddress() {
  // if (isDefault.value) {
  //   // console.log(isDefault.value, addressFrom.isDefault)
  //   addressFrom.isDefault = 0
  // }
  // else {
  //   addressFrom.isDefault = 1
  // }
  const res = addAddressAPI(addressFrom)
  console.log(res)
  // curAddress.value = res.result
}
function addConfirm() {
  const value = Object.values(addressFrom)
  if (!value.includes('')) {
    addAddress()
    // getCheckInfo()
    showAddDialog.value = false
  }
  else {
    ElMessage.error('收货信息未填写完整')
  }
}
// 删除收货地址
async function delAddress(item) {
  const res = await delAddressAPI(item.id)
  console.log(res)
  if (res.code === '1') {
    // getCheckInfo()
    ElMessage.success('删除成功')
    showChangeDialog.value = false
  }
  else {
    ElMessage.error(res.msg)
  }
}
// 创建订单
async function createOrder() {
  const res = await createOrderAPI({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
    goods: checkInfo.value.goods.map((item) => {
      return {
        skuId: item.skuId,
        count: item.count,
      }
    }),
    addressId: curAddress.value.id,
  })
  const orderId = res.result.id
  // 路由跳转
  router.push({
    path: 'pay',
    query: {
      id: orderId,
    },
  })
  // 更新购物车
  cartStore.updateCartListAPI()
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">
          收货地址
        </h3>
        <div v-if="checkInfo.userAddresses" class="box-body">
          <div class="address">
            <div class="text">
              <div v-if="!curAddress" class="none">
                您需要先添加收货地址才可提交订单。
              </div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <!-- 有时间适配修改地址和删除地址 -->
              <el-button v-if="curAddress" size="large" @click="showChangeDialog = true">
                切换地址
              </el-button>
              <el-button size="large" @click="showAddDialog = true">
                添加地址
              </el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">
          商品信息
        </h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">
                  商品信息
                </th>
                <th width="170">
                  单价
                </th>
                <th width="170">
                  数量
                </th>
                <th width="170">
                  小计
                </th>
                <th width="170">
                  实付
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>¥{{ i.price }}</td>
                <td>{{ i.price }}</td>
                <td>¥{{ i.totalPrice }}</td>
                <td>¥{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">
          配送时间
        </h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">
          支付方式
        </h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">
          金额明细
        </h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i />费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">
                {{ checkInfo.summary?.totalPayPrice.toFixed(2) }}
              </dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="createOrder">
            提交订单
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog v-model="showChangeDialog" title="切换收货地址" width="50%" center>
    <div class="addressWrapper">
      <div v-for="item in checkInfo.userAddresses" :key="item.id" class="text item "
        :class="{ active: activeAddresses.id === item.id }" @click="switchAddress(item)">
        <ul>
          <li><span>收<i />货<i />人：</span>{{ item.receiver }} </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
        <el-popconfirm title="确定要删除此收货地址吗？" width="220" confirm-button-text="确认" cancel-button-text="取消"
          @confirm="delAddress(item)">
          <template #reference>
            <el-button style="margin-left: 150px;">
              删除地址
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showChangeDialog = false">取消</el-button>
        <el-button type="primary" @click="changeConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 添加地址 -->
  <el-dialog v-model="showAddDialog" title="添加收货地址" width="30%" center>
    <el-form :model="addressFrom" label-width="auto" size="large" :rules="rules" status-icon>
      <!-- <el-form-item label="默认">
        <el-switch v-model="isDefault" />
      </el-form-item> -->
      <el-form-item label="姓名" prop="receiver">
        <el-input v-model="addressFrom.receiver" class="input" placeholder="请输入收货人姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="contact">
        <el-input v-model="addressFrom.contact" placeholder="请输入手机号" />
      </el-form-item>
      <!-- <el-form-item label="地区" prop="selectedOptions">
        <el-cascader v-model="selectedOptions" style="flex: 1;" :options="addressData" placeholder="请选择地区" />
      </el-form-item> -->
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="addressFrom.address" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="邮政编码" prop="postalCode">
        <el-input v-model="addressFrom.postalCode" placeholder="请输入邮政编码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
