<template>
  <div class="cm">
    <iframe
      src="https://codesandbox.io/embed/vigilant-leaf-cx058?autoresize=1&codemirror=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=light"
      style="width:100%; height:100%; border:0; border-radius: 4px; overflow:hidden;"
      title="vigilant-leaf-cx058"
      allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    ></iframe>

  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      code: `
function (){
  return {
      getData () {
        let data = [{
          id: 1,
          name: 'Adon'
        }, {
          id: 2,
          name: 'Gyrate'
        }]

        console.log(JSON.stringify(data))
      }
  }
}`,
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        lineNumbers: true,
        theme: 'monokai',
        line: true
      }
    }
  },
  mounted () {
    // this.getData()
  },
  methods: {
    runCode () {
      // 清除现有最终结果
      var dom = this.$refs['preview']
      dom.innerHTML = ''
      // 获得代码
      var code = eval(this.code)

      // 报错时如何定位到出错行
      // var fn = new Function(code)
      // fn()
      // debugger
    }

  }
}
</script>

<style scoped>
.cm{ position: relative; display: flex; flex-direction: row; width:100%;height:100%;}
.editor{ flex: 1; overflow: auto; text-align: left; }
.editor .toolbar{ padding: 4px; border-bottom: 1px solid #ddd; }
.editor .toolbar a{ text-decoration: none; font-size: 14px; color: #333; }
.editor .CodeMirror{ height: calc(100% - 30px); }
.preview{ flex: 1; border-left: 1px solid #ddd; }
</style>
