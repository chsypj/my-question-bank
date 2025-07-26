// generateManifest.js

// 引入 Node.js 内置的文件系统模块
const fs = require('fs');
// 引入 Node.js 内置的路径处理模块
const path = require('path');

console.log('开始生成题库清单文件 (manifest.json)...');

// --- 配置区 ---
// 定义科目信息，ID 和名称需要和你项目中的保持一致
const subjects = [
  { id: 1, name: "法律法规", fileName: "subject_1.json" },
  { id: 2, name: "综合知识", fileName: "subject_2.json" },
  { id: 3, name: "专业实务", fileName: "subject_3.json" },
  { id: 4, name: "案例分析", fileName: "subject_4.json" }
];

// 定义题库文件所在的目录路径
const dataDirectory = path.join(__dirname, 'miniprogram', 'data');
// 定义 manifest.json 文件最终要生成的位置
const manifestFilePath = path.join(dataDirectory, 'manifest.json');
// --- 配置区结束 ---

// 初始化清单对象结构
const manifest = {
  totalQuestions: 0,
  subjects: []
};

try {
  // 遍历所有科目配置
  subjects.forEach(subject => {
    // 拼接出每个题库文件的完整路径
    const filePath = path.join(dataDirectory, subject.fileName);

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      // 同步读取文件内容
      const fileContent = fs.readFileSync(filePath, 'utf8');
      // 将文件内容解析为 JSON 数组
      const questions = JSON.parse(fileContent);
      // 获取数组的长度，即题数
      const count = questions.length;

      console.log(`- 读取 ${subject.fileName} 成功，包含 ${count} 道题。`);

      // 将统计信息添加到清单对象中
      manifest.subjects.push({
        id: subject.id,
        name: subject.name,
        count: count
      });

      // 累加总题数
      manifest.totalQuestions += count;
    } else {
      // 如果文件不存在，则输出警告，并记录题数为0
      console.warn(`警告: 未找到文件 ${filePath}，将为科目 "${subject.name}" 记录0道题。`);
      manifest.subjects.push({
        id: subject.id,
        name: subject.name,
        count: 0
      });
    }
  });

  // 将最终的清单对象格式化为带缩进的 JSON 字符串
  const manifestString = JSON.stringify(manifest, null, 2);

  // 将字符串写入到 manifest.json 文件中
  fs.writeFileSync(manifestFilePath, manifestString, 'utf8');

  console.log(`\n✔ 成功!`);
  console.log(`总题数: ${manifest.totalQuestions}`);
  console.log(`清单文件已生成/更新于: ${manifestFilePath}`);

} catch (error) {
  console.error('\n✖ 生成过程中发生错误:');
  console.error(error);
}
