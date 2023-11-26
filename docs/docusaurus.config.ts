import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';

const config: Config = {
  title: 'EnkaNetworkAPI',
  tagline: 'Node.js Enka.Network API wrapper for Genshin Impact',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://enka-network-api-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.npm_config_base_url ?? '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'yuko1101', // Usually your GitHub org/user name.
  projectName: 'enka-network-api', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-typedoc-api',
      {
        projectRoot: path.join(__dirname, '..'),
        packages: [
          '.',
        ],
        readmes: true,
        changelogs: true,
      },
    ],
  ],

  themeConfig: {
    algolia: {
      appId: "4A2TGIJGTR",
      apiKey: "ddbb5051e54bc52f44d60f24eb353e87",
      indexName: "enka-network-api",
    },
    // Replace with your project's social card
    image: 'img/enka-splash.png',
    navbar: {
      title: 'EnkaNetworkAPI',
      logo: {
        alt: 'EnkaNetwork',
        src: 'img/enka-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Get Started',
        },
        {
          to: 'api',
          label: 'Documentation',
          position: 'left',
        },
        {
          href: 'https://github.com/yuko1101/enka-network-api',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Contents',
          items: [
            {
              label: 'Get Started',
              to: '/docs/README',
            },
            {
              label: 'Documentation',
              to: '/api'
            }
          ],
        },
        {
          title: 'GitHub',
          items: [
            {
              label: 'Repository',
              href: 'https://github.com/yuko1101/enka-network-api',
            },
            {
              label: 'Issues',
              href: 'https://github.com/yuko1101/enka-network-api/issues',
            },
            {
              label: 'Pull requests',
              href: 'https://github.com/yuko1101/enka-network-api/pulls',
            },
          ],
        },
        {
          title: 'Other Links',
          items: [
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/enka-network-api'
            },
            {
              label: 'EnkaNetwork',
              href: 'https://enka.network'
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} enka-network-api, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
