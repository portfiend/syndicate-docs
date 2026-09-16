import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'macrocosm docs',
  tagline: 'macrocosm YAYY!!!',
  favicon: 'img/thusd_syndicate.ico',

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://docs.macrocosm.cool',
  baseUrl: '/',

  organizationName: 'syndicate-ss14', 
  projectName: 'docs', 

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docslogo.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'macrocosm',
      logo: {
        alt: 'macrocosm logo',
        src: 'img/thusd_syndicate.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documents',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/syndicate-ss14/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/syndicate-ss14/docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} the Syndicate. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['csharp'],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
