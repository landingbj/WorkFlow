/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  source: {
    entry: {
      index: './src/app.tsx',
    },
    /**
     * support inversify @injectable() and @inject decorators
     */
    decorators: {
      version: 'legacy',
    },
  },
  html: {
    title: '工作流编排',
    template: './index.html',
    inject: 'body',
    scriptLoading: 'blocking',
    meta: {
      viewport: 'width=device-width, initial-scale=1.0',
    },
  },
  output: {
    distPath: {
      js: 'static/js',
      css: 'static/css',
      media: 'static/media',
      html: '',
    },
    filename: {
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
      media: '[name].[contenthash:8].[ext]',
    },
  },
  tools: {
    htmlPlugin: {
      template: './index.html',
    },
    rspack: {
      output: {
        publicPath: './',
      },
    },
  },
  server: {
    proxy: {
      '/workflow': {
        target: 'http://localhost:18080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
