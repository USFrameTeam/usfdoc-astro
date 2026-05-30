import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import starlightHeadingBadges from 'starlight-heading-badges';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import compress from '@playform/compress';
import remarkPicture from 'remark-picture';
import { convertToAvif } from './src/scripts/convert-avif.mjs';

export default defineConfig({
  site: 'https://usfdoctest.zuyst.top',
  markdown: {
    remarkPlugins: [
      [remarkPicture, {
        formatMapping: {
          jpg: ['avif', 'webp'],
          jpeg: ['avif', 'webp'],
          png: ['avif', 'webp'],
        },
      }],
    ],
  },
  integrations: [
    starlight({
      title: 'USF官方文档站',
      description: '基于原版SAPI的无名氏服务器管理框架',
      plugins: [
        starlightImageZoom(),
        starlightLinksValidator(),
        starlightHeadingBadges(),
        starlightLlmsTxt({
          projectName: 'USF',
          description: '基于原版SAPI的无名氏服务器管理框架',
        }),
        starlightSidebarTopics([
          {
            id: 'v2',
            label: 'V2',
            link: '/v2/first/quick-use/',
            icon: 'rocket',
            badge: { text: '推荐', variant: 'success' },
            items: [
              {
                label: '快速开始',
                items: [
                  { label: '介绍', link: '/v2/first/quick-use/' },
                  { label: '安装USF', link: '/v2/first/import/' },
                ],
              },
              {
                label: '功能介绍',
                collapsed: false,
                items: [
                  { label: '功能总览', link: '/v2/usage-guide/' },
                  { label: '传送系统', link: '/v2/features/teleport/' },
                  { label: '领地系统', link: '/v2/features/land/' },
                  { label: '商店系统', link: '/v2/features/store/' },
                  { label: '聊天系统', link: '/v2/features/chat/' },
                  { label: '群组系统', link: '/v2/features/group/' },
                  { label: '策略文件', link: '/v2/features/config-file/' },
                  { label: '物品锁定', link: '/v2/features/itemlock/' },
                  { label: '实用工具', link: '/v2/features/tools/' },
                  { label: '日志系统', link: '/v2/features/logging/' },
                ],
              },
              {
                label: '开发中功能(发布版本无法使用)',
                items: [
                  { label: '自定义变量', link: '/v2/custom/var/' },
                ],
              },
            ],
          },
          {
            id: 'v1',
            label: 'V1',
            link: '/v1/first/quick-use/',
            icon: 'puzzle',
            badge: { text: '停止维护', variant: 'caution' },
            items: [
              {
                label: '快速开始',
                items: [
                  { label: '介绍', link: '/v1/first/quick-use/' },
                  { label: '安装USF', link: '/v1/first/import/' },
                ],
              },
            ],
          },
          {
            id: 'neo',
            label: 'USFNeo',
            link: '/neo/first/quick-use/',
            icon: 'star',
            items: [
              {
                label: '快速开始',
                items: [
                  { label: '介绍', link: '/neo/first/quick-use/' },
                ],
              },
            ],
          },
          {
            id: 'more',
            label: '更多',
            link: '/more/change-log/',
            icon: 'information',
            items: [
              {
                label: '参考',
                items: [
                  { label: '更新日志', link: '/more/change-log/' },
                  { label: '版本对应表', link: '/more/edition/' },
                  { label: '使用问题与Q&A', link: '/more/faq/' },
                ],
              },
              {
                label: '开发者',
                items: [
                  { label: '手动适配USF插件', link: '/more/sdgx/' },
                ],
              },
              {
                label: '关于我们',
                items: [
                  { label: '维护团队', link: '/more/team/' },
                ],
              },
            ],
          },
        ], {
          exclude: ['/'],
        }),
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      logo: {
        src: './public/USFLogo.png',
      },
      components: {
        Header: './src/components/CustomHeader.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/EarthDLL/Unknown-Server-Framework' },
      ],
      lastUpdated: true,
      editLink: {
        baseUrl: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=IzHiT0hbY4KuL28MOLIHKH1DcSq2Jnde&authKey=O7WwQ4UOKe0d%2BY25voz3S4wGNxYj6YQcZ0%2BuW4zo6L%2FnZI%2BBUOWCYD4UEIGzBoGq&noverify=0&group_code=118123500',
      },
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon.ico',
          },
        },
      ],
    }),
    compress({
      Image: {
        AVIF: true,
      },
    }),
    sitemap(),
    convertToAvif(),
  ],
});
