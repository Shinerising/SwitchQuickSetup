import promptSync from 'prompt-sync';
const prompt = promptSync();

console.clear();
console.log("=".repeat(40));
console.log("欢迎使用交换机快速配置工具");
console.log("=".repeat(40));
console.log("1. 华为s5700系列交换机");
console.log("2. 华为s5720系列交换机");
console.log("3. 其他品牌交换机");
console.log("-".repeat(40));
const n = prompt("请输入交换机型号：");

console.clear();
console.log("=".repeat(40));
console.log("消息提示");
console.log("=".repeat(40));
console.log("对不起，现在不支持任何交换机");
const a = prompt("请单击回车键退出！");