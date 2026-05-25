import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLinksValidator from 'starlight-links-validator';
import starlightHeadingBadges from 'starlight-heading-badges';
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
      sidebar: [
        {
          label: '快速开始',
          items: [
            { label: '介绍', link: '/first/quick-use/' },
            { label: '安装USF', link: '/first/import/' },
            { label: '更新日志', link: '/change-log/' },
            { label: '版本对应表', link: '/edition/' },
          ],
        },
        {
          label: '使用文档',
          items: [
            { label: '物品锁定', link: '/itemlock/' },
            { label: '领地', link: '/fief/' },
            { label: '商店', link: '/shop/' },
            { label: '功能与工具', link: '/tools/' },
            { label: '自定义菜单', link: '/menu/' },
            { label: '使用问题与Q&A', link: '/faq/' },
            { label: '手动适配USF插件', link: '/sdgx/' },
          ],
        },
        {
          label: '开发中功能(发布版本无法使用)',
          items: [
            { label: '自定义变量', link: '/custom/var/' },
          ],
        },
        {
          label: '关于我们',
          items: [
            { label: '维护团队', link: '/team/' },
          ],
        },
      ],
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
