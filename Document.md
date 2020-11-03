###配置antd
使用craco配置antd主题
cnpm install @craco/craco --save-dev
修改package.json
/* package.json */
"scripts": {
-   "start": "react-scripts start",
-   "build": "react-scripts build",
-   "test": "react-scripts test",
+   "start": "craco start",
+   "build": "craco build",
+   "test": "craco test",
}

然后在项目根目录创建一个 craco.config.js 用于修改默认配置。

/* craco.config.js */
module.exports = {
  // ...
};

自定义主题#
按照 配置主题 的要求，自定义主题需要用到类似 less-loader 提供的 less 变量覆盖功能。我们可以引入 craco-less 来帮助加载 less 样式和修改变量。

首先把 src/App.css 文件修改为 src/App.less，然后修改样式引用为 less 文件。

/* src/App.js */
- import './App.css';
+ import './App.less';
/* src/App.less */
- @import '~antd/dist/antd.css';
+ @import '~antd/dist/antd.less';
然后安装 craco-less 并修改 craco.config.js 文件如下。

$ yarn add craco-less
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

###配置字体图标
yarn add react-icons  
https://react-icons.netlify.com/


配置滚动条
yarn add react-custom-scrollbars -S

import Scrollbars from 'react-custom-scrollbars'
<Scrollbars style={{"width":"100%","height":"300px"}}>
	<div></div>
</Scrollbars>


###配置emotion
/** @jsx jsx */
import { jsx, css, Global, ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
