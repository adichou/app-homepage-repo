import { watchEffect } from 'vue'

function setMetaDescription(content) {
  let tag = document.querySelector('meta[name="description"]')
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', 'description')
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// 响应式设置页面标题与描述：传入返回字符串的函数（内部读取 locale 等响应式值即可联动）
export function usePageMeta(getTitle, getDescription) {
  watchEffect(() => {
    const title = typeof getTitle === 'function' ? getTitle() : getTitle
    if (title) document.title = title

    const description = typeof getDescription === 'function' ? getDescription() : getDescription
    if (description) setMetaDescription(description)
  })
}
