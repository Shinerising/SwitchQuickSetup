import prompts from 'prompts';
async function start(){
    
    console.clear();
    console.log("=".repeat(40));
    console.log("欢迎使用交换机快速配置工具");
    console.log("=".repeat(40));
    console.log("1. 华为s5700系列交换机");
    console.log("2. 华为s5720系列交换机");
    console.log("3. 其他品牌交换机");
    console.log("-".repeat(40));
    //const n = await prompts({type: "number",name:"",message:"请输入交换机型号："});

    const c = await prompts({
        type: 'select',
        name: 'value',
        message: '请选择交换机型号：',
        choices: [
          { title: '华为s5700系列交换机'  },
          { title: '华为s5720系列交换机' },
          { title: '其他品牌交换机' }
        ],
        initial: 0
      })

    console.clear();
    console.log("=".repeat(40));
    console.log("消息提示");
    console.log("=".repeat(40));
    console.log("对不起，现在不支持任何交换机");
    const a = await prompts({type: "number",name:"",message:"请单击回车键退出！"});
}

start();