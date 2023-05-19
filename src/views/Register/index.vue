<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { registerAPI, sendCodeAPI } from '@/api/user'

const userStore = useUserStore()
const router = useRouter()
// 表单数据对象
const userInfo = ref({
  account: '',
  mobile: '',
  code: '123456',
  password: '',
  agree: true,
})

// 规则数据对象
const rules = {
  account: [
    { required: true, message: '用户名不能为空' },
    { min: 5, max: 20, message: '用户名长度要求5-20个字符' },
  ],
  password: [
    { required: true, message: '密码不能为空' },
    { min: 6, max: 20, message: '密码长度要求6-20个字符' },
  ],
  mobile: [
    { required: true, message: '手机号不能为空' },
    { min: 11, max: 11, message: '手机号格式错误' },
  ],
  code: [
    { required: true, message: '验证码不能为空' },
    { min: 6, max: 6, message: '验证码格式错误' },
  ],
  agree: [
    {
      validator: (rule, val, callback) => {
        return val ? callback() : new Error('请先同意协议')
      },
    },
  ],
}
// 发送验证码逻辑
const countdown = ref(0)
const buttonText = computed(() => {
  if (countdown.value > 0)
    return `${countdown.value}秒`

  else
    return '发送验证码'
})
async function sendCode() {
  const { mobile } = userInfo.value
  if (mobile === '') {
    ElMessage.warning('手机号不能为空')
  }
  else {
    // console.log(mobile)
    const res = await sendCodeAPI({ mobile })
    console.log(res)
    if (res.code === '1') {
      ElMessage.success('发送验证码成功')
      countdown.value = 30
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        }
        else {
          // 清除定时器
          clearInterval(timer)
          // 重置倒计时
          countdown.value = 0
        }
      }, 1000)
    }
    else {
      ElMessage.error('发送验证码失败')
    }
  }
}
// 获取form实例做统一校验
const formRef = ref(null)
function doRegister() {
  const data = userInfo.value
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await registerAPI(data)
      if (res.code === '1') {
        ElMessage.success('注册成功')
        router.replace({ path: '/login' })
        console.log(res)
      }
      else {
        elMessage.error('注册失败')
      }
    }
  })
}
</script>

<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">
            小兔鲜
          </RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入网站首页
          <i class="iconfont icon-angle-right" />
          <i class="iconfont icon-angle-right" />
        </RouterLink>
      </div>
    </header>
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a @click="$router.push('/login')">账户登录</a>
          <a class="active">账户注册</a>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form ref="formRef" :model="userInfo" :rules="rules" status-icon label-width="auto">
              <el-form-item prop="account" label="账户">
                <el-input v-model="userInfo.account" placeholder="请输入账户" />
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input v-model="userInfo.password" type="password" show-password placeholder="请输入密码" />
              </el-form-item>
              <el-form-item prop="mobile" label="手机号">
                <el-input v-model="userInfo.mobile" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item prop="code" label="验证码">
                <el-input v-model="userInfo.code" style="width: 60%;margin-right: 5px;" />
                <el-button :disabled="countdown > 0" style="width: 102px;" @click="sendCode">
                  {{ buttonText }}
                </el-button>
              </el-form-item>
              <el-form-item prop="agree" label-width="22px">
                <el-checkbox v-model="userInfo.agree" size="large">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>
              <el-button size="large" class="subBtn" @click="doRegister">
                点击注册
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">售后服务</a>
          <a href="javascript:;">配送与验收</a>
          <a href="javascript:;">商务合作</a>
          <a href="javascript:;">搜索推荐</a>
          <a href="javascript:;">友情链接</a>
        </p>
        <p>CopyRight © 小兔鲜儿</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang='scss'>
.active {
  color: $xtxColor;
  font-weight: 700;
}

.login-header {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url("@/assets/images/logo.png") no-repeat center 18px / contain;
    }
  }

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;

    i {
      font-size: 14px;
      color: $xtxColor;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  background: url('@/assets/images/login-bg.png') no-repeat center / cover;
  height: 488px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    nav {
      font-size: 14px;
      height: 55px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: $xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: $priceColor;
          }

          &.active,
          &:focus {
            border-color: $xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: $priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.subBtn {
  background: $xtxColor;
  width: 100%;
  color: #fff;
}
</style>
