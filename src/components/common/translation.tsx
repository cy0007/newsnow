import { useState, useCallback } from "react"
import type { NewsItem } from "@shared/types"

interface TranslationProps {
  text: string
  className?: string
}

interface TranslatedNewsItemProps {
  item: NewsItem
  isEnglishSource?: boolean
}

// 改进的翻译服务接口
async function translateText(text: string): Promise<string> {
  // 如果文本太短或者已经是中文，直接返回
  if (text.length < 3 || /[\u4e00-\u9fa5]/.test(text)) {
    return text
  }
  
  try {
    // 方案1: 使用 MyMemory API
    console.log('尝试翻译:', text)
    const myMemoryResponse = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )
    
    if (myMemoryResponse.ok) {
      const data = await myMemoryResponse.json()
      console.log('MyMemory 响应:', data)
      
      if (data.responseData?.translatedText && data.responseData.translatedText !== text) {
        const translated = data.responseData.translatedText
        // 检查是否真的翻译了（不是简单返回原文）
        if (translated.toLowerCase() !== text.toLowerCase()) {
          console.log('翻译成功:', translated)
          return translated
        }
      }
    }
    
    // 方案2: 使用 LibreTranslate (备用)
    try {
      console.log('尝试备用翻译服务')
      const libreResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'zh',
          format: 'text'
        })
      })
      
      if (libreResponse.ok) {
        const data = await libreResponse.json()
        console.log('LibreTranslate 响应:', data)
        if (data.translatedText && data.translatedText !== text) {
          console.log('备用翻译成功:', data.translatedText)
          return data.translatedText
        }
      }
    } catch (libreError) {
      console.warn('备用翻译服务失败:', libreError)
    }
    
    // 方案3: 简单的词汇映射（基础翻译）
    const basicTranslations = {
      'Latest': '最新',
      'New': '新',
      'AI': '人工智能',
      'breakthrough': '突破',
      'language': '语言',
      'model': '模型',
      'models': '模型',
      'OpenAI': 'OpenAI',
      'Google': '谷歌',
      'Microsoft': '微软',
      'Apple': '苹果',
      'Meta': 'Meta',
      'Facebook': '脸书',
      'Twitter': '推特',
      'GitHub': 'GitHub',
      'API': 'API',
      'SDK': 'SDK',
      'app': '应用',
      'application': '应用程序',
      'software': '软件',
      'tool': '工具',
      'framework': '框架',
      'library': '库',
      'database': '数据库',
      'cloud': '云',
      'security': '安全',
      'privacy': '隐私',
      'update': '更新',
      'release': '发布',
      'version': '版本',
      'feature': '功能',
      'bug': '错误',
      'fix': '修复'
    }
    
    // 尝试基础词汇替换
    let basicTranslation = text
    Object.entries(basicTranslations).forEach(([en, zh]) => {
      const regex = new RegExp(`\\b${en}\\b`, 'gi')
      basicTranslation = basicTranslation.replace(regex, zh)
    })
    
    if (basicTranslation !== text) {
      console.log('使用基础翻译:', basicTranslation)
      return `${basicTranslation} (基础翻译)`
    }
    
    throw new Error('所有翻译方案都失败了')
  } catch (error) {
    console.error('翻译失败:', error)
    return `${text} (翻译失败，显示原文)`
  }
}

// 翻译按钮组件
export function TranslationToggle({ text, className = "" }: TranslationProps) {
  const [isTranslated, setIsTranslated] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTranslate = useCallback(async () => {
    if (isTranslated) {
      setIsTranslated(false)
      return
    }

    if (translatedText) {
      setIsTranslated(true)
      return
    }

    setIsLoading(true)
    try {
      const result = await translateText(text)
      setTranslatedText(result)
      setIsTranslated(true)
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [text, isTranslated, translatedText])

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleTranslate}
        disabled={isLoading}
        className={$(
          "inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
          "bg-blue-500 bg-op-20 hover:bg-op-30 text-blue-600 dark:text-blue-400",
          isLoading && "op-50 cursor-not-allowed"
        )}
        title={isTranslated ? "显示原文" : "翻译为中文"}
      >
        {isLoading ? (
          <>
            <span className="i-ph:circle-dashed animate-spin" />
            翻译中
          </>
        ) : (
          <>
            <span className={$(isTranslated ? "i-ph:globe" : "i-ph:translate")} />
            {isTranslated ? "原文" : "译文"}
          </>
        )}
      </button>
      
      {isTranslated && translatedText && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 dark:bg-op-20 rounded text-sm">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">中文翻译：</div>
          <div className="text-gray-700 dark:text-gray-300">{translatedText}</div>
        </div>
      )}
    </div>
  )
}

// 带翻译功能的新闻标题组件
export function TranslatableNewsTitle({ item, isEnglishSource = false }: TranslatedNewsItemProps) {
  if (!isEnglishSource) {
    return <span>{item.title}</span>
  }

  return (
    <div>
      <div className="mb-2">{item.title}</div>
      <TranslationToggle text={item.title} className="mb-2" />
    </div>
  )
}

// 检查是否为英文信息源
export function isEnglishSource(sourceId: string): boolean {
  const englishSources = ['hackernews', 'producthunt', 'github', 'github-trending-today']
  return englishSources.includes(sourceId)
}

// 翻译工具函数
export { translateText } 