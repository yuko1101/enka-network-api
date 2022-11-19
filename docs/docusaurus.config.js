// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'EnkaNetworkAPI',
  tagline: 'Node.js Enka.Network API wrapper for Genshin Impact',
  url: 'https://enka-network-api-docs.vercel.app',
  baseUrl: process.env.npm_config_base_url ?? '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'yuko1101', // Usually your GitHub org/user name.
  projectName: 'enka-network-api', // Usually your repo name.

  // Even if you don't use internationalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [require("remark-breaks")],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'EnkaNetworkAPI',
        logo: {
          alt: 'EnkaNetwork',
          src: 'img/enka-logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Get Started',
          },
          {
            type: 'doc',
            docId: 'api/EnkaClient',
            position: 'left',
            label: 'Documentation'
          },
          // { to: '/examples', label: 'Examples', position: 'left' },
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
                to: '/docs/intro',
              },
              {
                label: 'Documentation',
                to: '/docs/api/EnkaClient'
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
                href: 'https://discordapp.com/invite/docusaurus',
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
