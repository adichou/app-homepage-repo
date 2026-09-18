// App 注册表：新增一款 app 只需在此追加条目，并在 content/<dir>/ 放入内容，
// 不需要编写任何页面代码。
//
// 字段说明：
// - id          路由参数（ASCII，保持 URL 稳定）
// - contentDir  content/ 下的目录名（与源码仓库同名；缺省与 id 相同）
// - bundleId    对应公开目录 / 重定向桩的历史路径（仅作记录）
// - category    photography | developer | home（决定门户页分组）
// - accent      产品页强调色（覆盖站点默认蓝）
// - appStoreUrl App Store 下载链接；留空则产品页不显示下载按钮
//               （App Store 元数据维护在私有 app-info-repo，不放在本仓库）
//
// 名称、副标题、分类/平台标签与图标等展示内容全部来自 content 目录：
// - <locale>/index.md frontmatter：name / tagline / category / platforms
// - <locale>/image/icon.*：应用图标

export const apps = [
  {
    id: 'camman',
    contentDir: 'cam-media-man-mobile',
    bundleId: 'aldistudio.cam-media-man-mobile',
    category: 'photography',
    accent: '#1769e0',
    appStoreUrl: ''
  },
  {
    id: 'agent-team-board',
    bundleId: '',
    category: 'developer',
    accent: '#7c3aed',
    appStoreUrl: ''
  }
]

export const categoryOrder = ['photography', 'developer', 'home']

export function getApp(id) {
  return apps.find((app) => app.id === id)
}

export function appsByCategory() {
  return categoryOrder
    .map((category) => ({ category, apps: apps.filter((app) => app.category === category) }))
    .filter((group) => group.apps.length > 0)
}
