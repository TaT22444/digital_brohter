// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // サイトの設定
  site: 'https://digital-brother.example.com',
  
  // サーバーモードに設定
  output: 'server',
  
  // Netlifyアダプターを追加
  adapter: netlify(),
  
  // 環境変数の設定
  vite: {
    envPrefix: 'OPENAI_', // OPENAIプレフィックスの環境変数をクライアントサイドに公開
  }
});
