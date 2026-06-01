const AURELIA_PACKAGE_VERSIONS = {
  'aurelia': '2.0.0-rc.1',
  '@aurelia/router': '2.0.0-rc.1',
  '@aurelia/testing': '2.0.0-rc.1',
  '@aurelia/vite-plugin': '2.0.0-rc.1',
  '@aurelia/webpack-loader': '2.0.0-rc.1',
  '@aurelia/plugin-gulp': '2.0.0-rc.1',
  '@aurelia/parcel-transformer': '2.0.0-rc.1',
  '@aurelia/babel-jest': '2.0.0-rc.1',
  '@aurelia/ts-jest': '2.0.0-rc.1',
  '@aurelia/storybook': '2.2.1',
};

const TEMPLATE_PROPERTY_BY_PACKAGE = {
  'aurelia': 'aureliaVersion',
  '@aurelia/router': 'aureliaRouterVersion',
  '@aurelia/testing': 'aureliaTestingVersion',
  '@aurelia/vite-plugin': 'aureliaVitePluginVersion',
  '@aurelia/webpack-loader': 'aureliaWebpackLoaderVersion',
  '@aurelia/plugin-gulp': 'aureliaPluginGulpVersion',
  '@aurelia/parcel-transformer': 'aureliaParcelTransformerVersion',
  '@aurelia/babel-jest': 'aureliaBabelJestVersion',
  '@aurelia/ts-jest': 'aureliaTsJestVersion',
  '@aurelia/storybook': 'aureliaStorybookVersion',
};

const TEMPLATE_PROPERTIES = Object.entries(TEMPLATE_PROPERTY_BY_PACKAGE)
  .reduce((properties, [pkg, property]) => {
    properties[property] = AURELIA_PACKAGE_VERSIONS[pkg];
    return properties;
  }, {});

module.exports = {
  AURELIA_PACKAGE_VERSIONS,
  TEMPLATE_PROPERTY_BY_PACKAGE,
  TEMPLATE_PROPERTIES,
};
