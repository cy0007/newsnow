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

// 简单的翻译服务接口
async function translateText(text: string): Promise<string> {
  try {
    // 使用 MyMemory 免费翻译API
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    const data = await response.json()
    
    if (data.responseData?.translatedText) {
      return data.responseData.translatedText
    }
    
    // 备用方案：使用浏览器内置翻译（如果支持）
    if ('translation' in navigator) {
      // @ts-ignore - 这是实验性API
      const translator = await navigator.translation?.createTranslator({
        sourceLanguage: 'en',
        targetLanguage: 'zh'
      })
      
      if (translator) {
        return await translator.translate(text)
      }
    }
    
    throw new Error('Translation failed')
  } catch (error) {
    console.warn('Translation failed:', error)
    return text // 翻译失败时返回原文
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